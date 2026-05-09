import type { Metadata } from "next";
import Link from "next/link";
import { Mountain, Leaf, Shield, Heart, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "من نحن",
  description:
    "اعرفي قصة أطلس بيور – علامة مغربية للعناية الشخصية الطبيعية مع الدفع عند الاستلام.",
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="section-padding bg-gradient-to-br from-ivory to-sand">
        <div className="container-max max-w-3xl text-center">
          <div className="w-16 h-16 bg-teal rounded-full flex items-center justify-center mx-auto mb-6">
            <Mountain className="w-8 h-8 text-ivory" />
          </div>
          <h1 className="font-display font-bold text-4xl text-charcoal mb-4">
            من نحن
          </h1>
          <p className="text-lg text-muted leading-relaxed">
            أطلس بيور – قصة ثقة ومكونات طبيعية من المغرب
          </p>
        </div>
      </section>

      {/* Brand story */}
      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl space-y-10">
          {/* Atlas */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mountain className="w-7 h-7 text-teal" />
              <h2 className="font-display font-bold text-2xl text-charcoal">
                أطلس – من جبال المغرب
              </h2>
            </div>
            <p className="text-muted leading-relaxed">
              جبال الأطلس رمز القوة والثبات في المغرب. اخترنا هذا الاسم لأننا نؤمن بأن العناية الحقيقية تبنى على أساس قوي من الطبيعة. كما أن الجبال تعطينا نباتات وخيرات طبيعية، نحن نختار المكونات التي تعمل بشكل حقيقي.
            </p>
          </div>

          {/* Pure */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Leaf className="w-7 h-7 text-teal" />
              <h2 className="font-display font-bold text-2xl text-charcoal">
                بيور – النقاء والبساطة
              </h2>
            </div>
            <p className="text-muted leading-relaxed">
              &quot;بيور&quot; تعني النقاء والبساطة. نحن نرفض المواد الاصطناعية المعقدة والمواد الكيميائية المجهولة. منتجاتنا تحتوي فقط على مكونات طبيعية معروفة ومستعملة منذ قرون في العناية التقليدية.
            </p>
          </div>

          {/* Brand promise */}
          <div className="bg-teal/5 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Heart className="w-7 h-7 text-teal" />
              <h2 className="font-display font-bold text-2xl text-charcoal">
                وعدنا معاك
              </h2>
            </div>
            <ul className="space-y-3">
              {[
                "مكونات طبيعية بسيطة ومعروفة",
                "لا ادعاءات طبية – منتجاتنا للعناية الشخصية فقط",
                "تغليف محترم يصل بأمان",
                "الدفع فقط عند استلام طلبك",
                "توصيل مجاني لجميع مدن المغرب",
                "فريق دعم لمساعدتك في أي سؤال",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" />
                  <span className="text-charcoal">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Why natural */}
          <div className="space-y-4">
            <h2 className="font-display font-bold text-2xl text-charcoal">
              لماذا اخترنا المكونات الطبيعية؟
            </h2>
            <p className="text-muted leading-relaxed">
              المكونات الطبيعية لها تاريخ طويل في العناية التقليدية. الأجداد كانوا يعرفون خصائص النباتات والمعادن الطبيعية قبل أن تظهر المواد الكيميائية الاصطناعية. نحن نعود لهذه المعرفة ونقدمها في شكل منتجات حديثة وسهلة الاستعمال.
            </p>
          </div>

          {/* COD commitment */}
          <div className="space-y-4">
            <h2 className="font-display font-bold text-2xl text-charcoal">
              الدفع عند الاستلام – التزامنا معك
            </h2>
            <p className="text-muted leading-relaxed">
              نفهم أن الثقة تبنى خطوة بخطوة. لهذا اخترنا نظام الدفع عند الاستلام. ما كتدفعيش قبل ما تشوفي وتستلمي طلبك بيديك. هذا هو التزامنا معك – لأننا واثقون في منتجاتنا وعايزين أنتِ تكوني واثقة فينا.
            </p>
          </div>

          {/* CTA */}
          <div className="text-center pt-4">
            <Link href="/products" className="btn-primary inline-flex items-center gap-2">
              تصفحي المنتجات
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <p className="mt-4 text-sm text-muted">
              أو{" "}
              <Link href="/contact" className="text-teal hover:underline">
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
