import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star, Package, Wind, Sparkles, CheckCircle2 } from "lucide-react";
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
    desc: "الخوف من الكلام القريب كيخليك تبعدي فاللحظات اللي خاصك تكوني فيها قريبة ومأثر على ثقتك فراسك.",
    product: "breath-drops",
    cta: "اكتشفي الحل دابا",
  },
  {
    icon: Package,
    title: "رائحة وعرق القدمين",
    desc: "لحظات الإحراج فاش كتبغي تحيدي صباطك عند عائلتك أو صحاباتك، مشكل كيخليك ديما مقلقة.",
    product: "foot-spray",
    cta: "اكتشفي الحل دابا",
  },
  {
    icon: Sparkles,
    title: "فطريات ومظهر الأظافر",
    desc: "أظافر كتحشمي تبينيها وكتضطري تخبيها، هاد الإحساس كيأثر على أنوثتك وراحتك النفسية.",
    product: "nail-serum",
    cta: "اكتشفي الحل دابا",
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
      <section className="bg-gradient-to-br from-ivory to-sand section-padding">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Text */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-teal/10 text-teal text-sm font-semibold px-3 py-1.5 rounded-full">
                <Star className="w-4 h-4 fill-saffron text-saffron" />
                منتجات طبيعية مغربية
              </div>
              <h1 className="font-display font-bold text-4xl md:text-5xl text-charcoal leading-tight">
                عناية نقية{" "}
                <span className="text-teal">لمشاكل</span>{" "}
                كتخليك تفكري بزاف قبل القرب
              </h1>
              <p className="text-lg text-muted leading-relaxed">
                من النفس للرجلين للأظافر – مكونات طبيعية 100% ومصادق عليها، باش ترجعي ثقتك وأنوثتك. توصيل مجاني والدفع حتى تقلبي الأمانة ديالك.
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
              <div className="flex items-center gap-3 text-sm text-muted">
                <CheckCircle2 className="w-4 h-4 text-teal" />
                <span>الدفع عند الاستلام – لا بطاقة بنكية مطلوبة</span>
              </div>
            </div>

            {/* Image */}
            <div className="relative aspect-square max-w-md mx-auto md:mx-0 w-full">
              <div className="absolute inset-0 bg-teal/10 rounded-3xl" />
              <Image
                src="/images/placeholders/home-hero.svg"
                alt="أطلس بيور – عناية شخصية طبيعية"
                fill
                priority
                className="object-contain p-8 rounded-3xl opacity-40"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10 pointer-events-none">
                <div className="bg-white/85 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-white/50 max-w-[85%]">
                  <p className="text-charcoal font-bold text-sm leading-relaxed">
                    صورة رئيسية للموقع تعرض المنتجات الثلاثة معاً في بيئة طبيعية مشرقة تعبر عن الجمال والثقة.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <TrustBadges />

      {/* Authority & Science Section (Maroc SFDA & Warranty) */}
      <section className="section-padding bg-sand border-b border-white">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Image Left */}
            <div className="relative aspect-square max-w-sm mx-auto w-full order-2 md:order-1">
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
            {/* Text Right */}
            <div className="space-y-5 order-1 md:order-2">
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
          </div>
        </div>
      </section>

      {/* Problem-aware section */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-10">
            <h2 className="font-display font-bold text-3xl text-charcoal mb-3">
              مشاكل صغيرة كتأثر على الثقة اليومية
            </h2>
            <p className="text-muted max-w-xl mx-auto">
              مشاكل ما حدش كيحب يتكلم عليها – ولكن لها حلول طبيعية وبسيطة.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {problemCards.map((card) => (
              <div
                key={card.title}
                className="card p-6 space-y-4 hover:shadow-md transition-shadow"
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
      <section className="section-padding bg-ivory">
        <div className="container-max">
          <div className="text-center mb-10">
            <h2 className="font-display font-bold text-3xl text-charcoal mb-3">
              منتجاتنا
            </h2>
            <p className="text-muted">
              ثلاثة منتجات، ثلاث مشاكل شائعة، حلول طبيعية.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Brand authority */}
      <section className="section-padding bg-teal-dark text-ivory">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <h2 className="font-display font-bold text-3xl leading-tight">
                اخترنا مكونات طبيعية 100% باش نحافظو على صحتك
              </h2>
              <p className="text-ivory/80 leading-relaxed text-lg">
                ما كنستعملوش مواد اصطناعية ولا مركبات كيميائية مجهولة. كل مكون في منتجاتنا معروف ومستعمل تقليدياً في العناية الشخصية، ومصادق عليه من طرف السلطات الصحية لضمان سلامتك.
              </p>
              <ul className="space-y-4 mt-4">
                {[
                  "القرنفل والنعناع للنفس المنتعش والثقة الكاملة",
                  "الشبة الحرة وزيت شجرة الشاي لراحة القدمين",
                  "الثوم وخل التفاح العضوي لعلاج فطريات الأظافر",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                    <CheckCircle2 className="w-6 h-6 text-saffron flex-shrink-0" />
                    <span className="text-ivory/90 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative aspect-square max-w-sm mx-auto w-full">
              <div className="absolute inset-0 bg-teal/20 rounded-3xl" />
              <Image
                src="/images/placeholders/breath-ingredients.svg"
                alt="مكونات طبيعية"
                fill
                className="object-contain p-6 opacity-40"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10 pointer-events-none">
                <div className="bg-white/85 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-white/50 max-w-[85%]">
                  <p className="text-charcoal font-bold text-sm leading-relaxed">
                    صورة تبرز مجموعة من المكونات الطبيعية (قرنفل، نعناع، شبة، ثوم) بطريقة فنية مرتبة.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="section-padding bg-sand">
        <div className="container-max">
          <div className="text-center mb-10">
            <h2 className="font-display font-bold text-3xl text-charcoal mb-3">
              زبوناتنا كيحكيو
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {allReviews.map((review, i) => (
              <ReviewCard key={i} review={review} />
            ))}
          </div>
        </div>
      </section>

      {/* How COD works */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-10">
            <h2 className="font-display font-bold text-3xl text-charcoal mb-3">
              كيفاش كيخدم الطلب؟
            </h2>
            <p className="text-muted">أربع خطوات بسيطة وطلبك في طريقه إليك</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, i) => (
              <div key={i} className="text-center space-y-3">
                <div className="w-14 h-14 bg-teal text-ivory rounded-full flex items-center justify-center font-bold text-xl mx-auto font-display">
                  {step.step}
                </div>
                <h3 className="font-bold text-charcoal font-display">{step.title}</h3>
                <p className="text-muted text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-ivory">
        <div className="container-max max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="font-display font-bold text-3xl text-charcoal mb-3">
              أسئلة شائعة
            </h2>
          </div>
          <FAQAccordion items={SITE_CONFIG.faq} />
        </div>
      </section>
    </div>
  );
}
