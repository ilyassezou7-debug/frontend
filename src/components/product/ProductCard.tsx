"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import StarRating from "@/components/ui/StarRating";
import { formatMAD } from "@/lib/money";
import { ShoppingBag, BadgeCheck } from "lucide-react";

interface ProductCardProps {
  product: Product;
  showFullSelector?: boolean;
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  const basePrice = product.offers[0].price;

  return (
    <div className="card flex flex-col overflow-hidden">
      {/* Product image */}
      <Link href={`/products/${product.slug}`} className="block relative">
        <div className="relative aspect-square bg-sand overflow-hidden">
          <Image
            src={product.images.hero}
            alt={product.displayName}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 380px"
          />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-teal text-[10px] font-bold px-2.5 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 z-10 border border-teal/10">
            <BadgeCheck className="w-3.5 h-3.5" />
            مصادق عليها (ONSSA)
          </div>
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Name & rating */}
        <div>
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-bold text-charcoal font-display text-base leading-snug hover:text-teal transition-colors">
              {product.displayName}
            </h3>
          </Link>
          <div className="flex items-center gap-2 mt-1.5">
            <StarRating rating={4.8} size="sm" />
            <span className="text-xs text-muted">(4.8/5)</span>
          </div>
        </div>

        {/* Headline */}
        <p className="text-sm text-muted leading-relaxed line-clamp-2">
          {product.headline}
        </p>

        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-teal text-lg">
            ابتداءً من {formatMAD(basePrice)}
          </span>
        </div>

        {/* Scarcity */}
        <p className="text-xs text-saffron font-medium">
          ⚡ الطلبات كتيجي بزاف – التوصيل خلال 2-5 أيام
        </p>

        {/* CTA */}
        <Link
          href={`/products/${product.slug}`}
          className="btn-primary w-full flex items-center justify-center gap-2 mt-auto"
        >
          <ShoppingBag className="w-4 h-4" />
          تسوقي الآن
        </Link>
      </div>
    </div>
  );
}
