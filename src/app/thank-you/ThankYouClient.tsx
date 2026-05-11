"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  Phone,
  ShoppingBag,
  ArrowLeft,
  ClipboardList,
  Truck,
  PackageCheck,
  Clock,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Banknote,
  Plus,
  Star,
  MessageCircle,
  ContactRound,
  MapPin,
} from "lucide-react";
import { PRODUCTS } from "@/config/products";
import { SITE_CONFIG } from "@/config/site";
import { formatMAD } from "@/lib/money";
import { useCartStore } from "@/store/cart-store";
import StarRating from "@/components/ui/StarRating";

interface StoredOrder {
  orderId: string;
  publicId: string;
  total: number;
  customer: { full_name: string; phone: string; city?: string };
  items: Array<{
    product_id: string;
    offer_id: string;
    quantity: number;
    unit_count: number;
    price: number;
  }>;
}

// ─────────────────────────────────────────────────────────────────
// Call window helper — Casablanca is UTC+1 (no DST observed since 2018)
// Confirmation hours: 09:00 → 21:00
// ─────────────────────────────────────────────────────────────────
function useCallWindow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  return useMemo(() => {
    if (!now) return null;
    const moroccoHour = (now.getUTCHours() + 1) % 24; // UTC+1
    const isOpen = moroccoHour >= 9 && moroccoHour < 21;
    return {
      isOpen,
      hour: moroccoHour,
      title: isOpen
        ? "غادي يتاصل بيك فريقنا فأقل من 10 دقائق"
        : "غادي يتاصل بيك فريقنا بكري الصباح",
      sub: isOpen
        ? "خلي هاتفك قريب وردي على المكالمة باش نأكدو طلبيتك ونرسلوها فالحين"
        : "كنخدمو من 9 صباحاً حتى 9 ليلاً. غدا الصباح من 9ص أول مكالمة هي ديالك إن شاء الله.",
      etaLabel: isOpen ? "أقل من 10 دقائق" : "غداً من 9:00 ص",
      pulseColor: isOpen ? "bg-emerald-500" : "bg-saffron",
    };
  }, [now]);
}

