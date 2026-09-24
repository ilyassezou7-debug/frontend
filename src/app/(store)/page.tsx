import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Banknote,
  BadgeCheck,
  CheckCircle2,
  FlaskConical,
  Lock,
  Mountain,
  PackageCheck,
  PhoneCall,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import FAQAccordion from "@/components/ui/FAQAccordion";
import ProductCard from "@/components/product/ProductCard";
import GuaranteeTile from "@/components/product/GuaranteeTile";
import ReviewCard from "@/components/product/ReviewCard";
import { PRODUCTS } from "@/config/products";
import { CONCERNS } from "@/config/concerns";
import { SITE_CONFIG } from "@/config/site";

// Server-rendered: the phone receives finished HTML. Only the FAQ accordion hydrates.

const promises = [
  { icon: Banknote, title: "الدفع عند الاستلام", sub: "ما كتخلصي حتى تشدي الأمانة" },
  { icon: Truck, title: "توصيل مجاني", sub: "لجميع المدن · 2 حتى 5 أيام" },
  { icon: Lock, title: "تغليف محترم", sub: "بلا إشهار خارجي" },
  { icon: ShieldCheck, title: "ضمان 30 يوم", sub: "ما عجبكش؟ فلوسك كترجع" },
];

const pillars = [
  { icon: FlaskConical, title: "تركيبة من إعداد صيادلة", desc: "كل منتج مدروس بمشاركة صيادلة وخبراء فالنباتات الطبية." },
  { icon: BadgeCheck, title: "مصادق عليها (ONSSA)", desc: "مصنوعة فالمغرب وفق معايير الجودة." },
  { icon: Mountain, title: "مكونات نباتية مغربية", desc: "مكونات نشطة بسيطة ونقية، بلا مواد كيميائية ضارة." },
  { icon: Lock, title: "خصوصية تامة", desc: "مشاكل ما كتنهضرش بصوت عالي — وحنا فاهمين هادشي." },
];

const steps = [
  { title: "اختاري العرض", desc: "المنتج والكمية اللي كتناسبك" },
  { title: "سميتك ونمرتك", desc: "جوج خانات، بلا تسجيل" },
  { title: "كنعيطو نأكدو", desc: "مكالمة قصيرة ومحترمة" },
  { title: "خلصي فالباب", desc: "نقداً، ملي كتشدي الطلبية" },
];

