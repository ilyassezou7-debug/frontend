"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { X, Timer } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useCheckoutStore } from "@/store/checkout-store";
import { getProductById } from "@/config/products";
import { submitOrder } from "@/lib/api";
import { formatMAD } from "@/lib/money";
import { generateEventId } from "@/lib/event-id";
import { trackPurchase, getTrackingData } from "@/lib/tracking";
import type { OrderPayload } from "@/types/order";

const UPSELL_PRICE = 99;
const COUNTDOWN_SECONDS = 12;

interface UpsellModalProps {
  isOpen: boolean;
  productId: string;
}

export default function UpsellModal({ isOpen, productId }: UpsellModalProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasSubmittedRef = useRef(false);

  const items = useCartStore((s) => s.items);
  const getTotal = useCartStore((s) => s.getTotal);
  const clearCart = useCartStore((s) => s.clearCart);
  const customer = useCheckoutStore((s) => s.customer);
  const setStep = useCheckoutStore((s) => s.setStep);
  const setLastOrder = useCheckoutStore((s) => s.setLastOrder);
  const closeCheckout = useCheckoutStore((s) => s.closeCheckout);

  const upsellProduct = getProductById(productId as Parameters<typeof getProductById>[0]);

  const submitFinalOrder = useCallback(
    async (upsellAccepted: boolean) => {
      if (hasSubmittedRef.current || !customer) return;
      hasSubmittedRef.current = true;
      setIsSubmitting(true);

      const subtotal = getTotal();
      const upsellTotal = upsellAccepted ? subtotal + UPSELL_PRICE : subtotal;
      const eventId = generateEventId();
      const tracking = getTrackingData() as unknown as OrderPayload["tracking"];

      const upsellItem = upsellAccepted && upsellProduct
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

        // Track purchase
        const contents = items.map((i) => ({
          id: i.productId,
          quantity: i.quantity,
          price: i.price,
        }));
        if (upsellAccepted && upsellProduct) {
          contents.push({ id: upsellProduct.id, quantity: 1, price: UPSELL_PRICE });
        }
        trackPurchase(upsellTotal, eventId, contents);

        // Save order summary to localStorage
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
        // Still redirect to thank-you even on error (COD store pattern)
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
    ]
  );

  // Countdown timer
  useEffect(() => {
    if (!isOpen) {
      setCountdown(COUNTDOWN_SECONDS);
      hasSubmittedRef.current = false;
      return;
    }

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          submitFinalOrder(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, submitFinalOrder]);

  if (!upsellProduct) return null;

  const progressPercent = (countdown / COUNTDOWN_SECONDS) * 100;

  return (
    <Dialog.Root open={isOpen} onOpenChange={() => {}}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
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
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                transition={{ type: "spring", damping: 20, stiffness: 180 }}
                className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
              >
                <div className="bg-ivory w-full md:max-w-md rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden">
                  {/* Countdown bar */}
                  <div className="h-1 bg-border-soft">
                    <div
                      className="h-full bg-saffron transition-all duration-1000"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="p-5 space-y-4">
                    {/* Header */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 text-saffron mb-2">
                        <Timer className="w-5 h-5" />
                        <span className="font-bold text-lg">{countdown} ثانية</span>
                      </div>
                      <Dialog.Title className="font-bold text-xl text-charcoal font-display">
                        انتظري! قبل ما نأكدو الطلب ديالك...
                      </Dialog.Title>
                    </div>

                    {/* Product showcase */}
                    <div className="bg-sand rounded-2xl p-4 flex items-center gap-4">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-white flex-shrink-0 relative">
                        <Image
                          src={upsellProduct.images.hero}
                          alt={upsellProduct.shortName}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-charcoal">
                          {upsellProduct.shortName}
                        </p>
                        <p className="text-sm text-muted mt-1 leading-relaxed">
                          {upsellProduct.subheading}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-bold text-teal text-xl">
                            {formatMAD(UPSELL_PRICE)}
                          </span>
                          <span className="text-muted line-through text-sm">
                            {formatMAD(199)}
                          </span>
                          <span className="bg-saffron text-white text-xs px-2 py-0.5 rounded-full font-bold">
                            -50%
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-center text-sm text-muted">
                      زيدي{" "}
                      <span className="font-semibold text-charcoal">
                        {upsellProduct.shortName}
                      </span>{" "}
                      لطلبك غير بـ{" "}
                      <span className="font-bold text-teal">99 درهم</span> اليوم
                      فقط.
                    </p>

                    {/* Buttons */}
                    <div className="space-y-2">
                      <button
                        onClick={() => submitFinalOrder(true)}
                        disabled={isSubmitting}
                        className="btn-primary w-full text-sm disabled:opacity-60"
                      >
                        {isSubmitting
                          ? "جاري تأكيد الطلب..."
                          : `نعم، زيديه لطلبي بـ ${formatMAD(UPSELL_PRICE)}`}
                      </button>
                      <button
                        onClick={() => submitFinalOrder(false)}
                        disabled={isSubmitting}
                        className="w-full py-2 text-sm text-muted hover:text-charcoal transition-colors disabled:opacity-60"
                      >
                        لا شكراً، كملي الطلب بدونه
                      </button>
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
