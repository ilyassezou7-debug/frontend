"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCheckoutStore } from "@/store/checkout-store";
import { useCartStore } from "@/store/cart-store";
import { submitOrder } from "@/lib/api";
import { generateEventId } from "@/lib/event-id";
import { trackPurchase, getTrackingData } from "@/lib/tracking";
import CheckoutModal from "./CheckoutModal";
import UpsellModal from "./UpsellModal";
import type { OrderPayload } from "@/types/order";

export default function CheckoutFlow() {
  const router = useRouter();
  const step = useCheckoutStore((s) => s.step);
  const isCheckoutOpen = useCheckoutStore((s) => s.isCheckoutOpen);
  const upsellProduct = useCheckoutStore((s) => s.upsellProduct);
  const customer = useCheckoutStore((s) => s.customer);
  const closeCheckout = useCheckoutStore((s) => s.closeCheckout);
  const setLastOrder = useCheckoutStore((s) => s.setLastOrder);

  const items = useCartStore((s) => s.items);
  const getTotal = useCartStore((s) => s.getTotal);
  const clearCart = useCartStore((s) => s.clearCart);

  // Auto-submit if step becomes "submitting" (no upsell case)
  useEffect(() => {
    if (step !== "submitting" || !customer) return;

    const doSubmit = async () => {
      const total = getTotal();
      const eventId = generateEventId();
      const tracking = getTrackingData() as unknown as OrderPayload["tracking"];

      const payload: OrderPayload = {
        customer,
        items: items.map((i) => ({
          product_id: i.productId,
          offer_id: i.offerId,
          quantity: i.quantity,
          unit_count: i.unitCount,
          price: i.price,
          source: i.source,
        })),
        totals: {
          subtotal: total,
          shipping: 0,
          total,
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
          shown: false,
          accepted: false,
          product_id: null,
          price: 0,
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
        trackPurchase(total, eventId, contents);

        if (typeof window !== "undefined") {
          localStorage.setItem(
            "atlas_last_order",
            JSON.stringify({
              orderId: response.order_id,
              publicId: response.public_id,
              total,
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
    };

    doSubmit();
  }, [step, customer, items, getTotal, setLastOrder, clearCart, closeCheckout, router]);

  return (
    <>
      <CheckoutModal
        isOpen={isCheckoutOpen && (step === "checkout_form")}
        onClose={closeCheckout}
      />
      {upsellProduct && (
        <UpsellModal
          isOpen={isCheckoutOpen && step === "upsell"}
          productId={upsellProduct}
        />
      )}
    </>
  );
}
