"use client";

import type { ProductOffer } from "@/types/product";
import type { OfferId } from "@/types/product";
import { formatMAD } from "@/lib/money";
import { cn } from "@/lib/cn";
import {
  Check,
  Flame,
  Crown,
} from "lucide-react";

interface OfferSelectorProps {
  offers: ProductOffer[];
  selected: OfferId;
  onChange: (offerId: OfferId) => void;
}

interface OfferMeta {
  title: string;
  subtitle: string;
  ribbon?: string;
  ribbonIcon?: React.ReactNode;
  highlight?: "popular" | "best";
}

const META: Record<string, OfferMeta> = {
  one: {
    title: "وحدة واحدة",
    subtitle: "شهر كامل من الاستعمال",
  },
  two: {
    title: "وحدتان",
    subtitle: "شهران دون انقطاع",
    ribbon: "الأكثر اختياراً",
    ribbonIcon: <Flame className="w-3.5 h-3.5" />,
    highlight: "popular",
  },
  three: {
    title: "ثلاث وحدات + هدية",
    subtitle: "البروتوكول الكامل · 3 أشهر",
    ribbon: "الأكثر توفيراً",
    ribbonIcon: <Crown className="w-3.5 h-3.5" />,
    highlight: "best",
  },
};

export default function OfferSelector({
  offers,
  selected,
  onChange,
}: OfferSelectorProps) {
  // Per-product unit anchor: the price of a single unit for THIS product.
  // Used to compute the crossed-out "original" price and the savings pill.
  const unitPrice =
    offers.find((o) => o.offerId === "one")?.price ??
    offers[0]?.price ??
    0;

  return (
    <div className="space-y-4">
      <div className="space-y-3.5">
        {offers.map((offer) => {
          const isSelected = selected === offer.offerId;
          const base = META[offer.offerId] ?? {
            title: `${offer.quantity} وحدات`,
            subtitle: "",
          };
          // Per-product copy (from the product config) overrides the shared
          // defaults so each product can have its own persuasive wording.
          const meta = {
            ...base,
            ...(offer.title ? { title: offer.title } : {}),
            ...(offer.subtitle ? { subtitle: offer.subtitle } : {}),
            ...(offer.ribbon ? { ribbon: offer.ribbon } : {}),
          };
          const original = unitPrice * offer.quantity;
          const savings = original - offer.price;
          const isBest = meta.highlight === "best";
          const isPopular = meta.highlight === "popular";

          // Colors based on highlight
          const activeBorder = isBest ? "border-saffron" : "border-teal";
          const activeBg = isBest ? "bg-saffron/[0.04]" : "bg-teal/[0.04]";
          const activeShadow = isBest 
            ? "shadow-[0_8px_20px_-6px_rgba(184,134,47,0.25)]" 
            : "shadow-[0_8px_20px_-6px_rgba(14,92,74,0.25)]";

          return (
            <div key={offer.offerId} className="relative">
              {/* Floating Badge (2026 Modern Style) */}
              {meta.ribbon && (
                <div
                  className={cn(
                    "absolute -top-3 right-4 z-10 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide flex items-center gap-1.5 shadow-md border",
                    isBest 
                      ? "bg-gradient-to-r from-saffron to-saffron-dark text-white border-saffron-dark/20" 
                      : "bg-teal text-white border-teal-dark/20"
                  )}
                >
                  {meta.ribbonIcon}
                  <span>{meta.ribbon}</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => onChange(offer.offerId)}
                aria-pressed={isSelected}
                className={cn(
                  "relative block w-full text-right rounded-2xl overflow-hidden",
                  "transition-all duration-300 ease-out",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                  isSelected
                    ? cn("border-2", activeBorder, activeBg, activeShadow, "z-0")
                    : "border-2 border-border-soft bg-white hover:border-teal/30 hover:bg-mist/10 scale-100 z-0",
                  meta.ribbon ? "pt-5 pb-4 px-4" : "p-4"
                )}
              >
                <div className="flex items-center gap-3.5 sm:gap-4">
                  {/* Modern Animated Radio Button */}
                  <div
                    className={cn(
                      "w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-300",
                      isSelected
                        ? isBest ? "border-saffron bg-saffron" : "border-teal bg-teal"
                        : "border-border-soft bg-sand/30"
                    )}
                  >
                    {isSelected && (
                      <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white animate-pop" strokeWidth={3.5} />
                    )}
                  </div>

                  {/* Content Grid */}
                  <div className="flex-1 min-w-0 text-right">
                    {/* Top Row: Title & Price */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <p className={cn(
                        "font-bold font-display text-[15px] sm:text-base leading-tight truncate transition-colors duration-300",
                        isSelected ? "text-charcoal" : "text-charcoal/80"
                      )}>
                        {meta.title}
                      </p>
                      
                      <div className="text-left flex flex-col items-end flex-shrink-0 tabular-nums">
                        <div className="flex items-center gap-1.5">
                          {savings > 0 && (
                            <span className="text-[11px] sm:text-xs text-muted line-through font-medium">
                              {formatMAD(original)}
                            </span>
                          )}
                          <span className={cn(
                            "font-extrabold text-lg sm:text-xl leading-none transition-colors duration-300",
                            isSelected 
                              ? isBest ? "text-saffron-dark" : "text-teal"
                              : "text-charcoal"
                          )}>
                            {formatMAD(offer.price)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row: Subtitle & Savings Pill */}
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[11px] sm:text-xs text-muted leading-tight truncate">
                        {offer.title && (
                          <span className="font-bold text-teal">
                            {offer.quantity === 1
                              ? "علبة واحدة"
                              : offer.quantity === 2
                                ? "علبتان"
                                : "ثلاث علب"}
                          </span>
                        )}
                        {offer.title && meta.subtitle ? " · " : ""}
                        {meta.subtitle}
                      </p>
                      
                      {savings > 0 && (
                        <div className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 tabular-nums transition-colors duration-300",
                          isSelected
                            ? isBest ? "bg-saffron/20 text-saffron-dark" : "bg-teal/15 text-teal-dark"
                            : "bg-sand text-charcoal/80"
                        )}>
                          وفر {savings} د.م
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}
