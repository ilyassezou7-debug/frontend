"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { Timer, CheckCircle2, Package } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useCheckoutStore } from "@/store/checkout-store";
import { getProductById } from "@/config/products";
import { submitOrder } from "@/lib/api";
import { formatMAD } from "@/lib/money";
import { generateEventId } from "@/lib/event-id";
import { trackPurchase, getTrackingData } from "@/lib/tracking";
import type { OrderPayload } from "@/types/order";

const UPSELL_PRICE = 99;
const COUNTDOWN_SECONDS = 10;

type SubmitPhase = "idle" | "accepting" | "declining";

interface UpsellModalProps {
  isOpen: boolean;
  productId: string;
}

export default function UpsellModal({ isOpen, productId }: UpsellModalProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [phase, setPhase] = useState<SubmitPhase>("idle");
  const hasSubmittedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const items = useCartStore((s) => s.items);
  const getTotal = useCartStore((s) => s.getTotal);
  const clearCart = useCartStore((s) => s.clearCart);
  const customer = useCheckoutStore((s) => s.customer);
  const setLastOrder = useCheckoutStore((s) => s.setLastOrder);
  const closeCheckout = useCheckoutStore((s) => s.closeCheckout);

  const upsellProduct = getProductById(
    productId as Parameters<typeof getProductById>[0]
  );

  const stopCountdown = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const submitFinalOrder = useCallback(
    async (upsellAccepted: boolean) => {
      if (hasSubmittedRef.current || !customer) return;
      hasSubmittedRef.current = true;

      // Stop timer immediately — give instant visual feedback
      stopCountdown();
      setPhase(upsellAccepted ? "accepting" : "declining");

      const subtotal = getTotal();
      const upsellTotal = upsellAccepted ? subtotal + UPSELL_PRICE : subtotal;
      const eventId = generateEventId();
      const tracking =
        getTrackingData() as unknown as OrderPayload["tracking"];

      const upsellItem =
        upsellAccepted && upsellProduct
          ? [
              {
                product_id: upsellProduct.id,
                offer_id: "upsell_99",
                quantity: 1,
                unit_count: 1,
                price: UPSELL_PRICE,
                source: "post_checkout_upsell",
              },
            ]
          : [];

      const payload: OrderPayload = {
        customer,
        items: [
          ...items.map((i) => ({
            product_id: i.productId,
            offer_id: i.offerId,
            quantity: i.quantity,
            unit_count: i.unitCount,
            price: i.price,
            source: i.source,
          })),
          ...upsellItem,
        ],
        totals: {
          subtotal,
          shipping: 0,
          total: upsellTotal,
          currency: "MAD",
        },
        tracking: {
          event_id: eventId,
          fbp: tracking?.fbp ?? null,
          fbc: tracking?.fbc ?? null,
          ttp: tracking?.ttp ?? null,
          ttclid: tracking?.ttclid ?? null,
          sc_click_id: tracking?.sc_click_id ?? null,
          page_url: tracking?.page_url ?? "",
          referrer: tracking?.referrer ?? null,
          user_agent: tracking?.user_agent ?? "",
          utm: tracking?.utm,
        },
        upsell: {
          shown: true,
          accepted: upsellAccepted,
          product_id: upsellAccepted ? productId : null,
          price: upsellAccepted ? UPSELL_PRICE : 0,
        },
      };

      try {
        const response = await submitOrder(payload);
        setLastOrder(response.order_id, response.public_id);

        const contents = items.map((i) => ({
          id: i.productId,
          quantity: i.quantity,
          price: i.price,
        }));
        if (upsellAccepted && upsellProduct) {
          contents.push({
            id: upsellProduct.id,
            quantity: 1,
            price: UPSELL_PRICE,
          });
        }
        trackPurchase(upsellTotal, eventId, contents);

        if (typeof window !== "undefined") {
          localStorage.setItem(
            "atlas_last_order",
            JSON.stringify({
              orderId: response.order_id,
              publicId: response.public_id,
              total: upsellTotal,
              customer,
              items: payload.items,
            })
          );
        }

        clearCart();
        closeCheckout();
        router.push(`/thank-you?order_id=${response.public_id}`);
      } catch (err) {
        console.error("Order submission failed:", err);
        clearCart();
        closeCheckout();
        router.push("/thank-you");
      }
    },
    [
      customer,
      getTotal,
      items,
      upsellProduct,
      productId,
      setLastOrder,
      clearCart,
      closeCheckout,
      router,
      stopCountdown,
    ]
  );

  useEffect(() => {
    if (!isOpen) {
      setCountdown(COUNTDOWN_SECONDS);
      setPhase("idle");
      hasSubmittedRef.current = false;
      stopCountdown();
      return;
    }

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          stopCountdown();
          submitFinalOrder(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return stopCountdown;
  }, [isOpen, submitFinalOrder, stopCountdown]);

  if (!upsellProduct) return null;

  const progressPercent = (countdown / COUNTDOWN_SECONDS) * 100;
  const isSubmitting = phase !== "idle";

  return (
    <Dialog.Root open={isOpen} onOpenChange={() => {}}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            {/* Overlay */}
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-charcoal/70 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.93, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.93, y: 40 }}
                transition={{ type: "spring", damping: 22, stiffness: 200 }}
                className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
              >
                <div
                  className="bg-ivory w-full md:max-w-md rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden"
                  style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
                >
                  <AnimatePresence mode="wait">
                    {/* ── LOADING STATE (shown immediately on any button press) ── */}
                    {isSubmitting ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="flex flex-col items-center justify-center gap-5 px-6 py-14 text-center"
                      >
                        {/* Animated spinner ring */}
                        <div className="relative w-16 h-16">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.9,
                              ease: "linear",
                            }}
                            className="w-16 h-16 border-4 border-teal/20 border-t-teal rounded-full"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Package className="w-6 h-6 text-teal" />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <p className="font-bold text-xl text-charcoal font-display">
                            {phase === "accepting"
                              ? "جاري تأكيد طلبك..."
                              : "جاري تأكيد طلبك..."}
                          </p>
                          <p className="text-sm text-muted leading-relaxed">
                            {phase === "accepting"
                              ? "تم إضافة المنتج — نجهز طلبك الآن"
                              : "طلبك مسجل — سيتصل بك فريقنا قريباً"}
                          </p>
                        </div>

                        {/* Animated dots */}
                        <div className="flex gap-1.5">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                              transition={{
                                repeat: Infinity,
                                duration: 1,
                                delay: i * 0.2,
                              }}
                              className="w-2 h-2 rounded-full bg-teal"
                            />
                          ))}
                        </div>
                      </motion.div>
                    ) : (
                      /* ── UPSELL CONTENT ── */
                      <motion.div
                        key="content"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                      >
                        {/* Countdown progress bar */}
                        <div className="h-1.5 bg-border-soft">
                          <motion.div
                            className="h-full bg-saffron origin-right"
                            style={{ width: `${progressPercent}%` }}
                            transition={{ duration: 0.9, ease: "linear" }}
                          />
                        </div>

                        <div className="p-5 space-y-4">
                          {/* Timer + headline */}
                          <div className="text-center">
                            <div className="inline-flex items-center gap-1.5 bg-saffron/10 text-saffron rounded-full px-3 py-1 mb-3">
                              <Timer className="w-4 h-4" />
                              <span className="font-bold text-sm tabular-nums">
                                {countdown} ثانية
                              </span>
                            </div>
                            <Dialog.Title className="font-bold text-xl text-charcoal font-display leading-snug">
                              انتظري! قبل ما نأكدو الطلب ديالك...
                            </Dialog.Title>
                          </div>

                          {/* Product card */}
                          <div className="bg-sand rounded-2xl p-4 flex items-center gap-4">
                            <div className="w-20 h-20 rounded-xl overflow-hidden bg-white flex-shrink-0 relative shadow-sm">
                              <Image
                                src={upsellProduct.images.hero}
                                alt={upsellProduct.shortName}
                                fill
                                className="object-cover"
                                sizes="80px"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-charcoal">
                                {upsellProduct.shortName}
                              </p>
                              <p className="text-sm text-muted mt-1 leading-relaxed line-clamp-2">
                                {upsellProduct.subheading}
                              </p>
                              <div className="flex items-center gap-2 mt-2 flex-wrap">
                                <span className="font-bold text-teal text-xl">
                                  {formatMAD(UPSELL_PRICE)}
                                </span>
                                <span className="text-muted line-through text-sm">
                                  {formatMAD(199)}
                                </span>
                                <span className="bg-saffron text-white text-xs px-2 py-0.5 rounded-full font-bold">
                                  ‑50%
                                </span>
                              </div>
                            </div>
                          </div>

                          <p className="text-center text-sm text-muted px-2">
                            زيدي{" "}
                            <span className="font-semibold text-charcoal">
                              {upsellProduct.shortName}
                            </span>{" "}
                            لطلبك غير بـ{" "}
                            <span className="font-bold text-teal">
                              99 درهم
                            </span>{" "}
                            اليوم فقط.
                          </p>

                          {/* Action buttons */}
                          <div className="space-y-2.5 pb-1">
                            {/* Accept — primary CTA */}
                            <button
                              onClick={() => submitFinalOrder(true)}
                              className="btn-primary w-full text-base min-h-[54px] flex items-center justify-center gap-2 active:scale-[0.98]"
                            >
                              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                              <span>
                                نعم، زيديه لطلبي بـ {formatMAD(UPSELL_PRICE)}
                              </span>
                            </button>

                            {/* Decline — clearly tappable, no waiting */}
                            <button
                              onClick={() => submitFinalOrder(false)}
                              className="w-full min-h-[48px] flex items-center justify-center rounded-2xl text-sm text-muted hover:text-charcoal hover:bg-sand/60 active:bg-sand transition-colors px-4"
                            >
                              لا شكراً، كملي الطلب بدونه
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
