import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  Package,
  Wind,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  FlaskConical,
  Mountain,
  Lock,
  BadgeCheck,
} from "lucide-react";
import TrustBadges from "@/components/ui/TrustBadges";
import FAQAccordion from "@/components/ui/FAQAccordion";
import ProductCard from "@/components/product/ProductCard";
import ReviewCard from "@/components/product/ReviewCard";
import { PRODUCTS } from "@/config/products";
import { SITE_CONFIG } from "@/config/site";

const problemCards = [
  {
    icon: Wind,
    title: "رائحة الفم المزعجة",
    desc: "الخوف من الكلام القريب كيخليك تبعدي فاللحظات اللي خاصك تكوني فيها قريبة، ومأثر على ثقتك فراسك.",
    product: "breath-drops",
    cta: "شوفي البروتوكول",
  },
  {
    icon: Package,
    title: "رائحة وعرق القدمين",
    desc: "لحظات الإحراج فاش كتبغي تحيدي صباطك عند العائلة أو الصحاب – مشكل كيخليك ديما مقلقة.",
    product: "foot-spray",
    cta: "شوفي البروتوكول",
  },
  {
    icon: Sparkles,
    title: "فطريات ومظهر الأظافر",
    desc: "أظافر كتحشمي تبينيها وكتضطري تخبيها، إحساس كيأثر على أنوثتك وراحتك النفسية.",
    product: "nail-serum",
    cta: "شوفي البروتوكول",
  },
];

const pillars = [
  {
    icon: FlaskConical,
    title: "تركيبة من إعداد صيادلة",
    desc: "كل منتج مصمم بمشاركة صيادلة وخبراء فالنباتات الطبية، وفق بروتوكولات دقيقة.",
  },
  {
    icon: BadgeCheck,
    title: "مصادق عليها رسمياً (ONSSA)",
    desc: "جميع تركيباتنا مصادق عليها من الهيئة العامة للغداء والدواء المغربية.",
  },
  {
    icon: Mountain,
    title: "مكونات نباتية مغربية",
    desc: "نختارو المكونات النشطة من قلب الطبيعة المغربية – بسيطة، نقية، وفعالة.",
  },
  {
    icon: Lock,
    title: "خصوصية تامة",
    desc: "تغليف محترم بلا إشهار خارجي. مشاكل ما تنهضرش عليها بصوت عالي – فهماك.",
  },
];

const howItWorks = [
  { step: "1", title: "اختاري العرض", desc: "اختاري المنتج والكمية اللي كتناسبك" },
  { step: "2", title: "دخلي الاسم والرقم", desc: "فقط اسمك الكامل ورقم هاتفك المغربي" },
  { step: "3", title: "نأكدو الطلب", desc: "فريقنا غيتاصل بيك باش يأكد المعلومات" },
  { step: "4", title: "خلصي عند الاستلام", desc: "الدفع عند التوصيل، بلا بطاقة بنكية" },
];

