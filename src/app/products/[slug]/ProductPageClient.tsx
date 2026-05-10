"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  ShoppingBag,
  Sparkles,
  Clock,
  CalendarCheck,
  Lightbulb,
  ShieldCheck,
  Truck,
  Banknote,
  BadgeCheck,
} from "lucide-react";
import type { Product } from "@/types/product";
import type { OfferId } from "@/types/product";
import OfferSelector from "@/components/product/OfferSelector";
import StickyBuyBar from "@/components/product/StickyBuyBar";
import StarRating from "@/components/ui/StarRating";
import FAQAccordion from "@/components/ui/FAQAccordion";

import PainPointsList from "@/components/product/sections/PainPointsList";
import BenefitsGrid from "@/components/product/sections/BenefitsGrid";
import IngredientsSection from "@/components/product/sections/IngredientsSection";
import AntiClaimStrip from "@/components/product/sections/AntiClaimStrip";
import ComparisonTable from "@/components/product/sections/ComparisonTable";
import ReviewsBlock from "@/components/product/sections/ReviewsBlock";
import GoldenGuaranteeSeal from "@/components/product/sections/GoldenGuaranteeSeal";
import BundleCrossSell from "@/components/product/sections/BundleCrossSell";
import FinalCTA from "@/components/product/sections/FinalCTA";

import { useCartStore } from "@/store/cart-store";
import { formatMAD } from "@/lib/money";
import { trackViewContent, trackAddToCart } from "@/lib/tracking";
import { generateEventId } from "@/lib/event-id";
import { PRODUCTS } from "@/config/products";

interface ProductPageClientProps {
  product: Product;
}

