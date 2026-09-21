"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, PhoneCall, Truck, Package } from "lucide-react";
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

/** Image-only page: every section (text included) is a designed image. */
const PRODUCT_ID = "melasma_cream";
const IMG = (n: string) => `/images/lp/kalaf/${n}.webp`;
const SECTIONS_BEFORE_FORM = [
  "01_hero", "02_who", "03_sun", "04_formula", "05_vs",
  "06_ritual", "07_time", "08_safety", "09_atlas", "10_offer",
];
const SECTIONS_AFTER_FORM = ["11_faq", "12_close"];
/** Sections whose baked-in button should open the order form. */
const CLICKABLE = new Set(["01_hero", "10_offer", "12_close"]);

/** Must match backend/app/services/pricing.py (the server recalculates). */
const OFFERS = [
  { offerId: "one" as const, quantity: 1, price: 199, anchor: 299, title: "علبة وحدة", subtitle: "باش تجربي · حوالي شهر", badge: null as string | null },
  { offerId: "two" as const, quantity: 2, price: 329, anchor: 598, title: "علبتين · برنامج شهرين", subtitle: "المدة اللي كتبان فيها النتيجة", badge: "⭐ الأكثر طلباً" },
  { offerId: "three" as const, quantity: 3, price: 449, anchor: 897, title: "3 علب · البرنامج الكامل", subtitle: "للكلف القديم والبقع الغامقة", badge: null },
];