export default function ThankYouClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const clearCart = useCartStore((s) => s.clearCart);
  const callWindow = useCallWindow();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("atlas_last_order");
      if (stored) {
        try {
          setOrder(JSON.parse(stored));
        } catch {
          /* ignore */
        }
      }
      clearCart();
    }
  }, [clearCart]);

  // Cross-sell — products NOT in the order
  const orderedProductIds = new Set(order?.items.map((i) => i.product_id) ?? []);
  const crossSell = PRODUCTS.filter((p) => !orderedProductIds.has(p.id)).slice(
    0,
    2
  );

  // Aggregated reviews from all products for social proof carousel
  const recentReviews = PRODUCTS.flatMap((p) => p.reviews)
    .filter((r) => r.verified)
    .slice(0, 3);

  const customerFirstName =
    order?.customer.full_name?.split(" ")[0]?.trim() || "صديقتي";

  // Format Morocco-style phone (display)
  const formatPhone = (phone: string) =>
    phone.replace(/(\d{4})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4");

  return (
    <div className="bg-ivory min-h-screen">
      {/* ───── 1. SUCCESS HEADER ───── */}
      <section className="relative bg-gradient-to-br from-teal via-teal-dark to-teal-dark text-ivory pt-12 pb-10 sm:pt-16 sm:pb-14 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #B8862F 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="container-max max-w-3xl relative text-center">
          {/* Confetti-feel seal */}
          <div className="relative inline-flex items-center justify-center mb-5">
            <div className="absolute inset-0 bg-saffron/30 rounded-full blur-2xl scale-125 animate-pulse" />
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-saffron via-saffron-dark to-saffron flex items-center justify-center shadow-2xl ring-4 ring-white/20">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
          </div>

          <p className="text-saffron text-[11px] font-bold tracking-[0.3em] uppercase mb-3">
            تم استلام طلبيتك
          </p>
          <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl mb-3 leading-tight">
            مبروك عليك {customerFirstName} 🎉
          </h1>
          <p className="text-base sm:text-lg text-ivory/85 leading-relaxed max-w-xl mx-auto">
            طلبيتك توصلات بنجاح فأطلس بيور.
            <br className="hidden sm:block" />
            دابا غير خصك تردي على مكالمة التأكيد، وحنا نتكلفو بالباقي.
          </p>

          {orderId && (
            <div className="inline-flex items-center gap-2 mt-5 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full">
              <span className="text-xs text-ivory/70">رقم الطلب:</span>
              <span className="font-mono font-bold text-saffron text-sm tabular-nums">
                #{orderId}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ───── 2. CALL WINDOW BANNER (highest priority) ───── */}
      {callWindow && (
        <section className="px-4 -mt-6 relative z-10">
          <div className="container-max max-w-3xl">
            <div
              className={`rounded-2xl p-5 sm:p-6 shadow-xl border-2 ${
                callWindow.isOpen
                  ? "bg-emerald-50 border-emerald-300"
                  : "bg-saffron/10 border-saffron/40"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center ${
                      callWindow.isOpen
                        ? "bg-emerald-500 text-white"
                        : "bg-saffron text-white"
                    }`}
                  >
                    <Phone className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <span
                    className={`absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full ${callWindow.pulseColor} animate-ping`}
                  />
                  <span
                    className={`absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full ${callWindow.pulseColor}`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${
                        callWindow.isOpen
                          ? "bg-emerald-600 text-white"
                          : "bg-saffron text-white"
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      {callWindow.etaLabel}
                    </span>
                  </div>
                  <h2 className="font-display font-bold text-charcoal text-lg sm:text-xl leading-tight mb-2">
                    {callWindow.title}
                  </h2>
                  <p className="text-charcoal/80 text-sm sm:text-base leading-relaxed">
                    {callWindow.sub}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-charcoal/70 bg-white/60 rounded-lg px-3 py-2">
                    <AlertCircle className="w-4 h-4 text-saffron flex-shrink-0" />
                    <span>
                      المكالمة كتجي من رقم مغربي يبدا بـ{" "}
                      <span className="font-bold tabular-nums text-charcoal">
                        05
                      </span>{" "}
                      أو{" "}
                      <span className="font-bold tabular-nums text-charcoal">
                        06
                      </span>{" "}
                      – ما تحشميش تردي حتى ولو ما عرفتيش الرقم.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ───── 3. ORDER TIMELINE ───── */}
      <section className="px-4 pt-10">
        <div className="container-max max-w-3xl">
          <div className="bg-white rounded-3xl border border-border-soft p-6 md:p-8 shadow-sm">
            <h2 className="font-display font-bold text-xl text-charcoal mb-6 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-teal" />
              شنو غادي يوقع دابا؟
            </h2>

            <ol className="space-y-4">
              {[
                {
                  icon: CheckCircle2,
                  title: "طلبيتك مسجلة",
                  desc: "تم تأكيد استلام طلبك بنجاح",
                  done: true,
                  time: "الآن",
                },
                {
                  icon: Phone,
                  title: "مكالمة التأكيد",
                  desc: "نتاصلو بيك لتأكيد العنوان والمعلومات",
                  done: false,
                  time: callWindow?.etaLabel ?? "قريباً",
                  active: true,
                },
                {
                  icon: PackageCheck,
                  title: "تجهيز وشحن طلبيتك",
                  desc: "كنحضرو طلبيتك بعناية ونرسلوها",
                  done: false,
                  time: "خلال 24 ساعة",
                },
                {
                  icon: Truck,
                  title: "التوصيل ليديك",
                  desc: "كتشدي الأمانة وكتخلصي كاش يد بيد",
                  done: false,
                  time: "2-5 أيام",
                },
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="relative flex-shrink-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step.done
                          ? "bg-teal text-white"
                          : step.active
                          ? "bg-saffron text-white ring-4 ring-saffron/20 animate-pulse"
                          : "bg-sand text-muted"
                      }`}
                    >
                      <step.icon className="w-5 h-5" />
                    </div>
                    {i < 3 && (
                      <div className="absolute right-1/2 top-10 w-0.5 h-6 bg-border-soft translate-x-1/2" />
                    )}
                  </div>
                  <div className="flex-1 pb-2 min-w-0">
                    <div className="flex items-baseline justify-between gap-2 flex-wrap">
                      <h3
                        className={`font-bold leading-tight ${
                          step.done
                            ? "text-charcoal"
                            : step.active
                            ? "text-charcoal"
                            : "text-muted"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <span
                        className={`text-[11px] font-semibold tabular-nums whitespace-nowrap ${
                          step.active ? "text-saffron" : "text-muted"
                        }`}
                      >
                        {step.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted mt-0.5 leading-snug">
                      {step.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ───── 4. CUSTOMER DETAILS — confirm what we have ───── */}
      {order && (
        <section className="px-4 pt-6">
          <div className="container-max max-w-3xl">
            <div className="bg-mist/40 rounded-3xl border border-teal/15 p-5 md:p-6">
              <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-teal mb-3">
                المعلومات اللي عندنا عليك
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="bg-white rounded-2xl p-4 border border-border-soft">
                  <p className="text-[11px] text-muted mb-1 flex items-center gap-1">
                    <ContactRound className="w-3.5 h-3.5" />
                    الاسم
                  </p>
                  <p className="font-bold text-charcoal text-base truncate">
                    {order.customer.full_name}
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-border-soft">
                  <p className="text-[11px] text-muted mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    الهاتف للمكالمة
                  </p>
                  <p className="font-bold text-charcoal text-base tabular-nums" dir="ltr">
                    {formatPhone(order.customer.phone)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs text-charcoal/80 bg-white/70 rounded-xl px-3 py-2.5">
                <AlertCircle className="w-4 h-4 text-saffron flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  إلا كانت شي معلومة غالطة، أرسلي ليها رسالة واتساب فوراً وحنا
                  نصححوها قبل الشحن.
                </p>
              </div>

              <a
                href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(
                  `سلام، عندي تصحيح فطلبيتي رقم #${orderId ?? ""}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-[#25D366] hover:bg-[#1fb955] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                صححي معلومة عبر واتساب
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ───── 5. CLEAN ORDER SUMMARY ───── */}
      {order && (
        <section className="px-4 pt-6">
          <div className="container-max max-w-3xl">
            <div className="bg-white rounded-3xl border border-border-soft overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-border-soft flex items-center justify-between">
                <h2 className="font-display font-bold text-lg text-charcoal flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-teal" />
                  ملخص طلبيتك
                </h2>
                <span className="text-xs text-muted tabular-nums">
                  {order.items.length} منتج
                </span>
              </div>

              <ul className="divide-y divide-border-soft">
                {order.items.map((item, i) => {
                  const product = PRODUCTS.find((p) => p.id === item.product_id);
                  const offerLabel =
                    product?.offers.find((o) => o.offerId === item.offer_id)
                      ?.label || item.offer_id;
                  return (
                    <li key={i} className="flex items-center gap-3 sm:gap-4 px-5 py-4">
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-sand flex-shrink-0">
                        {product && (
                          <Image
                            src={product.images.hero}
                            alt={product.shortName}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-charcoal text-sm sm:text-base truncate leading-tight">
                          {product?.shortName ?? item.product_id}
                        </p>
                        <p className="text-xs text-muted mt-1 leading-snug">
                          {item.unit_count} {item.unit_count === 1 ? "علبة" : "علب"}
                          {" · "}
                          {offerLabel}
                          {item.quantity > 1 ? ` × ${item.quantity}` : ""}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-left">
                        <p className="font-bold text-teal text-base tabular-nums whitespace-nowrap">
                          {formatMAD(item.price * item.quantity)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="bg-ivory px-5 py-4 border-t border-border-soft space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">المجموع الفرعي</span>
                  <span className="font-semibold text-charcoal tabular-nums">
                    {formatMAD(order.total)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" />
                    التوصيل
                  </span>
                  <span className="font-bold text-emerald-700 text-xs uppercase tracking-wide">
                    مجاني
                  </span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border-soft">
                  <span className="font-bold text-charcoal text-sm">
                    تخلصي عند الاستلام
                  </span>
                  <span className="font-extrabold text-teal text-xl tabular-nums">
                    {formatMAD(order.total)}
                  </span>
                </div>
                <p className="text-[11px] text-muted text-center pt-1">
                  💵 ما كتخلصي والو دابا – الدفع كاش يد بيد ملي توصلك الأمانة
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ───── 6. EXCITEMENT — what to expect when product arrives ───── */}
      <section className="px-4 pt-10">
        <div className="container-max max-w-3xl">
          <div className="bg-gradient-to-br from-teal-dark to-teal text-ivory rounded-3xl p-6 md:p-8 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, #B8862F 1px, transparent 0)",
                backgroundSize: "20px 20px",
              }}
            />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-xl bg-saffron/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-saffron" />
                </div>
                <p className="text-saffron text-[11px] font-bold tracking-[0.2em] uppercase">
                  المرحلة الموالية
                </p>
              </div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl mb-3 leading-tight">
                ها شنو غادي تحسي بيه ملي توصلك طلبيتك
              </h2>
              <p className="text-ivory/80 leading-relaxed mb-6">
                المنتجات ديالنا مكونة من تركيبات نباتية مدروسة، وكاينين آلاف
                النساء المغربيات اللي كيشهدوا بالفرق من أول استعمال.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    n: "1",
                    title: "من أول استعمال",
                    desc: "إحساس فوري بالفرق + ثقة كتبدا ترجع",
                  },
                  {
                    n: "2",
                    title: "خلال أسبوع",
                    desc: "نتائج فعّالة + تغيير واضح",
                  },
                  {
                    n: "3",
                    title: "خلال شهر",
                    desc: "نتائج عميقة كتدوم معاك",
                  },
                ].map((s) => (
                  <div
                    key={s.n}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/15"
                  >
                    <div className="w-8 h-8 rounded-full bg-saffron text-white text-sm font-bold flex items-center justify-center mb-3">
                      {s.n}
                    </div>
                    <p className="font-bold text-white text-sm mb-1">{s.title}</p>
                    <p className="text-xs text-ivory/75 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── 7. SAVE OUR NUMBER ───── */}
      <section className="px-4 pt-6">
        <div className="container-max max-w-3xl">
          <div className="bg-white rounded-3xl border border-border-soft p-6 md:p-7 shadow-sm">
            <div className="flex items-start gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-teal/10 text-teal flex items-center justify-center flex-shrink-0">
                <ContactRound className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h2 className="font-display font-bold text-lg text-charcoal leading-tight">
                  زيدي رقمنا فالهاتف ديالك
                </h2>
                <p className="text-sm text-muted mt-1 leading-relaxed">
                  باش ما تفوتيش المكالمة وتعرفي أنه &laquo; أطلس بيور &raquo;
                  هي اللي كتاصل بيك.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={`tel:${SITE_CONFIG.confirmationPhone.replace(/\s/g, "")}`}
                className="flex items-center justify-center gap-2 bg-teal hover:bg-teal-hover text-ivory font-bold text-sm px-5 py-3 rounded-xl transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span dir="ltr" className="tabular-nums">
                  {SITE_CONFIG.confirmationPhone}
                </span>
              </a>
              <a
                href={`https://wa.me/${SITE_CONFIG.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1fb955] text-white font-bold text-sm px-5 py-3 rounded-xl transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                واتساب الدعم
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ───── 8. CROSS-SELL — "while you wait, add to your order" ───── */}
      {crossSell.length > 0 && (
        <section className="px-4 pt-10">
          <div className="container-max max-w-3xl">
            <div className="text-center mb-6">
              <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-saffron mb-2">
                فرصة قبل الشحن
              </p>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-charcoal mb-2 leading-tight">
                كملي روتينك بنفس الطلبية
              </h2>
              <p className="text-sm text-muted max-w-lg mx-auto leading-relaxed">
                ملي يتاصل بيك فريق التأكيد، قولي ليه أنك بغيتي تضيفي هاد
                المنتجات لطلبيتك – غادي يضيفهم بلا توصيل إضافي ولا أي تكلفة.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {crossSell.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className="group bg-white rounded-2xl border border-border-soft hover:border-teal/40 hover:shadow-md transition-all overflow-hidden flex"
                >
                  <div className="relative w-24 sm:w-28 flex-shrink-0 bg-sand">
                    <Image
                      src={p.images.hero}
                      alt={p.shortName}
                      fill
                      className="object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                      sizes="112px"
                    />
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-saffron text-white flex items-center justify-center shadow-md ring-2 ring-white">
                      <Plus className="w-4 h-4" strokeWidth={3} />
                    </div>
                  </div>
                  <div className="flex-1 p-4 min-w-0">
                    <p className="font-bold text-charcoal text-sm leading-tight truncate">
                      {p.shortName}
                    </p>
                    <p className="text-xs text-muted line-clamp-2 mt-1 leading-snug">
                      {p.headline}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-teal text-sm tabular-nums">
                        من {formatMAD(199)}
                      </span>
                      <span className="text-teal text-xs font-bold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                        اكتشفي
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───── 9. SOCIAL PROOF ───── */}
      <section className="px-4 pt-10">
        <div className="container-max max-w-3xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 mb-2">
              <StarRating rating={4.8} />
              <span className="text-sm font-bold text-charcoal">4.8/5</span>
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-charcoal leading-tight">
              زبونات مغربيات اختارو نفس الخطوة ديالك
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {recentReviews.map((review, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 border border-border-soft shadow-sm"
              >
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-3.5 h-3.5 ${
                        idx < review.rating
                          ? "fill-saffron text-saffron"
                          : "text-muted/30"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-charcoal text-xs leading-relaxed mb-3 line-clamp-3">
                  &laquo; {review.text} &raquo;
                </p>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-charcoal truncate">
                    {review.author}
                  </span>
                  {review.city && (
                    <span className="text-muted inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {review.city}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── 10. TRUST STRIP / FINAL REASSURANCE ───── */}
      <section className="px-4 py-10">
        <div className="container-max max-w-3xl">
          <div className="bg-mist/50 rounded-3xl p-6 md:p-7 border border-teal/15">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-saffron via-saffron-dark to-saffron flex items-center justify-center shadow-md ring-4 ring-white">
                  <ShieldCheck className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="text-center sm:text-right flex-1">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-saffron mb-1">
                  الضمان الذهبي
                </p>
                <h3 className="font-display font-bold text-charcoal text-lg leading-tight mb-1">
                  ما عندك ما تخسري
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  ضمان استرجاع 30 يوم • دفع عند الاستلام • توصيل مجاني • تركيبات
                  مصادق عليها (ONSSA)
                </p>
              </div>
            </div>
          </div>

          {/* Bottom actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Link
              href="/products"
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              تصفحي المنتجات
            </Link>
            <Link
              href="/"
              className="btn-secondary flex-1 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              الرئيسية
            </Link>
          </div>

          <p className="text-center text-sm text-muted mt-6">
            عندك سؤال؟{" "}
            <Link
              href="/contact"
              className="text-teal hover:underline font-semibold"
            >
              تواصلي معنا
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
