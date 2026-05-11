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
  Gift,
  Sparkles,
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
  bonus?: string;
  highlight?: "popular" | "best";
}

const META: Record<string, OfferMeta> = {
  one: {
    title: "علبة واحدة",
    subtitle: "كافية لـ 30 يوم استعمال",
  },
  two: {
    title: "علبتين",
    subtitle: "كافية لـ 60 يوم • بلا انقطاع",
    ribbon: "الأكثر اختياراً",
    ribbonIcon: <Flame className="w-3.5 h-3.5" />,
    ribbonClass: "bg-teal text-white",
    bonus: "60 يوم تغطية",
    highlight: "popular",
  },
  three: {
    title: "ثلاث علب — البروتوكول الكامل",
    subtitle: "كافية لـ 90 يوم + قطعة هدية",
    ribbon: "الأكثر توفيراً • -41%",
    ribbonIcon: <Crown className="w-3.5 h-3.5" />,
    ribbonClass:
      "bg-gradient-to-l from-saffron-dark via-saffron to-saffron-dark text-white",
    bonus: "+ قطعة مجانية",
    highlight: "best",
  },
};

export default function OfferSelector({
  offers,
  selected,
  onChange,
}: OfferSelectorProps) {
  return (
    <div className="space-y-3.5">
      {/* Speed promise — stays */}
      <div className="flex items-center gap-2.5 bg-gradient-to-l from-emerald-50 via-emerald-50/70 to-emerald-50/40 border border-emerald-200/60 rounded-xl px-3.5 py-2.5">
        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-emerald-700" strokeWidth={2.5} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] sm:text-[13px] font-bold text-emerald-800 leading-tight">
            نتائج محسوسة من أول أسبوع استعمال
          </p>
          <p className="text-[10px] sm:text-[11px] text-emerald-700/80 leading-tight mt-0.5">
            كل علبة عندها نفس الفعالية – الكمية كتضمن الاستمرارية
          </p>
        </div>
      </div>

      {/* Pack cards */}
      {offers.map((offer) => {
        const isSelected = selected === offer.offerId;
        const meta = META[offer.offerId] ?? {
          title: `${offer.quantity} علب`,
          subtitle: "",
        };
        const original = UNIT_PRICE * offer.quantity;
        const savings = original - offer.price;
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
              "block w-full text-right rounded-2xl overflow-hidden",
              "transition-all duration-200 ease-out",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              // Border + bg + shadow per state
              isSelected
                ? isBest
                  ? "border-2 border-saffron bg-gradient-to-br from-saffron/[0.07] to-saffron/[0.02] shadow-lg shadow-saffron/15 focus-visible:ring-saffron/40"
                  : "border-2 border-teal bg-gradient-to-br from-teal/[0.06] to-teal/[0.02] shadow-lg shadow-teal/15 focus-visible:ring-teal/40"
                : cn(
                    "bg-white hover:shadow-md focus-visible:ring-teal/40 border-2",
                    isBest
                      ? "border-saffron/35 hover:border-saffron"
                      : isPopular
                      ? "border-teal/35 hover:border-teal"
                      : "border-border-soft hover:border-teal/40"
                  )
            )}
          >
            {/* TOP BANNER (integrated, full-width — only popular & best) */}
            {meta.ribbon && (
              <div
                className={cn(
                  "px-3 py-1.5 text-[10px] sm:text-[11px] font-bold tracking-[0.12em] uppercase flex items-center justify-center gap-1.5",
                  meta.ribbonClass
                )}
              >
                {meta.ribbonIcon}
                <span>{meta.ribbon}</span>
              </div>
            )}

            {/* MAIN CONTENT — generous padding, clear zones */}
            <div className="px-4 py-4 sm:px-5 sm:py-5">
              <div className="flex items-start gap-3 sm:gap-4">
                {/* Radio */}
                <div
                  className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
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

                {/* Title block — takes remaining width */}
                <div className="flex-1 min-w-0 text-right">
                  <h3 className="font-bold text-charcoal text-[15px] sm:text-base leading-tight">
                    {meta.title}
                  </h3>
                  <p className="text-[11px] sm:text-[12px] text-muted mt-1 leading-snug">
                    {meta.subtitle}
                  </p>
                </div>

                {/* Price column — fixed-width, vertical stack */}
                <div className="text-left flex flex-col items-end flex-shrink-0 tabular-nums">
                  {savings > 0 && (
                    <p className="text-[11px] text-muted/80 line-through leading-none mb-1 whitespace-nowrap">
                      {formatMAD(original)}
                    </p>
                  )}
                  <p
                    className={cn(
                      "font-extrabold text-xl sm:text-2xl leading-none whitespace-nowrap",
                      isBest ? "text-saffron-dark" : "text-teal"
                    )}
                  >
                    {formatMAD(offer.price)}
                  </p>
                  {offer.quantity > 1 && (
                    <p className="text-[10px] text-muted mt-1.5 whitespace-nowrap">
                      {perUnit} د.م / علبة
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* BOTTOM SAVINGS STRIP — only on multi-pack, full-width colored bar */}
            {savings > 0 && (
              <div
                className={cn(
                  "px-4 sm:px-5 py-2.5 border-t flex items-center justify-between gap-2 text-[12px]",
                  isBest
                    ? "bg-saffron/[0.08] border-saffron/15 text-saffron-dark"
                    : "bg-emerald-50 border-emerald-100 text-emerald-700"
                )}
              >
                <span className="font-extrabold flex items-center gap-1.5 tabular-nums">
                  {isBest ? (
                    <Gift className="w-3.5 h-3.5" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  وفّري {savings} درهم
                </span>
                {meta.bonus && (
                  <span className="font-bold opacity-90 text-[11px] truncate">
                    {meta.bonus}
                  </span>
                )}
              </div>
            )}
          </button>
        );
      })}

      {/* Reassurance footer */}
      <div className="flex items-center justify-between gap-2 pt-1 px-1 text-[10px] sm:text-[11px] text-muted">
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
