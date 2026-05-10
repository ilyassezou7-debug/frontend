"use client";

import type { ProductOffer } from "@/types/product";
import type { OfferId } from "@/types/product";
import { formatMAD } from "@/lib/money";
import { cn } from "@/lib/cn";
import {
  Check,
  Truck,
  ShieldCheck,
  Gift,
  Flame,
  Crown,
  Banknote,
  Lock,
  Users,
} from "lucide-react";

interface OfferSelectorProps {
  offers: ProductOffer[];
  selected: OfferId;
  onChange: (offerId: OfferId) => void;
}

const UNIT_PRICE = 199;

interface Perk {
  icon: React.ReactNode;
  label: string;
}

interface OfferMeta {
  ribbon?: string;
  ribbonClass?: string;
  ribbonIcon?: React.ReactNode;
  duration: string;
  framing?: string;
  perks: Perk[];
  socialProof?: string;
  highlight?: "popular" | "best";
}

const ICON = "w-3.5 h-3.5";

const META: Record<string, OfferMeta> = {
  one: {
    duration: "كيوصل لـ 30 يوم استعمال",
    perks: [
      { icon: <Banknote className={ICON} />, label: "الدفع عند الاستلام" },
      { icon: <ShieldCheck className={ICON} />, label: "ضمان 30 يوم" },
    ],
  },
  two: {
    ribbon: "الأكثر طلباً",
    ribbonIcon: <Flame className="w-3.5 h-3.5" />,
    ribbonClass: "bg-teal text-white",
    highlight: "popular",
    duration: "بروتوكول 60 يوم",
    framing: "ليك ولأمك ولا أختك",
    perks: [
      { icon: <Truck className={ICON} />, label: "توصيل مجاني" },
      { icon: <Banknote className={ICON} />, label: "الدفع عند الاستلام" },
      { icon: <ShieldCheck className={ICON} />, label: "ضمان 30 يوم" },
    ],
    socialProof: "اختيار 8 من كل 10 زبونات",
  },
  three: {
    ribbon: "بروتوكول كامل • وفّري 41%",
    ribbonIcon: <Crown className="w-3.5 h-3.5" />,
    ribbonClass: "bg-gradient-to-r from-saffron-dark via-saffron to-saffron-dark text-white",
    highlight: "best",
    duration: "بروتوكول كامل 90 يوم",
    framing: "+ 1 قطعة مجانية بحساب الباقة",
    perks: [
      { icon: <Truck className={ICON} />, label: "توصيل مجاني" },
      { icon: <Gift className={ICON} />, label: "+1 قطعة هدية" },
      { icon: <Banknote className={ICON} />, label: "الدفع عند الاستلام" },
      { icon: <ShieldCheck className={ICON} />, label: "ضمان 30 يوم" },
    ],
    socialProof: "الباقة المفضلة للنتائج المضمونة",
  },
};

