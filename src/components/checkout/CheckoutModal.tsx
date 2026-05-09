"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Lock, User, Phone } from "lucide-react";
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

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const items = useCartStore((s) => s.items);
  const getTotal = useCartStore((s) => s.getTotal);
  const setCustomer = useCheckoutStore((s) => s.setCustomer);
  const setStep = useCheckoutStore((s) => s.setStep);
  const setUpsellProduct = useCheckoutStore((s) => s.setUpsellProduct);

  const total = getTotal();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  function onSubmit(data: FormValues) {
    const normalizedPhone = normalizeMoroccanPhone(data.phone) || data.phone;
    setCustomer({ full_name: data.full_name, phone: normalizedPhone });

    // Determine upsell
    const cartProductIds = items.map((i) => i.productId as ProductId);
    const upsellId = getUpsellProduct(cartProductIds);

    if (upsellId) {
      setUpsellProduct(upsellId);
      setStep("upsell");
    } else {
      setStep("submitting");
    }
  }

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
                  <div className="flex items-center justify-between p-5 border-b border-border-soft sticky top-0 bg-ivory/95 backdrop-blur-sm z-10">
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

                  <div className="p-5 space-y-5">
                    {/* Order summary */}
                    <div className="bg-sand rounded-2xl p-4 space-y-2">
                      <p className="font-semibold text-charcoal text-sm mb-3">
                        ملخص طلبك
                      </p>
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
                            className="flex justify-between items-center text-sm"
                          >
                            <span className="text-charcoal">
                              {product?.shortName} ({offer?.quantity} قطعة) ×{" "}
                              {item.quantity}
                            </span>
                            <span className="font-semibold text-teal">
                              {formatMAD(item.price * item.quantity)}
                            </span>
                          </div>
                        );
                      })}
                      <div className="border-t border-border-soft pt-2 mt-2 flex justify-between font-bold">
                        <span>المجموع</span>
                        <span className="text-teal">{formatMAD(total)}</span>
                      </div>
                      <p className="text-xs text-teal font-medium text-center">
                        + التوصيل مجاني
                      </p>
                    </div>

                    {/* COD trust */}
                    <div className="flex items-center gap-2 text-sm text-muted bg-white rounded-xl px-4 py-3 border border-border-soft">
                      <Lock className="w-4 h-4 text-teal flex-shrink-0" />
                      <p>
                        الدفع عند الاستلام – ما كتحتاجيش بطاقة بنكية
                      </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      {/* Full name */}
                      <div>
                        <label className="block text-sm font-semibold text-charcoal mb-1.5">
                          الاسم الكامل
                        </label>
                        <div className="relative">
                          <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                          <input
                            {...register("full_name")}
                            type="text"
                            placeholder="مثلاً: فاطمة الزهراء"
                            className={cn(
                              "w-full pr-10 pl-4 py-3 rounded-xl border bg-white text-charcoal placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-teal/30 transition-all",
                              errors.full_name
                                ? "border-red-400"
                                : "border-border-soft"
                            )}
                          />
                        </div>
                        {errors.full_name && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.full_name.message}
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-semibold text-charcoal mb-1.5">
                          رقم الهاتف
                        </label>
                        <div className="relative">
                          <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                          <input
                            {...register("phone")}
                            type="tel"
                            inputMode="numeric"
                            placeholder="06XXXXXXXX أو 07XXXXXXXX"
                            dir="ltr"
                            className={cn(
                              "w-full pr-10 pl-4 py-3 rounded-xl border bg-white text-charcoal placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-teal/30 transition-all text-right",
                              errors.phone
                                ? "border-red-400"
                                : "border-border-soft"
                            )}
                          />
                        </div>
                        {errors.phone && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary w-full text-base disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "جاري المعالجة..." : "تأكيد الطلب"}
                      </button>
                    </form>

                    <p className="text-xs text-center text-muted">
                      بالضغط على تأكيد الطلب، توافقي على شروط الاستخدام وسياسة الخصوصية.
                    </p>
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
