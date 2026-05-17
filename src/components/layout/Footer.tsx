import Link from "next/link";
import { Shield, Truck, Package, Phone, Leaf, ChevronDown } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";
import Image from "next/image";

const iconMap = {
  shield: Shield,
  truck: Truck,
  package: Package,
  phone: Phone,
  leaf: Leaf,
} as const;

export default function Footer({ isSoftPage = false }: { isSoftPage?: boolean }) {
  const description = isSoftPage 
    ? "أطلس بيور علامة مغربية تقدم منتجات طبيعية عالية الجودة، مستوحاة من طبيعة المغرب، لروتين يومي أفضل."
    : SITE_CONFIG.brandShortDescription;
    
  const badges = isSoftPage
    ? SITE_CONFIG.trustBadges.filter(b => !b.label.includes("صيادلة") && !b.label.includes("ONSSA"))
    : SITE_CONFIG.trustBadges;

  return (
    <footer className="bg-teal-dark text-ivory">
      {/* Brand Top Section */}
      <div className="border-b border-teal/30">
        <div className="container-max py-12 flex flex-col items-center justify-center text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mb-5">
            <Image 
              src="/logo.png" 
              alt="Atlas Pure Logo" 
              width={64} 
              height={64} 
              className="object-contain"
            />
            <div className="flex flex-col items-center sm:items-start text-center sm:text-start">
              <p className="font-bold text-3xl sm:text-2xl font-display text-white tracking-wide">
                أطلس بيور
              </p>
            </div>
          </div>
          <p className="max-w-2xl text-ivory/75 text-sm leading-relaxed">
            {description}
          </p>
          {!isSoftPage && (
            <p className="mt-4 text-saffron text-xs italic tracking-wide">
              « {SITE_CONFIG.tagline} »
            </p>
          )}
        </div>
      </div>

      {/* Trust badges row */}
      <div className="border-b border-teal/30">
        <div className="container-max py-6 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-6">
            {badges.map((badge) => {
              const Icon = iconMap[badge.icon as keyof typeof iconMap];
              return (
                <div key={badge.label} className="flex flex-row-reverse sm:flex-row items-center justify-between sm:justify-center w-full sm:w-auto bg-white/5 sm:bg-transparent p-4 sm:p-0 rounded-xl sm:rounded-none gap-3 sm:gap-2">
                  {Icon && <Icon className="w-5 h-5 sm:w-4 sm:h-4 text-saffron flex-shrink-0" />}
                  <span className="text-sm font-medium sm:font-normal text-right flex-1 sm:flex-none">{badge.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container-max py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center sm:text-start">
          {/* Products */}
          {!isSoftPage && (
          <div className="border-b border-teal/30 sm:border-none pb-4 sm:pb-0">
            <details className="group">
              <summary className="flex items-center justify-between font-semibold font-display cursor-pointer list-none [&::-webkit-details-marker]:hidden outline-none">
                <span className="text-lg">المنتجات</span>
                <ChevronDown className="w-5 h-5 text-ivory/60 transition-transform duration-300 group-open:rotate-180 sm:hidden" />
              </summary>
              <ul className="space-y-3 mt-4 text-ivory/75 hidden group-open:block sm:!block">
                {[
                  { href: "/products/breath-drops", label: "قطرات النفس" },
                  { href: "/products/foot-spray", label: "بخاخ القدمين" },
                  { href: "/products/nail-serum", label: "سيروم الأظافر" },
                  { href: "/products", label: "عرض كل المنتجات" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover:text-ivory text-sm transition-colors block py-1 sm:py-0"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          </div>
          )}

          {/* Quick links */}
          <div className="border-b border-teal/30 sm:border-none pb-4 sm:pb-0">
            <details className="group">
              <summary className="flex items-center justify-between font-semibold font-display cursor-pointer list-none [&::-webkit-details-marker]:hidden outline-none">
                <span className="text-lg">روابط سريعة</span>
                <ChevronDown className="w-5 h-5 text-ivory/60 transition-transform duration-300 group-open:rotate-180 sm:hidden" />
              </summary>
              <ul className="space-y-3 mt-4 text-ivory/75 hidden group-open:block sm:!block">
                {[
                  { href: "/about", label: "من نحن" },
                  { href: "/contact", label: "تواصل معنا" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover:text-ivory text-sm transition-colors block py-1 sm:py-0"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          </div>

          {/* Legal links */}
          <div className="border-b border-teal/30 sm:border-none pb-4 sm:pb-0">
            <details className="group">
              <summary className="flex items-center justify-between font-semibold font-display cursor-pointer list-none [&::-webkit-details-marker]:hidden outline-none">
                <span className="text-lg">سياسات</span>
                <ChevronDown className="w-5 h-5 text-ivory/60 transition-transform duration-300 group-open:rotate-180 sm:hidden" />
              </summary>
              <ul className="space-y-3 mt-4 text-ivory/75 hidden group-open:block sm:!block">
                {[
                  { href: "/privacy", label: "سياسة الخصوصية" },
                  { href: "/shipping", label: "سياسة التوصيل والشحن" },
                  { href: "/returns", label: "سياسة الإرجاع" },
                  { href: "/terms", label: "الشروط والأحكام" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover:text-ivory text-sm transition-colors block py-1 sm:py-0"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          </div>

          {/* Support */}
          <div className="border-b border-teal/30 sm:border-none pb-4 sm:pb-0">
            <details className="group">
              <summary className="flex items-center justify-between font-semibold font-display cursor-pointer list-none [&::-webkit-details-marker]:hidden outline-none">
                <span className="text-lg">الدعم</span>
                <ChevronDown className="w-5 h-5 text-ivory/60 transition-transform duration-300 group-open:rotate-180 sm:hidden" />
              </summary>
              <div className="mt-4 hidden group-open:block sm:!block">
                <p className="text-ivory/75 text-sm mb-3">نحن هنا للإجابة على استفساراتكم:</p>
                <a href={`mailto:${SITE_CONFIG.email}`} className="inline-flex items-center gap-2 text-ivory/90 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-sm border border-white/10">
                  <Phone className="w-4 h-4" />
                  <span dir="ltr">{SITE_CONFIG.email}</span>
                </a>
              </div>
            </details>
          </div>
        </div>

        <div className="border-t border-teal/30 mt-8 pt-6 text-center">
          <p className="text-ivory/60 text-sm">
            جميع الحقوق محفوظة © 2026 أطلس بيور
          </p>
        </div>
      </div>
    </footer>
  );
}
