"use client";

import { useEffect, useState } from "react";
import { Truck, Banknote, ShieldCheck, Leaf, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";

const MESSAGES = [
  {
    icon: Truck,
    text: "توصيل مجاني لجميع مدن المغرب 🇲🇦",
  },
  {
    icon: Banknote,
    text: "الدفع عند الاستلام • بلا بطاقة بنكية",
  },
  {
    icon: ShieldCheck,
    text: "ضمان 30 يوم • الفلوس كترجع إلا ما عجباكش",
  },
  {
    icon: Leaf,
    text: "تركيبة من إعداد صيادلة • مصادقة ONSSA",
  },
  {
    icon: Sparkles,
    text: "نتائج محسوسة من أول أسبوع استعمال",
  },
] as const;

const ROTATE_MS = 3800;
const FADE_MS = 380;

export default function AnnouncementBar() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduceMotion) return;
    }

    const interval = setInterval(() => {
      setVisible(false);
      const swap = setTimeout(() => {
        setIdx((i) => (i + 1) % MESSAGES.length);
        setVisible(true);
      }, FADE_MS);
      return () => clearTimeout(swap);
    }, ROTATE_MS);

    return () => clearInterval(interval);
  }, []);

  const current = MESSAGES[idx];
  const Icon = current.icon;

  return (
    <div
      className="bg-gradient-to-l from-teal-dark via-teal to-teal-dark text-white border-b border-teal-dark/40 shadow-inner"
      role="region"
      aria-label="إشعارات الموقع"
      aria-live="polite"
    >
      <div className="relative max-w-7xl mx-auto px-4 py-2 sm:py-2.5 min-h-[2.25rem] sm:min-h-[2.5rem] flex items-center justify-center">
        {/* Left gold dot */}
        <span className="hidden sm:block absolute right-4 w-1.5 h-1.5 rounded-full bg-saffron animate-pulse" />

        <p
          className={cn(
            "font-bold tracking-wide text-[12px] sm:text-sm flex items-center justify-center gap-2 text-center",
            "transition-opacity ease-out",
            visible ? "opacity-100" : "opacity-0"
          )}
          style={{ transitionDuration: `${FADE_MS}ms` }}
        >
          <Icon
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-saffron flex-shrink-0"
            strokeWidth={2.5}
          />
          <span>{current.text}</span>
        </p>

        {/* Right gold dot */}
        <span className="hidden sm:block absolute left-4 w-1.5 h-1.5 rounded-full bg-saffron animate-pulse" />

        {/* Indicator dots */}
        <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex items-center gap-1">
          {MESSAGES.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-[2px] rounded-full transition-all duration-300",
                i === idx ? "w-3 bg-saffron" : "w-1 bg-white/30"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
