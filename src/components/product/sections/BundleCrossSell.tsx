"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, ArrowLeft, ShoppingBag } from "lucide-react";
import type { Product } from "@/types/product";
import { formatMAD } from "@/lib/money";
import { useCartStore } from "@/store/cart-store";

interface BundleCrossSellProps {
  primary: Product;
  others: Product[];
}

/**
 * Bundle cross-sell — frames adding another product as a "complete routine"
 * with a (mock) bundle-style discount visual to lift AOV without changing real prices.
 */
export default function BundleCrossSell({
  primary,
  others,
}: BundleCrossSellProps) {
  if (others.length === 0) return null;

  return (
    <section className="section-padding bg-mist/30">
      <div className="container-max">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="divider-gold mb-4 max-w-xs mx-auto">
            <span>كملي روتينك</span>
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-charcoal leading-tight mb-3">
            الروتين الكامل ديال أطلس بيور
          </h2>
          <p className="text-muted leading-relaxed">
            النساء اللي اختارو الروتين الكامل، حسّو بفرق أكبر فأقل وقت.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {others.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-border-soft hover:border-teal/40 hover:shadow-md transition-all overflow-hidden group"
            >
              <div className="flex items-stretch">
                {/* Combined image — current + the cross-sell */}
                <div className="relative w-28 sm:w-32 flex-shrink-0 bg-sand">
                  <Image
                    src={p.images.hero}
                    alt={p.shortName}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-saffron text-white flex items-center justify-center shadow-md ring-2 ring-white">
                    <Plus className="w-4 h-4" strokeWidth={3} />
                  </div>
                </div>

                <div className="flex-1 p-4 flex flex-col">
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-saffron mb-1">
                    أضيفي للروتين
                  </p>
                  <h3 className="font-bold text-charcoal text-base leading-tight mb-1">
                    {p.shortName}
                  </h3>
                  <p className="text-xs text-muted line-clamp-2 mb-3 flex-1">
                    {primary.crossSellText[p.id] ?? p.headline}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <p className="text-[10px] text-muted line-through tabular-nums leading-none">
                        {formatMAD(292)}
                      </p>
                      <p className="font-bold text-teal text-base tabular-nums leading-none mt-1">
                        + {formatMAD(149)}
                      </p>
                    </div>
                      <button
                        onClick={() => {
                          useCartStore.getState().addOffer({
                            productId: p.id,
                            offerId: "cross_sell",
                            quantity: 1,
                            unitCount: 1,
                            price: 149,
                            source: "cart_cross_sell",
                          });
                          useCartStore.getState().openCart();
                        }}
                        className="inline-flex items-center gap-1 text-teal text-xs font-bold hover:gap-2 transition-all bg-teal/10 px-3 py-1.5 rounded-full"
                      >
                      أضيفي للسلة
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