export default function HomePage() {
  const products = CONCERNS.map((c) => PRODUCTS.find((p) => p.slug === c.slug)).filter(Boolean) as typeof PRODUCTS;
  const reviews = PRODUCTS.flatMap((p) => p.reviews.slice(0, 1)).slice(0, 4);

  return (
    <div>
      {/* ───────── HERO ───────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-ivory-2 to-ivory">
        <div className="container-max pt-6 pb-10 md:pt-16 md:pb-20">
          <div className="grid md:grid-cols-2 gap-7 md:gap-14 items-center">
            <div className="order-2 md:order-1">
              <p className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-teal bg-white border border-teal/15 rounded-full px-3.5 py-1.5 shadow-soft">
                <ShieldCheck className="w-4 h-4" />
                {SITE_CONFIG.tagline}
              </p>

              <h1 className="font-display font-bold text-charcoal text-[2.1rem] leading-[1.25] sm:text-5xl md:text-[3.4rem] md:leading-[1.2] mt-4 text-balance">
                المشاكل اللي ما كتنهضرش عليها…{" "}
                <span className="text-teal">عندها حل.</span>
              </h1>

              <p className="text-muted text-base sm:text-lg leading-relaxed mt-4 max-w-xl">
                تركيبات نباتية مغربية من إعداد صيادلة، لمشاكل يومية حساسة. كتوصلك فتغليف محترم، وما كتخلصي حتى تشدي
                الأمانة ديالك.
              </p>

              {/* The key element: one tap from the worry to the product that answers it */}
              <div className="mt-6">
                <p className="text-sm font-bold text-charcoal mb-2.5">شنو اللي مقلقك؟</p>
                <div className="flex flex-wrap gap-2">
                  {CONCERNS.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/products/${c.slug}`}
                      className="inline-flex items-center gap-1.5 bg-white border border-border-soft hover:border-teal hover:bg-teal hover:text-ivory text-charcoal text-sm font-bold rounded-full px-4 py-2.5 min-h-[44px] shadow-soft transition-colors"
                    >
                      {c.label}
                      <ArrowLeft className="w-3.5 h-3.5 opacity-60" />
                    </Link>
                  ))}
                </div>
              </div>

              <ul className="flex flex-wrap gap-x-5 gap-y-2 mt-6 text-sm text-charcoal/80">
                {["الدفع عند الاستلام", "توصيل مجاني", "ضمان 30 يوم"].map((t) => (
                  <li key={t} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-teal" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="order-1 md:order-2">
              <div className="relative aspect-[5/4] md:aspect-square rounded-[1.75rem] overflow-hidden bg-sand shadow-lift ring-1 ring-saffron/20">
                <Image
                  src="/images/home/ingredients-new.webp"
                  alt="تركيبات أطلس بيور النباتية"
                  fill
                  priority
                  quality={62}
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-white/95 rounded-full px-3 py-1.5 text-xs font-bold text-charcoal shadow-soft">
                    <Star className="w-3.5 h-3.5 fill-saffron text-saffron" />
                    4.8 · تقييم زبوناتنا
                  </span>
                  <span className="bg-teal/95 text-ivory rounded-full px-3 py-1.5 text-xs font-bold shadow-soft">صنع فالمغرب</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── PROMISES ───────── */}
      <section className="bg-teal-dark text-ivory">
        <div className="container-max py-5 md:py-7">
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-4">
            {promises.map((p) => (
              <li key={p.title} className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-white/[0.07] text-saffron-light flex items-center justify-center flex-shrink-0">
                  <p.icon className="w-5 h-5" />
                </span>
                <span className="leading-tight">
                  <span className="block font-bold text-sm">{p.title}</span>
                  <span className="block text-[11px] sm:text-xs text-ivory/65 mt-0.5">{p.sub}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────── SHOP BY CONCERN ───────── */}
      <section id="collection" className="section-padding bg-ivory scroll-mt-20">
        <div className="container-max">
          <div className="flex items-end justify-between gap-4 mb-6 md:mb-10">
            <div>
              <p className="eyebrow mb-2">تركيباتنا</p>
              <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-charcoal leading-tight">
                مشكل واحد، تركيبة وحدة مدروسة ليه.
              </h2>
            </div>
            <Link href="/products" className="hidden sm:inline-flex items-center gap-1 text-teal font-bold text-sm whitespace-nowrap">
              كل المنتجات <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} priority={i < 2} />
            ))}
            <GuaranteeTile />
          </div>
        </div>
      </section>

      {/* ───────── DISCRETION: the promise no competitor makes ───────── */}
      <section className="section-padding bg-white content-auto">
        <div className="container-max">
          <div className="grid md:grid-cols-2 gap-8 md:gap-14 items-center">
            <div className="relative aspect-[4/3] md:aspect-square rounded-[1.75rem] overflow-hidden bg-sand">
              <Image
                src="/images/home/hero-new.webp"
                alt="تركيبة أطلس بيور"
                fill
                quality={60}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div>
              <p className="eyebrow mb-2">خصوصية تامة</p>
              <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-charcoal leading-tight">
                مشكلك كيبقى بيناتنا.
              </h2>
              <p className="text-muted text-base sm:text-lg leading-relaxed mt-4">
                كنعرفو بلي هاد المشاكل ما كتنهضرش عليها حتى مع القريبين. داكشي علاش كل خطوة عندنا مصممة باش تكون مرتاحة.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  { icon: PackageCheck, t: "تغليف محترم بلا إشهار خارجي" },
                  { icon: PhoneCall, t: "مكالمة تأكيد قصيرة ومحترمة، بلا أسئلة محرجة" },
                  { icon: Banknote, t: "بلا بطاقة بنكية، بلا تسجيل، بلا حساب" },
                ].map((x) => (
                  <li key={x.t} className="flex items-start gap-3 bg-ivory rounded-2xl p-4 border border-border-soft">
                    <span className="w-9 h-9 rounded-xl bg-teal/10 text-teal flex items-center justify-center flex-shrink-0">
                      <x.icon className="w-5 h-5" />
                    </span>
                    <span className="font-semibold text-charcoal pt-1.5 text-[15px]">{x.t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── STANDARDS ───────── */}
      <section className="section-padding bg-mist/50 content-auto">
        <div className="container-max">
          <div className="max-w-2xl mb-8 md:mb-12">
            <p className="eyebrow mb-2">المعايير ديالنا</p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-charcoal leading-tight">
              دواء الطبيعة، <span className="text-teal">بمعايير الصيدلية.</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {pillars.map((p) => (
              <div key={p.title} className="bg-white rounded-2xl p-4 sm:p-6 border border-border-soft">
                <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-teal text-ivory flex items-center justify-center mb-3 sm:mb-4">
                  <p.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </span>
                <h3 className="font-display font-bold text-charcoal text-[15px] sm:text-lg leading-snug">{p.title}</h3>
                <p className="text-muted text-xs sm:text-sm leading-relaxed mt-1.5">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── REVIEWS ───────── */}
      <section className="section-padding bg-ivory content-auto">
        <div className="container-max">
          <div className="text-center max-w-2xl mx-auto mb-8 md:mb-12">
            <p className="eyebrow mb-2 justify-center">زبوناتنا</p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-charcoal leading-tight">
              شنو كيقولو اللي جربوا
            </h2>
            <p className="flex items-center justify-center gap-1.5 mt-3 text-sm text-muted">
              <span className="flex">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-saffron text-saffron" />
                ))}
              </span>
              <span className="font-bold text-charcoal">4.8/5</span> متوسط التقييم
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {reviews.map((r, i) => (
              <ReviewCard key={i} review={r} />
            ))}
          </div>
        </div>
      </section>

      {/* ───────── HOW ORDERING WORKS ───────── */}
      <section className="section-padding bg-white content-auto">
        <div className="container-max">
          <div className="text-center max-w-2xl mx-auto mb-8 md:mb-12">
            <p className="eyebrow mb-2 justify-center">كيفاش كنطلبو</p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-charcoal leading-tight">
              أقل من دقيقة. بلا بطاقة بنكية.
            </h2>
          </div>
          <ol className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            {steps.map((s, i) => (
              <li key={s.title} className="relative bg-ivory rounded-2xl p-4 sm:p-6 border border-border-soft">
                <span className="w-9 h-9 rounded-full bg-teal text-ivory font-display font-bold flex items-center justify-center tabular-nums">
                  {i + 1}
                </span>
                <h3 className="font-display font-bold text-charcoal mt-3 text-[15px] sm:text-base">{s.title}</h3>
                <p className="text-muted text-xs sm:text-sm mt-1 leading-relaxed">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ───────── GUARANTEE ───────── */}
      <section className="px-4 py-12 md:py-20 bg-gradient-teal text-ivory relative overflow-hidden content-auto">
        <div className="container-max text-center max-w-3xl">
          <span className="inline-flex w-16 h-16 rounded-full bg-gradient-gold items-center justify-center shadow-gold mb-5">
            <ShieldCheck className="w-8 h-8 text-ivory" />
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl leading-tight">
            جربي 30 يوم. ما عجبكش؟ فلوسك كترجع.
          </h2>
          <p className="text-ivory/75 text-base sm:text-lg leading-relaxed mt-4">
            كتخلصي غير ملي تشدي الطلبية، وعندك 30 يوم كاملة باش تجربي. إلا ما لقيتيش النتيجة، كنرجعو ليك فلوسك بلا
            أسئلة معقدة.
          </p>
          <Link
            href="#collection"
            className="inline-flex items-center gap-2 mt-7 bg-ivory text-teal-dark font-bold rounded-full px-7 py-3.5 min-h-[52px] hover:bg-white transition-colors"
          >
            اختاري التركيبة ديالك
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ───────── FAQ ───────── */}
      <section className="section-padding bg-ivory content-auto">
        <div className="container-max max-w-3xl">
          <div className="text-center mb-8 md:mb-10">
            <p className="eyebrow mb-2 justify-center">أسئلة شائعة</p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-charcoal">كل ما تحتاجي تعرفي</h2>
          </div>
          <FAQAccordion items={SITE_CONFIG.faq} />
        </div>
      </section>
    </div>
  );
}
