import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG } from "@/config/site";

export const metadata: Metadata = {
  title: "الشروط والأحكام",
};

export default function TermsPage() {
  return (
    <div className="section-padding bg-ivory">
      <div className="container-max max-w-3xl">
        <h1 className="font-display font-bold text-4xl text-charcoal mb-8">
          الشروط والأحكام
        </h1>

        <div className="space-y-8 text-charcoal">
          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-charcoal">
              1. القبول بالشروط
            </h2>
            <p className="text-muted leading-relaxed">
              باستخدامك لموقع {SITE_CONFIG.nameEn} ({SITE_CONFIG.domain})، فأنت توافقين على هذه الشروط والأحكام. إذا كنتِ لا توافقين، يرجى عدم استخدام الموقع.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-charcoal">
              2. طبيعة المنتجات
            </h2>
            <p className="text-muted leading-relaxed">
              جميع منتجات أطلس بيور هي منتجات عناية شخصية طبيعية. هي ليست أدوية ولا تُعالج أي مرض. لا ينبغي استخدام منتجاتنا كبديل للرعاية الطبية. في حالة وجود حالة طبية، يرجى استشارة طبيب مختص.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-charcoal">
              3. نظام الطلب والدفع
            </h2>
            <p className="text-muted leading-relaxed">
              جميع الطلبات تعمل بنظام الدفع عند الاستلام (COD) فقط. لا يوجد دفع إلكتروني أو بطاقة بنكية. عند تسجيل الطلب، فريق التأكيد سيتصل بك للتحقق من المعلومات قبل الإرسال.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-charcoal">
              4. تأكيد الطلب
            </h2>
            <p className="text-muted leading-relaxed">
              لا يُعتبر الطلب مؤكداً حتى يتصل بك فريقنا ويؤكد المعلومات. تسجيل الطلب عبر الموقع هو مجرد طلب أولي. نحتفظ بحق رفض أي طلب لأي سبب.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-charcoal">
              5. التوصيل
            </h2>
            <p className="text-muted leading-relaxed">
              التوصيل مجاني لجميع مدن المغرب. مدة التوصيل عادة 2-5 أيام عمل. لسنا مسؤولين عن التأخيرات الناجمة عن شركات التوصيل أو الظروف الخارجة عن إرادتنا.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-charcoal">
              6. الإلغاء والإرجاع
            </h2>
            <p className="text-muted leading-relaxed">
              راجعي{" "}
              <Link href="/returns" className="text-teal hover:underline">
                سياسة الإرجاع
              </Link>{" "}
              للتفاصيل الكاملة حول الإلغاء والاستبدال.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-charcoal">
              7. الملكية الفكرية
            </h2>
            <p className="text-muted leading-relaxed">
              جميع محتويات الموقع (نصوص، صور، شعار) هي ملك لأطلس بيور محفوظة حقوق النشر. لا يجوز نسخها أو استخدامها دون إذن مسبق.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-charcoal">
              8. القانون المطبق
            </h2>
            <p className="text-muted leading-relaxed">
              تخضع هذه الشروط للقانون المغربي. أي نزاع يخضع للمحاكم المغربية المختصة.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-charcoal">
              9. التواصل
            </h2>
            <p className="text-muted leading-relaxed">
              لأي سؤال حول هذه الشروط:{" "}
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="text-teal hover:underline"
              >
                {SITE_CONFIG.email}
              </a>
            </p>
          </section>

          <p className="text-sm text-muted border-t border-border-soft pt-4">
            آخر تحديث: يناير 2026
          </p>
        </div>
      </div>
    </div>
  );
}
