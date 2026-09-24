"use client";

import { useEffect, useState } from "react";
import { ListChecks, Timer, Truck, ShieldCheck, Banknote } from "lucide-react";
import type { OfferId, Product } from "@/types/product";
import OfferSelector from "@/components/product/OfferSelector";
import StickyBuyBar from "@/components/product/StickyBuyBar";
import { formatMAD } from "@/lib/money";
import { trackViewContent } from "@/lib/tracking";
import { generateEventId } from "@/lib/event-id";
import { buyNow } from "@/lib/buy-now";

/** Only the fields the buy box needs - the page's long-form copy stays on the server and never reaches the phone as JS. */
export type BuyBoxProduct = Pick<Product, "id" | "shortName" | "offers" | "offerNudge"> & { images: { hero: string } };

/**
 * The one interactive island of the product page: offer picker, price, the buy button and the sticky bar that shares
 * the chosen offer. Everything else on the page is server-rendered HTML.
 */
export default function BuyBox({ product, offerBlockId }: { product: BuyBoxProduct; offerBlockId: string }) {
  const [selectedOffer, setSelectedOffer] = useState<OfferId>("two");

  useEffect(() => {
    const singlePrice = product.offers.find((o) => o.offerId === "one")?.price ?? product.offers[0]?.price ?? 0;
    trackViewContent(product.id, singlePrice, generateEventId());
  }, [product.id, product.offers]);

  const offer = product.offers.find((o) => o.offerId === selectedOffer)!;

  // Straight to the name + phone form (the cart drawer used to sit in between)
  function handleBuy() {
    buyNow(product, offer);
  }

  return (
    <>
      {/* Offer Selector */}
      <div id="offer-select">
        <p className="font-semibold text-charcoal mb-3">
          اختر الكمية:
        </p>
        <OfferSelector
          offers={product.offers}
          selected={selectedOffer}
          onChange={setSelectedOffer}
        />
      </div>

      {/* Offer nudge */}
      <p className="text-base text-saffron font-semibold bg-saffron/10 rounded-xl px-5 py-4 border border-saffron/20 leading-relaxed shadow-sm">
        ⚡ {product.offerNudge}
      </p>

      {/* ───────── HOW-TO-ORDER MINI GUIDE ───────── */}
      <div className="bg-white border border-border-soft rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between gap-2 px-4 pt-3.5 pb-2 border-b border-border-soft/70">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal/10 flex items-center justify-center">
              <ListChecks className="w-4 h-4 text-teal" />
            </div>
            <p className="font-display font-bold text-sm text-charcoal">
              كيف تطلب — 3 خطوات فقط
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal bg-teal/10 px-2 py-1 rounded-full">
            <Timer className="w-3 h-3" />
            أقل من دقيقة
          </span>
        </div>

        <ol className="grid grid-cols-3 gap-0 p-3">
          {[
            {
              n: 1,
              title: "اختر الكمية",
              sub: "العرض المناسب",
              tone: "teal" as const,
            },
            {
              n: 2,
              title: "اسمك ورقمك",
              sub: "حقلان فقط",
              tone: "teal" as const,
            },
            {
              n: 3,
              title: "ادفع عند الباب",
              sub: "بدون بطاقة",
              tone: "saffron" as const,
            },
          ].map((step, i, arr) => (
            <li
              key={step.n}
              className={`relative flex flex-col items-center text-center px-1.5 ${
                i < arr.length - 1
                  ? "after:content-[''] after:absolute after:top-4 after:left-0 after:w-[calc(50%-1rem)] after:h-px after:border-t after:border-dashed after:border-teal/30"
                  : ""
              } ${
                i > 0
                  ? "before:content-[''] before:absolute before:top-4 before:right-0 before:w-[calc(50%-1rem)] before:h-px before:border-t before:border-dashed before:border-teal/30"
                  : ""
              }`}
            >
              <div
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px] shadow-sm ring-2 ring-white tabular-nums ${
                  step.tone === "saffron"
                    ? "bg-saffron text-ivory"
                    : "bg-teal text-ivory"
                }`}
              >
                {step.n}
              </div>
              <p className="text-[11px] font-bold text-charcoal leading-tight mt-2">
                {step.title}
              </p>
              <p className="text-[10px] text-muted leading-tight mt-0.5">
                {step.sub}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {/* ───────── PRIMARY CTA ───────── */}
      {/* Single unified CTA for mobile + desktop. The price is shown
          prominently above, the button copy commits to the action. */}
      <div className="space-y-3">
        <div className="flex items-baseline justify-between gap-3 px-1">
          <div className="flex items-baseline gap-2 tabular-nums">
            <span className="text-[11px] text-muted">المجموع:</span>
            <span className="font-display font-extrabold text-2xl text-teal">
              {formatMAD(offer.price)}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/70 rounded-full px-2.5 py-1 inline-flex items-center gap-1">
            <Truck className="w-3 h-3" />
            التوصيل مجاني
          </span>
        </div>

        <button
          onClick={handleBuy}
          className="btn-primary btn-shimmer-gold w-full text-lg md:text-xl py-4 md:py-5 min-h-[60px] md:min-h-[64px] rounded-2xl"
        >
          <span>اطلب الآن</span>
          <span className="text-ivory/60 font-normal">·</span>
          <span className="text-ivory/90 font-semibold text-base md:text-lg">الدفع عند الاستلام</span>
        </button>

        <p className="text-center text-[11px] text-muted leading-relaxed">
          بضغطة واحدة نُجهّز لك طلبك · بدون تسجيل · بدون بطاقة بنكية
        </p>

        <div className="flex items-center justify-center gap-x-4 gap-y-1 flex-wrap text-[11px] text-muted pt-1">
          <span className="inline-flex items-center gap-1">
            <Banknote className="w-3.5 h-3.5 text-teal" />
            الدفع عند الاستلام
          </span>
          <span className="text-border-soft">•</span>
          <span className="inline-flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-teal" />
            توصيل مجاني
          </span>
          <span className="text-border-soft">•</span>
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal" />
            ضمان 30 يوم
          </span>
        </div>
      </div>

      <StickyBuyBar product={product} selectedOffer={selectedOffer} targetId={offerBlockId} onBuy={handleBuy} />
    </>
  );
}
