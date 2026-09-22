import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG } from "@/config/site";

export const metadata: Metadata = {
  title: "سياسة الخصوصية",
};

export default function PrivacyPage() {
  return (
    <div className="section-padding bg-ivory">
      <div className="container-max max-w-3xl">
        <h1 className="font-display font-bold text-4xl text-charcoal mb-8">
          سياسة الخصوصية
        </h1>

        <div className="prose-like space-y-8 text-charcoal">
          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-charcoal">
              1. المعلومات التي نجمعها
            </h2>
            <p className="text-muted leading-relaxed">
              عند تسجيل طلب عبر موقعنا، نجمع المعلومات التالية فقط:
            </p>
            <ul className="space-y-1 text-muted">
              <li className="flex items-start gap-2">
                <span className="text-teal mt-1">•</span>
                <span>الاسم الكامل – لتعريف الشخصية وإجراء التأكيد</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal mt-1">•</span>
                <span>رقم الهاتف – للتواصل معك وتأكيد الطلب والتوصيل</span>
              </li>
            </ul>
            <p className="text-muted leading-relaxed">
              لا نطلب منك أي معلومات بنكية أو مالية. نظام الدفع لدينا هو الدفع عند الاستلام فقط.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-charcoal">
              2. كيف نستخدم معلوماتك
            </h2>
            <p className="text-muted leading-relaxed">
              نستخدم معلوماتك حصرياً لـ:
            </p>
            <ul className="space-y-1 text-muted">
              <li className="flex items-start gap-2">
                <span className="text-teal mt-1">•</span>
                <span>تأكيد طلبك والتواصل معك قبل الإرسال</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal mt-1">•</span>
                <span>إتمام عملية التوصيل مع شركات الشحن</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal mt-1">•</span>
                <span>متابعة طلبك في حالة الحاجة</span>
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-charcoal">
              3. تتبع الإعلانات (Pixels)
            </h2>
            <p className="text-muted leading-relaxed">
              يستخدم موقعنا تقنيات تتبع إعلاني من Meta (فيسبوك/إنستغرام)، TikTok، وSnapchat. هذه التقنيات تساعدنا في قياس فعالية إعلاناتنا وتحسينها. يمكنك تعطيل هذا التتبع من إعدادات متصفحك أو عبر خيارات الخصوصية في كل منصة.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-charcoal">
              4. ما لا نجمعه
            </h2>
            <p className="text-muted leading-relaxed">
              لا نجمع أي معلومات طبية أو صحية. منتجاتنا للعناية الشخصية فقط وليست أدوية. لا نطلب تاريخ الميلاد أو العنوان الدقيق (يُجمع عند التوصيل من شركة الشحن).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-charcoal">
              5. مشاركة المعلومات
            </h2>
            <p className="text-muted leading-relaxed">
              لا نبيع ولا نشارك معلوماتك الشخصية مع أطراف ثالثة، باستثناء شركات التوصيل التي تحتاج اسمك ورقم هاتفك لإتمام التوصيل.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-charcoal">
              6. حقوقك
            </h2>
            <p className="text-muted leading-relaxed">
              يحق لك طلب حذف بياناتك أو الاطلاع عليها في أي وقت. للتواصل معنا بشأن خصوصيتك:
            </p>
            <Link
              href="/contact"
              className="inline-block text-teal font-semibold hover:underline"
            >
              تواصلي معنا
            </Link>
            <p className="text-muted">
              أو عبر البريد: {SITE_CONFIG.email}
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
