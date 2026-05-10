"use client";

import type { ProductOffer } from "@/types/product";
import type { OfferId } from "@/types/product";
import { formatMAD } from "@/lib/money";
import { cn } from "@/lib/cn";
import { Check, Truck, ShieldCheck, Gift, Flame, Crown } from "lucide-react";

interface OfferSelectorProps {
  offers: ProductOffer[];
  selected: OfferId;
  onChange: (offerId: OfferId) => void;
}

const UNIT_PRICE = 199;

interface OfferMeta {
  ribbon?: string;
  ribbonColor?: string;
  ribbonIcon?: React.ReactNode;
  perks: { icon: React.ReactNode; label: string }[];
  highlight?: "popular" | "best";
}

const META: Record<string, OfferMeta> = {
  one: {
    perks: [
      { icon: <ShieldCheck className="w-3.5 h-3.5" />, label: "ضمان 30 يوم" },
    ],
  },
  two: {
    ribbon: "الأكثر طلباً",
    ribbonIcon: <Flame className="w-3.5 h-3.5" />,
    ribbonColor: "bg-teal text-white",
    highlight: "popular",
    perks: [
      { icon: <Truck className="w-3.5 h-3.5" />, label: "توصيل مجاني" },
      { icon: <ShieldCheck className="w-3.5 h-3.5" />, label: "ضمان 30 يوم" },
    ],
  },
  three: {
    ribbon: "أفضل قيمة • وفّري 41%",
    ribbonIcon: <Crown className="w-3.5 h-3.5" />,
    ribbonColor: "bg-saffron text-white",
    highlight: "best",
    perks: [
      { icon: <Truck className="w-3.5 h-3.5" />, label: "توصيل مجاني" },
      { icon: <Gift className="w-3.5 h-3.5" />, label: "قطعة هدية للعائلة" },
      { icon: <ShieldCheck className="w-3.5 h-3.5" />, label: "ضمان 30 يوم" },
    ],
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
        const meta = META[offer.offerId] ?? { perks: [] };
        const original = UNIT_PRICE * offer.quantity;
        const savings = original - offer.price;
        const discountPct =
          offer.quantity > 1 ? Math.round((savings / original) * 100) : 0;
        const perUnit = Math.round(offer.price / offer.quantity);

        return (
          <button
            key={offer.offerId}
            type="button"
            onClick={() => onChange(offer.offerId)}
            aria-pressed={isSelected}
            className={cn(
              "relative w-full text-right rounded-2xl border-2 transition-all duration-200 overflow-hidden group",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-teal/40",
              isSelected
                ? meta.highlight === "best"
                  ? "border-saffron bg-saffron/5 shadow-md"
                  : "border-teal bg-teal/5 shadow-md"
                : "border-border-soft bg-white hover:border-teal/40 hover:shadow-sm",
              meta.highlight === "popular" && !isSelected && "border-teal/30",
              meta.highlight === "best" && !isSelected && "border-saffron/30"
            )}
          >
            {meta.ribbon && (
              <div
                className={cn(
                  "absolute top-0 left-0 px-3 py-1 rounded-br-2xl text-[11px] font-bold flex items-center gap-1 z-10",
                  meta.ribbonColor
                )}
              >
                {meta.ribbonIcon}
                {meta.ribbon}
              </div>
            )}

            <div className={cn("p-4 pt-5", meta.ribbon && "pt-7")}>
              <div className="flex items-stretch justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                      isSelected
                        ? meta.highlight === "best"
                          ? "border-saffron bg-saffron"
                          : "border-teal bg-teal"
                        : "border-muted/30 bg-white"
                    )}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                  </div>

                  <div className="text-right min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-charcoal text-base">
                        {offer.quantity} {offer.quantity === 1 ? "قطعة" : "قطع"}
                      </span>
                      {discountPct > 0 && (
                        <span className="bg-red-50 text-red-600 text-[11px] font-bold px-2 py-0.5 rounded-full border border-red-100">
                          -{discountPct}%
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted mt-0.5">{offer.label}</p>
                  </div>
                </div>

                <div className="text-left flex flex-col items-end justify-center flex-shrink-0">
                  {discountPct > 0 && (
                    <p className="text-xs text-muted line-through leading-none mb-1">
                      {formatMAD(original)}
                    </p>
                  )}
                  <p
                    className={cn(
                      "font-extrabold text-xl leading-none",
                      meta.highlight === "best" ? "text-saffron" : "text-teal"
                    )}
                  >
                    {formatMAD(offer.price)}
                  </p>
                  {offer.quantity > 1 && (
                    <p className="text-[11px] text-muted mt-1">
                      {perUnit} د.م / قطعة
                    </p>
                  )}
                </div>
              </div>

              {meta.perks.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border-soft flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  {meta.perks.map((perk, i) => (
                    <span
                      key={i}
                      className={cn(
                        "inline-flex items-center gap-1 text-[11px] font-medium",
                        isSelected
                          ? meta.highlight === "best"
                            ? "text-saffron"
                            : "text-teal"
                          : "text-muted"
                      )}
                    >
                      {perk.icon}
                      {perk.label}
                    </span>
                  ))}
                  {savings > 0 && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mr-auto">
                      وفّري {savings} درهم
                    </span>
                  )}
                </div>
              )}
            </div>
          </button>
        );
      })}

      <p className="text-[11px] text-muted text-center pt-1">
        💳 الدفع كاش عند الاستلام • 🚚 التوصيل لجميع مدن المغرب
      </p>
    </div>
  );
}
