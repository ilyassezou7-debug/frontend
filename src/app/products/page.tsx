import type { Metadata } from "next";
import { CheckCircle2, FlaskConical, BadgeCheck, Lock } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import TrustBadges from "@/components/ui/TrustBadges";
import FAQAccordion from "@/components/ui/FAQAccordion";
import ReviewCard from "@/components/product/ReviewCard";
import { PRODUCTS } from "@/config/products";
import { SITE_CONFIG } from "@/config/site";

export const metadata: Metadata = {
  title: "المنتجات",
  description:
    "تصفحي جميع منتجات أطلس بيور: قطرات النفس، بخاخ القدمين، وسيروم الأظافر. مكونات طبيعية، الدفع عند الاستلام.",
};

export default function ProductsPage() {
  const allReviews = PRODUCTS.flatMap((p) => p.reviews).slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-ivory via-mist/40 to-sand section-padding">
        <div className="container-max text-center max-w-2xl">
          <p className="divider-gold mb-4 max-w-xs mx-auto">
            <span>تركيباتنا</span>
          </p>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-charcoal mb-4 leading-tight">
            ثلاث تركيبات صيدلانية.{" "}
            <span className="text-teal">حل واحد لكل مشكل.</span>
          </h1>
          <p className="text-lg text-muted">
            كل منتج مصمم بمشاركة صيادلة لهدف واحد دقيق – بلا تشتيت، بلا حشو، بنتائج مضمونة.
          </p>
        </div>
      </section>

      {/* Trust strip */}
      <TrustBadges />

      {/* Products grid */}
      <section className="section-padding bg-ivory">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} showFullSelector />
            ))}
          </div>
        </div>
      </section>

      {/* Why AtlasPure */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className="divider-gold mb-4 max-w-xs mx-auto">
              <span>الفرق ديالنا</span>
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-charcoal mb-3">
              علاش أطلس بيور؟
            </h2>
            <p className="text-muted leading-relaxed">
              الفرق بيناتنا وبين الباقي ماشي فالشعارات – بل فالبروتوكول.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: FlaskConical,
                title: "تركيبة من إعداد صيادلة",
                desc: "كل منتج مصمم بمشاركة صيادلة وخبراء فالنباتات الطبية – بلا حشو ولا مواد كيميائية مجهولة.",
              },
              {
                icon: BadgeCheck,
                title: "مصادق عليها رسمياً",
                desc: "جميع تركيباتنا مصادق عليها من الهيئة العامة للغداء والدواء المغربية (ONSSA).",
              },
              {
                icon: Lock,
                title: "خصوصية تامة",
                desc: "تغليف محترم بلا إشهار خارجي، توصيل مباشر، الدفع نقداً عند الاستلام.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-ivory rounded-2xl p-6 border border-border-soft hover:border-teal/40 hover:shadow-md transition-all text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-teal/10 text-teal flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-xl text-charcoal font-display mb-2">
                  {item.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="section-padding bg-sand">
        <div className="container-max">
          <div className="text-center mb-8">
            <h2 className="font-display font-bold text-2xl text-charcoal">
              آراء زبوناتنا
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {allReviews.map((review, i) => (
              <ReviewCard key={i} review={review} />
            ))}
          </div>
        </div>
      </section>

      {/* COD reassurance */}
      <section className="section-padding bg-teal-dark text-ivory">
        <div className="container-max text-center max-w-2xl">
          <CheckCircle2 className="w-12 h-12 text-saffron mx-auto mb-4" />
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
            ماعنديكش ما تخسريه
          </h2>
          <p className="text-ivory/80 text-lg leading-relaxed">
            الطلب مجاني. التوصيل مجاني. والدفع فقط ملي توصلك السلعة فيدك. ضمان 30 يوم باش ترجعي فلوسك إلا ما لقيتيش الفرق. هاد هو وعدنا معاك.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-ivory">
        <div className="container-max max-w-3xl">
          <div className="text-center mb-8">
            <h2 className="font-display font-bold text-2xl text-charcoal">
              أسئلة شائعة
            </h2>
          </div>
          <FAQAccordion items={SITE_CONFIG.faq} />
        </div>
      </section>
    </div>
  );
}
