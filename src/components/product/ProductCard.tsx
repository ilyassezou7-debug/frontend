import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { formatMAD } from "@/lib/money";
import { concernFor } from "@/config/concerns";
import { ArrowLeft, Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
  showFullSelector?: boolean;
  /** Above-the-fold cards load their photo eagerly. */
  priority?: boolean;
}

/**
 * Compact enough for two per row on a phone. Led by the concern the product answers, then the product and its
 * lowest price. No animation library, no pulsing "high demand" dot, no badge repeated over every photo.
 */
export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const fromPrice = Math.min(...product.offers.map((o) => o.price));
  const concern = concernFor(product.slug);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col h-full bg-white rounded-2xl sm:rounded-3xl border border-border-soft overflow-hidden transition-[border-color,box-shadow,transform] duration-300 hover:border-teal/30 hover:shadow-card sm:hover:-translate-y-1"
    >
      <div className="relative aspect-square bg-sand/60 overflow-hidden">
        <Image
          src={product.images.hero}
          alt={product.displayName}
          fill
          priority={priority}
          quality={60}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
        />
        {concern && (
          <span className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/95 text-teal text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-full shadow-soft">
            {concern.label}
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-3 sm:p-5 gap-1.5 sm:gap-2">
        <h3 className="font-display font-bold text-charcoal text-[15px] sm:text-lg leading-snug line-clamp-2 group-hover:text-teal transition-colors">
          {product.name}
        </h3>
        <p className="hidden sm:block text-sm text-muted leading-relaxed line-clamp-2">{product.headline}</p>

        <div className="flex items-center gap-1 text-xs text-muted">
          <Star className="w-3.5 h-3.5 fill-saffron text-saffron" aria-hidden />
          <span className="font-bold text-charcoal tabular-nums">4.8</span>
          <span className="tabular-nums">({product.ratingCount})</span>
        </div>

        <div className="mt-auto pt-2 sm:pt-3 flex items-end justify-between gap-2">
          <p className="leading-none">
            <span className="block text-[10px] sm:text-[11px] text-muted mb-1">ابتداءً من</span>
            <span className="font-display font-bold text-teal text-lg sm:text-2xl tabular-nums">{formatMAD(fromPrice)}</span>
          </p>
          <span
            aria-hidden
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-teal text-ivory flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:-translate-x-1"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
