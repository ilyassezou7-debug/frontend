import Image from "next/image";
import {
  CheckCircle2,
  Sparkles,
  Clock,
  CalendarCheck,
  Lightbulb,
  ShieldCheck,
  Truck,
  Banknote,
  BadgeCheck,
  ListChecks,
  Timer,
} from "lucide-react";
import type { Product } from "@/types/product";
import BuyBox from "./BuyBox";
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

import { PRODUCTS, getSinglePrice } from "@/config/products";

interface ProductPageClientProps {
  product: Product;
}

const OFFER_BLOCK_ID = "offer-block";

/** Server-rendered product page; the only client JS is <BuyBox> (plus the FAQ and cross-sell widgets). */
export default function ProductPageView({ product }: ProductPageClientProps) {
  const crossSellProducts = product.crossSellPriority
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, 2) as Product[];

  return (
    <div className="pb-24 sm:pb-28">
      {/* ───────── HERO + OFFER ───────── */}
      <section
        id={OFFER_BLOCK_ID}
        className="pt-4 pb-10 md:py-16 lg:py-20 bg-gradient-to-b from-ivory-2 to-ivory scroll-mt-20 md:scroll-mt-28"
      >
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
            {/* ───────── PRODUCT IMAGE — Pharma-apothecary frame ───────── */}
            <div className="relative aspect-square max-w-md mx-auto md:max-w-none w-full md:sticky md:top-28">

              {/* Frame */}
              <div className="relative aspect-square w-full overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-ivory to-white shadow-[0_30px_60px_-15px_rgba(16,38,34,0.18)] ring-1 ring-saffron/25 border border-white">
                <Image
                  src={product.images.hero}
                  alt={product.displayName}
                  fill
                  priority
                  quality={62}
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Inner white hairline — apothecary display feel */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 ring-1 ring-inset ring-white/50 rounded-[1.75rem] pointer-events-none"
                />

                {/* Bottom gradient for legibility of the wordmark */}
                <div
                  aria-hidden="true"
                  className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-charcoal/45 via-charcoal/15 to-transparent pointer-events-none"
                />

                {/* Apothecary wordmark — discreet, brand-anchoring */}
                <div className="absolute bottom-3 right-4 sm:bottom-4 sm:right-5 flex items-center gap-2 text-white/90 z-10">
                  <span className="font-display font-bold text-xs sm:text-sm leading-none">
                    أطلس بيور
                  </span>
                  <span className="w-px h-3 bg-white/50" />
                  <span className="font-sans text-[9px] sm:text-[10px] latin-tracking font-semibold uppercase">
                    Pharma-Botanic
                  </span>
                </div>
              </div>

              {/* Gold corner brackets — museum-frame accent (decorative) */}
              <span
                aria-hidden="true"
                className="absolute -top-1.5 -right-1.5 w-7 h-7 border-t-2 border-r-2 border-saffron/60 rounded-tr-2xl pointer-events-none"
              />
              <span
                aria-hidden="true"
                className="absolute -top-1.5 -left-1.5 w-7 h-7 border-t-2 border-l-2 border-saffron/60 rounded-tl-2xl pointer-events-none"
              />
              <span
                aria-hidden="true"
                className="absolute -bottom-1.5 -right-1.5 w-7 h-7 border-b-2 border-r-2 border-saffron/60 rounded-br-2xl pointer-events-none"
              />
              <span
                aria-hidden="true"
                className="absolute -bottom-1.5 -left-1.5 w-7 h-7 border-b-2 border-l-2 border-saffron/60 rounded-bl-2xl pointer-events-none"
              />

              {/* ───────── ONSSA CERTIFICATION SEAL ─────────
                  Circular "stamp" sits over the top-right corner of the frame.
                  This is the hero trust signal — readable at a glance even
                  before any text loads. */}
              <div
                className="absolute top-3 right-3 sm:-top-3 sm:-right-3 z-20"
                role="img"
                aria-label="مصادق عليه من ONSSA"
              >
                <div className="relative w-[4.5rem] h-[4.5rem] sm:w-24 sm:h-24">

                  {/* The seal */}
                  <div className="relative w-full h-full rounded-full bg-gradient-to-br from-saffron via-saffron to-saffron-dark shadow-xl ring-4 ring-ivory">
                    {/* Inner dashed ring — like a real certification stamp */}
                    <div className="absolute inset-1.5 sm:inset-2 rounded-full border border-dashed border-ivory/60 flex flex-col items-center justify-center text-ivory text-center px-1.5">
                      <BadgeCheck
                        className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mb-0.5"
                        strokeWidth={2.5}
                      />
                      <p className="font-display text-[10px] sm:text-[11px] md:text-xs font-extrabold leading-none">
                        مصادق عليه
                      </p>
                      <p className="text-[8px] sm:text-[9px] md:text-[10px] font-bold latin-tracking mt-0.5 leading-none">
                        ONSSA
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Product Info */}
            <div className="space-y-5 lg:space-y-6">
              <div>
                <h1 className="font-display font-bold text-[1.75rem] leading-[1.3] sm:text-4xl lg:text-5xl text-charcoal mb-3 lg:mb-4 text-balance">
                  {product.heroPromise}
                </h1>
                <div className="flex items-center gap-2 mb-3 lg:mb-4">
                  <StarRating rating={4.8} />
                  <span className="text-sm md:text-base text-muted">
                    <span className="font-bold text-charcoal">4.8/5</span> · من{" "}
                    <span className="tabular-nums font-bold text-charcoal">
                      {product.ratingCount}+
                    </span>{" "}
                    تقييم موثّق
                  </span>
                </div>
                <p className="text-base lg:text-lg text-muted leading-relaxed">
                  {product.headline}
                </p>
              </div>

              {/* Quick benefits chips */}
              <div className="flex flex-wrap gap-3">
                {product.benefits.slice(0, 3).map((b) => (
                  <span
                    key={b.title}
                    className="inline-flex items-center gap-2 bg-white border border-teal/20 text-teal text-sm font-semibold px-4 py-2 rounded-full shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {b.title}
                  </span>
                ))}
              </div>

              <BuyBox
                offerBlockId={OFFER_BLOCK_ID}
                product={{
                  id: product.id,
                  shortName: product.shortName,
                  offers: product.offers,
                  offerNudge: product.offerNudge,
                  images: { hero: product.images.hero },
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ───────── PAIN POINTS ───────── */}
      <div className="content-auto">
        <PainPointsList
          title="نتفهّم ما تشعر به"
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
              لا تحتاج أي خبرة — في دقائق ستعرف كيف تستعمل{" "}
              {product.shortName} للحصول على أفضل نتيجة.
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
                    ماذا ستلاحظ؟
                  </h3>
                  <p className="text-xs text-muted">
                    نتائج فعّالة من أول استعمال — وتزداد مع الوقت
                  </p>
                </div>
              </div>

              <ol className="relative space-y-5 pr-6 border-r-2 border-dashed border-teal/20">
                {product.expectedTimeline.map((item, i) => (
                  <li key={i} className="relative group/timeline-item">
                    <span className="absolute -right-[33px] top-1 w-5 h-5 rounded-full bg-white border-2 border-teal flex items-center justify-center group-hover/timeline-item:scale-125 transition-transform duration-200">
                      <span className="w-2 h-2 rounded-full bg-teal group-hover/timeline-item:bg-saffron transition-colors" />
                    </span>
                    <p className="font-bold text-saffron text-sm mb-1 group-hover/timeline-item:text-teal transition-colors">
                      {item.when}
                    </p>
                    <p className="text-charcoal leading-relaxed group-hover/timeline-item:translate-x-1 transition-transform duration-200">
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
                  — إن لم تلاحظ الفرق، نُعيد لك مالك دون أي أسئلة.
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
              كل ما تحتاج معرفته عن {product.shortName}
            </h2>
            <p className="text-muted">
              إجابات صريحة عن الأسئلة التي يطرحها عملاؤنا قبل الطلب.
            </p>
          </div>
          <FAQAccordion items={product.productFaqs} />
        </div>
      </section>

      {/* ───────── BUNDLE CROSS-SELL ───────── */}
      <div className="content-auto">
        <BundleCrossSell
          others={crossSellProducts.map((p) => ({
            id: p.id,
            shortName: p.shortName,
            hero: p.images.hero,
            pitch: product.crossSellText[p.id] ?? p.headline,
            regularPrice: getSinglePrice(p),
          }))}
        />
      </div>

      {/* ───────── FINAL CTA ───────── */}
      <div className="content-auto">
        <FinalCTA
          productShortName={product.shortName}
          ratingCount={product.ratingCount}
          targetId={OFFER_BLOCK_ID}
        />
      </div>

    </div>
  );
}
