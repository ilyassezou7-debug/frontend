"use client";

import type { ProductOffer } from "@/types/product";
import type { OfferId } from "@/types/product";
import { formatMAD } from "@/lib/money";
import { cn } from "@/lib/cn";

interface OfferSelectorProps {
  offers: ProductOffer[];
  selected: OfferId;
  onChange: (offerId: OfferId) => void;
}

const savingsMap: Record<string, number> = {
  two: 119,
  three: 248,
};

export default function OfferSelector({
  offers,
  selected,
  onChange,
}: OfferSelectorProps) {
  return (
    <div className="space-y-2">
      {offers.map((offer) => {
        const isSelected = selected === offer.offerId;
        const isRecommended = offer.offerId === "two";
        const savings = savingsMap[offer.offerId];

        return (
          <button
            key={offer.offerId}
            type="button"
            onClick={() => onChange(offer.offerId)}
            className={cn(
              "w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-right",
              isSelected
                ? "border-teal bg-teal/5"
                : "border-border-soft bg-white hover:border-teal/40"
            )}
          >
            <div className="flex items-center gap-3">
              {/* Radio indicator */}
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                  isSelected ? "border-teal" : "border-muted/40"
                )}
              >
                {isSelected && (
                  <div className="w-2.5 h-2.5 rounded-full bg-teal" />
                )}
              </div>

              <div className="text-right">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-charcoal">
                    {offer.quantity}{" "}
                    {offer.quantity === 1 ? "قطعة" : "قطع"}
                  </span>
                  {offer.badge && (
                    <span className="bg-saffron text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {offer.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted mt-0.5">{offer.label}</p>
              </div>
            </div>

            <div className="text-left">
              <p className="font-bold text-teal text-lg">
                {formatMAD(offer.price)}
              </p>
              {savings && (
                <p className="text-xs text-saffron font-medium">
                  توفري {savings} درهم
                </p>
              )}
              {offer.quantity > 1 && (
                <p className="text-xs text-muted">
                  {Math.round(offer.price / offer.quantity)} درهم / قطعة
                </p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
