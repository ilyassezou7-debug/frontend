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
  Zap,
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
    subtitle: "30 يوم استعمال",
  },
  two: {
    title: "علبتين",
    subtitle: "60 يوم • بلا انقطاع",
    ribbon: "الأكثر اختياراً",
    ribbonIcon: <Flame className="w-3 h-3" />,
    ribbonClass: "bg-teal text-white",
    highlight: "popular",
  },
  three: {
    title: "ثلاث علب + هدية",
    subtitle: "90 يوم • البروتوكول الكامل",
    ribbon: "الأكثر توفيراً • -41%",
    ribbonIcon: <Crown className="w-3 h-3" />,
    ribbonClass:
      "bg-gradient-to-l from-saffron-dark via-saffron to-saffron-dark text-white",
    highlight: "best",
  },
};

export default function OfferSelector({
  offers,
  selected,
  onChange,
}: OfferSelectorProps) {
  return (
    <div className="space-y-2.5">
      {/* Speed promise — compact */}
      <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/60 rounded-lg px-2.5 py-1.5">
        <Zap className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" strokeWidth={2.5} />
        <p className="text-[11px] sm:text-xs font-bold text-emerald-800 leading-tight">
          نتائج محسوسة من أول أسبوع
        </p>
      </div>

      {/* Pack cards — compact */}
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
          <button
            key={offer.offerId}
            type="button"
            onClick={() => onChange(offer.offerId)}
            aria-pressed={isSelected}
            className={cn(
              "block w-full text-right rounded-xl overflow-hidden",
              "transition-all duration-200 ease-out",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
              isSelected
                ? isBest
                  ? "border-2 border-saffron bg-saffron/[0.05] shadow-md shadow-saffron/15 focus-visible:ring-saffron/40"
                  : "border-2 border-teal bg-teal/[0.05] shadow-md shadow-teal/15 focus-visible:ring-teal/40"
                : cn(
                    "bg-white hover:shadow-sm focus-visible:ring-teal/40 border-2",
                    isBest
                      ? "border-saffron/30 hover:border-saffron"
                      : isPopular
                      ? "border-teal/30 hover:border-teal"
                      : "border-border-soft hover:border-teal/40"
                  )
            )}
          >
            {/* Thin top banner — only popular & best */}
            {meta.ribbon && (
              <div
                className={cn(
                  "px-2.5 py-[3px] text-[9.5px] sm:text-[10px] font-bold tracking-[0.1em] uppercase flex items-center justify-center gap-1",
                  meta.ribbonClass
                )}
              >
                {meta.ribbonIcon}
                <span>{meta.ribbon}</span>
              </div>
            )}

            {/* Compact single-row body */}
            <div className="px-3 py-2.5 sm:px-3.5 sm:py-3 flex items-center gap-2.5 sm:gap-3">
              {/* Radio */}
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                  "transition-all duration-200",
                  isSelected
                    ? isBest
                      ? "border-saffron bg-saffron"
                      : "border-teal bg-teal"
                    : "border-muted/30 bg-white"
                )}
              >
                {isSelected && (
                  <Check className="w-3 h-3 text-white" strokeWidth={3.5} />
                )}
              </div>

              {/* Title + subtitle (with inline savings chip) */}
              <div className="flex-1 min-w-0 text-right">
                <h3 className="font-bold text-charcoal text-[14px] sm:text-[15px] leading-tight truncate">
                  {meta.title}
                </h3>
                <div className="flex items-center justify-end gap-1.5 mt-0.5">
                  <p className="text-[10.5px] sm:text-[11px] text-muted leading-tight truncate">
                    {meta.subtitle}
                  </p>
                  {savings > 0 && (
                    <span
                      className={cn(
                        "text-[9.5px] sm:text-[10px] font-extrabold px-1.5 py-[1px] rounded-md flex-shrink-0 tabular-nums leading-tight",
                        isBest
                          ? "bg-saffron/15 text-saffron-dark"
                          : "bg-emerald-100 text-emerald-700"
                      )}
                    >
                      -{savings} د
                    </span>
                  )}
                </div>
              </div>

              {/* Price column — compact vertical stack */}
              <div className="text-left flex flex-col items-end flex-shrink-0 tabular-nums">
                {savings > 0 && (
                  <p className="text-[10px] text-muted/80 line-through leading-none mb-0.5 whitespace-nowrap">
                    {formatMAD(original)}
                  </p>
                )}
                <p
                  className={cn(
                    "font-extrabold text-[17px] sm:text-lg leading-none whitespace-nowrap",
                    isBest ? "text-saffron-dark" : "text-teal"
                  )}
                >
                  {formatMAD(offer.price)}
                </p>
              </div>
            </div>
          </button>
        );
      })}

      {/* Reassurance footer — compact */}
      <div className="flex items-center justify-between gap-2 pt-1 px-1 text-[10px] text-muted">
        <span className="inline-flex items-center gap-1">
          <Banknote className="w-3 h-3 text-teal" />
          الدفع عند الاستلام
        </span>
        <span className="inline-flex items-center gap-1">
          <Truck className="w-3 h-3 text-teal" />
          توصيل مجاني
        </span>
        <span className="inline-flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-teal" />
          ضمان 30 يوم
        </span>
      </div>
    </div>
  );
}
