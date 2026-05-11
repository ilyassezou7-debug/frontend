"use client";

import type { ProductOffer } from "@/types/product";
import type { OfferId } from "@/types/product";
import { formatMAD } from "@/lib/money";
import { cn } from "@/lib/cn";
import { motion } from "framer-motion";
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
    ribbonIcon: <Flame className="w-3.5 h-3.5" />,
    highlight: "popular",
  },
  three: {
    title: "ثلاث علب + هدية",
    subtitle: "90 يوم • البروتوكول الكامل",
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
  return (
    <div className="space-y-4">
      {/* Speed promise — modern alert style */}
      <div className="flex items-center justify-center gap-2 bg-emerald-50/80 border border-emerald-200/60 rounded-xl px-3 py-2.5 mb-2 shadow-sm">
        <Zap className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="currentColor" />
        <p className="text-xs font-bold text-emerald-800 leading-tight">
          نتائج محسوسة من أول أسبوع
        </p>
      </div>

      <div className="space-y-3.5">
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
                    ? cn("border-2", activeBorder, activeBg, activeShadow, "scale-[1.02] sm:scale-100 z-0")
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
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" strokeWidth={3.5} />
                      </motion.div>
                    )}
                  </div>

                  {/* Content Grid */}
                  <div className="flex-1 min-w-0 text-right">
                    {/* Top Row: Title & Price */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h3 className={cn(
                        "font-bold font-display text-[15px] sm:text-base leading-tight truncate transition-colors duration-300",
                        isSelected ? "text-charcoal" : "text-charcoal/80"
                      )}>
                        {meta.title}
                      </h3>
                      
                      <div className="text-left flex flex-col items-end flex-shrink-0 tabular-nums">
                        <div className="flex items-center gap-1.5">
                          {savings > 0 && (
                            <span className="text-[11px] sm:text-xs text-muted/60 line-through font-medium">
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
                        {meta.subtitle}
                      </p>
                      
                      {savings > 0 && (
                        <div className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 tabular-nums transition-colors duration-300",
                          isSelected
                            ? isBest ? "bg-saffron/20 text-saffron-dark" : "bg-teal/15 text-teal-dark"
                            : "bg-sand text-muted"
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

      {/* Reassurance footer — Modern Pill Style */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 pt-2 text-[10px] sm:text-[11px] font-medium text-muted">
        <span className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-border-soft shadow-sm">
          <Banknote className="w-3.5 h-3.5 text-teal" />
          الدفع عند الاستلام
        </span>
        <span className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-border-soft shadow-sm">
          <Truck className="w-3.5 h-3.5 text-teal" />
          توصيل مجاني
        </span>
        <span className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-border-soft shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-teal" />
          ضمان 30 يوم
        </span>
      </div>
    </div>
  );
}
