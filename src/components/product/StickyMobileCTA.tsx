"use client";

import type { Product } from "@/types/product";
import type { OfferId } from "@/types/product";
import { useCartStore } from "@/store/cart-store";
import { trackAddToCart } from "@/lib/tracking";
import { generateEventId } from "@/lib/event-id";
import { formatMAD } from "@/lib/money";
import { ShoppingBag } from "lucide-react";

interface StickyMobileCTAProps {
  product: Product;
  selectedOffer: OfferId;
}

export default function StickyMobileCTA({
  product,
  selectedOffer,
}: StickyMobileCTAProps) {
  const addOffer = useCartStore((s) => s.addOffer);
  const openCart = useCartStore((s) => s.openCart);

  const offer = product.offers.find((o) => o.offerId === selectedOffer)!;

  function handleAddToCart() {
    addOffer({
      productId: product.id,
      offerId: offer.offerId,
      quantity: 1,
      unitCount: offer.quantity,
      price: offer.price,
      source: "product_page",
    });
    const eventId = generateEventId();
    trackAddToCart(product.id, offer.price, eventId);
    openCart();
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-border-soft px-4 py-3 shadow-lg">
      <button
        onClick={handleAddToCart}
        className="btn-primary w-full flex items-center justify-center gap-2 text-base"
      >
        <ShoppingBag className="w-5 h-5" />
        أضيفي للسلة – {formatMAD(offer.price)}
      </button>
    </div>
  );
}
