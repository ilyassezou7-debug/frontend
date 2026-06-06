import { X } from "lucide-react";

interface AntiClaimStripProps {
  claims: string[];
}

/**
 * "What's NOT in it" chip strip — kills the dropshipping suspicion.
 * Compact section between ingredients and how-to-use.
 */
export default function AntiClaimStrip({ claims }: AntiClaimStripProps) {
  return (
    <section className="bg-white py-10 border-y border-border-soft">
      <div className="container-max">
        <div className="text-center mb-6">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-saffron mb-2">
            خالٍ تماماً من
          </p>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-charcoal">
            تركيبة نقية بلا حشو ولا مفاجآت
          </h2>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
          {claims.map((claim) => (
            <span
              key={claim}
              className="inline-flex items-center gap-2 bg-ivory border border-border-soft text-charcoal text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-full"
            >
              <span className="w-5 h-5 rounded-full bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
                <X className="w-3 h-3" strokeWidth={3} />
              </span>
              {claim}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
