"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ShoppingBag, ArrowDown } from "lucide-react";
import type { Product, OfferId } from "@/types/product";
import { formatMAD } from "@/lib/money";

interface StickyBuyBarProps {
  product: Product;
  selectedOffer: OfferId;
  /** DOM id of the element to scroll to (the offer block heading). */
  targetId: string;
}

/**
 * Sticky buy bar — appears on mobile bottom AND desktop bottom-center.
 * Hidden when the offer block (targetId) is in the viewport.
 * Click → smooth scroll to the offer block. The block uses `scroll-mt-*`
 * so the heading lands just under the sticky header (not page top).
 */
export default function StickyBuyBar({
  product,
  selectedOffer,
  targetId,
}: StickyBuyBarProps) {
  const [hidden, setHidden] = useState(true); // start hidden until we know
  const offer = product.offers.find((o) => o.offerId === selectedOffer)!;

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        // Hide when the offer block is meaningfully visible
        setHidden(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );
    obs.observe(target);
    return () => obs.disconnect();
  }, [targetId]);

  function handleClick() {
    const target = document.getElementById(targetId);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 transition-all duration-300 ease-out pointer-events-none ${
        hidden
          ? "opacity-0 translate-y-full"
          : "opacity-100 translate-y-0 pointer-events-auto"
      }`}
      aria-hidden={hidden}
    >
      <div className="mx-auto max-w-3xl px-3 pb-3 sm:pb-4">
        <div className="bg-white/95 backdrop-blur-md border border-border-soft rounded-2xl shadow-2xl shadow-charcoal/10 ring-1 ring-black/5 overflow-hidden">
          <div className="flex items-center gap-3 p-2.5 sm:p-3">
            {/* Tiny product thumbnail */}
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden flex-shrink-0 bg-sand">
              <Image
                src={product.images.hero}
                alt={product.shortName}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>

            {/* Title + price */}
            <div className="flex-1 min-w-0 text-right">
              <p className="font-bold text-charcoal text-[13px] sm:text-sm leading-tight truncate">
                {product.shortName}
              </p>
              <p className="text-[11px] sm:text-xs text-muted leading-tight mt-0.5">
                ابتداءً من{" "}
                <span className="font-bold text-teal tabular-nums">
                  {formatMAD(offer.price)}
                </span>
              </p>
            </div>

            {/* CTA */}
            <button
              type="button"
              onClick={handleClick}
              className="flex-shrink-0 inline-flex items-center gap-1.5 sm:gap-2 bg-teal hover:bg-teal-hover text-ivory font-bold text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-md shadow-teal/20 active:scale-95 transition-all"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xs:inline sm:inline">اطلبي الآن</span>
              <ArrowDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-bounce" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
