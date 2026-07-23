"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Truck,
  Package,
  BadgeCheck,
  CheckCircle2,
  Star,
  Leaf,
  PhoneCall,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { getProductById } from "@/config/products";
import { submitOrder } from "@/lib/api";
import { generateEventId } from "@/lib/event-id";
import {
  getTrackingData,
  saveLandingUrl,
  trackViewContent,
  trackInitiateCheckout,
  trackPurchase,
} from "@/lib/tracking";
import { normalizeMoroccanPhone } from "@/lib/phone";
import type { OrderPayload } from "@/types/order";

const PRODUCT = getProductById("joint_capsules")!;
const PRODUCT_IMG = "/images/lp/joint-product.png";

/** العروض الوحيدة المتاحة — كما طلبت */
const OFFERS = [
  {
    offerId: "one" as const,
    quantity: 1,
    price: 249,
    anchor: 349,
    title: "علبة واحدة — شهر كامل",
    subtitle: "باش تبدا وتحس بالفرق فحركتك",
    badge: null as string | null,
  },
  {
    offerId: "two" as const,
    quantity: 2,
    price: 299,
    anchor: 498,
    title: "علبتان — شهران متواصلان",
    subtitle: "الاختيار اللي كننصح به: الغضروف كيحتاج وقت باش يتغذى",
    badge: "نصيحة الدكتورة ⭐",
  },
];

const INITIAL_STOCK = 10;

