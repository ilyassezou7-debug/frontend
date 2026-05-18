"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, CheckCircle2, ShoppingBag, Truck, Package, Shield, ArrowLeft } from "lucide-react";

const REVIEWS = [
  {
    name: "فاطمة الزهراء",
    city: "الدار البيضاء",
    text: "المنتجات ديالكم رائعة جداً، الجودة كتبان من أول استعمال. شكراً على التوصيل السريع والتعامل الراقي.",
    rating: 5,
    initial: "ف",
  },
  {
    name: "مريم ب.",
    city: "الرباط",
    text: "صراحة أحسن حاجة جربت. روتين يومي مريح والنتيجة زوينة بزاف. غنبقى ديما نتعامل معاكم.",
    rating: 5,
    initial: "م",
  },
  {
    name: "خديجة م.",
    city: "مراكش",
    text: "منتجات طبيعية 100% وهادشي اللي كنت كنقلب عليه. التغليف زوين والتوصيل جا في وقتو.",
    rating: 5,
    initial: "خ",
  },
  {
    name: "سناء",
    city: "طنجة",
    text: "تعامل احترافي ومنتجات في المستوى. كنصح أي وحدة تجربهم مغاديش تندم.",
    rating: 5,
    initial: "س",
  },
  {
    name: "هند ل.",
    city: "أكادير",
    text: "جودة عالية وسعر معقول. وصلني الطلب بسرعة ومغلف مزيان. نتاع الأطلس بيور كاينين!",
    rating: 5,
    initial: "ه",
  },
  {
    name: "نورة",
    city: "فاس",
    text: "مرة استغربت من السرعة! توصل ليا الطلب في يومين فقط. والمنتج جاب المعنى فعلاً.",
    rating: 5,
    initial: "ن",
  },
];

const FAKE_ORDERS = [
  "سلمى من أكادير طلبات باقة العناية اليومية",
  "ليلى من فاس طلبات باقة العناية اليومية",
  "هاجر من وجدة طلبات باقة العناية اليومية",
  "نورة من القنيطرة طلبات باقة العناية اليومية",
  "أسماء من مكناس طلبات باقة العناية اليومية",
  "ريم من الرباط طلبات باقة العناية اليومية",
];

const TRUST_ITEMS = [
  { icon: Shield, label: "منتجات طبيعية 100%" },
  { icon: Truck, label: "توصيل مجاني لكل المغرب" },
  { icon: Package, label: "الدفع عند الاستلام" },
  { icon: CheckCircle2, label: "ضمان الرضا 30 يوم" },
];

const BENEFITS = [
  {
    title: "مكونات من الطبيعة",
    desc: "نختار بعناية أفضل المكونات الطبيعية لضمان عناية آمنة وفعالة في روتينك اليومي.",
  },
  {
    title: "جودة لا تُساوم",
    desc: "كل منتج يمر بمراقبة صارمة قبل أن يصلك، لأننا نعرف أنك تستحقين الأفضل.",
  },
  {
    title: "توصيل سريع لبابك",
    desc: "نوصلك طلبك في 2-5 أيام عمل لجميع مدن المغرب، مجاناً وبدون أي رسوم إضافية.",
  },
];

export default function LandingPageClient() {
  const [currentOrder, setCurrentOrder] = useState<string | null>(null);
  const [showOrder, setShowOrder] = useState(false);

  useEffect(() => {
    const show = () => {
      const order = FAKE_ORDERS[Math.floor(Math.random() * FAKE_ORDERS.length)];
      setCurrentOrder(order);
      setShowOrder(true);
      setTimeout(() => setShowOrder(false), 4500);
    };

    const timer = setTimeout(show, 5000);
    const interval = setInterval(show, 14000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-ivory" dir="rtl">
      <main className="flex-grow">

        {/* ─── Hero ─── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-teal-dark via-teal to-teal/70 text-white">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }}
          />
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 bg-saffron rounded-full animate-pulse" />
              <span>متوفر الآن في جميع مدن المغرب</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display leading-tight mb-6">
              عناية يومية<br />
              <span className="text-saffron">من قلب الطبيعة المغربية</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
              منتجات مستوحاة من أجود مكونات الطبيعة، تقدمها لك علامة أطلس بيور المغربية لروتين يومي أفضل وأرقى.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-saffron hover:bg-saffron/90 text-teal-dark font-bold px-8 py-4 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
            >
              اكتشفي الآن
              <ArrowLeft className="w-5 h-5" />
            </Link>

            {/* Trust pills */}
            <div className="flex flex-wrap justify-center gap-3 mt-10">
              {TRUST_ITEMS.map((item) => (
                <div key={item.label} className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm backdrop-blur-sm">
                  <item.icon className="w-4 h-4 text-saffron flex-shrink-0" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Stats ─── */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-3 divide-x divide-x-reverse divide-gray-100 text-center">
              {[
                { value: "+10,000", label: "عميلة سعيدة" },
                { value: "+3", label: "منتجات مختارة" },
                { value: "30 يوم", label: "ضمان الرضا" },
              ].map((stat) => (
                <div key={stat.label} className="py-2 px-4">
                  <p className="text-3xl font-bold text-teal-dark font-display">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Benefits ─── */}
        <section className="py-20 bg-ivory">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-teal-dark mb-12 font-display">
              لماذا أطلس بيور؟
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {BENEFITS.map((b) => (
                <div key={b.title} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-teal/10 rounded-xl flex items-center justify-center mb-5">
                    <CheckCircle2 className="w-6 h-6 text-teal" />
                  </div>
                  <h3 className="text-lg font-bold text-teal-dark mb-3">{b.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Reviews ─── */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-teal-dark font-display mb-3">
                شنو كيقولو زبوناتنا
              </h2>
              <div className="flex items-center justify-center gap-1 text-saffron">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
                <span className="text-gray-500 text-sm mr-2">(+500 تقييم)</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {REVIEWS.map((review) => (
                <div key={review.name} className="bg-ivory p-6 rounded-2xl border border-gray-100">
                  <div className="flex text-saffron mb-4">
                    {[...Array(review.rating)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-5">
                    &quot;{review.text}&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-teal/10 flex items-center justify-center text-teal font-bold text-sm flex-shrink-0">
                      {review.initial}
                    </div>
                    <div>
                      <p className="font-semibold text-teal-dark text-sm">{review.name}</p>
                      <p className="text-xs text-gray-400">{review.city}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA Banner ─── */}
        <section className="py-20 bg-gradient-to-r from-teal-dark to-teal">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
              جربي الفرق اليوم
            </h2>
            <p className="text-white/80 mb-8 text-lg">
              الدفع عند الاستلام • توصيل مجاني • ضمان 30 يوم
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-white text-teal-dark font-bold px-8 py-4 rounded-2xl text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
            >
              تسوقي الآن
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </section>

      </main>

      {/* ─── Fake Order Notification ─── */}
      <div
        className={`fixed bottom-4 left-4 sm:bottom-8 sm:left-8 bg-white p-4 rounded-2xl shadow-2xl border border-teal/20 flex items-center gap-4 transition-all duration-500 z-50 max-w-xs ${
          showOrder ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <div className="w-10 h-10 bg-teal/10 rounded-full flex items-center justify-center flex-shrink-0">
          <ShoppingBag className="w-5 h-5 text-teal" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">{currentOrder}</p>
          <p className="text-xs text-gray-400 mt-0.5">منذ دقيقتين ✓</p>
        </div>
      </div>
    </div>
  );
}
