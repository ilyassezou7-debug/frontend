"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  ShoppingBag,
  ArrowLeft,
  Sparkles,
  Clock,
  CalendarCheck,
  Lightbulb,
} from "lucide-react";
import type { Product } from "@/types/product";
import type { OfferId } from "@/types/product";
import OfferSelector from "@/components/product/OfferSelector";
import ReviewCard from "@/components/product/ReviewCard";
import StickyMobileCTA from "@/components/product/StickyMobileCTA";
import TrustBadges from "@/components/ui/TrustBadges";
import FAQAccordion from "@/components/ui/FAQAccordion";
import StarRating from "@/components/ui/StarRating";
import { useCartStore } from "@/store/cart-store";
import { formatMAD } from "@/lib/money";
import { trackViewContent, trackAddToCart } from "@/lib/tracking";
import { generateEventId } from "@/lib/event-id";
import { SITE_CONFIG } from "@/config/site";
import { PRODUCTS } from "@/config/products";

interface ProductPageClientProps {
  product: Product;
}

export default function ProductPageClient({ product }: ProductPageClientProps) {
  const [selectedOffer, setSelectedOffer] = useState<OfferId>("two");
  const addOffer = useCartStore((s) => s.addOffer);
  const openCart = useCartStore((s) => s.openCart);

  useEffect(() => {
    const eventId = generateEventId();
    trackViewContent(product.id, 199, eventId);
  }, [product.id]);

  const offer = product.offers.find((o) => o.offerId === selectedOffer)!;

  function handleAddToCart() {
    addOffer({
      productId: product.id,
      offerId: offer.offerId,
      quantity: 1,
      unitCount: offer.quantity,
      price: offer.price,
      source: "product_page",
    });
    const eventId = generateEventId();
    trackAddToCart(product.id, offer.price, eventId);
    openCart();
  }

  const crossSellProducts = product.crossSellPriority
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, 2);

  return (
    <div>
      {/* Hero / Offer Block */}
      <section className="section-padding bg-gradient-to-br from-ivory to-sand">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            {/* Product Image */}
            <div className="relative aspect-square max-w-lg mx-auto w-full">
              <div className="absolute inset-0 bg-teal/5 rounded-3xl" />
              <Image
                src={product.images.hero}
                alt={product.displayName}
                fill
                priority
                className="object-contain p-6 rounded-3xl opacity-40"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              
              {/* Image content placeholder description */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10 pointer-events-none">
                <div className="bg-white/85 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-white/50 max-w-[85%]">
                  <p className="text-charcoal font-bold text-sm leading-relaxed">
                    {product.id === "breath_drops" && "صورة جذابة لقطرات النفس مع أوراق النعناع والقرنفل في خلفية نقية توحي بالانتعاش والثقة."}
                    {product.id === "foot_spray" && "صورة لبخاخ القدمين مع لمسات من زيت شجرة الشاي والشبة، في بيئة مريحة توحي بالنظافة."}
                    {product.id === "nail_serum" && "صورة لسيروم الأظافر تبرز نقاء السيروم مع مكونات طبيعية كالثوم وخل التفاح."}
                  </p>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-5">
              <div>
                <h1 className="font-display font-bold text-3xl md:text-4xl text-charcoal leading-tight mb-2">
                  {product.displayName}
                </h1>
                <div className="flex items-center gap-2 mb-3">
                  <StarRating rating={4.8} />
                  <span className="text-sm text-muted">
                    ({product.reviews.length} تقييم)
                  </span>
                </div>
                <p className="text-lg text-muted leading-relaxed">
                  {product.headline}
                </p>
              </div>

              <p className="text-sm text-muted leading-relaxed">
                {product.subheading}
              </p>

              {/* Offer Selector */}
              <div>
                <p className="font-semibold text-charcoal mb-3">
                  اختاري الكمية:
                </p>
                <OfferSelector
                  offers={product.offers}
                  selected={selectedOffer}
                  onChange={setSelectedOffer}
                />
              </div>

              {/* Offer nudge */}
              <p className="text-sm text-saffron font-medium bg-saffron/10 rounded-xl px-4 py-2">
                ⚡ {product.offerNudge}
              </p>

              {/* Desktop CTA */}
              <div className="hidden md:block">
                <button
                  onClick={handleAddToCart}
                  className="btn-primary w-full flex items-center justify-center gap-2 text-base"
                >
                  <ShoppingBag className="w-5 h-5" />
                  أضيفي للسلة – {formatMAD(offer.price)}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <TrustBadges />

      {/* Authority & Science Section (Maroc SFDA & Warranty) - Text Left, Image Right */}
      <section className="section-padding bg-white border-b border-sand">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Text Left */}
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 bg-saffron/10 text-saffron-dark text-sm font-semibold px-3 py-1.5 rounded-full">
                <CheckCircle2 className="w-4 h-4" />
                جودة مضمونة 100%
              </div>
              <h2 className="font-display font-bold text-3xl text-charcoal">
                مصادق عليه علمياً وآمن للاستعمال
              </h2>
              <p className="text-muted leading-relaxed text-lg">
                منتجاتنا خاضعة لمعايير الجودة الصارمة ومصادق عليها من الهيئة العامة للغداء والدواء المغربية. كنستعملو غير المكونات الطبيعية اللي ثبتت الفعالية ديالها علمياً، باش نعطيوك نتيجة حقيقية بلا أضرار جانبية.
              </p>
              <ul className="space-y-3 mt-4">
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-teal" />
                  </div>
                  <span className="font-medium text-charcoal">مصادق عليها من الهيئة العامة للغداء والدواء المغربية</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-teal" />
                  </div>
                  <span className="font-medium text-charcoal">ضمان استرجاع الأموال لمدة 30 يوم (30 Days Warranty)</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-teal" />
                  </div>
                  <span className="font-medium text-charcoal">مكونات طبيعية 100% خالية من المواد الكيميائية الضارة</span>
                </li>
              </ul>
            </div>
            {/* Image Right */}
            <div className="relative aspect-square max-w-sm mx-auto w-full">
              <div className="absolute inset-0 bg-teal/10 rounded-3xl transform -rotate-3" />
              <Image
                src="/images/placeholders/science-proof.svg"
                alt="مصادق عليه علمياً"
                fill
                className="object-contain p-6 rounded-3xl opacity-40"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10 pointer-events-none">
                <div className="bg-white/85 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-white/50 max-w-[85%]">
                  <p className="text-charcoal font-bold text-sm leading-relaxed">
                    صورة تختم بمصادقة أو شهادة طبية (مثل شعار ONSSA) لتعزيز الثقة.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain section (Image Left, Text Right) */}
      <section className="section-padding bg-sand">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Image Left */}
            <div className="relative aspect-square max-w-sm mx-auto w-full order-2 md:order-1">
              <div className="absolute inset-0 bg-white rounded-3xl shadow-sm transform rotate-3" />
              <Image
                src={product.images.lifestyle}
                alt={`معاناة ${product.shortName}`}
                fill
                className="object-cover rounded-3xl p-2 opacity-40"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10 pointer-events-none">
                <div className="bg-white/85 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-white/50 max-w-[85%]">
                  <p className="text-charcoal font-bold text-sm leading-relaxed">
                    صورة تعبيرية لامرأة تبرز الراحة، الثقة، والأنوثة بعد التخلص من المشكل.
                  </p>
                </div>
              </div>
            </div>
            {/* Text Right */}
            <div className="space-y-5 order-1 md:order-2">
              <h2 className="font-display font-bold text-3xl text-charcoal mb-4">
                فاهمين الإحساس ديالك كمرأة مغربية
              </h2>
              <p className="text-muted leading-relaxed text-lg">
                {product.painSection}
              </p>
              <p className="text-charcoal font-medium mt-4 border-r-4 border-teal pr-4 py-2 bg-white/50 rounded-l-lg">
                &quot;ماشي بوحدك اللي كتعاني من هاد المشكل.. الآلاف من النساء المغربيات جربو وارتاحو أخيراً.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ingredients (Text Left, Image Right) */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Text Left */}
            <div className="space-y-5">
              <h2 className="font-display font-bold text-3xl text-charcoal">
                قوة الطبيعة في مكوناتنا
              </h2>
              <p className="text-muted leading-relaxed text-lg">
                {product.ingredientCopy}
              </p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                {product.ingredients.map((ing) => (
                  <div key={ing} className="flex items-center gap-3 bg-sand p-3 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-teal flex-shrink-0" />
                    <span className="font-medium text-charcoal text-sm">{ing}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Image Right */}
            <div className="relative aspect-square max-w-sm mx-auto w-full">
              <div className="absolute inset-0 bg-teal/5 rounded-full scale-105" />
              <Image
                src={product.images.ingredients}
                alt={`مكونات ${product.shortName}`}
                fill
                className="object-contain rounded-full opacity-40"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10 pointer-events-none">
                <div className="bg-white/85 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-white/50 max-w-[85%]">
                  <p className="text-charcoal font-bold text-sm leading-relaxed">
                    صورة تسلط الضوء بوضوح على المكونات الطبيعية للمنتج ({product.ingredients.slice(0, 2).join(" و")}).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to use – step-by-step + timeline + tips */}
      <section className="section-padding bg-gradient-to-b from-sand to-ivory">
        <div className="container-max">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 bg-teal/10 text-teal text-sm font-semibold px-3 py-1.5 rounded-full mb-4">
              <Sparkles className="w-4 h-4" />
              طريقة الاستعمال
            </div>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-charcoal mb-3">
              ساهلة وبسيطة في 3 خطوات فقط
            </h2>
            <p className="text-muted leading-relaxed">
              ما تحتاجي حتى خبرة – فدقائق غادي تكوني عارفة كيفاش تستعملي{" "}
              {product.shortName} باش تحصلي على أحسن نتيجة.
            </p>

            {/* Frequency badge */}
            <div className="inline-flex items-center gap-2 bg-white border border-border-soft rounded-full px-4 py-2 mt-5 shadow-sm">
              <Clock className="w-4 h-4 text-saffron" />
              <span className="text-sm text-charcoal">
                <span className="text-muted">معدل الاستعمال:</span>{" "}
                <span className="font-bold">{product.usageFrequency}</span>
              </span>
            </div>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
            {product.howToUseSteps.map((step, i) => (
              <div
                key={i}
                className="relative bg-white rounded-2xl p-6 shadow-sm border border-border-soft hover:shadow-md hover:border-teal/30 transition-all"
              >
                <div className="absolute -top-4 right-6 w-10 h-10 rounded-full bg-teal text-white font-bold text-lg flex items-center justify-center shadow-md ring-4 ring-ivory">
                  {i + 1}
                </div>
                <div className="pt-3">
                  <h3 className="font-display font-bold text-lg text-charcoal mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted leading-relaxed text-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Timeline + Tips */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Timeline */}
            <div className="lg:col-span-3 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-border-soft">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center flex-shrink-0">
                  <CalendarCheck className="w-5 h-5 text-teal" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-charcoal">
                    شنو غادي تحسي بيه؟
                  </h3>
                  <p className="text-xs text-muted">
                    نتائج حقيقية متوقعة مع الاستعمال المنتظم
                  </p>
                </div>
              </div>

              <ol className="relative space-y-5 pr-6 border-r-2 border-dashed border-teal/20">
                {product.expectedTimeline.map((item, i) => (
                  <li key={i} className="relative">
                    <span className="absolute -right-[33px] top-1 w-5 h-5 rounded-full bg-white border-2 border-teal flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-teal" />
                    </span>
                    <p className="font-bold text-saffron text-sm mb-1">
                      {item.when}
                    </p>
                    <p className="text-charcoal leading-relaxed">
                      {item.result}
                    </p>
                  </li>
                ))}
              </ol>

              <div className="mt-6 pt-5 border-t border-border-soft flex items-start gap-3 text-sm">
                <CheckCircle2 className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" />
                <p className="text-muted leading-relaxed">
                  <span className="font-semibold text-charcoal">
                    ضمان استرجاع الأموال 30 يوم
                  </span>{" "}
                  – إلا ما لقيتيش الفرق، كنرجعو ليك الفلوس بلا أي أسئلة.
                </p>
              </div>
            </div>

            {/* Tips */}
            <div className="lg:col-span-2 bg-charcoal text-ivory rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-saffron/20 flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-5 h-5 text-saffron" />
                </div>
                <h3 className="font-display font-bold text-xl">
                  نصائح للحصول على أفضل نتيجة
                </h3>
              </div>

              <ul className="space-y-4">
                {product.usageTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-saffron/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-saffron" />
                    </div>
                    <p className="text-ivory/90 leading-relaxed text-sm">
                      {tip}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="section-padding bg-ivory">
        <div className="container-max">
          <h2 className="font-display font-bold text-2xl text-charcoal mb-6">
            تقييمات الزبونات
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {product.reviews.map((review, i) => (
              <ReviewCard key={i} review={review} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Guarantee Section */}
      <section className="section-padding bg-teal-dark text-ivory">
        <div className="container-max text-center max-w-3xl">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-6">
            <CheckCircle2 className="w-8 h-8 text-saffron" />
          </div>
          <h2 className="font-display font-bold text-3xl mb-4">
            التزامنا معاك – راحتك وثقتك هي الأهم
          </h2>
          <p className="text-ivory/80 text-lg leading-relaxed mb-8">
            في أطلس بيور، كنضمنو ليك تجربة تسوق مريحة وآمنة 100%. التوصيل سريع، والدفع ما كيكون حتى تستلمي الطلبية ديالك. فريقنا ديما معاك باش يجاوب على استفساراتك.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-saffron" />
              </div>
              <h3 className="font-bold text-lg mb-2">توصيل سريع ومجاني</h3>
              <p className="text-sm text-ivory/70 leading-relaxed">توصيل مجاني لجميع مدن المغرب في مدة لا تتجاوز 2-5 أيام عمل.</p>
            </div>
            
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-saffron" />
              </div>
              <h3 className="font-bold text-lg mb-2">الدفع عند الاستلام</h3>
              <p className="text-sm text-ivory/70 leading-relaxed">ما كتخلصي والو دابا، الدفع كيكون نقداً يد في يد ملي توصلك الأمانة.</p>
            </div>
            
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-saffron" />
              </div>
              <h3 className="font-bold text-lg mb-2">تأكيد سريع للطلبية</h3>
              <p className="text-sm text-ivory/70 leading-relaxed">غادي نتواصلو معاك هاتفياً لتأكيد الطلب ونبقاو معاك حتى الاستلام براحة تامة.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-sell */}
      {crossSellProducts.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-max">
            <h2 className="font-display font-bold text-2xl text-charcoal mb-6">
              كملي روتينك
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
              {crossSellProducts.map(
                (p) =>
                  p && (
                    <div key={p.id} className="card p-4">
                      <div className="flex gap-4 items-center mb-3">
                        <div className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-sand">
                          <Image
                            src={p.images.hero}
                            alt={p.shortName}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-charcoal text-sm">
                            {p.shortName}
                          </p>
                          <p className="text-xs text-muted mt-0.5">
                            {product.crossSellText[p.id]}
                          </p>
                        </div>
                      </div>
                      <Link
                        href={`/products/${p.slug}`}
                        className="flex items-center justify-between text-teal text-sm font-semibold hover:gap-2 transition-all"
                      >
                        <span>من {formatMAD(199)}</span>
                        <span className="flex items-center gap-1">
                          اكتشفي <ArrowLeft className="w-4 h-4" />
                        </span>
                      </Link>
                    </div>
                  )
              )}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="section-padding bg-ivory">
        <div className="container-max max-w-3xl">
          <h2 className="font-display font-bold text-2xl text-charcoal mb-6">
            أسئلة شائعة
          </h2>
          <FAQAccordion items={SITE_CONFIG.faq} />
        </div>
      </section>

      {/* Sticky mobile CTA */}
      <StickyMobileCTA product={product} selectedOffer={selectedOffer} />
    </div>
  );
}