export default function WasfaLandingClient() {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);

  const [selected, setSelected] = useState(OFFERS[1]);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [stock, setStock] = useState(INITIAL_STOCK);

  useEffect(() => {
    saveLandingUrl();
    trackViewContent(PRODUCT.id, selected.price, generateEventId());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist a slowly-decreasing stock (never below 3)
  useEffect(() => {
    const key = "atlas_wasfa_stock";
    const saved = Number(localStorage.getItem(key));
    let current = saved >= 3 && saved <= INITIAL_STOCK ? saved : INITIAL_STOCK;
    setStock(current);
    const t = setInterval(() => {
      if (current > 3 && Math.random() > 0.6) {
        current -= 1;
        setStock(current);
        localStorage.setItem(key, String(current));
      }
    }, 45000);
    return () => clearInterval(t);
  }, []);

  const savings = useMemo(
    () => selected.anchor - selected.price,
    [selected]
  );

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    trackInitiateCheckout(selected.price, generateEventId());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: { name?: string; phone?: string } = {};
    if (fullName.trim().length < 3) next.name = "المرجو إدخال الاسم الكامل";
    const normalized = normalizeMoroccanPhone(phone);
    if (!normalized) next.phone = "المرجو إدخال رقم هاتف مغربي صحيح (06/07)";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    const eventId = generateEventId();
    const tracking = getTrackingData() as unknown as OrderPayload["tracking"];
    const total = selected.price;

    const payload: OrderPayload = {
      customer: { full_name: fullName.trim(), phone: normalized! },
      items: [
        {
          product_id: PRODUCT.id,
          offer_id: selected.offerId,
          // quantity = how many times this offer was added (always 1 here);
          // unit_count = boxes inside the offer. Backend multiplies them.
          quantity: 1,
          unit_count: selected.quantity,
          price: selected.price,
          source: "product_page",
        },
      ],
      totals: { subtotal: total, shipping: 0, total, currency: "MAD" },
      tracking: {
        event_id: eventId,
        fbp: tracking?.fbp ?? null,
        fbc: tracking?.fbc ?? null,
        ttp: tracking?.ttp ?? null,
        ttclid: tracking?.ttclid ?? null,
        sc_click_id: tracking?.sc_click_id ?? null,
        page_url: tracking?.page_url ?? "",
        referrer: tracking?.referrer ?? null,
        user_agent: tracking?.user_agent ?? "",
        utm: tracking?.utm,
      },
      upsell: { shown: false, accepted: false, product_id: null, price: 0 },
    };

    try {
      const res = await submitOrder(payload);
      trackPurchase(
        total,
        eventId,
        [{ id: PRODUCT.id, quantity: selected.quantity, price: total }],
        normalized!
      );
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "atlas_last_order",
          JSON.stringify({
            orderId: res.order_id,
            publicId: res.public_id,
            total,
            customer: payload.customer,
            items: payload.items,
          })
        );
      }
      router.push(`/thank-you?order_id=${res.public_id}`);
    } catch (err) {
      console.error("Order submission failed:", err);
      router.push("/thank-you");
    }
  };

  return (
    <div className="min-h-screen bg-ivory text-charcoal" dir="rtl">
      {/* ── شريط التنبيه ── */}
      <div className="bg-red-600 text-white text-center text-xs sm:text-sm py-2.5 px-3 font-bold">
        ⚠️ متبقي {stock} علب فقط من هذه الدفعة — التوصيل مجاني والدفع عند الاستلام
      </div>

      {/* ── رسالة الدكتورة ── */}
      <section className="bg-white border-b border-border-soft">
        <div className="max-w-2xl mx-auto px-5 py-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-full bg-teal/10 border-2 border-teal flex items-center justify-center flex-shrink-0">
              <BadgeCheck className="w-7 h-7 text-teal" />
            </div>
            <div>
              <p className="font-display font-bold text-teal-dark text-lg">
                رسالة من الدكتورة فتيحة الزعيم
              </p>
              <p className="text-muted text-sm">
                إلى كل واحد شاف الفيديو وكيعاني من آلام المفاصل
              </p>
            </div>
          </div>

          <div className="space-y-4 text-[17px] leading-loose text-charcoal/90">
            <p>
              إلا وصلتي لهاد الصفحة، فأنت شفتي الفيديو ديالي وعرفتي علاش
              المسكنات عمرها ما غادي تحل ليك المشكل. <strong>الوجع اللي فركبتيك،
              فظهرك، فكتافك — ماشي قدر خاصك تتعايش معاه.</strong>
            </p>
            <p>
              أنا ما كنبيعش الوهم. هاد التركيبة اللي هضرت عليها فالفيديو هي
              نفسها اللي كتعتمدها أكبر العلامات العالمية لصحة المفاصل:{" "}
              <strong className="text-teal-dark">
                الجلوكوزامين والشوندرويتين اللي كيبنيو الغضروف، MSM اللي كيخفف
                التيبّس، والكركم المركّز كمضاد التهاب طبيعي
              </strong>{" "}
              — وزدنا الفلفل الأسود باش الكركم يمتص فعلاً ما يضيعش.
            </p>
            <p>
              صنعناها هنا فالمغرب، بإشراف صيادلة، ومصادق عليها من{" "}
              <strong>ONSSA</strong>. وحطيت سمعتي عليها:{" "}
              <strong className="text-teal-dark">
                إلا ما حسيتيش بالفرق فراحة مفاصلك، رجع العلبة وكنرجعو ليك فلوسك
                كاملين — بلا أسئلة.
              </strong>
            </p>
            <div className="bg-mist border border-border-soft rounded-2xl p-4 text-teal-dark font-semibold">
              ملاحظة مهمة: بسبب قيود الإنتاج، كل دفعة كتخرج فيها كمية صغيرة باش
              نضمنو الجودة. <span className="text-red-600">هاد الدفعة فيها 10
              علب فقط</span> — وما كنقدرش نضمن ليك متى غادي توصل الدفعة الجاية.
            </div>
          </div>
        </div>
      </section>

      {/* ── المنتج + الثقة ── */}
      <section className="py-10 bg-ivory">
        <div className="max-w-2xl mx-auto px-5 text-center">
          <div className="relative inline-block">
            <img
              src={PRODUCT_IMG}
              alt={PRODUCT.displayName}
              className="w-full max-w-sm mx-auto rounded-3xl shadow-card"
            />
            <span className="absolute top-3 right-3 bg-gradient-gold text-teal-dark font-bold text-xs px-3 py-1.5 rounded-full shadow-gold">
              تركيبة بإشراف صيادلة
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            {[
              { icon: ShieldCheck, label: "ضمان 30 يوم" },
              { icon: Truck, label: "توصيل مجاني" },
              { icon: Package, label: "الدفع عند الاستلام" },
              { icon: Leaf, label: "مصادق ONSSA" },
            ].map((t) => (
              <div
                key={t.label}
                className="flex flex-col items-center gap-1.5 bg-white rounded-2xl border border-border-soft py-4 px-2"
              >
                <t.icon className="w-6 h-6 text-teal" />
                <span className="text-xs font-bold text-teal-dark">{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── شنو غادي يتبدل ── */}
      <section className="py-10 bg-white">
        <div className="max-w-2xl mx-auto px-5">
          <h2 className="text-xl sm:text-2xl font-bold text-teal-dark font-display text-center mb-8">
            شنو قالو ليا المرضى من بعد ما جربوها؟
          </h2>
          <div className="space-y-4">
            {PRODUCT.reviews.slice(0, 4).map((r) => (
              <div
                key={r.author}
                className="bg-ivory rounded-2xl border border-border-soft p-5"
              >
                <div className="flex text-saffron mb-2">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-charcoal/85 leading-relaxed mb-3">
                  &quot;{r.text}&quot;
                </p>
                <p className="text-sm font-bold text-teal-dark">
                  {r.author} · {r.city}{r.age ? ` · ${r.age} سنة` : ""}
                  <span className="mr-2 text-teal text-xs font-semibold">
                    ✓ عميل مؤكد
                  </span>
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-3">
            {PRODUCT.expectedTimeline.map((t) => (
              <div
                key={t.when}
                className="flex items-center gap-3 bg-mist rounded-2xl p-4 border border-border-soft"
              >
                <Clock className="w-6 h-6 text-teal flex-shrink-0" />
                <div>
                  <p className="font-bold text-teal-dark text-sm">{t.when}</p>
                  <p className="text-muted text-sm">{t.result}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── العرض + الطلب ── */}
      <section ref={formRef} id="order" className="py-12 bg-ivory scroll-mt-6">
        <div className="max-w-2xl mx-auto px-5">
          <div className="bg-teal-deep text-white rounded-2xl p-5 text-center mb-7">
            <p className="font-bold flex items-center justify-center gap-2">
              <AlertTriangle className="w-5 h-5 text-saffron" />
              المخزون محدود جداً بسبب قيود الإنتاج
            </p>
            <p className="text-sm mt-2">
              🔥 متبقي <strong className="text-saffron text-lg">{stock}</strong>{" "}
              علب فقط من هذه الدفعة
            </p>
            <div className="mt-3 h-2.5 bg-white/15 rounded-full overflow-hidden" dir="ltr">
              <div
                className="h-full bg-saffron rounded-full transition-all"
                style={{ width: `${(stock / INITIAL_STOCK) * 100}%` }}
              />
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-teal-dark font-display text-center mb-6">
            اختر عرضك — التوصيل مجاني والدفع عند الاستلام
          </h2>

          <div className="space-y-4 mb-8">
            {OFFERS.map((offer) => {
              const active = offer.offerId === selected.offerId;
              return (
                <button
                  key={offer.offerId}
                  onClick={() => setSelected(offer)}
                  className={`w-full text-right relative rounded-2xl border-2 p-5 transition-all bg-white ${
                    active
                      ? "border-teal shadow-cta"
                      : "border-border-soft hover:border-teal/40"
                  }`}
                >
                  {offer.badge && (
                    <span className="absolute -top-3 right-5 bg-gradient-gold text-teal-dark text-xs font-bold px-3 py-1 rounded-full shadow-gold">
                      {offer.badge}
                    </span>
                  )}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-1 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                          active ? "border-teal bg-teal" : "border-border-soft"
                        }`}
                      >
                        {active && (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        )}
                      </span>
                      <span>
                        <span className="block font-bold text-teal-dark">
                          {offer.title}
                        </span>
                        <span className="block text-xs text-muted mt-1">
                          {offer.subtitle}
                        </span>
                      </span>
                    </div>
                    <span className="text-left flex-shrink-0">
                      <span className="block font-bold text-xl text-saffron-dark">
                        {offer.price} درهم
                      </span>
                      <span className="block text-xs text-muted line-through">
                        {offer.anchor} درهم
                      </span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ── الفورم ── */}
          <div className="bg-white rounded-2xl border border-border-soft shadow-card p-6">
            <h3 className="font-bold text-teal-dark mb-1 text-lg">
              باش نصيفطو ليك الطلب، عمّر معلوماتك 👇
            </h3>
            <p className="text-xs text-muted mb-5">
              غادي نتصلو بيك هاتفياً لتأكيد الطلب والعنوان — مكالمة وحدة دقيقة
              فقط.
            </p>
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
                  }}
                  placeholder="الاسم الكامل"
                  className={`w-full px-4 py-4 rounded-xl border bg-ivory focus:outline-none focus:border-teal text-base ${
                    errors.name ? "border-red-400" : "border-border-soft"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }));
                  }}
                  placeholder="رقم الهاتف (06 أو 07)"
                  className={`w-full px-4 py-4 rounded-xl border bg-ivory focus:outline-none focus:border-teal text-base ${
                    errors.phone ? "border-red-400" : "border-border-soft"
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              <div className="bg-ivory rounded-xl p-4 border border-border-soft text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted">الطلب:</span>
                  <strong className="text-teal-dark">
                    {selected.quantity === 1 ? "علبة واحدة" : "علبتان"}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">التوصيل:</span>
                  <strong className="text-teal">مجاني</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">توفّر:</span>
                  <strong className="text-teal">{savings} درهم</strong>
                </div>
                <div className="flex justify-between border-t border-border-soft pt-2 text-base">
                  <span className="text-muted">المجموع:</span>
                  <strong className="text-saffron-dark text-lg">
                    {selected.price} درهم
                  </strong>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-teal hover:bg-teal-hover disabled:opacity-60 text-white font-bold py-4.5 rounded-2xl text-lg shadow-cta transition-all py-4"
              >
                {submitting ? "⏳ جاري تسجيل الطلب..." : "✅ أطلب الآن — الدفع عند الاستلام"}
              </button>
              <p className="text-center text-xs text-muted flex items-center justify-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5" />
                ما كتخلص والو دابا — غير ملي توصلك الأمانة ليدك
              </p>
            </form>
          </div>

          {/* الضمان */}
          <div className="mt-7 bg-white rounded-2xl border-2 border-saffron/40 p-5 flex items-start gap-4">
            <ShieldCheck className="w-9 h-9 text-saffron-dark flex-shrink-0" />
            <div>
              <p className="font-bold text-teal-dark mb-1">
                ضماني الشخصي ليك — 30 يوم
              </p>
              <p className="text-sm text-charcoal/80 leading-relaxed">
                جرب المنتج شهر كامل. إلا ما حسيتيش بفرق حقيقي فراحة مفاصلك،
                رجع العلبة — حتى لو فارغة — وكنرجعو ليك فلوسك كاملين بلا ما
                نسولوك حتى سؤال. أنا واثقة فاللي كنبيع.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── أسئلة ── */}
      <section className="py-10 bg-white">
        <div className="max-w-2xl mx-auto px-5">
          <h2 className="text-xl sm:text-2xl font-bold text-teal-dark font-display text-center mb-6">
            أسئلة كيطرحوها عليا بزاف
          </h2>
          <div className="space-y-3">
            {PRODUCT.productFaqs.slice(0, 5).map((f) => (
              <details
                key={f.q}
                className="bg-ivory rounded-xl border border-border-soft px-5 group"
              >
                <summary className="cursor-pointer list-none font-bold text-teal-dark py-4 flex items-center justify-between text-sm sm:text-base">
                  {f.q}
                  <span className="text-saffron-dark group-open:rotate-45 transition-transform text-xl flex-shrink-0 mr-2">
                    +
                  </span>
                </summary>
                <p className="text-muted text-sm leading-relaxed pb-4">{f.a}</p>
              </details>
            ))}
          </div>

          <button
            onClick={scrollToForm}
            className="mt-8 w-full bg-teal hover:bg-teal-hover text-white font-bold py-4 rounded-2xl text-lg shadow-cta transition-all"
          >
            🛒 أطلب دابا قبل ما تسالي الكمية — {selected.price} درهم
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-teal-deep text-white text-center py-8 px-4">
        <p className="font-display text-lg font-bold mb-1">أطلس بيور</p>
        <p className="text-white/60 text-xs">
          © {new Date().getFullYear()} جميع الحقوق محفوظة
        </p>
        <p className="text-white/40 text-[11px] mt-2 max-w-md mx-auto leading-relaxed">
          هذا المنتج مكمّل غذائي ولا يُغني عن استشارة الطبيب. النتائج قد تختلف
          من شخص لآخر.
        </p>
      </footer>

      {/* ── Sticky CTA ── */}
      <button
        onClick={scrollToForm}
        className="fixed bottom-0 inset-x-0 z-50 bg-gradient-teal text-white font-bold py-4 text-center shadow-lift sm:hidden"
      >
        🛒 أطلب الآن — {selected.price} درهم · متبقي {stock} علب
      </button>
      <div className="h-14 sm:hidden" />
    </div>
  );
}