export default function HomePage() {
  const allReviews = PRODUCTS.flatMap((p) => p.reviews).slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-ivory-2 via-mist/30 to-sand py-16 md:py-24 lg:py-32 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #0E5C4A 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Premium ambient orbs */}
        <div aria-hidden className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-saffron/10 blur-3xl pointer-events-none" />
        <div aria-hidden className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-teal/10 blur-3xl pointer-events-none" />
        <div className="container-max relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            {/* ───────── HERO IMAGE — premium pharma-apothecary frame ─────────
                Order-first on mobile so it's the first thing a phone visitor
                sees, before scrolling into the brand pitch. */}
              <div className="relative aspect-square max-w-lg lg:max-w-xl mx-auto md:mx-0 w-full order-1 md:order-2">
                {/* Soft ambient halo */}
                <div
                  aria-hidden="true"
                  className="absolute -inset-6 sm:-inset-8 bg-gradient-to-br from-saffron/10 via-transparent to-teal/10 rounded-[2.5rem] blur-2xl opacity-70 pointer-events-none"
                />

                {/* Frame */}
                <div className="relative aspect-square w-full overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-ivory to-white shadow-[0_30px_60px_-15px_rgba(16,38,34,0.18)] ring-1 ring-saffron/25 border border-white">
                  <Image
                    src="/images/home/ingredients-new.webp"
                    alt="أطلس بيور – عناية صيدلانية نباتية"
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 ring-1 ring-inset ring-white/50 rounded-[1.75rem] pointer-events-none"
                />
                <div
                  aria-hidden="true"
                  className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-charcoal/45 via-charcoal/15 to-transparent pointer-events-none"
                />
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

              {/* Gold corner brackets — museum-frame accent */}
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

              {/* ONSSA certification seal */}
              <div
                className="absolute top-3 right-3 sm:-top-3 sm:-right-3 z-20"
                role="img"
                aria-label="مصادق عليه من ONSSA"
              >
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28">
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-saffron/25 animate-ping"
                    style={{ animationDuration: "3s" }}
                  />
                  <div className="relative w-full h-full rounded-full bg-gradient-to-br from-saffron via-saffron to-saffron-dark shadow-xl ring-4 ring-ivory">
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
            </div>

            {/* Text */}
            <div className="space-y-6 lg:space-y-8 order-2 md:order-1">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-teal/20 text-teal text-xs lg:text-sm font-bold px-4 py-2 rounded-full shadow-soft">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inline-flex w-full h-full rounded-full bg-saffron opacity-70 animate-ping" />
                  <span className="relative inline-flex w-2 h-2 rounded-full bg-saffron" />
                </span>
                <ShieldCheck className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="tracking-wide">عناية صيدلانية نباتية مغربية</span>
              </div>
              <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-[3.5rem] text-charcoal leading-[1.15]">
                دواء الطبيعة.{" "}
                <span className="text-teal block mt-2">بمعايير الصيدلية.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted leading-relaxed max-w-xl">
                أطلس بيور كتقدم تركيبات نباتية مدروسة من إعداد صيادلة، مصادق عليها رسمياً، ومخصصة للمشاكل اليومية اللي ما كتنهضرش عليها بصوت عالي. بأمان، خصوصية، ونتائج حقيقية.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/products" className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
                  تصفحي المنتجات
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <Link href="/about" className="btn-secondary text-lg px-8 py-4">
                  اعرفي علينا
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm md:text-base text-muted pt-4">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal" /> الدفع عند الاستلام
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal" /> توصيل مجاني
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal" /> ضمان 30 يوم
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <TrustBadges />

      {/* Authority & Science Section */}
      <section className="section-padding bg-white border-y border-border-soft content-auto">
        <div className="container-max">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="divider-gold mb-4">
              <span>المعايير ديالنا</span>
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-charcoal mb-4 leading-tight">
              معاييرنا ماشي بدافع الموضة –{" "}
              <span className="text-teal">بدافع الصحة</span>
            </h2>
            <p className="text-muted leading-relaxed text-lg">
              فأطلس بيور، كل تركيبة كتدوز من 4 معايير صارمة قبل ما توصل ليك. ماشي وعود إعلانية – بل بروتوكول حقيقي.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="group bg-ivory rounded-2xl p-6 border border-border-soft hover:border-teal/40 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-teal/10 group-hover:bg-teal group-hover:text-white text-teal flex items-center justify-center mb-4 transition-colors">
                  <p.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-charcoal mb-2 leading-tight">
                  {p.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem-aware section */}
      <section className="section-padding bg-mist/40 content-auto">
        <div className="container-max">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className="divider-gold mb-4">
              <span>المشاكل اللي كنحلوها</span>
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-charcoal mb-3">
              مشاكل صغيرة. تأثير كبير على ثقتك.
            </h2>
            <p className="text-muted leading-relaxed">
              ما حدش كيحب يتكلم عليها – ولكن لها حلول صيدلانية بسيطة، نباتية، ومدروسة.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {problemCards.map((card) => (
              <div
                key={card.title}
                className="bg-white rounded-2xl p-6 space-y-4 border border-border-soft hover:border-teal/40 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-teal/10 rounded-2xl flex items-center justify-center">
                  <card.icon className="w-6 h-6 text-teal" />
                </div>
                <h3 className="font-bold text-xl text-charcoal font-display">
                  {card.title}
                </h3>
                <p className="text-muted leading-relaxed text-sm">{card.desc}</p>
                <Link
                  href={`/products/${card.product}`}
                  className="inline-flex items-center gap-1 text-teal font-semibold text-sm hover:gap-2 transition-all"
                >
                  {card.cta}
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="section-padding bg-white content-auto">
        <div className="container-max">
          <div className="text-center mb-12">
            <p className="divider-gold mb-4 max-w-xs mx-auto">
              <span>تركيباتنا</span>
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-charcoal mb-3">
              ثلاث تركيبات. ثلاث مشاكل. حل واحد لكل وحدة.
            </h2>
            <p className="text-muted">
              كل منتج مصمم لهدف واحد دقيق – بلا تشتيت، بلا حشو.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Brand authority — botanicals */}
      <section className="section-padding bg-teal-dark text-ivory relative overflow-hidden content-auto">
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #B8862F 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="container-max relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <p className="divider-gold mb-2">
                <span>المختبر النباتي</span>
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl leading-tight">
                مكونات نباتية نشطة –{" "}
                <span className="text-saffron">مدروسة، مش عشوائية.</span>
              </h2>
              <p className="text-ivory/80 leading-relaxed text-lg">
                ما كنستعملوش مواد اصطناعية ولا مركبات كيميائية مجهولة. كل مكون عندو تاريخ تقليدي موثّق ودراسات علمية كتأكد فعاليته. الطبيعة كتقدم الحل – وحنا كنقدموه فتركيبة صيدلانية.
              </p>
              <ul className="space-y-3 mt-4">
                {[
                  {
                    title: "القرنفل والنعناع",
                    desc: "مضاد بكتيري طبيعي + انتعاش فوري",
                  },
                  {
                    title: "الشبة الحرة وزيت شجرة الشاي",
                    desc: "كيمتص الرطوبة + كيقتل البكتيريا المسببة للروائح",
                  },
                  {
                    title: "الثوم وخل التفاح العضوي",
                    desc: "مضاد فطري طبيعي + كينقي ويقوي الظفر",
                  },
                ].map((item) => (
                  <li
                    key={item.title}
                    className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <Leaf />
                    <div>
                      <p className="font-bold text-white">{item.title}</p>
                      <p className="text-ivory/70 text-sm mt-0.5">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative aspect-[4/3] md:aspect-square w-full h-full min-h-[400px] md:min-h-full">
              <div className="absolute inset-0 bg-white/5 rounded-3xl border border-saffron/30 overflow-hidden" />
              <Image
                src="/images/home/hero-new.webp"
                alt="مكونات نباتية نشطة"
                fill
                className="object-cover rounded-3xl"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="section-padding bg-ivory content-auto">
        <div className="container-max">
          <div className="text-center mb-10">
            <p className="divider-gold mb-4 max-w-xs mx-auto">
              <span>زبوناتنا كيحكيو</span>
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-charcoal mb-3">
              آلاف النساء المغربيات اختاروا الفرق
            </h2>
            <div className="flex items-center justify-center gap-2 text-sm text-muted mt-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-saffron text-saffron" />
                ))}
              </div>
              <span className="font-semibold text-charcoal">4.8/5</span>
              <span>·</span>
              <span>متوسط تقييم زبوناتنا</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {allReviews.map((review, i) => (
              <ReviewCard key={i} review={review} />
            ))}
          </div>
        </div>
      </section>

      {/* How COD works */}
      <section className="section-padding bg-white content-auto">
        <div className="container-max">
          <div className="text-center mb-12">
            <p className="divider-gold mb-4 max-w-xs mx-auto">
              <span>كيفاش كيخدم الطلب</span>
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-charcoal mb-3">
              4 خطوات بسيطة. بلا بطاقة بنكية.
            </h2>
            <p className="text-muted">
              كنخليو كل شي ساهل وآمن – من الطلب حتى الاستلام.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, i) => (
              <div
                key={i}
                className="text-center space-y-3 bg-ivory rounded-2xl p-6 border border-border-soft"
              >
                <div className="w-14 h-14 bg-teal text-ivory rounded-full flex items-center justify-center font-bold text-xl mx-auto font-display ring-4 ring-saffron/20">
                  {step.step}
                </div>
                <h3 className="font-bold text-charcoal font-display">
                  {step.title}
                </h3>
                <p className="text-muted text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-ivory content-auto">
        <div className="container-max max-w-3xl">
          <div className="text-center mb-10">
            <p className="divider-gold mb-4 max-w-xs mx-auto">
              <span>أسئلة شائعة</span>
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-charcoal mb-3">
              كل ما تحتاجي تعرفي
            </h2>
          </div>
          <FAQAccordion items={SITE_CONFIG.faq} />
        </div>
      </section>
    </div>
  );
}

function Leaf() {
  return (
    <div className="w-9 h-9 rounded-lg bg-saffron/15 text-saffron flex items-center justify-center flex-shrink-0">
      <CheckCircle2 className="w-5 h-5" />
    </div>
  );
}
