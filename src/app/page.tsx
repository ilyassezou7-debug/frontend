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
      <section className="relative bg-gradient-to-br from-ivory via-mist/40 to-sand section-padding overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #0E5C4A 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="container-max relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Text */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-white border border-teal/20 text-teal text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                <ShieldCheck className="w-4 h-4" />
                <span className="tracking-wide">عناية صيدلانية نباتية مغربية</span>
              </div>
              <h1 className="font-display font-bold text-4xl md:text-5xl text-charcoal leading-[1.15]">
                دواء الطبيعة.{" "}
                <span className="text-teal">بمعايير الصيدلية.</span>
              </h1>
              <p className="text-lg text-muted leading-relaxed max-w-xl">
                أطلس بيور كتقدم تركيبات نباتية مدروسة من إعداد صيادلة، مصادق عليها رسمياً، ومخصصة للمشاكل اليومية اللي ما كتنهضرش عليها بصوت عالي. بأمان، خصوصية، ونتائج حقيقية.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/products" className="btn-primary flex items-center gap-2">
                  تصفحي المنتجات
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <Link href="/about" className="btn-secondary">
                  اعرفي علينا
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted pt-2">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal" /> الدفع عند الاستلام
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal" /> توصيل مجاني
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal" /> ضمان 30 يوم
                </span>
              </div>
            </div>

            {/* Image */}
            <div className="relative aspect-square max-w-md mx-auto md:mx-0 w-full">
              <div className="absolute inset-0 bg-white rounded-3xl shadow-md border border-border-soft" />
              <div className="absolute inset-3 rounded-2xl border border-saffron/30" />
              <Image
                src="/images/placeholders/home-hero.svg"
                alt="أطلس بيور – عناية صيدلانية نباتية"
                fill
                priority
                className="object-contain p-10 rounded-3xl opacity-30"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 pointer-events-none">
                <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-saffron/20 max-w-[85%]">
                  <p className="text-charcoal font-bold text-sm leading-relaxed">
                    صورة &quot;still life&quot; صيدلانية: ثلاث قنينات أنيقة فوق رخام أبيض، أوراق نباتية، إضاءة طبيعية. شكل مستوحى من رفوف الصيدلية.
                  </p>
                </div>
              </div>
              {/* Pharmacy seal corner */}
              <div className="absolute -top-3 -left-3 bg-saffron text-white text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full shadow-md">
                ONSSA Approved
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
            <div className="relative aspect-square max-w-sm mx-auto w-full">
              <div className="absolute inset-0 bg-white/5 rounded-3xl border border-saffron/30" />
              <div className="absolute inset-3 rounded-2xl border border-white/10" />
              <Image
                src="/images/placeholders/breath-ingredients.svg"
                alt="مكونات نباتية نشطة"
                fill
                className="object-contain p-10 opacity-25"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10 pointer-events-none">
                <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-saffron/30 max-w-[85%]">
                  <p className="text-charcoal font-bold text-sm leading-relaxed">
                    صورة لرفّ صيدلية بقنينات زجاجية تحمل المكونات النباتية الخام (قرنفل، نعناع، شبة، ثوم) – أسلوب apothecary راقي.
                  </p>
                </div>
              </div>
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