const OFFER_BLOCK_ID = "offer-block";

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
    .slice(0, 2) as Product[];

  return (
    <div className="pb-24 sm:pb-28">
      {/* ───────── HERO + OFFER ───────── */}
      <section
        id={OFFER_BLOCK_ID}
        className="section-padding bg-gradient-to-br from-ivory via-mist/30 to-sand scroll-mt-20 md:scroll-mt-24"
      >
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Product Image — fills column on desktop */}
            <div className="relative aspect-square w-full">
              <div className="absolute inset-0 bg-white rounded-3xl shadow-md border border-border-soft" />
              <div className="absolute inset-3 rounded-2xl border border-saffron/30" />
              <Image
                src={product.images.hero}
                alt={product.displayName}
                fill
                priority
                className="object-contain p-8 sm:p-12 rounded-3xl opacity-30"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Floating badges */}
              <div className="absolute top-4 left-4 bg-saffron text-white text-[10px] sm:text-[11px] font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                <BadgeCheck className="w-3.5 h-3.5" />
                ONSSA
              </div>
              <div className="absolute bottom-4 right-4 bg-teal text-white text-[10px] sm:text-[11px] font-bold tracking-wide px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                100% طبيعي
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-5">
              <div>
                {/* Hero Promise — the headline that lands at top of viewport when sticky CTA is tapped */}
                <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-charcoal leading-[1.2] mb-3">
                  {product.heroPromise}
                </h1>
                <div className="flex items-center gap-2 mb-3">
                  <StarRating rating={4.8} />
                  <span className="text-sm text-muted">
                    <span className="font-bold text-charcoal">4.8/5</span> · من{" "}
                    <span className="tabular-nums font-bold text-charcoal">
                      {product.ratingCount}+
                    </span>{" "}
                    تقييم زبونة
                  </span>
                </div>
                <p className="text-base md:text-lg text-muted leading-relaxed">
                  {product.headline}
                </p>
              </div>

              {/* Quick benefits chips */}
              <div className="flex flex-wrap gap-2">
                {product.benefits.slice(0, 3).map((b) => (
                  <span
                    key={b.title}
                    className="inline-flex items-center gap-1.5 bg-white border border-teal/20 text-teal text-xs font-semibold px-3 py-1.5 rounded-full"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {b.title}
                  </span>
                ))}
              </div>

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
              <p className="text-sm text-saffron font-semibold bg-saffron/10 rounded-xl px-4 py-3 border border-saffron/20 leading-relaxed">
                ⚡ {product.offerNudge}
              </p>

              {/* Desktop CTA + inline trust micro-strip */}
              <div className="hidden md:block space-y-3">
                <button
                  onClick={handleAddToCart}
                  className="btn-primary w-full flex items-center justify-center gap-2 text-base"
                >
                  <ShoppingBag className="w-5 h-5" />
                  أضيفي للسلة – {formatMAD(offer.price)}
                </button>
                <div className="flex items-center justify-center gap-x-4 gap-y-1 flex-wrap text-[11px] text-muted">
                  <span className="inline-flex items-center gap-1">
                    <Banknote className="w-3.5 h-3.5 text-teal" />
                    الدفع عند الاستلام
                  </span>
                  <span className="text-border-soft">•</span>
                  <span className="inline-flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-teal" />
                    توصيل مجاني
                  </span>
                  <span className="text-border-soft">•</span>
                  <span className="inline-flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal" />
                    ضمان 30 يوم
                  </span>
                </div>
              </div>

              {/* Mobile CTA */}
              <div className="md:hidden space-y-3">
                <button
                  onClick={handleAddToCart}
                  className="btn-primary w-full flex items-center justify-center gap-2 text-base"
                >
                  <ShoppingBag className="w-5 h-5" />
                  أضيفي للسلة – {formatMAD(offer.price)}
                </button>
                <div className="flex items-center justify-between gap-2 text-[10px] text-muted">
                  <span className="inline-flex items-center gap-1">
                    <Banknote className="w-3.5 h-3.5 text-teal" />
                    دفع COD
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
            </div>
          </div>
        </div>
      </section>

      {/* ───────── PAIN POINTS ───────── */}
      <div className="content-auto">
        <PainPointsList
          title="فاهمين الإحساس ديالك"
          intro={product.painSection}
          points={product.painPoints}
          image={product.images.lifestyle}
          imageAlt={`معاناة ${product.shortName}`}
        />
      </div>

      {/* ───────── BENEFITS / TRANSFORMATION ───────── */}
      <div className="content-auto">
        <BenefitsGrid
          benefits={product.benefits}
          productShortName={product.shortName}
        />
      </div>

      {/* ───────── INGREDIENTS DEEP DIVE ───────── */}
      <div className="content-auto">
        <IngredientsSection
          intro={product.ingredientCopy}
          ingredients={product.ingredientDetails}
          image={product.images.ingredients}
          imageAlt={`مكونات ${product.shortName}`}
        />
      </div>

      {/* ───────── ANTI-CLAIMS STRIP ───────── */}
      <div className="content-auto">
        <AntiClaimStrip claims={product.antiClaims} />
      </div>

      {/* ───────── HOW TO USE ───────── */}
      <section className="section-padding bg-gradient-to-b from-sand to-ivory content-auto">
        <div className="container-max">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="divider-gold mb-4 max-w-xs mx-auto">
              <span>طريقة الاستعمال</span>
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-charcoal mb-3 leading-tight">
              ساهلة وبسيطة فـ 3 خطوات فقط
            </h2>
            <p className="text-muted leading-relaxed">
              ما تحتاجي حتى خبرة – فدقائق غادي تكوني عارفة كيفاش تستعملي{" "}
              {product.shortName} باش تحصلي على أحسن نتيجة.
            </p>
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
                    نتائج محسوسة من أول استعمال – وكتزيد مع الوقت
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

      {/* ───────── COMPARISON TABLE ───────── */}
      <div className="content-auto">
        <ComparisonTable rows={product.comparison} />
      </div>

      {/* ───────── REVIEWS ───────── */}
      <div className="content-auto">
        <ReviewsBlock
          reviews={product.reviews}
          ratingCount={product.ratingCount}
        />
      </div>

      {/* ───────── GOLDEN GUARANTEE SEAL ───────── */}
      <div className="content-auto">
        <GoldenGuaranteeSeal customText={product.guaranteeText} />
      </div>

      {/* ───────── PRODUCT-SPECIFIC FAQ ───────── */}
      <section className="section-padding bg-ivory content-auto">
        <div className="container-max max-w-3xl">
          <div className="text-center mb-10">
            <p className="divider-gold mb-4 max-w-xs mx-auto">
              <span>أسئلة شائعة</span>
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-charcoal mb-3">
              كل ما تحتاجي تعرفي على {product.shortName}
            </h2>
            <p className="text-muted">
              جوابات صريحة على الأسئلة اللي كتسولها زبوناتنا قبل الطلب.
            </p>
          </div>
          <FAQAccordion items={product.productFaqs} />
        </div>
      </section>

      {/* ───────── BUNDLE CROSS-SELL ───────── */}
      <div className="content-auto">
        <BundleCrossSell primary={product} others={crossSellProducts} />
      </div>

      {/* ───────── FINAL CTA ───────── */}
      <div className="content-auto">
        <FinalCTA
          productShortName={product.shortName}
          ratingCount={product.ratingCount}
          targetId={OFFER_BLOCK_ID}
        />
      </div>

      {/* ───────── STICKY BUY BAR (mobile + desktop) ───────── */}
      <StickyBuyBar
        product={product}
        selectedOffer={selectedOffer}
        targetId={OFFER_BLOCK_ID}
      />
    </div>
  );
}
