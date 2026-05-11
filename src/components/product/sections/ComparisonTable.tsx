import { Check, X, Minus } from "lucide-react";
import type { ComparisonRow } from "@/types/product";

interface ComparisonTableProps {
  rows: ComparisonRow[];
}

function Cell({ value, accent }: { value: boolean | string; accent?: boolean }) {
  if (value === true) {
    return (
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto ${
          accent ? "bg-teal text-white" : "bg-emerald-50 text-emerald-700"
        }`}
      >
        <Check className="w-4 h-4" strokeWidth={3} />
      </div>
    );
  }
  if (value === false) {
    return (
      <div className="w-7 h-7 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
        <X className="w-4 h-4" strokeWidth={3} />
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-muted font-medium">
      <Minus className="w-3 h-3" />
      <span>{value}</span>
    </div>
  );
}

/**
 * Comparison table — AtlasPure vs traditional vs pharmacy.
 * Powerful for cold-traffic conversion: positions the brand as the obvious choice.
 * Mobile: cards stack into a vertical comparison strip per row.
 */
export default function ComparisonTable({ rows }: ComparisonTableProps) {
  const cols: { key: "us" | "traditional" | "pharmacy"; label: string; highlight?: boolean }[] = [
    { key: "us", label: "أطلس بيور", highlight: true },
    { key: "traditional", label: "حلول تقليدية" },
    { key: "pharmacy", label: "صيدلية" },
  ];

  return (
    <section className="section-padding bg-ivory">
      <div className="container-max">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="divider-gold mb-4 max-w-xs mx-auto">
            <span>المقارنة</span>
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-charcoal leading-tight mb-3">
            علاش <span className="text-teal">أطلس بيور</span> الأحسن؟
          </h2>
          <p className="text-muted leading-relaxed">
            مقارنة بصيغة بسيطة بين الحلول المتاحة فالسوق – باش تختاري بثقة.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-border-soft bg-white shadow-sm">
          {/* Header */}
          <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] sm:grid-cols-[2fr_1fr_1fr_1fr] bg-charcoal text-ivory">
            <div className="p-3 sm:p-4 text-right text-[11px] sm:text-sm font-semibold">
              الميزة
            </div>
            {cols.map((c) => (
              <div
                key={c.key}
                className={`p-3 sm:p-4 text-center text-[11px] sm:text-sm font-bold ${
                  c.highlight ? "bg-teal" : ""
                }`}
              >
                {c.label}
              </div>
            ))}
          </div>

          {/* Rows */}
          {rows.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-[1.4fr_1fr_1fr_1fr] sm:grid-cols-[2fr_1fr_1fr_1fr] items-center ${
                i % 2 === 0 ? "bg-white" : "bg-ivory/60"
              }`}
            >
              <div className="p-3 sm:p-4 text-right text-[12px] sm:text-sm font-medium text-charcoal leading-snug">
                {row.feature}
              </div>
              <div className="p-3 sm:p-4 text-center bg-teal/[0.04]">
                <Cell value={row.us} accent />
              </div>
              <div className="p-3 sm:p-4 text-center">
                <Cell value={row.traditional} />
              </div>
              <div className="p-3 sm:p-4 text-center">
                <Cell value={row.pharmacy} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
