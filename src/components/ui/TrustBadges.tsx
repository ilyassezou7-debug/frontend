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
  const bg = variant === "light" ? "bg-sand" : "bg-teal-dark";
  const text = variant === "light" ? "text-charcoal" : "text-ivory";
  const iconColor = variant === "light" ? "text-teal" : "text-saffron";

  return (
    <div className={`${bg} ${className}`}>
      <div className="container-max py-4">
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          {SITE_CONFIG.trustBadges.map((badge) => {
            const Icon = iconMap[badge.icon as keyof typeof iconMap];
            return (
              <div
                key={badge.label}
                className="flex items-center gap-2"
              >
                {Icon && (
                  <Icon className={`w-5 h-5 flex-shrink-0 ${iconColor}`} />
                )}
                <span className={`text-sm font-medium ${text}`}>
                  {badge.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
