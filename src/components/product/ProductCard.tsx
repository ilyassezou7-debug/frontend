"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import StarRating from "@/components/ui/StarRating";
import { formatMAD } from "@/lib/money";
import { ShoppingBag } from "lucide-react";

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
            className="object-cover hover:scale-105 transition-transform duration-300 opacity-40"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Image content placeholder description */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10 pointer-events-none">
            <div className="bg-white/85 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-white/50 max-w-[85%]">
              <p className="text-charcoal font-bold text-sm leading-relaxed">
                {product.id === "breath_drops" && "صورة جذابة لقطرات النفس مع أوراق النعناع والقرنفل في خلفية نقية توحي بالانتعاش والثقة."}
                {product.id === "foot_spray" && "صورة لبخاخ القدمين مع لمسات من زيت شجرة الشاي والشبة، في بيئة مريحة توحي بالنظافة."}
                {product.id === "nail_serum" && "صورة لسيروم الأظافر تبرز نقاء السيروم مع مكونات طبيعية كالثوم وخل التفاح."}
              </p>
            </div>
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
