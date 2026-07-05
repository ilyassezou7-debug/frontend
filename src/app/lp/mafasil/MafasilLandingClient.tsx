"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Star,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Package,
  Clock,
  Flame,
  Leaf,
  Activity,
  HeartPulse,
  ArrowLeft,
  BadgeCheck,
  XCircle,
} from "lucide-react";
import { getProductById, getSinglePrice } from "@/config/products";
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
const SINGLE_PRICE = getSinglePrice(PRODUCT);

const TRUST = [
  { icon: ShieldCheck, label: "ضمان 30 يوم" },
  { icon: Truck, label: "توصيل مجاني" },
  { icon: Package, label: "الدفع عند الاستلام" },
  { icon: Leaf, label: "مصادق عليها ONSSA" },
];

const MECHANISM = [
  {
    icon: Flame,
    title: "المسكّنات تُسكّن مؤقتاً",
    desc: "الفولتارين والمسكّنات تُخمد الإحساس بالألم في الدماغ فقط، بينما يستمر تآكل الغضروف واحتكاك العظم بالعظم.",
  },
  {
    icon: HeartPulse,
    title: "المشكل الحقيقي في الغضروف",
    desc: "مع الوقت تجف المادة اللزجة بين العظام ويتآكل الغضروف، فيحتكّ العظم بالعظم — وهنا يبدأ الحريق والتورّم.",
  },
  {
    icon: Activity,
    title: "الحل: تغذية المفصل من الداخل",
    desc: "تركيبة الجلوكوزامين والشوندرويتين و MSM والكركم تدعم إعادة بناء الغضروف وتقلّل الالتهاب من الجذر لا مجرد تسكينه.",
  },
];

