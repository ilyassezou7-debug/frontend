import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "سياسة الإرجاع",
};

export default function ReturnsPage() {
  return (
    <div className="section-padding bg-ivory">
      <div className="container-max max-w-3xl">
        <h1 className="font-display font-bold text-4xl text-charcoal mb-8">
          سياسة الإرجاع والاستبدال
        </h1>

        <div className="space-y-8 text-charcoal">
          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-charcoal">
              الدفع عند الاستلام
            </h2>
            <p className="text-muted leading-relaxed">
              جميع طلباتنا تعمل بنظام الدفع عند الاستلام (COD). هذا يعني أنك لا تدفعي أي مبلغ حتى توصلك السلعة إلى بابك. لا يوجد دفع مسبق ولا مخاطر مالية عليك.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-charcoal">
              في حالة وصول المنتج تالفاً
            </h2>
            <p className="text-muted leading-relaxed">
              إذا وصلك المنتج تالفاً أو مكسوراً أو مختلفاً عما طلبتيه، تواصلي معنا فوراً خلال 24 ساعة من الاستلام. سنرسل لك بديلاً مجاناً أو نسوي المشكلة معك.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-charcoal">
              سياسة الاستبدال
            </h2>
            <p className="text-muted leading-relaxed">
              يمكن استبدال المنتجات في الحالات التالية:
            </p>
            <ul className="space-y-2 text-muted">
              <li className="flex items-start gap-2">
                <span className="text-teal mt-1">•</span>
                <span>المنتج وصل تالفاً أو مكسوراً</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal mt-1">•</span>
                <span>وصل منتج مختلف عما طلبتيه</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal mt-1">•</span>
                <span>المنتج ناقص أو غير مكتمل</span>
              </li>
            </ul>
            <p className="text-muted leading-relaxed">
              للمنتجات التي تم فتحها واستخدامها، لا يمكن استردادها لأسباب صحية وأمان المنتج.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-charcoal">
              عملية التوصيل
            </h2>
            <p className="text-muted leading-relaxed">
              بعد تأكيد طلبك هاتفياً، نرسله عبر شركة توصيل معتمدة. مدة التوصيل عادة 2-5 أيام عمل حسب موقعك في المغرب. ستتلقين اتصالاً من المندوب قبل التوصيل.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-charcoal">
              الإلغاء
            </h2>
            <p className="text-muted leading-relaxed">
              يمكنك إلغاء طلبك قبل إرساله. تواصلي معنا فور طلب الإلغاء. بعد إرسال الطلب مع شركة التوصيل، يصعب الإلغاء.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-charcoal">
              رفض الاستلام
            </h2>
            <p className="text-muted leading-relaxed">
              لك الحق في رفض استلام الطلب إذا وجدتِه تالفاً ظاهرياً. لكن نرجو منك إخبارنا لنتمكن من حل المشكلة معك بسرعة.
            </p>
          </section>

          <div className="bg-teal/5 rounded-2xl p-5">
            <p className="text-charcoal font-medium mb-2">للتواصل:</p>
            <Link href="/contact" className="text-teal font-semibold hover:underline">
              صفحة التواصل
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
