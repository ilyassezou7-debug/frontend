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
  ListChecks,
  Timer,
} from "lucide-react";
import type { Product } from "@/types/product";
import type { OfferId } from "@/types/product";
import OfferSelector from "@/components/product/OfferSelector";
import BackToOrderFAB from "@/components/product/BackToOrderFAB";
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
import { motion } from "framer-motion";

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
    trackViewContent(product.id, 292, eventId);
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
        className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-ivory via-mist/30 to-sand scroll-mt-28 md:scroll-mt-32 overflow-hidden"
      >
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
            {/* ───────── PRODUCT IMAGE — Pharma-apothecary frame ───────── */}
            <div className="relative aspect-square max-w-md mx-auto md:max-w-none w-full md:sticky md:top-32">
              {/* Soft ambient halo behind the frame (premium feel, no perf cost) */}
              <div
                aria-hidden="true"
                className="absolute -inset-6 sm:-inset-8 bg-gradient-to-br from-saffron/10 via-transparent to-teal/10 rounded-[2.5rem] blur-2xl opacity-70 pointer-events-none"
              />

              {/* Frame */}
              <div className="relative aspect-square w-full overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-ivory to-white shadow-[0_30px_60px_-15px_rgba(16,38,34,0.18)] ring-1 ring-saffron/25 border border-white">
                <Image
                  src={product.images.hero}
                  alt={product.displayName}
                  fill
                  priority
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
                  <span className="font-sans text-[9px] sm:text-[10px] tracking-[0.25em] font-semibold uppercase">
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
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-24 md:h-24">
                  {/* Subtle, slow pulse — drawing the eye without being noisy */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-saffron/25 animate-ping"
                    style={{ animationDuration: "3s" }}
                  />

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
                      <p className="text-[8px] sm:text-[9px] md:text-[10px] font-bold tracking-[0.25em] mt-0.5 leading-none">
                        ONSSA
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile-only mini trust strip directly under the frame.
                  Reassures phone visitors before they scroll into the body
                  content. Hidden on md+ since the desktop info column already
                  shows the same trust signals. */}
              <div className="md:hidden mt-4 grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center justify-center gap-1 bg-white/80 backdrop-blur-sm border border-border-soft rounded-xl py-2 px-1 text-center">
                  <Banknote className="w-4 h-4 text-teal" />
                  <span className="text-[10px] font-semibold text-charcoal leading-tight">
                    دفع عند الاستلام
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1 bg-white/80 backdrop-blur-sm border border-border-soft rounded-xl py-2 px-1 text-center">
                  <Truck className="w-4 h-4 text-teal" />
                  <span className="text-[10px] font-semibold text-charcoal leading-tight">
                    توصيل مجاني
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1 bg-white/80 backdrop-blur-sm border border-border-soft rounded-xl py-2 px-1 text-center">
                  <ShieldCheck className="w-4 h-4 text-teal" />
                  <span className="text-[10px] font-semibold text-charcoal leading-tight">
                    ضمان 30 يوم
                  </span>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-5 lg:space-y-6">
              <div>
                <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-charcoal leading-[1.15] mb-3 lg:mb-4">
                  {product.heroPromise}
                </h1>
                <div className="flex items-center gap-2 mb-3 lg:mb-4">
                  <StarRating rating={4.8} />
                  <span className="text-sm md:text-base text-muted">
                    <span className="font-bold text-charcoal">4.8/5</span> · من{" "}
                    <span className="tabular-nums font-bold text-charcoal">
                      {product.ratingCount}+
                    </span>{" "}
                    تقييم زبونة
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

              {/* Offer Selector */}
              <div id="offer-select">
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
              <p className="text-base text-saffron font-semibold bg-saffron/10 rounded-xl px-5 py-4 border border-saffron/20 leading-relaxed shadow-sm">
                ⚡ {product.offerNudge}
              </p>

              {/* ───────── HOW-TO-ORDER MINI GUIDE ───────── */}
              <div className="bg-white border border-border-soft rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between gap-2 px-4 pt-3.5 pb-2 border-b border-border-soft/70">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-teal/10 flex items-center justify-center">
                      <ListChecks className="w-4 h-4 text-teal" />
                    </div>
                    <p className="font-display font-bold text-sm text-charcoal">
                      كيفاش تطلبي – 3 خطوات فقط
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal bg-teal/10 px-2 py-1 rounded-full">
                    <Timer className="w-3 h-3" />
                    أقل من دقيقة
                  </span>
                </div>

                <ol className="grid grid-cols-3 gap-0 p-3">
                  {[
                    {
                      n: 1,
                      title: "اختاري الكمية",
                      sub: "العرض اللي بغيتي",
                      tone: "teal" as const,
                    },
                    {
                      n: 2,
                      title: "اسمك ورقمك",
                      sub: "حقلين فقط",
                      tone: "teal" as const,
                    },
                    {
                      n: 3,
                      title: "خلصي عند الباب",
                      sub: "بدون بطاقة",
                      tone: "saffron" as const,
                    },
                  ].map((step, i, arr) => (
                    <li
                      key={step.n}
                      className={`relative flex flex-col items-center text-center px-1.5 ${
                        i < arr.length - 1
                          ? "after:content-[''] after:absolute after:top-4 after:left-0 after:w-[calc(50%-1rem)] after:h-px after:border-t after:border-dashed after:border-teal/30"
                          : ""
                      } ${
                        i > 0
                          ? "before:content-[''] before:absolute before:top-4 before:right-0 before:w-[calc(50%-1rem)] before:h-px before:border-t before:border-dashed before:border-teal/30"
                          : ""
                      }`}
                    >
                      <div
                        className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px] shadow-sm ring-2 ring-white tabular-nums ${
                          step.tone === "saffron"
                            ? "bg-saffron text-ivory"
                            : "bg-teal text-ivory"
                        }`}
                      >
                        {step.n}
                      </div>
                      <p className="text-[11px] font-bold text-charcoal leading-tight mt-2">
                        {step.title}
                      </p>
                      <p className="text-[10px] text-muted leading-tight mt-0.5">
                        {step.sub}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* ───────── PRIMARY CTA ───────── */}
              {/* Single unified CTA for mobile + desktop. The price is shown
                  prominently above, the button copy commits to the action. */}
              <div className="space-y-3">
                <div className="flex items-baseline justify-between gap-3 px-1">
                  <div className="flex items-baseline gap-2 tabular-nums">
                    <span className="text-[11px] text-muted">المجموع:</span>
                    <span className="font-display font-extrabold text-2xl text-teal">
                      {formatMAD(offer.price)}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/70 rounded-full px-2.5 py-1 inline-flex items-center gap-1">
                    <Truck className="w-3 h-3" />
                    التوصيل مجاني
                  </span>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="btn-primary btn-shimmer-gold w-full text-lg md:text-xl py-4 md:py-5 min-h-[60px] md:min-h-[64px] rounded-2xl"
                >
                  <ShoppingBag className="w-6 h-6" />
                  <span>أكدي طلبك الآن</span>
                  <span className="hidden sm:inline text-ivory/60 font-normal">
                    ·
                  </span>
                  <span className="hidden sm:inline text-ivory/90 font-semibold">
                    الدفع عند الاستلام
                  </span>
                </button>

                <p className="text-center text-[11px] text-muted leading-relaxed">
                  بضغطة وحدة كنخدمو ليك السلة · بدون تسجيل · بدون بطاقة بنكية
                </p>

                <div className="flex items-center justify-center gap-x-4 gap-y-1 flex-wrap text-[11px] text-muted pt-1">
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
                    نتائج فعّالة من أول استعمال – وكتزيد مع الوقت
                  </p>
                </div>
              </div>

              <ol className="relative space-y-5 pr-6 border-r-2 border-dashed border-teal/20">
                {product.expectedTimeline.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: i * 0.15, ease: "easeOut" }}
                    className="relative group/timeline-item cursor-pointer"
                  >
                    <span className="absolute -right-[33px] top-1 w-5 h-5 rounded-full bg-white border-2 border-teal flex items-center justify-center group-hover/timeline-item:scale-125 transition-transform duration-200">
                      <span className="w-2 h-2 rounded-full bg-teal group-hover/timeline-item:bg-saffron transition-colors" />
                    </span>
                    <p className="font-bold text-saffron text-sm mb-1 group-hover/timeline-item:text-teal transition-colors">
                      {item.when}
                    </p>
                    <p className="text-charcoal leading-relaxed group-hover/timeline-item:translate-x-1 transition-transform duration-200">
                      {item.result}
                    </p>
                  </motion.li>
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

      {/* ───────── SIDE FAB ─────────
          Watches the hero section for visibility, scrolls directly to the
          offer selector cards so the customer lands on the packages. */}
      <BackToOrderFAB watchId={OFFER_BLOCK_ID} scrollToId="offer-select" />
    </div>
  );
}
