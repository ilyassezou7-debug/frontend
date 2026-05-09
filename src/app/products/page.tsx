import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
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
      <section className="bg-gradient-to-br from-ivory to-sand section-padding">
        <div className="container-max text-center">
          <h1 className="font-display font-bold text-4xl md:text-5xl text-charcoal mb-4">
            اختاري العناية المناسبة
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            ثلاثة منتجات لثلاث مشاكل شائعة – مكونات طبيعية بسيطة، بثمن معقول.
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

      {/* Why Atlas Pure */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-10">
            <h2 className="font-display font-bold text-3xl text-charcoal mb-3">
              لماذا أطلس بيور؟
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                title: "مكونات طبيعية",
                desc: "كل مكون معروف ومستعمل تقليدياً. ما فيهاش مواد اصطناعية.",
              },
              {
                title: "بثمن معقول",
                desc: "عناية حقيقية بثمن في متناول الجميع. الجودة ما خاصهاش تكون غالية.",
              },
              {
                title: "دفع عند الاستلام",
                desc: "ما كتحتاجيش بطاقة بنكية. خلصي فقط ملي توصلك السلعة.",
              },
            ].map((item) => (
              <div key={item.title} className="text-center space-y-3 p-6">
                <CheckCircle2 className="w-10 h-10 text-teal mx-auto" />
                <h3 className="font-bold text-xl text-charcoal font-display">
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
          <h2 className="font-display font-bold text-3xl mb-4">
            ماعنديكش ما تخسريه
          </h2>
          <p className="text-ivory/80 text-lg leading-relaxed">
            الطلب مجاني. التوصيل مجاني. والدفع فقط ملي توصلك السلعة في يدك. هاد هو وعدنا معاك.
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
