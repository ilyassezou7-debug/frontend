"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  X,
  Lock,
  User,
  Phone,
  CheckCircle2,
  Truck,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useCheckoutStore } from "@/store/checkout-store";
import { PRODUCTS, getUpsellProduct } from "@/config/products";
import { formatMAD } from "@/lib/money";
import { isValidMoroccanPhone, normalizeMoroccanPhone } from "@/lib/phone";
import type { ProductId } from "@/types/product";
import { cn } from "@/lib/cn";

const schema = z.object({
  full_name: z
    .string()
    .min(2, "الاسم قصير جداً")
    .max(80, "الاسم طويل جداً")
    .regex(/^[a-zA-Z\u0600-\u06FF\s]+$/, "الاسم يحتوي على رموز غير مسموحة"),
  phone: z
    .string()
    .min(9, "رقم الهاتف قصير جداً")
    .refine((v) => isValidMoroccanPhone(v), {
      message: "رقم هاتف مغربي غير صحيح (يجب أن يبدأ بـ 06 أو 07)",
    }),
});

type FormValues = z.infer<typeof schema>;

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  { label: "السلة", icon: CheckCircle2 },
  { label: "المعلومات", icon: User },
  { label: "التأكيد", icon: ShieldCheck },
];

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const items = useCartStore((s) => s.items);
  const getTotal = useCartStore((s) => s.getTotal);
  const setCustomer = useCheckoutStore((s) => s.setCustomer);
  const setStep = useCheckoutStore((s) => s.setStep);
  const setUpsellProduct = useCheckoutStore((s) => s.setUpsellProduct);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const [activeField, setActiveField] = useState<"name" | "phone" | null>(null);

  const total = getTotal();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, dirtyFields, isValid },
    reset,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const nameValue = watch("full_name");
  const phoneValue = watch("phone");
  const nameValid = dirtyFields.full_name && !errors.full_name && nameValue?.length >= 2;
  const phoneValid = dirtyFields.phone && !errors.phone && phoneValue?.length >= 9;

  useEffect(() => {
    if (!isOpen) {
      reset();
      setActiveField(null);
    }
  }, [isOpen, reset]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => nameInputRef.current?.focus(), 350);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const { ref: nameRegRef, ...nameRegProps } = register("full_name");

  function onSubmit(data: FormValues) {
    const normalizedPhone = normalizeMoroccanPhone(data.phone) || data.phone;
    setCustomer({ full_name: data.full_name, phone: normalizedPhone });

    const cartProductIds = items.map((i) => i.productId as ProductId);
    const upsellId = getUpsellProduct(cartProductIds);

    if (upsellId) {
      setUpsellProduct(upsellId);
      setStep("upsell");
    } else {
      setStep("submitting");
    }
  }

  const currentStepIndex = 1;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 20, stiffness: 200 }}
                className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
              >
                <div className="bg-ivory w-full md:max-w-lg rounded-t-3xl md:rounded-3xl shadow-2xl max-h-[95vh] overflow-y-auto">
                  {/* Header */}
                  <div className="flex items-center justify-between p-5 pb-3 sticky top-0 bg-ivory/95 backdrop-blur-sm z-10">
                    <Dialog.Title className="font-bold text-xl text-charcoal font-display">
                      أكملي طلبك
                    </Dialog.Title>
                    <button
                      onClick={onClose}
                      className="p-2 rounded-xl hover:bg-sand transition-colors"
                    >
                      <X className="w-5 h-5 text-charcoal" />
                    </button>
                  </div>

                  {/* Progress Steps */}
                  <div className="px-5 pb-4">
                    <div className="flex items-center justify-between relative">
                      <div className="absolute top-4 right-[16%] left-[16%] h-[2px] bg-border-soft" />
                      <div
                        className="absolute top-4 right-[16%] h-[2px] bg-teal transition-all duration-500"
                        style={{ width: `${currentStepIndex * 34}%` }}
                      />
                      {STEPS.map((step, i) => {
                        const isCompleted = i < currentStepIndex;
                        const isCurrent = i === currentStepIndex;
                        const StepIcon = step.icon;
                        return (
                          <div
                            key={step.label}
                            className="flex flex-col items-center gap-1.5 relative z-10"
                          >
                            <div
                              className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                                isCompleted
                                  ? "bg-teal text-white"
                                  : isCurrent
                                    ? "bg-teal/15 text-teal ring-2 ring-teal/30"
                                    : "bg-sand text-muted"
                              )}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : (
                                <StepIcon className="w-4 h-4" />
                              )}
                            </div>
                            <span
                              className={cn(
                                "text-[10px] font-medium",
                                isCompleted || isCurrent
                                  ? "text-teal"
                                  : "text-muted"
                              )}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="px-5 pb-5 space-y-4">
                    {/* Compact Order Summary */}
                    <div className="bg-sand/70 rounded-2xl p-3.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-teal" />
                          <span className="text-xs text-teal font-semibold">
                            توصيل مجاني
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xs text-muted">المجموع:</span>
                          <span className="font-bold text-lg text-teal">
                            {formatMAD(total)}
                          </span>
                        </div>
                      </div>
                      {items.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-border-soft/60">
                          {items.map((item) => {
                            const product = PRODUCTS.find(
                              (p) => p.id === item.productId
                            );
                            const offer = product?.offers.find(
                              (o) => o.offerId === item.offerId
                            );
                            return (
                              <div
                                key={`${item.productId}-${item.offerId}`}
                                className="flex justify-between items-center text-xs text-muted py-0.5"
                              >
                                <span>
                                  {product?.shortName} ({offer?.quantity} قطعة)
                                  {item.quantity > 1 && ` × ${item.quantity}`}
                                </span>
                                <span className="font-medium text-charcoal">
                                  {formatMAD(item.price * item.quantity)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Reserved order urgency nudge */}
                    <div className="flex items-center justify-center gap-1.5 py-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <p className="text-xs text-amber-700 font-medium">
                        طلبك محجوز — أدخلي معلوماتك لتأكيده
                      </p>
                    </div>

                    {/* Form */}
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-3"
                    >
                      {/* Full name */}
                      <div
                        className={cn(
                          "rounded-2xl border-2 p-3 transition-all duration-200",
                          activeField === "name"
                            ? "border-teal/40 bg-white shadow-sm"
                            : nameValid
                              ? "border-teal/20 bg-teal/[0.03]"
                              : errors.full_name
                                ? "border-red-300 bg-white"
                                : "border-border-soft bg-white"
                        )}
                      >
                        <label className="flex items-center gap-2 text-xs font-semibold text-charcoal mb-2">
                          <div
                            className={cn(
                              "w-5 h-5 rounded-full flex items-center justify-center",
                              nameValid
                                ? "bg-teal text-white"
                                : "bg-sand text-muted"
                            )}
                          >
                            {nameValid ? (
                              <CheckCircle2 className="w-3 h-3" />
                            ) : (
                              <span className="text-[10px] font-bold">1</span>
                            )}
                          </div>
                          الاسم الكامل
                        </label>
                        <div className="relative">
                          <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/50" />
                          <input
                            {...nameRegProps}
                            ref={(e) => {
                              nameRegRef(e);
                              nameInputRef.current = e;
                            }}
                            type="text"
                            placeholder="مثلاً: فاطمة الزهراء"
                            onFocus={() => setActiveField("name")}
                            onBlur={(e) => {
                              nameRegProps.onBlur(e);
                              setActiveField(null);
                            }}
                            className="w-full pr-10 pl-4 py-2.5 rounded-xl border-0 bg-sand/40 text-charcoal placeholder:text-muted/40 focus:outline-none focus:bg-sand/60 transition-all text-sm"
                          />
                        </div>
                        {errors.full_name && (
                          <p className="text-red-500 text-xs mt-1.5 pr-7">
                            {errors.full_name.message}
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div
                        className={cn(
                          "rounded-2xl border-2 p-3 transition-all duration-200",
                          activeField === "phone"
                            ? "border-teal/40 bg-white shadow-sm"
                            : phoneValid
                              ? "border-teal/20 bg-teal/[0.03]"
                              : errors.phone
                                ? "border-red-300 bg-white"
                                : "border-border-soft bg-white"
                        )}
                      >
                        <label className="flex items-center gap-2 text-xs font-semibold text-charcoal mb-2">
                          <div
                            className={cn(
                              "w-5 h-5 rounded-full flex items-center justify-center",
                              phoneValid
                                ? "bg-teal text-white"
                                : "bg-sand text-muted"
                            )}
                          >
                            {phoneValid ? (
                              <CheckCircle2 className="w-3 h-3" />
                            ) : (
                              <span className="text-[10px] font-bold">2</span>
                            )}
                          </div>
                          رقم الهاتف
                        </label>
                        <div className="relative flex items-center gap-2">
                          <div className="flex items-center gap-1 bg-sand/60 rounded-lg px-2 py-2.5 flex-shrink-0">
                            <span className="text-sm">🇲🇦</span>
                            <span className="text-xs text-muted font-medium">
                              +212
                            </span>
                          </div>
                          <input
                            {...register("phone")}
                            type="tel"
                            inputMode="numeric"
                            placeholder="06XXXXXXXX"
                            dir="ltr"
                            onFocus={() => setActiveField("phone")}
                            onBlur={() => setActiveField(null)}
                            className="w-full px-3 py-2.5 rounded-xl border-0 bg-sand/40 text-charcoal placeholder:text-muted/40 focus:outline-none focus:bg-sand/60 transition-all text-sm text-left"
                          />
                        </div>
                        {errors.phone && (
                          <p className="text-red-500 text-xs mt-1.5 pr-7">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>

                      {/* CTA */}
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileTap={{ scale: 0.97 }}
                        className="btn-primary btn-shimmer-gold w-full text-base font-bold min-h-[54px] rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-teal/20 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
                      >
                        <AnimatePresence mode="wait" initial={false}>
                          {isSubmitting ? (
                            <motion.span
                              key="loading"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center gap-2"
                            >
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  repeat: Infinity,
                                  duration: 0.85,
                                  ease: "linear",
                                }}
                                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full flex-shrink-0"
                              />
                              جاري التحقق...
                            </motion.span>
                          ) : (
                            <motion.span
                              key="idle"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center gap-2"
                            >
                              <Lock className="w-4 h-4 flex-shrink-0" />
                              تأكيد الطلب — الدفع عند الاستلام
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    </form>

                    {/* Trust badges */}
                    <div className="flex items-center justify-center gap-4 pt-1">
                      <div className="flex items-center gap-1 text-[10px] text-muted">
                        <Lock className="w-3 h-3 text-teal/60" />
                        <span>بدون بطاقة بنكية</span>
                      </div>
                      <div className="w-px h-3 bg-border-soft" />
                      <div className="flex items-center gap-1 text-[10px] text-muted">
                        <Truck className="w-3 h-3 text-teal/60" />
                        <span>توصيل مجاني</span>
                      </div>
                      <div className="w-px h-3 bg-border-soft" />
                      <div className="flex items-center gap-1 text-[10px] text-muted">
                        <ShieldCheck className="w-3 h-3 text-teal/60" />
                        <span>آمن 100%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
