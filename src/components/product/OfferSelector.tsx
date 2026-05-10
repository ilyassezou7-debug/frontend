"use client";

import type { ProductOffer } from "@/types/product";
import type { OfferId } from "@/types/product";
import { formatMAD } from "@/lib/money";
import { cn } from "@/lib/cn";
import {
  Check,
  Truck,
  ShieldCheck,
  Banknote,
  Flame,
  Crown,
} from "lucide-react";

interface OfferSelectorProps {
  offers: ProductOffer[];
  selected: OfferId;
  onChange: (offerId: OfferId) => void;
}

const UNIT_PRICE = 199;

interface OfferMeta {
  title: string;
  subtitle: string;
  ribbon?: string;
  ribbonClass?: string;
  ribbonIcon?: React.ReactNode;
  highlight?: "popular" | "best";
}

const META: Record<string, OfferMeta> = {
  one: {
    title: "علبة واحدة",
    subtitle: "30 يوم • شهر كامل",
  },
  two: {
    title: "علبتين",
    subtitle: "شهر النتيجة + شهر التثبيت",
    ribbon: "الأكثر اختياراً",
    ribbonIcon: <Flame className="w-3 h-3" />,
    ribbonClass: "bg-teal text-white",
    highlight: "popular",
  },
  three: {
    title: "ثلاث علب — البروتوكول الكامل",
    subtitle: "نتيجة + تثبيت + هدية",
    ribbon: "الأكثر توفيراً",
    ribbonIcon: <Crown className="w-3 h-3" />,
    ribbonClass:
      "bg-gradient-to-r from-saffron-dark via-saffron to-saffron-dark text-white",
    highlight: "best",
  },
};

export default function OfferSelector({
  offers,
  selected,
  onChange,
}: OfferSelectorProps) {
  return (
    <div className="space-y-3 pt-2">
      {offers.map((offer) => {
        const isSelected = selected === offer.offerId;
        const meta = META[offer.offerId] ?? {
          title: `${offer.quantity} علب`,
          subtitle: "",
        };
        const original = UNIT_PRICE * offer.quantity;
        const savings = original - offer.price;
        const isBest = meta.highlight === "best";
        const isPopular = meta.highlight === "popular";

        return (
          <div key={offer.offerId} className="relative">
            {/* Floating ribbon pill */}
            {meta.ribbon && (
              <div
                className={cn(
                  "absolute z-10 top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
                  "px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide flex items-center gap-1 shadow-sm whitespace-nowrap",
                  meta.ribbonClass
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
                "block w-full text-right rounded-2xl border-2 overflow-hidden",
                "transition-all duration-200 ease-out",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
                isSelected
                  ? isBest
                    ? "border-saffron bg-saffron/[0.06] shadow-md shadow-saffron/10 focus-visible:ring-saffron/40"
                    : "border-teal bg-teal/[0.06] shadow-md shadow-teal/10 focus-visible:ring-teal/40"
                  : cn(
                      "bg-white hover:shadow-sm focus-visible:ring-teal/40",
                      isBest
                        ? "border-saffron/35 hover:border-saffron"
                        : isPopular
                        ? "border-teal/35 hover:border-teal"
                        : "border-border-soft hover:border-teal/40"
                    )
              )}
            >
              <div
                className={cn(
                  "grid items-center gap-3 px-4 py-3.5",
                  "grid-cols-[1fr_auto_auto]"
                )}
              >
                {/* Title block (RTL start = right side) */}
                <div className="min-w-0 text-right">
                  <h3 className="font-bold text-charcoal text-[15px] sm:text-base leading-tight truncate">
                    {meta.title}
                  </h3>
                  {meta.subtitle && (
                    <p className="text-[11px] sm:text-xs text-muted mt-1 leading-snug truncate">
                      {meta.subtitle}
                    </p>
                  )}
                </div>

                {/* Radio — visual center */}
                <div
                  className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                    "transition-all duration-200",
                    isSelected
                      ? isBest
                        ? "border-saffron bg-saffron"
                        : "border-teal bg-teal"
                      : "border-muted/30 bg-white"
                  )}
                >
                  {isSelected && (
                    <Check
                      className="w-3.5 h-3.5 text-white"
                      strokeWidth={3.5}
                    />
                  )}
                </div>

                {/* Price column (RTL end = far left) */}
                <div className="text-left flex flex-col items-start tabular-nums flex-shrink-0">
                  {savings > 0 && (
                    <p className="text-[10px] text-muted line-through leading-none mb-0.5 whitespace-nowrap">
                      {formatMAD(original)}
                    </p>
                  )}
                  <p
                    className={cn(
                      "font-extrabold text-[19px] leading-none whitespace-nowrap",
                      isBest ? "text-saffron-dark" : "text-teal"
                    )}
                  >
                    {formatMAD(offer.price)}
                  </p>
                  {savings > 0 && (
                    <p
                      className={cn(
                        "text-[10px] font-bold mt-1 whitespace-nowrap",
                        isBest ? "text-saffron-dark" : "text-emerald-700"
                      )}
                    >
                      وفّري {savings} درهم
                    </p>
                  )}
                </div>
              </div>
            </button>
          </div>
        );
      })}

      {/* Reassurance footer — single compact strip */}
      <div className="flex items-center justify-between gap-2 pt-2 px-1 text-[10px] sm:text-[11px] text-muted">
        <span className="inline-flex items-center gap-1">
          <Banknote className="w-3.5 h-3.5 text-teal" />
          الدفع عند الاستلام
        </span>
        <span className="inline-flex items-center gap-1">
          <Truck className="w-3.5 h-3.5 text-teal" />
          توصيل مجاني
        </span>
        <span className="inline-flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-teal" />
          ضمان 30 يوم
        </span>
      </div>
    </div>
  );
}
