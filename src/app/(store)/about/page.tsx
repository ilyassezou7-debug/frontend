import type { Metadata } from "next";
import Link from "next/link";
import {
  Mountain,
  Leaf,
  ShieldCheck,
  Heart,
  ArrowLeft,
  FlaskConical,
  Lock,
  BadgeCheck,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { SITE_CONFIG } from "@/config/site";

export const metadata: Metadata = {
  title: "من نحن",
  description:
    "أطلس بيور – علامة مغربية للعناية الصيدلانية النباتية، تركيبات من إعداد صيادلة، مصادق عليها رسمياً، مع الدفع عند الاستلام.",
};

const pillars = [
  {
    icon: FlaskConical,
    title: "علم نباتي مغربي",
    desc: "كل تركيبة مبنية على مكونات نشطة معروفة، عندها تاريخ تقليدي طويل في العناية المغربية ومدعومة بدراسات حديثة.",
  },
  {
    icon: BadgeCheck,
    title: "معايير صيدلانية",
    desc: "مصنّعة فالمغرب وفق بروتوكولات الجودة الصيدلانية، ومصادق عليها من الهيئة العامة للغداء والدواء (ONSSA).",
  },
  {
    icon: Lock,
    title: "خصوصية تامة",
    desc: "كنبيعو الحلول للمشاكل اللي ما كتنهضرش عليها بصوت عالي. تغليف محترم، لغة مهذبة، بلا حشمة.",
  },
  {
    icon: Heart,
    title: "التزام بالنتيجة",
    desc: "ضمان استرجاع الأموال 30 يوم، الدفع عند الاستلام، وجدول زمني واضح للنتائج المتوقعة. كنوقفو بكلامنا.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="section-padding bg-gradient-to-br from-ivory via-mist/40 to-sand">
        <div className="container-max max-w-3xl text-center">
          <div className="flex justify-center mb-6">
            <Image 
              src="/logo.png" 
              alt="Atlas Pure Logo" 
              width={80} 
              height={80} 
              className="object-contain"
            />
          </div>
          <p className="divider-gold mb-4 max-w-xs mx-auto">
            <span>من نحن</span>
          </p>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-charcoal mb-4 leading-tight">
            دواء الطبيعة.{" "}
            <span className="text-teal">بمعايير الصيدلية.</span>
          </h1>
          <p className="text-lg text-muted leading-relaxed">
            {SITE_CONFIG.brandShortDescription}
          </p>
        </div>
      </section>

      {/* Manifesto */}
      <section className="section-padding bg-white content-auto">
        <div className="container-max max-w-3xl">
          <div className="prose-custom space-y-6 text-charcoal leading-relaxed text-lg">
            <p>
              فالمغرب، فيه مشاكل صحية يومية كتعاني منهم آلاف النساء بصمت – رائحة الفم، عرق الرجلين، فطريات الأظافر. مشاكل ما حدش كيتكلم عليها فالعائلة، وما كتلقايش حلول جدية ليها فالأنترنيت غير الإشهارات اللي كتعد ولا كتبيع &quot;طبيعي&quot; بلا أي معنى.
            </p>
            <p>
              <span className="font-bold text-teal">أطلس بيور تأسست باش تحل هاد الفجوة.</span>{" "}
              ماشي علامة جمال، ماشي إشهار &quot;dropshipping&quot;، ماشي وعود فاضية. حنا علامة مغربية للعناية الصيدلانية النباتية، كنخدمو على هاد المشاكل بنفس الجدية اللي كتخدم بيها صيدلية حقيقية.
            </p>
            <p>
              كل تركيبة كنطلقوها كتدوز من بروتوكول صارم: اختيار مكونات نباتية نشطة لها تاريخ موثق، صياغتها بمشاركة صيادلة، مصادقتها من الهيئة العامة للغداء والدواء المغربية (ONSSA)، وأخيراً اختبارها مع زبونات حقيقيات.
            </p>
            <p className="text-2xl font-display font-bold text-teal text-center py-6 border-y border-saffron/30 italic">
              « كنبيعو الحلول، ماشي الأمل. »
            </p>
          </div>
        </div>
      </section>

      {/* 4 Pillars */}
      <section className="section-padding bg-mist/40 content-auto">
        <div className="container-max">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className="divider-gold mb-4 max-w-xs mx-auto">
              <span>أركاننا الأربعة</span>
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-charcoal mb-3">
              4 وعود ما كنتنازلوش عليهم
            </h2>
            <p className="text-muted leading-relaxed">
              كل قرار فأطلس بيور كيدوز من هاد الأربعة معايير. إلا ما كانوش كاملين، التركيبة ما كتطلق.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {pillars.map((p, i) => (
              <div
                key={p.title}
                className="bg-white rounded-2xl p-6 md:p-7 border border-border-soft hover:border-teal/40 hover:shadow-md transition-all flex gap-5"
              >
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-teal text-white flex items-center justify-center shadow-md ring-4 ring-saffron/15">
                    <p.icon className="w-7 h-7" />
                  </div>
                  <p className="text-center mt-2 text-[10px] font-bold tracking-[0.2em] text-saffron">
                    0{i + 1}
                  </p>
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-xl text-charcoal mb-2">
                    {p.title}
                  </h3>
                  <p className="text-muted leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Atlas + Pure name story */}
      <section className="section-padding bg-white content-auto">
        <div className="container-max max-w-4xl">
          <p className="divider-gold mb-4 max-w-xs mx-auto">
            <span>قصة الاسم</span>
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-charcoal mb-10 text-center">
            علاش <span className="text-teal">أطلس بيور</span>؟
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-ivory rounded-2xl p-7 border border-border-soft">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center">
                  <Mountain className="w-6 h-6 text-teal" />
                </div>
                <h3 className="font-display font-bold text-2xl text-charcoal">
                  أطلس
                </h3>
              </div>
              <p className="text-muted leading-relaxed">
                جبال الأطلس رمز القوة، الثبات، والنقاء فالمغرب. منها كنستلهمو – وفعلاً منها كياخدو منشأهم بزاف من المكونات النباتية اللي كنستعملو. الجبال كتعطينا أساس، وحنا كنبنيو فوقو علامة كتدوم.
              </p>
            </div>
            <div className="bg-ivory rounded-2xl p-7 border border-border-soft">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-saffron/15 flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-saffron" />
                </div>
                <h3 className="font-display font-bold text-2xl text-charcoal">
                  بيور <span className="text-base text-muted">/ Pure</span>
                </h3>
              </div>
              <p className="text-muted leading-relaxed">
                بيور كتعني النقاء والبساطة. كنرفضو المركبات الكيميائية المعقدة والمواد المجهولة. كل تركيبة عندنا فيها 4 إلى 6 مكونات نباتية بس – كل وحدة عندها سبب علمي واضح باش تكون فالقنينة.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Promise / commitment */}
      <section className="section-padding bg-teal-dark text-ivory content-auto">
        <div className="container-max max-w-4xl">
          <div className="text-center mb-10">
            <Sparkles className="w-10 h-10 text-saffron mx-auto mb-4" />
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-3">
              وعودنا معاك – مكتوبة، موثقة، مضمونة
            </h2>
            <p className="text-ivory/75 leading-relaxed max-w-xl mx-auto">
              ماشي مجرد كلمات – هادي التزامات حقيقية كنوقفو وراها بكل قنينة كنرسلو.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "تركيبات نباتية 100% – بلا بارابين، بلا سيليكون، بلا مواد كيميائية ضارة",
              "مصادق عليها رسمياً من الهيئة العامة للغداء والدواء المغربية (ONSSA)",
              "ضمان استرجاع الأموال 30 يوم – بلا أسئلة معقدة",
              "الدفع نقداً عند استلام طلبك – ماشي قبل",
              "توصيل مجاني لجميع مدن المغرب",
              "تغليف محترم وخصوصية تامة فالعنوان والمحتوى",
              "فريق دعم مغربي كيرد عليك بدارجتك",
              "تركيبات مدروسة – بلا ادعاءات طبية كاذبة",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/10"
              >
                <ShieldCheck className="w-5 h-5 text-saffron flex-shrink-0 mt-0.5" />
                <span className="text-ivory/90 text-sm leading-relaxed">
                  {item}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-saffron hover:bg-saffron-dark text-white font-semibold rounded-2xl px-8 py-4 shadow-lg transition-colors"
            >
              تصفحي تركيباتنا
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <p className="mt-4 text-sm text-ivory/60">
              أو{" "}
              <Link href="/contact" className="text-saffron hover:underline">
                تواصلي معنا
              </Link>{" "}
              لأي سؤال
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
