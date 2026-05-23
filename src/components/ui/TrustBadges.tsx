import { Shield, Truck, Package, Phone, Leaf } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";

const iconMap = {
  shield: Shield,
  truck: Truck,
  package: Package,
  phone: Phone,
  leaf: Leaf,
} as const;

interface TrustBadgesProps {
  variant?: "light" | "dark";
  className?: string;
}

export default function TrustBadges({
  variant = "light",
  className = "",
}: TrustBadgesProps) {
  const isDark = variant === "dark";

  return (
    <div
      className={`relative ${
        isDark
          ? "bg-teal-dark text-ivory"
          : "bg-gradient-to-b from-ivory-2 to-sand/60 text-charcoal"
      } ${className}`}
    >
      {/* Top + bottom gold hairlines */}
      <div aria-hidden className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-saffron/40 to-transparent" />
      <div aria-hidden className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-saffron/40 to-transparent" />

      <div className="container-max py-5 md:py-6">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 md:gap-x-10">
          {SITE_CONFIG.trustBadges.map((badge, i) => {
            const Icon = iconMap[badge.icon as keyof typeof iconMap];
            return (
              <div key={badge.label} className="flex items-center">
                <div
                  className={`flex items-center gap-2.5 transition-all ${
                    isDark ? "" : "hover:text-teal"
                  }`}
                >
                  {Icon && (
                    <span
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isDark
                          ? "bg-white/5 text-saffron"
                          : "bg-white text-teal shadow-soft border border-border-soft"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </span>
                  )}
                  <span className="text-sm font-semibold tracking-wide">
                    {badge.label}
                  </span>
                </div>
                {i < SITE_CONFIG.trustBadges.length - 1 && (
                  <span
                    aria-hidden
                    className={`hidden md:inline-block mx-4 lg:mx-5 w-px h-5 ${
                      isDark ? "bg-white/15" : "bg-border-soft"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