export default function KalafLandingClient() {
  const router = useRouter();
  const formRef = useRef<HTMLElement>(null);

  const [selected, setSelected] = useState(OFFERS[1]);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    saveLandingUrl();
    trackViewContent(PRODUCT_ID, selected.price, generateEventId());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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
          product_id: PRODUCT_ID,
          offer_id: selected.offerId,
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
        [{ id: PRODUCT_ID, quantity: selected.quantity, price: total }],
        normalized!
      );
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
      router.push(`/thank-you?order_id=${res.public_id}`);
    } catch (err) {
      console.error("Order submission failed:", err);
      router.push("/thank-you");
    }
  };

  const section = (n: string, i: number) => (
    <img
      key={n}
      src={IMG(n)}
      alt=""
      width={1080}
      height={n === "01_hero" || n === "06_ritual" || n === "10_offer" ? 1924 : 1630}
      loading={i < 2 ? "eager" : "lazy"}
      fetchPriority={i === 0 ? "high" : undefined}
      onClick={CLICKABLE.has(n) ? scrollToForm : undefined}
      className={`block w-full h-auto ${CLICKABLE.has(n) ? "cursor-pointer" : ""}`}
    />
  );

  return (
    <div className="min-h-screen bg-[#FBF8F3] text-[#1D2A24]" dir="rtl">
      <div className="bg-[#0F3B2E] text-[#E6CB8E] text-center text-xs sm:text-sm py-2.5 px-3 font-bold">
        🚚 التوصيل مجاني · 💵 الدفع عند الاستلام
      </div>

      <main className="max-w-[540px] mx-auto bg-[#FBF8F3] shadow-card">
        {SECTIONS_BEFORE_FORM.map(section)}

        {/* ── العرض + الطلب ── */}
        <section ref={formRef} id="order" className="px-4 py-8 scroll-mt-2 bg-[#F5EFE6]">
          <h2 className="text-2xl font-bold text-[#0F3B2E] font-display text-center mb-5">
            ختاري العرض ديالك 👇
          </h2>

          <div className="space-y-4 mb-6">
            {OFFERS.map((offer) => {
              const active = offer.offerId === selected.offerId;
              return (
                <button
                  key={offer.offerId}
                  type="button"
                  onClick={() => setSelected(offer)}
                  className={`w-full text-right relative rounded-2xl border-2 p-4 transition-all ${
                    active ? "border-[#C9A45C] bg-[#0F3B2E] text-white shadow-lg" : "border-[#E4DACB] bg-white"
                  }`}
                >
                  {offer.badge && (
                    <span className="absolute -top-3 right-4 bg-[#C9A45C] text-[#0F3B2E] text-xs font-bold px-3 py-1 rounded-full">
                      {offer.badge}
                    </span>
                  )}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-1 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                          active ? "border-[#E6CB8E] bg-[#C9A45C]" : "border-[#E4DACB]"
                        }`}
                      >
                        {active && <CheckCircle2 className="w-4 h-4 text-[#0F3B2E]" />}
                      </span>
                      <span>
                        <span className={`block font-bold ${active ? "text-white" : "text-[#0F3B2E]"}`}>{offer.title}</span>
                        <span className={`block text-xs mt-1 ${active ? "text-white/70" : "text-[#5D6A63]"}`}>{offer.subtitle}</span>
                      </span>
                    </div>
                    <span className="text-left flex-shrink-0">
                      <span className={`block font-bold text-xl ${active ? "text-[#E6CB8E]" : "text-[#0F3B2E]"}`}>{offer.price} درهم</span>
                      <span className={`block text-xs line-through ${active ? "text-white/50" : "text-[#A08F7A]"}`}>{offer.anchor} درهم</span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl border border-[#E4DACB] p-5">
            <h3 className="font-bold text-[#0F3B2E] mb-1 text-lg">عمّري معلوماتك باش نصيفطو ليك الطلب</h3>
            <p className="text-xs text-[#5D6A63] mb-4">غادي نعيطو ليك باش نأكدو الطلب والعنوان — مكالمة قصيرة.</p>
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <input
                  id="kalaf-name"
                  type="text"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
                  }}
                  placeholder="الاسم الكامل"
                  className={`w-full px-4 py-4 rounded-xl border bg-[#FBF8F3] focus:outline-none focus:border-[#0F3B2E] text-base ${
                    errors.name ? "border-red-400" : "border-[#E4DACB]"
                  }`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <input
                  id="kalaf-phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }));
                  }}
                  placeholder="رقم الهاتف (06 أو 07)"
                  className={`w-full px-4 py-4 rounded-xl border bg-[#FBF8F3] focus:outline-none focus:border-[#0F3B2E] text-base ${
                    errors.phone ? "border-red-400" : "border-[#E4DACB]"
                  }`}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div className="bg-[#FBF8F3] rounded-xl p-4 border border-[#E4DACB] text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#5D6A63]">الطلب:</span>
                  <strong className="text-[#0F3B2E]">{selected.title}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5D6A63]">التوصيل:</span>
                  <strong className="text-[#0F3B2E]">مجاني</strong>
                </div>
                <div className="flex justify-between border-t border-[#E4DACB] pt-2 text-base">
                  <span className="text-[#5D6A63]">المجموع:</span>
                  <strong className="text-[#0F3B2E] text-lg">{selected.price} درهم</strong>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#0F3B2E] hover:bg-[#15503E] disabled:opacity-60 text-[#E6CB8E] border-2 border-[#C9A45C] font-bold py-4 rounded-2xl text-lg transition-all"
              >
                {submitting ? "⏳ جاري تسجيل الطلب..." : "✅ اطلبي دابا — الدفع عند الاستلام"}
              </button>
              <div className="flex items-center justify-center gap-4 text-xs text-[#5D6A63]">
                <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> توصيل مجاني</span>
                <span className="flex items-center gap-1"><Package className="w-3.5 h-3.5" /> الدفع عند الاستلام</span>
                <span className="flex items-center gap-1"><PhoneCall className="w-3.5 h-3.5" /> مكالمة تأكيد</span>
              </div>
            </form>
          </div>
        </section>

        {SECTIONS_AFTER_FORM.map((n, i) => section(n, i + SECTIONS_BEFORE_FORM.length))}

        <footer className="bg-[#0F3B2E] text-white text-center py-7 px-4">
          <p className="font-display text-lg font-bold mb-1">أطلس بيور</p>
          <p className="text-white/50 text-[11px] max-w-md mx-auto leading-relaxed">
            منتوج تجميلي كيساعد على تخفيف مظهر البقع. ماشي دواء، وما مخصصش لتشخيص ولا علاج ولا الوقاية من أي مرض. النتائج كتختلف من شخص لآخر.
          </p>
        </footer>
      </main>

      {/* ── Sticky CTA ── */}
      <button
        type="button"
        onClick={scrollToForm}
        className="fixed bottom-0 inset-x-0 z-50 bg-[#0F3B2E] text-[#E6CB8E] border-t-2 border-[#C9A45C] font-bold py-4 text-center shadow-lift"
        style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}
      >
        🛒 اطلبي دابا — {selected.price} درهم · الدفع عند الاستلام
      </button>
      <div className="h-16" />
    </div>
  );
}