export default function MafasilLandingClient() {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);

  const [selectedOffer, setSelectedOffer] = useState(
    PRODUCT.offers.find((o) => o.offerId === "two") ?? PRODUCT.offers[0]
  );
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  // countdown + stock
  const [remaining, setRemaining] = useState(6 * 60 * 60);
  const [stock, setStock] = useState(17);
  const [imgOk, setImgOk] = useState(true);

  useEffect(() => {
    saveLandingUrl();
    const eventId = generateEventId();
    trackViewContent(PRODUCT.id, SINGLE_PRICE, eventId);
  }, []);

  useEffect(() => {
    const key = "atlas_mafasil_deadline";
    let deadline = Number(localStorage.getItem(key));
    if (!deadline || deadline < Date.now()) {
      deadline = Date.now() + 6 * 60 * 60 * 1000;
      localStorage.setItem(key, String(deadline));
    }
    const tick = () =>
      setRemaining(Math.max(0, Math.floor((deadline - Date.now()) / 1000)));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const s = setInterval(() => {
      setStock((prev) => (prev > 6 && Math.random() > 0.5 ? prev - 1 : prev));
    }, 25000);
    return () => clearInterval(s);
  }, []);

  const hms = useMemo(() => {
    const h = Math.floor(remaining / 3600);
    const m = Math.floor((remaining % 3600) / 60);
    const s = remaining % 60;
    const pad = (n: number) => String(n).padStart(2, "0");
    return { h: pad(h), m: pad(m), s: pad(s) };
  }, [remaining]);

  const oldPrice = selectedOffer.quantity * SINGLE_PRICE;
  const saving = oldPrice - selectedOffer.price;

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    trackInitiateCheckout(selectedOffer.price, generateEventId());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: { name?: string; phone?: string } = {};
    if (fullName.trim().length < 3) nextErrors.name = "المرجو إدخال الاسم الكامل";
    const normalizedPhone = normalizeMoroccanPhone(phone);
    if (!normalizedPhone) nextErrors.phone = "رقم هاتف مغربي غير صحيح";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    const eventId = generateEventId();
    const tracking = getTrackingData() as unknown as OrderPayload["tracking"];
    const total = selectedOffer.price;

    const payload: OrderPayload = {
      customer: { full_name: fullName.trim(), phone: normalizedPhone! },
      items: [
        {
          product_id: PRODUCT.id,
          offer_id: selectedOffer.offerId,
          quantity: selectedOffer.quantity,
          unit_count: selectedOffer.quantity,
          price: selectedOffer.price,
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
      const response = await submitOrder(payload);
      trackPurchase(
        total,
        eventId,
        [{ id: PRODUCT.id, quantity: selectedOffer.quantity, price: total }],
        normalizedPhone!
      );
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "atlas_last_order",
          JSON.stringify({
            orderId: response.order_id,
            publicId: response.public_id,
            total,
            customer: payload.customer,
            items: payload.items,
          })
        );
      }
      router.push(`/thank-you?order_id=${response.public_id}`);
    } catch (err) {
      console.error("Order submission failed:", err);
      router.push("/thank-you");
    }
  };

  return (
    <div className="min-h-screen bg-ivory text-charcoal" dir="rtl">
      {/* ── Announcement ── */}
      <div className="bg-teal-deep text-white text-center text-xs sm:text-sm py-2 px-3 font-medium">
        ⚠️ عرض محدود اليوم • توصيل مجاني لكل المغرب • الدفع عند الاستلام
      </div>

      {/* ── Authority header ── */}
      <div className="bg-white border-b border-border-soft">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-center gap-3 text-center">
          <BadgeCheck className="w-5 h-5 text-teal flex-shrink-0" />
          <p className="text-sm text-muted">
            تركيبة <span className="font-bold text-teal-dark">بإشراف صيادلة</span> ومصادق
            عليها من <span className="font-bold text-teal-dark">ONSSA</span> — مصنوعة في
            المغرب
          </p>
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-dark via-teal to-teal/80 text-white">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-saffron rounded-full animate-pulse" />
              <span>+341 عائلة مغربية ارتاحت من وجع المفاصل</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display leading-tight mb-5">
              وجع الركبة والمفاصل والظهر؟
              <br />
              <span className="text-saffron">امشِ، انحنِ، صلِّ... دون ألم.</span>
            </h1>
            <p className="text-white/85 text-lg leading-relaxed mb-6">
              {PRODUCT.subheading}
            </p>
            <ul className="space-y-2 mb-8">
              {[
                "يُخفّف الألم والتيبّس من الجذر",
                "يدعم تجدّد الغضروف لا مجرد تسكين",
                "تركيبة المعيار الذهبي بإشراف صيادلة",
                "طبيعي وآمن — الدفع عند الاستلام",
              ].map((li) => (
                <li key={li} className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-saffron flex-shrink-0" />
                  {li}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-bold text-saffron font-display">
                {selectedOffer.price} <span className="text-lg">درهم</span>
              </span>
              {saving > 0 && (
                <>
                  <span className="text-white/60 line-through text-xl">
                    {oldPrice} درهم
                  </span>
                  <span className="bg-saffron text-teal-dark text-xs font-bold px-3 py-1 rounded-full">
                    توفّر {saving} درهم
                  </span>
                </>
              )}
            </div>

            <button
              onClick={scrollToForm}
              className="inline-flex items-center gap-2 bg-saffron hover:bg-saffron/90 text-teal-dark font-bold px-8 py-4 rounded-2xl text-lg shadow-gold hover:-translate-y-0.5 transition-all"
            >
              اطلب الآن — الدفع عند الاستلام
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          {/* product visual */}
          <div className="flex justify-center">
            <div className="relative bg-white/10 border border-white/20 rounded-3xl p-8 backdrop-blur-sm w-full max-w-sm aspect-square flex items-center justify-center">
              {imgOk ? (
                <img
                  src={PRODUCT.images.hero}
                  alt={PRODUCT.displayName}
                  className="max-h-full object-contain drop-shadow-2xl"
                  onError={() => setImgOk(false)}
                />
              ) : (
                <div className="text-center">
                  <div className="text-6xl mb-4">🦵</div>
                  <p className="font-display text-2xl font-bold">{PRODUCT.shortName}</p>
                  <p className="text-white/70 text-sm mt-1">أطلس بيور</p>
                </div>
              )}
              <span className="absolute -top-3 -right-3 bg-saffron text-teal-dark font-bold text-sm px-4 py-2 rounded-full shadow-lg">
                100% طبيعي
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust strip ── */}
      <section className="bg-white border-b border-border-soft">
        <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {TRUST.map((t) => (
            <div key={t.label} className="flex items-center justify-center gap-2 text-center">
              <t.icon className="w-5 h-5 text-teal flex-shrink-0" />
              <span className="text-sm font-semibold text-teal-dark">{t.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Video (VSL) ── */}
      <section className="py-14 bg-ivory">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-teal-dark font-display mb-6">
            شاهد الفيديو حتى الآخر 👇
          </h2>
          <div className="aspect-video rounded-2xl bg-teal-dark/90 border border-teal/30 flex flex-col items-center justify-center text-white shadow-card">
            {/* استبدل هذا بـ <iframe> رابط الفيديو ديالك */}
            <div className="w-16 h-16 rounded-full bg-white text-teal-dark flex items-center justify-center text-2xl mb-3">
              ▶
            </div>
            <p className="text-white/70 text-sm">ضع رابط الفيديو ديالك هنا</p>
          </div>
          <button
            onClick={scrollToForm}
            className="mt-6 inline-flex items-center gap-2 bg-teal hover:bg-teal-hover text-white font-bold px-7 py-3.5 rounded-2xl shadow-cta transition-all"
          >
            اطلب المنتج الآن
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* ── Pain points ── */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-teal-dark font-display mb-10">
            واش كتعاني من هاد المشاكل؟
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {PRODUCT.painPoints.map((p) => (
              <div
                key={p}
                className="flex items-start gap-3 bg-ivory rounded-2xl p-5 border border-border-soft"
              >
                <XCircle className="w-5 h-5 text-saffron-dark flex-shrink-0 mt-1" />
                <p className="text-charcoal/90 leading-relaxed">{p}</p>
              </div>
            ))}
          </div>
          <p className="text-center mt-8 text-lg bg-mist rounded-2xl p-5 border border-border-soft text-teal-dark font-medium">
            {PRODUCT.painSection}
          </p>
        </div>
      </section>

      {/* ── Mechanism ── */}
      <section className="py-16 bg-ivory">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-teal-dark font-display mb-10">
            علاش المسكّنات ماشي هي الحل؟
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {MECHANISM.map((m, i) => (
              <div
                key={m.title}
                className="bg-white rounded-2xl p-7 border border-border-soft shadow-soft relative"
              >
                <span className="absolute -top-3 right-6 w-8 h-8 rounded-full bg-gradient-gold text-teal-dark font-bold flex items-center justify-center text-sm">
                  {i + 1}
                </span>
                <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center mb-4">
                  <m.icon className="w-6 h-6 text-teal" />
                </div>
                <h3 className="font-bold text-teal-dark mb-2">{m.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ingredients ── */}
      <section className="py-16 bg-gradient-to-br from-teal-dark to-teal text-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center font-display mb-4">
            تركيبة المعيار الذهبي
          </h2>
          <p className="text-center text-white/80 max-w-2xl mx-auto mb-10">
            {PRODUCT.ingredientCopy}
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {PRODUCT.ingredientDetails.map((ing) => (
              <div
                key={ing.name}
                className="bg-white/10 border border-white/20 rounded-2xl p-5 backdrop-blur-sm"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Leaf className="w-4 h-4 text-saffron flex-shrink-0" />
                  <h3 className="font-bold">{ing.name}</h3>
                </div>
                <p className="text-white/80 text-sm">{ing.benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-teal-dark font-display mb-10">
            شنو غادي يتبدّل معاك؟
          </h2>
          <div className="space-y-4">
            {PRODUCT.expectedTimeline.map((step) => (
              <div
                key={step.when}
                className="flex items-center gap-4 bg-ivory rounded-2xl p-5 border border-border-soft"
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-teal/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-teal" />
                </div>
                <div>
                  <p className="font-bold text-teal-dark">{step.when}</p>
                  <p className="text-muted text-sm">{step.result}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="py-16 bg-ivory">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-teal-dark font-display mb-3">
              شنو كيقولو زبناؤنا
            </h2>
            <div className="flex items-center justify-center gap-1 text-saffron">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
              <span className="text-muted text-sm mr-2">
                ({PRODUCT.ratingCount} تقييم)
              </span>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRODUCT.reviews.map((r) => (
              <div
                key={r.author}
                className="bg-white p-6 rounded-2xl border border-border-soft shadow-soft"
              >
                <div className="flex text-saffron mb-3">
                  {[...Array(r.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-charcoal/85 text-sm leading-relaxed mb-4">
                  &quot;{r.text}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-teal/10 flex items-center justify-center text-teal font-bold text-sm">
                    {r.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-teal-dark text-sm">{r.author}</p>
                    <p className="text-xs text-muted">{r.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Offer + Order form ── */}
      <section ref={formRef} id="order" className="py-16 bg-white scroll-mt-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* scarcity */}
          <div className="bg-teal-deep text-white rounded-2xl p-6 text-center mb-8">
            <p className="font-bold mb-3">⚠️ المخزون محدود جداً بسبب الطلب الكبير</p>
            <div className="flex justify-center gap-3 mb-3">
              {[
                { v: hms.h, l: "ساعة" },
                { v: hms.m, l: "دقيقة" },
                { v: hms.s, l: "ثانية" },
              ].map((c) => (
                <div key={c.l} className="bg-white/10 rounded-xl px-4 py-2 min-w-[64px]">
                  <span className="block text-2xl font-bold text-saffron">{c.v}</span>
                  <span className="text-xs text-white/70">{c.l}</span>
                </div>
              ))}
            </div>
            <p className="text-sm">
              🔥 باقي فقط <strong className="text-saffron">{stock}</strong> علبة بهذا الثمن
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* offers */}
            <div>
              <h2 className="text-xl font-bold text-teal-dark font-display mb-4">
                اختر الباقة المناسبة لك
              </h2>
              <div className="space-y-3">
                {PRODUCT.offers.map((offer) => {
                  const active = offer.offerId === selectedOffer.offerId;
                  const was = offer.quantity * SINGLE_PRICE;
                  return (
                    <button
                      key={offer.offerId}
                      onClick={() => setSelectedOffer(offer)}
                      className={`w-full text-right relative rounded-2xl border-2 p-4 transition-all ${
                        active
                          ? "border-saffron bg-saffron/5 shadow-gold"
                          : "border-border-soft bg-white hover:border-teal/40"
                      }`}
                    >
                      {offer.badge && (
                        <span className="absolute -top-3 right-5 bg-saffron text-teal-dark text-xs font-bold px-3 py-1 rounded-full">
                          {offer.badge}
                        </span>
                      )}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-teal-dark">
                            {offer.title ?? offer.label}
                          </p>
                          {offer.subtitle && (
                            <p className="text-xs text-muted mt-0.5">{offer.subtitle}</p>
                          )}
                        </div>
                        <div className="text-left flex-shrink-0">
                          <p className="font-bold text-lg text-saffron-dark">
                            {offer.price} درهم
                          </p>
                          {was > offer.price && (
                            <p className="text-xs text-muted line-through">{was} درهم</p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted mt-4 leading-relaxed">
                {PRODUCT.offerNudge}
              </p>
            </div>

            {/* form */}
            <div className="bg-ivory rounded-2xl p-6 border border-border-soft shadow-card">
              <h3 className="font-bold text-teal-dark mb-4">
                لإتمام الطلب، أدخل معلوماتك 👇
              </h3>
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
                    className={`w-full px-4 py-3.5 rounded-xl border bg-white focus:outline-none focus:border-teal ${
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
                    className={`w-full px-4 py-3.5 rounded-xl border bg-white focus:outline-none focus:border-teal ${
                      errors.phone ? "border-red-400" : "border-border-soft"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                <div className="bg-white rounded-xl p-4 border border-border-soft text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted">الكمية:</span>
                    <strong className="text-teal-dark">
                      {selectedOffer.quantity}{" "}
                      {selectedOffer.quantity === 1 ? "علبة" : "علب"}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">التوصيل:</span>
                    <strong className="text-teal">مجاني</strong>
                  </div>
                  <div className="flex justify-between border-t border-border-soft pt-2 text-base">
                    <span className="text-muted">المجموع:</span>
                    <strong className="text-saffron-dark">
                      {selectedOffer.price} درهم
                    </strong>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-teal hover:bg-teal-hover disabled:opacity-60 text-white font-bold py-4 rounded-2xl text-lg shadow-cta transition-all"
                >
                  {submitting ? "جاري تأكيد الطلب..." : "✅ تأكيد الطلب"}
                </button>
                <p className="text-center text-xs text-muted">
                  🔒 الدفع عند الاستلام — لا تدفع أي شيء الآن
                </p>
              </form>
            </div>
          </div>

          {/* guarantee */}
          {PRODUCT.guaranteeText && (
            <div className="mt-8 bg-mist rounded-2xl p-6 border border-border-soft flex items-start gap-4">
              <ShieldCheck className="w-8 h-8 text-teal flex-shrink-0" />
              <p className="text-teal-dark text-sm leading-relaxed">
                {PRODUCT.guaranteeText}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 bg-ivory">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-teal-dark font-display mb-8">
            أسئلة شائعة
          </h2>
          <div className="space-y-3">
            {PRODUCT.productFaqs.map((f) => (
              <details
                key={f.q}
                className="bg-white rounded-xl border border-border-soft px-5 group"
              >
                <summary className="cursor-pointer list-none font-bold text-teal-dark py-4 flex items-center justify-between">
                  {f.q}
                  <span className="text-saffron-dark group-open:rotate-45 transition-transform text-xl">
                    +
                  </span>
                </summary>
                <p className="text-muted text-sm leading-relaxed pb-4">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-teal-deep text-white text-center py-10 px-4">
        <p className="font-display text-xl font-bold mb-2">أطلس بيور</p>
        <p className="text-white/60 text-sm">
          © {new Date().getFullYear()} جميع الحقوق محفوظة
        </p>
        <p className="text-white/40 text-xs mt-3 max-w-lg mx-auto">
          هذا المنتج مكمّل غذائي طبيعي ولا يُغني عن استشارة الطبيب المختص.
        </p>
      </footer>

      {/* ── Sticky mobile CTA ── */}
      <button
        onClick={scrollToForm}
        className="fixed bottom-0 inset-x-0 z-50 bg-gradient-teal text-white font-bold py-4 text-center shadow-lift sm:hidden"
      >
        🛒 اطلب الآن — {selectedOffer.price} درهم
      </button>
    </div>
  );
}
