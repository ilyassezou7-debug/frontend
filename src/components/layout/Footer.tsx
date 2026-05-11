import Link from "next/link";
import {
  Shield,
  Truck,
  Package,
  Phone,
  Leaf,
  ChevronDown,
  MessageCircle,
  Mail,
  MapPin,
  Sparkles,
  HeartHandshake,
} from "lucide-react";
import { SITE_CONFIG } from "@/config/site";
import BrandMark from "./BrandMark";

const iconMap = {
  shield: Shield,
  truck: Truck,
  package: Package,
  phone: Phone,
  leaf: Leaf,
} as const;

// Brand-promise items used by the marquee strip at the top of the footer.
// Duplicated in JSX to create a seamless infinite scroll.
const PROMISES = [
  { icon: Shield, label: "تركيبة من إعداد صيادلة" },
  { icon: Leaf, label: "مكونات من جبال الأطلس" },
  { icon: Sparkles, label: "مصادق ONSSA" },
  { icon: Truck, label: "توصيل مجاني لكل المغرب" },
  { icon: Package, label: "الدفع عند الاستلام" },
  { icon: HeartHandshake, label: "ضمان النتيجة 30 يوم" },
  { icon: MapPin, label: "صُنع فالمغرب" },
];

function MarqueeRow() {
  return (
    <div className="flex items-center gap-8 py-3 px-2 whitespace-nowrap">
      {PROMISES.map(({ icon: Icon, label }, i) => (
        <span
          key={`${label}-${i}`}
          className="inline-flex items-center gap-2 text-[12px] sm:text-[13px] text-ivory/85 font-medium"
        >
          <Icon className="w-3.5 h-3.5 text-saffron flex-shrink-0" />
          <span>{label}</span>
          <span
            aria-hidden="true"
            className="inline-block w-1 h-1 rounded-full bg-saffron/60 ms-6"
          />
        </span>
      ))}
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-teal-dark text-ivory relative overflow-hidden">
      {/* Decorative gold radial behind the brand block */}
      <div
        aria-hidden="true"
        className="absolute top-32 left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full bg-saffron/[0.06] blur-3xl pointer-events-none"
      />

      {/* ───────────────  TOP: infinite marquee of brand promises  ─────────────── */}
      <div className="relative bg-teal/40 border-y border-saffron/15 overflow-hidden">
        <div className="flex w-max animate-marquee">
          {/* Render twice for seamless loop */}
          <MarqueeRow />
          <MarqueeRow />
        </div>
        {/* Edge fades for elegance */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-teal-dark to-transparent pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-teal-dark to-transparent pointer-events-none"
        />
      </div>

      {/* ───────────────  BRAND HERO  ─────────────── */}
      <div className="relative">
        <div className="container-max py-14 sm:py-16 flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-5">
            <BrandMark size={56} variant="light" />
            <div className="text-right">
              <p className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-wide leading-none">
                أطلس بيور
              </p>
              <p className="text-[10px] sm:text-[11px] text-saffron tracking-[0.25em] uppercase mt-1">
                Pharma · Botanic
              </p>
            </div>
          </div>

          {/* Gold divider with seal label */}
          <div className="flex items-center gap-3 w-full max-w-xs my-2">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-saffron/60 to-transparent" />
            <span className="text-saffron text-[10px] tracking-[0.3em] uppercase">
              Atlas · Pure
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-saffron/60 to-transparent" />
          </div>

          <p className="mt-4 text-saffron text-sm sm:text-base italic font-display tracking-wide">
            « {SITE_CONFIG.tagline} »
          </p>

          <p className="mt-5 max-w-2xl text-ivory/75 text-[13px] sm:text-sm leading-relaxed">
            {SITE_CONFIG.brandShortDescription}
          </p>
        </div>
      </div>

      {/* ───────────────  CONTACT / CONNECT STRIP  ─────────────── */}
      <div className="relative border-y border-teal/40 bg-teal/20">
        <div className="container-max py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-ivory/85">
            <div className="w-9 h-9 rounded-full bg-saffron/15 border border-saffron/30 flex items-center justify-center">
              <Phone className="w-4 h-4 text-saffron" />
            </div>
            <div className="text-right">
              <p className="text-[13px] sm:text-sm font-bold text-white leading-tight">
                عندك سؤال؟ كاينين هنا.
              </p>
              <p className="text-[11px] text-ivory/65 leading-tight mt-0.5">
                فريق الدعم كيجاوب من الإثنين للسبت • 9ص - 7م
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href={`https://wa.me/${SITE_CONFIG.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366]/95 hover:bg-[#25D366] text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-900/20 active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>واتساب</span>
            </a>
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/15 text-ivory font-semibold text-sm px-4 py-2.5 rounded-xl transition-all active:scale-95"
            >
              <Mail className="w-4 h-4" />
              <span dir="ltr" className="text-[12px]">{SITE_CONFIG.email}</span>
            </a>
          </div>
        </div>
      </div>

      {/* ───────────────  TRUST BADGES ROW  ─────────────── */}
      <div className="border-b border-teal/30">
        <div className="container-max py-5">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {SITE_CONFIG.trustBadges.map((badge) => {
              const Icon = iconMap[badge.icon as keyof typeof iconMap];
              return (
                <div
                  key={badge.label}
                  className="inline-flex items-center gap-1.5 text-[11px] sm:text-[12px] text-ivory/80"
                >
                  {Icon && <Icon className="w-3.5 h-3.5 text-saffron" />}
                  <span>{badge.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ───────────────  LINK COLUMNS  ─────────────── */}
      <div className="container-max py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 text-center sm:text-start">
          {/* Products */}
          <div className="border-b border-teal/30 sm:border-none pb-3 sm:pb-0">
            <details className="group">
              <summary className="flex items-center justify-between font-semibold font-display cursor-pointer list-none [&::-webkit-details-marker]:hidden outline-none">
                <span className="text-[15px] sm:text-base text-white">المنتجات</span>
                <ChevronDown className="w-4 h-4 text-ivory/60 transition-transform duration-300 group-open:rotate-180 sm:hidden" />
              </summary>
              <ul className="space-y-2.5 mt-3 text-ivory/70 hidden group-open:block sm:!block">
                {[
                  { href: "/products/breath-drops", label: "قطرات النفس" },
                  { href: "/products/foot-spray", label: "بخاخ القدمين" },
                  { href: "/products/nail-serum", label: "سيروم الأظافر" },
                  { href: "/products", label: "كل المنتجات ←" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover:text-saffron text-[13px] transition-colors block py-0.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          </div>

          {/* Quick links */}
          <div className="border-b border-teal/30 sm:border-none pb-3 sm:pb-0">
            <details className="group">
              <summary className="flex items-center justify-between font-semibold font-display cursor-pointer list-none [&::-webkit-details-marker]:hidden outline-none">
                <span className="text-[15px] sm:text-base text-white">العلامة</span>
                <ChevronDown className="w-4 h-4 text-ivory/60 transition-transform duration-300 group-open:rotate-180 sm:hidden" />
              </summary>
              <ul className="space-y-2.5 mt-3 text-ivory/70 hidden group-open:block sm:!block">
                {[
                  { href: "/about", label: "قصتنا · من نحن" },
                  { href: "/products", label: "البروتوكولات" },
                  { href: "/contact", label: "تواصل معنا" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover:text-saffron text-[13px] transition-colors block py-0.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          </div>

          {/* Legal */}
          <div className="border-b border-teal/30 sm:border-none pb-3 sm:pb-0">
            <details className="group">
              <summary className="flex items-center justify-between font-semibold font-display cursor-pointer list-none [&::-webkit-details-marker]:hidden outline-none">
                <span className="text-[15px] sm:text-base text-white">السياسات</span>
                <ChevronDown className="w-4 h-4 text-ivory/60 transition-transform duration-300 group-open:rotate-180 sm:hidden" />
              </summary>
              <ul className="space-y-2.5 mt-3 text-ivory/70 hidden group-open:block sm:!block">
                {[
                  { href: "/shipping", label: "التوصيل والشحن" },
                  { href: "/returns", label: "الإرجاع وضمان 30 يوم" },
                  { href: "/privacy", label: "الخصوصية" },
                  { href: "/terms", label: "الشروط والأحكام" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover:text-saffron text-[13px] transition-colors block py-0.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          </div>

          {/* Pharmacy seal */}
          <div className="pb-3 sm:pb-0">
            <details className="group">
              <summary className="flex items-center justify-between font-semibold font-display cursor-pointer list-none [&::-webkit-details-marker]:hidden outline-none">
                <span className="text-[15px] sm:text-base text-white">الجودة والثقة</span>
                <ChevronDown className="w-4 h-4 text-ivory/60 transition-transform duration-300 group-open:rotate-180 sm:hidden" />
              </summary>
              <div className="mt-3 hidden group-open:block sm:!block space-y-2.5">
                <div className="inline-flex items-center gap-2 bg-white/5 border border-saffron/20 rounded-lg px-2.5 py-1.5 text-[11px] text-ivory/85">
                  <Sparkles className="w-3.5 h-3.5 text-saffron" />
                  <span>مصادق · ONSSA</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-white/5 border border-saffron/20 rounded-lg px-2.5 py-1.5 text-[11px] text-ivory/85">
                  <Shield className="w-3.5 h-3.5 text-saffron" />
                  <span>تركيبة صيدلانية</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-white/5 border border-saffron/20 rounded-lg px-2.5 py-1.5 text-[11px] text-ivory/85">
                  <MapPin className="w-3.5 h-3.5 text-saffron" />
                  <span>صُنع فالمغرب 🇲🇦</span>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* ───────────────  SIGNATURE BOTTOM  ─────────────── */}
      <div className="border-t border-saffron/15 bg-teal-dark/60">
        <div className="container-max py-6 flex flex-col items-center text-center gap-3">
          {/* Signature poetic line */}
          <p className="font-display italic text-saffron text-[13px] sm:text-sm tracking-wide">
            من قلب جبال الأطلس… ليديك. — بأمان، خصوصية، وثقة.
          </p>

          {/* Tiny gold ornament */}
          <div className="flex items-center gap-2 text-saffron/60">
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-saffron/50" />
            <span className="text-[10px]">◆</span>
            <span className="w-8 h-px bg-gradient-to-l from-transparent to-saffron/50" />
          </div>

          <p className="text-ivory/55 text-[11px] sm:text-[12px]">
            © 2026 أطلس بيور · جميع الحقوق محفوظة · صُنع بحب فالمغرب
          </p>
        </div>
      </div>
    </footer>
  );
}
