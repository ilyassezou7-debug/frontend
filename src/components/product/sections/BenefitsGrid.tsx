import { Sparkles, Shield, Zap } from "lucide-react";
import type { Benefit } from "@/types/product";

interface BenefitsGridProps {
  benefits: Benefit[];
  productShortName: string;
}

const ICONS = [Zap, Shield, Sparkles] as const;

/**
 * Transformation grid — "what changes for you" in 3 cards.
 * The bridge between pain and product. Cold-traffic users see the outcome.
 */
export default function BenefitsGrid({
  benefits,
  productShortName,
}: BenefitsGridProps) {
  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="divider-gold mb-4 max-w-xs mx-auto">
            <span>التحول</span>
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-charcoal leading-tight mb-3">
            ماذا سيتغيّر لك مع{" "}
            <span className="text-teal">{productShortName}</span>؟
          </h2>
          <p className="text-muted leading-relaxed">
            ليست وعوداً — نتائج حقيقية تلاحظها في حياتك اليومية من أول استعمال.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {benefits.map((b, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div
                key={b.title}
                className="group relative bg-ivory rounded-2xl p-6 border border-border-soft hover:border-teal/40 hover:shadow-md transition-all"
              >
                <div className="absolute -top-4 right-6 w-11 h-11 rounded-2xl bg-teal text-white flex items-center justify-center shadow-md ring-4 ring-white">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="pt-3">
                  <p className="text-[10px] font-bold tracking-[0.2em] text-saffron mb-2">
                    0{i + 1}
                  </p>
                  <h3 className="font-display font-bold text-xl text-charcoal mb-2 leading-tight">
                    {b.title}
                  </h3>
                  <p className="text-muted leading-relaxed text-sm">{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
