"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Star, CheckCircle2, ShoppingBag } from "lucide-react";

const REVIEWS = [
  {
    name: "فاطمة الزهراء",
    city: "الدار البيضاء",
    text: "المنتجات ديالكم رائعة جداً، الجودة كتبان من أول استعمال. شكراً على التوصيل السريع والتعامل الراقي.",
    rating: 5,
  },
  {
    name: "مريم",
    city: "الرباط",
    text: "صراحة أحسن حاجة جربت. روتين يومي مريح والنتيجة زوينة بزاف. غنبقى ديما نتعامل معاكم.",
    rating: 5,
  },
  {
    name: "خديجة",
    city: "مراكش",
    text: "شكراً أطلس بيور، منتجات طبيعية 100% وهادشي اللي كنت كنقلب عليه. التغليف زوين بزاف.",
    rating: 5,
  },
  {
    name: "سناء",
    city: "طنجة",
    text: "تعامل احترافي ومنتجات في المستوى. كنصح أي وحدة تجربهم مغاديش تندم.",
    rating: 5,
  }
];

const FAKE_ORDERS = [
  "سلمى من أكادير اشترت باقة العناية",
  "ليلى من فاس اشترت باقة العناية",
  "هاجر من وجدة اشترت باقة العناية",
  "نورة من القنيطرة اشترت باقة العناية",
  "أسماء من مكناس اشترت باقة العناية"
];

export default function LandingPage() {
  const [currentOrder, setCurrentOrder] = useState<string | null>(null);
  const [showOrder, setShowOrder] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomOrder = FAKE_ORDERS[Math.floor(Math.random() * FAKE_ORDERS.length)];
      setCurrentOrder(randomOrder);
      setShowOrder(true);
      
      setTimeout(() => {
        setShowOrder(false);
      }, 4000);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-teal-dark mb-6 font-display leading-tight">
            العناية الطبيعية اللي كتقلبي عليها
          </h1>
          <p className="text-lg sm:text-xl text-charcoal/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            اكتشفي سر الجمال الطبيعي مع منتجاتنا المستوحاة من الطبيعة المغربية. جودة عالية وعناية يومية تليق بك.
          </p>
          <div className="relative w-full max-w-4xl mx-auto aspect-video sm:aspect-[2/1] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            <Image
              src="/images/hero-bg.jpg" // Fallback to a generic image or placeholder
              alt="العناية الطبيعية"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-teal-dark/10"></div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "مكونات طبيعية", desc: "نختار أفضل المكونات من الطبيعة لعناية آمنة." },
                { title: "جودة عالية", desc: "نحرص على تقديم أعلى معايير الجودة في كل تفصيلة." },
                { title: "توصيل سريع", desc: "نوصل طلبك لباب الدار في جميع مدن المغرب." }
              ].map((benefit, i) => (
                <div key={i} className="text-center p-6 rounded-2xl bg-ivory border border-border-soft">
                  <div className="w-12 h-12 bg-teal/10 text-teal rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-teal-dark mb-2">{benefit.title}</h3>
                  <p className="text-charcoal/70">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="py-20 bg-mist/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-teal-dark mb-12 font-display">
              شنو كيقولو زبوناتنا
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {REVIEWS.map((review, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-border-soft">
                  <div className="flex text-saffron mb-4">
                    {[...Array(review.rating)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-charcoal/80 mb-4 text-sm leading-relaxed">
                    &quot;{review.text}&quot;
                  </p>
                  <div className="mt-auto">
                    <p className="font-bold text-teal-dark text-sm">{review.name}</p>
                    <p className="text-xs text-charcoal/50">{review.city}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Fake Order Notification */}
      <div 
        className={`fixed bottom-4 left-4 sm:bottom-8 sm:left-8 bg-white p-4 rounded-xl shadow-2xl border border-teal/20 flex items-center gap-4 transition-all duration-500 z-50 max-w-sm ${
          showOrder ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
        }`}
      >
        <div className="w-10 h-10 bg-teal/10 rounded-full flex items-center justify-center flex-shrink-0">
          <ShoppingBag className="w-5 h-5 text-teal" />
        </div>
        <div>
          <p className="text-sm font-medium text-charcoal">{currentOrder}</p>
          <p className="text-xs text-charcoal/50 mt-1">منذ دقيقتين</p>
        </div>
      </div>
    </div>
  );
}
