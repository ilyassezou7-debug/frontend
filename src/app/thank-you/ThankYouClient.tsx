"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Phone, ShoppingBag, ArrowLeft } from "lucide-react";
import { PRODUCTS } from "@/config/products";
import { formatMAD } from "@/lib/money";

interface StoredOrder {
  orderId: string;
  publicId: string;
  total: number;
  customer: { full_name: string; phone: string };
  items: Array<{
    product_id: string;
    offer_id: string;
    quantity: number;
    unit_count: number;
    price: number;
  }>;
}

export default function ThankYouClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [order, setOrder] = useState<StoredOrder | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("atlas_last_order");
      if (stored) {
        try {
          setOrder(JSON.parse(stored));
        } catch {
          // ignore
        }
      }
    }
  }, []);

  return (
    <div className="section-padding bg-ivory min-h-screen">
      <div className="container-max max-w-2xl">
        {/* Success header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-10 h-10 text-teal" />
          </div>
          <h1 className="font-display font-bold text-3xl text-charcoal mb-3">
            تم تسجيل طلبك بنجاح!
          </h1>
          <p className="text-lg text-muted">
            شكراً لك على ثقتك في أطلس بيور.
          </p>
          {orderId && (
            <p className="text-sm text-muted mt-2">
              رقم الطلب:{" "}
              <span className="font-mono font-semibold text-charcoal">
                {orderId}
              </span>
            </p>
          )}
        </div>

        {/* What happens next */}
        <div className="bg-white rounded-3xl border border-border-soft p-6 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <Phone className="w-6 h-6 text-teal flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-charcoal mb-1">
                غادي يتاصل بك فريق التأكيد
              </p>
              <p className="text-muted text-sm leading-relaxed">
                باش يأكد المعلومات قبل الإرسال. هاد الخطوة ضرورية.
              </p>
            </div>
          </div>
          <div className="bg-saffron/10 rounded-2xl px-4 py-3 border border-saffron/20">
            <p className="text-charcoal font-medium text-sm">
              ⚠️ مهم: خلي الهاتف قريب منك في الساعات القادمة. إذا ما ردتيش على المكالمة، قد يتأخر طلبك.
            </p>
          </div>
        </div>

        {/* Order summary */}
        {order && (
          <div className="bg-white rounded-3xl border border-border-soft p-6 mb-6">
            <h2 className="font-display font-semibold text-xl text-charcoal mb-4">
              ملخص طلبك
            </h2>
            <div className="space-y-3">
              {order.items.map((item, i) => {
                const product = PRODUCTS.find((p) => p.id === item.product_id);
                const offerLabel =
                  product?.offers.find((o) => o.offerId === item.offer_id)
                    ?.label || item.offer_id;
                return (
                  <div
                    key={i}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-charcoal">
                      {product?.shortName || item.product_id} ({item.unit_count}{" "}
                      قطعة – {offerLabel}) × {item.quantity}
                    </span>
                    <span className="font-semibold text-teal">
                      {formatMAD(item.price * item.quantity)}
                    </span>
                  </div>
                );
              })}
              <div className="border-t border-border-soft pt-3 flex justify-between font-bold">
                <span>المجموع المدفوع عند الاستلام</span>
                <span className="text-teal">{formatMAD(order.total)}</span>
              </div>
            </div>
            <div className="mt-3 text-xs text-muted">
              الاسم: {order.customer.full_name} | الهاتف: {order.customer.phone}
            </div>
          </div>
        )}

        {/* Delivery info */}
        <div className="bg-teal/5 rounded-2xl p-5 mb-6">
          <h3 className="font-semibold text-charcoal mb-2">
            معلومات التوصيل
          </h3>
          <ul className="space-y-1 text-sm text-muted">
            <li>• التوصيل مجاني لجميع مدن المغرب</li>
            <li>• مدة التوصيل: 2-5 أيام عمل</li>
            <li>• الدفع عند الاستلام – ما تحتاجيش تدفعي الآن</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/products"
            className="btn-primary flex items-center justify-center gap-2 flex-1"
          >
            <ShoppingBag className="w-4 h-4" />
            تصفح المنتجات
          </Link>
          <Link
            href="/"
            className="btn-secondary flex items-center justify-center gap-2 flex-1"
          >
            <ArrowLeft className="w-4 h-4" />
            الرئيسية
          </Link>
        </div>

        <p className="text-center text-sm text-muted mt-6">
          أي سؤال؟{" "}
          <Link href="/contact" className="text-teal hover:underline">
            تواصلي معنا
          </Link>
        </p>
      </div>
    </div>
  );
}
