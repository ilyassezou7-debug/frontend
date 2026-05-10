import { ShieldCheck, Truck, Banknote, Phone } from "lucide-react";

interface GoldenGuaranteeSealProps {
  customText?: string;
}

/**
 * Golden Guarantee section — single bold seal that consolidates trust signals.
 * Replaces 3 redundant trust mentions throughout the old page.
 */
export default function GoldenGuaranteeSeal({
  customText,
}: GoldenGuaranteeSealProps) {
  return (
    <section className="section-padding bg-teal-dark text-ivory relative overflow-hidden">
      {/* Subtle gold pattern */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #B8862F 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="container-max relative">
        <div className="max-w-3xl mx-auto text-center">
          {/* Seal */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute inset-0 bg-saffron/20 rounded-full blur-2xl" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-saffron via-saffron-dark to-saffron flex items-center justify-center shadow-2xl ring-4 ring-saffron/30">
              <ShieldCheck className="w-12 h-12 text-white" />
            </div>
          </div>

          <p className="text-saffron text-[11px] font-bold tracking-[0.3em] uppercase mb-3">
            الضمان الذهبي
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4 leading-tight">
            30 يوم لتجربة المنتج بلا مخاطر
          </h2>
          <p className="text-ivory/85 text-base md:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            {customText ??
              "إلا ما حسيتيش بفرق خلال 30 يوم – رجعي القنينة (حتى لو فاضية) وكنرجعو ليك جميع فلوسك بلا أسئلة. كنوقفو بكلامنا."}
          </p>

          {/* 3 trust pillars under the seal */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              {
                icon: Banknote,
                title: "الدفع عند الاستلام",
                desc: "ما كتخلصي والو دابا – الدفع نقداً يد بيد ملي توصلك الأمانة.",
              },
              {
                icon: Truck,
                title: "توصيل مجاني وسريع",
                desc: "لجميع مدن المغرب فمدة 2-5 أيام عمل، بلا أي تكلفة إضافية.",
              },
              {
                icon: Phone,
                title: "تأكيد سريع للطلب",
                desc: "غادي نتواصلو معاك هاتفياً لتأكيد المعلومات والتوصيل.",
              },
            ].map((p) => (
              <div
                key={p.title}
                className="bg-white/5 rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-saffron/15 text-saffron flex items-center justify-center mx-auto mb-3">
                  <p.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base mb-2">{p.title}</h3>
                <p className="text-sm text-ivory/70 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
