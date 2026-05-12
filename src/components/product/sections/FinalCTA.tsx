"use client";

import { ArrowDown, ShieldCheck, Truck, Banknote } from "lucide-react";

interface FinalCTAProps {
  productShortName: string;
  ratingCount: number;
  /** DOM id of the offer block to scroll to. */
  targetId: string;
}

/**
 * Final CTA — last chance close section. Re-anchors social proof,
 * bounces user back to the offer block.
 */
export default function FinalCTA({
  productShortName,
  ratingCount,
  targetId,
}: FinalCTAProps) {
  function handleClick() {
    const target =
      document.getElementById("offer-select") ??
      document.getElementById(targetId);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="section-padding bg-gradient-to-b from-ivory to-mist/40">
      <div className="container-max">
        <div className="bg-white rounded-3xl border border-saffron/30 shadow-lg max-w-3xl mx-auto p-6 md:p-10 text-center">
          <div className="inline-flex items-center gap-2 bg-saffron/10 text-saffron text-xs font-bold tracking-wide px-3 py-1.5 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-saffron animate-pulse" />
            انضمي لـ {ratingCount}+ امرأة مغربية
          </div>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-charcoal leading-tight mb-3">
            استرجعي ثقتك مع {productShortName} اليوم
          </h2>
          <p className="text-muted leading-relaxed max-w-xl mx-auto mb-7">
            بدون مخاطر – الدفع عند الاستلام، توصيل مجاني، وضمان استرجاع 30 يوم.
            <br />
            ما عندك ما تخسري.
          </p>

          <button
            type="button"
            onClick={handleClick}
            className="inline-flex items-center justify-center gap-2 bg-teal hover:bg-teal-hover text-ivory font-bold text-base md:text-lg px-8 py-4 rounded-2xl shadow-lg shadow-teal/20 active:scale-95 transition-all"
          >
            اطلبي الآن
            <ArrowDown className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-6 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Banknote className="w-4 h-4 text-teal" />
              الدفع عند الاستلام
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-teal" />
              توصيل مجاني
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal" />
              ضمان 30 يوم
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