export default function OfferSelector({
  offers,
  selected,
  onChange,
}: OfferSelectorProps) {
  return (
    <div className="space-y-3">
      {offers.map((offer) => {
        const isSelected = selected === offer.offerId;
        const meta = META[offer.offerId] ?? { perks: [], duration: "" };
        const original = UNIT_PRICE * offer.quantity;
        const savings = original - offer.price;
        const discountPct =
          offer.quantity > 1 ? Math.round((savings / original) * 100) : 0;
        const perUnit = Math.round(offer.price / offer.quantity);
        const isBest = meta.highlight === "best";
        const isPopular = meta.highlight === "popular";

        return (
          <button
            key={offer.offerId}
            type="button"
            onClick={() => onChange(offer.offerId)}
            aria-pressed={isSelected}
            className={cn(
              "relative w-full text-right rounded-2xl border-2 overflow-hidden",
              "transition-all duration-200 ease-out",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              isSelected
                ? isBest
                  ? "border-saffron bg-saffron/[0.06] shadow-lg shadow-saffron/10 focus-visible:ring-saffron/40"
                  : "border-teal bg-teal/[0.05] shadow-lg shadow-teal/10 focus-visible:ring-teal/40"
                : cn(
                    "bg-white hover:shadow-md focus-visible:ring-teal/40",
                    isBest
                      ? "border-saffron/40 hover:border-saffron"
                      : isPopular
                      ? "border-teal/40 hover:border-teal"
                      : "border-border-soft hover:border-teal/40"
                  )
            )}
          >
            {/* Ribbon — full-width strip, never overlaps content */}
            {meta.ribbon && (
              <div
                className={cn(
                  "px-3 py-1.5 text-[11px] font-bold flex items-center justify-center gap-1.5 tracking-wide",
                  meta.ribbonClass
                )}
              >
                {meta.ribbonIcon}
                <span className="truncate">{meta.ribbon}</span>
              </div>
            )}

            <div className="p-4 sm:p-5">
              {/* Header row: radio + title + price */}
              <div className="flex items-start justify-between gap-3">
                {/* Right side (RTL start): radio + title */}
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                      "transition-all duration-200",
                      isSelected
                        ? isBest
                          ? "border-saffron bg-saffron scale-110"
                          : "border-teal bg-teal scale-110"
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

                  <div className="text-right min-w-0 flex-1">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <h3 className="font-bold text-charcoal text-base sm:text-lg leading-none">
                        {offer.quantity}{" "}
                        {offer.quantity === 1 ? "قطعة" : "قطع"}
                      </h3>
                      {discountPct > 0 && (
                        <span className="bg-red-50 text-red-600 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md border border-red-100 tabular-nums leading-none">
                          −{discountPct}%
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] sm:text-xs text-muted mt-1.5 leading-snug">
                      {meta.duration}
                    </p>
                  </div>
                </div>

                {/* Left side (RTL end): price block */}
                <div className="text-left flex flex-col items-end justify-start flex-shrink-0 tabular-nums">
                  {discountPct > 0 && (
                    <p className="text-[11px] text-muted line-through leading-none mb-1 whitespace-nowrap">
                      {formatMAD(original)}
                    </p>
                  )}
                  <p
                    className={cn(
                      "font-extrabold text-2xl leading-none whitespace-nowrap",
                      isBest ? "text-saffron-dark" : "text-teal"
                    )}
                  >
                    {formatMAD(offer.price)}
                  </p>
                  {offer.quantity > 1 && (
                    <p className="text-[10px] text-muted mt-1.5 whitespace-nowrap">
                      {perUnit} د.م / قطعة
                    </p>
                  )}
                </div>
              </div>

              {/* Savings highlight bar */}
              {savings > 0 && (
                <div
                  className={cn(
                    "mt-3 px-3 py-2 rounded-xl flex items-center justify-between gap-2 text-[12px] font-bold",
                    isBest
                      ? "bg-gradient-to-l from-saffron/15 to-saffron/5 text-saffron-dark border border-saffron/20"
                      : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                  )}
                >
                  <span className="flex items-center gap-1.5 tabular-nums">
                    {isBest && <Gift className="w-3.5 h-3.5" />}
                    وفّري {savings} درهم
                  </span>
                  {meta.framing && (
                    <span className="text-[11px] font-medium opacity-80 truncate">
                      {meta.framing}
                    </span>
                  )}
                </div>
              )}

              {/* Perks row */}
              <div className="mt-3 pt-3 border-t border-border-soft/70 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                {meta.perks.map((perk, i) => (
                  <span
                    key={i}
                    className={cn(
                      "inline-flex items-center gap-1 text-[11px] font-medium whitespace-nowrap",
                      isSelected
                        ? isBest
                          ? "text-saffron-dark"
                          : "text-teal"
                        : "text-muted"
                    )}
                  >
                    {perk.icon}
                    {perk.label}
                  </span>
                ))}
              </div>

              {/* Social proof line */}
              {meta.socialProof && (
                <div
                  className={cn(
                    "mt-2.5 pt-2.5 border-t border-dashed flex items-center gap-1.5 text-[11px]",
                    isBest
                      ? "border-saffron/20 text-saffron-dark"
                      : "border-teal/20 text-teal"
                  )}
                >
                  <Users className="w-3 h-3 flex-shrink-0" />
                  <span className="font-semibold truncate">
                    {meta.socialProof}
                  </span>
                </div>
              )}
            </div>
          </button>
        );
      })}

      {/* Reassurance footer */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-[11px] text-muted">
        <span className="inline-flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-teal" />
          ما كتخلصي والو دابا
        </span>
        <span className="hidden sm:inline text-border-soft">•</span>
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-teal" />
          ضمان استرجاع 30 يوم
        </span>
        <span className="hidden sm:inline text-border-soft">•</span>
        <span className="inline-flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5 text-teal" />
          توصيل لجميع المدن
        </span>
      </div>
    </div>
  );
}
