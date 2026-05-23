import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import StarRating from "@/components/ui/StarRating";
import { formatMAD } from "@/lib/money";
import { ShoppingBag, BadgeCheck, ArrowLeft } from "lucide-react";

interface ProductCardProps {
  product: Product;
  showFullSelector?: boolean;
}

export default function ProductCard({ product }: ProductCardProps) {
  const basePrice = product.offers[0].price;

  return (
    <div className="group card flex flex-col overflow-hidden relative">
      {/* Gold corner accents — appear on hover */}
      <span aria-hidden className="pointer-events-none absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-saffron/0 group-hover:border-saffron/70 rounded-tl-xl transition-colors duration-300 z-20" />
      <span aria-hidden className="pointer-events-none absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-saffron/0 group-hover:border-saffron/70 rounded-br-xl transition-colors duration-300 z-20" />

      {/* Product image */}
      <Link href={`/products/${product.slug}`} className="block relative">
        <div className="relative aspect-square bg-gradient-to-br from-sand to-mist/60 overflow-hidden">
          <Image
            src={product.images.hero}
            alt={product.displayName}
            fill
            className="object-cover group-hover:scale-[1.06] transition-transform duration-[600ms] ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 380px"
          />
          {/* Subtle vignette */}
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-charcoal/15 via-transparent to-transparent pointer-events-none" />

          {/* ONSSA badge */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-teal text-[10px] font-extrabold px-2.5 py-1.5 rounded-full shadow-soft flex items-center gap-1.5 z-10 border border-teal/15">
            <BadgeCheck className="w-3.5 h-3.5" />
            مصادق عليها (ONSSA)
          </div>
        </div>
      </Link>

      <div className="p-5 sm:p-6 flex flex-col flex-1 gap-3">
        {/* Name & rating */}
        <div>
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-bold text-charcoal font-display text-lg leading-snug group-hover:text-teal transition-colors">
              {product.displayName}
            </h3>
          </Link>
          <div className="flex items-center gap-2 mt-1.5">
            <StarRating rating={4.8} size="sm" />
            <span className="text-xs text-muted tabular-nums">(4.8/5)</span>
          </div>
        </div>

        {/* Headline */}
        <p className="text-sm text-muted leading-relaxed line-clamp-2">
          {product.headline}
        </p>

        {/* Price row */}
        <div className="flex items-baseline justify-between mt-1 pt-3 border-t border-border-soft/70">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[11px] text-muted">ابتداءً من</span>
            <span className="font-display font-extrabold text-teal text-2xl tabular-nums">
              {formatMAD(basePrice)}
            </span>
          </div>
          <span className="text-[10px] font-semibold text-saffron uppercase tracking-wider">
            COD
          </span>
        </div>

        {/* Scarcity */}
        <p className="text-xs text-saffron font-semibold inline-flex items-center gap-1.5">
          <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-saffron animate-pulse" />
          الطلبات كتيجي بزاف — التوصيل خلال 2-5 أيام
        </p>

        {/* CTA */}
        <Link
          href={`/products/${product.slug}`}
          className="btn-primary w-full mt-auto group/cta"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>تسوقي الآن</span>
          <ArrowLeft className="w-4 h-4 -mr-1 opacity-70 group-hover/cta:-translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
