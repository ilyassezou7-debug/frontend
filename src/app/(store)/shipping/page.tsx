import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "سياسة التوصيل والشحن",
};

export default function ShippingPage() {
  return (
    <div className="section-padding bg-ivory">
      <div className="container-max max-w-3xl">
        <h1 className="font-display font-bold text-4xl text-charcoal mb-8">
          سياسة التوصيل والشحن
        </h1>

        <div className="space-y-8 text-charcoal">
          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-charcoal">
              مدة التوصيل
            </h2>
            <p className="text-muted leading-relaxed">
              نقوم بالتوصيل لجميع مدن المغرب. تستغرق مدة التوصيل:
            </p>
            <ul className="space-y-2 text-muted">
              <li className="flex items-start gap-2">
                <span className="text-teal mt-1">•</span>
                <span>المدن الكبرى: من يوم إلى يومين (1-2 أيام).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal mt-1">•</span>
                <span>باقي المدن والمناطق: من يومين إلى 5 أيام (2-5 أيام).</span>
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-charcoal">
              تكلفة الشحن
            </h2>
            <p className="text-muted leading-relaxed">
              التوصيل مجاني تماماً لجميع الطلبيات في جميع أنحاء المغرب.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-charcoal">
              طريقة الدفع
            </h2>
            <p className="text-muted leading-relaxed">
              جميع الطلبات تعمل بنظام الدفع عند الاستلام. لا تدفع أي مبلغ حتى يصلك الطلب إلى باب منزلك.
            </p>
          </section>

          <div className="bg-teal/5 rounded-2xl p-5">
            <p className="text-charcoal font-medium mb-2">للاستفسارات المتعلقة بتوصيل طلبك:</p>
            <Link href="/contact" className="text-teal font-semibold hover:underline">
              تواصل معنا
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
