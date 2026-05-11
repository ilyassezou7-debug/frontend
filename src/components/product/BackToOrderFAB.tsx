"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { Product, OfferId } from "@/types/product";
import OfferSelector from "@/components/product/OfferSelector";
import { formatMAD } from "@/lib/money";

interface BackToOrderFABProps {
  targetId: string;
  product: Product;
  selectedOffer: OfferId;
  onOfferChange: (id: OfferId) => void;
  onAddToCart: () => void;
}

export default function BackToOrderFAB({
  targetId,
  product,
  selectedOffer,
  onOfferChange,
  onAddToCart,
}: BackToOrderFABProps) {
  const [fabVisible, setFabVisible] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const offer = product.offers.find((o) => o.offerId === selectedOffer)!;

  /* Hide FAB while offer block is visible */
  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;
    const obs = new IntersectionObserver(
      ([entry]) => setFabVisible(!entry.isIntersecting),
      { threshold: 0.15 }
    );
    obs.observe(target);
    return () => obs.disconnect();
  }, [targetId]);

  /* Lock body scroll while sheet is open */
  useEffect(() => {
    if (sheetOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheetOpen]);

  function handleOrder() {
    onAddToCart();
    setSheetOpen(false);
  }

  return (
    <>
      {/* ── Floating Action Button ── */}
      <AnimatePresence>
        {fabVisible && (
          <motion.button
            type="button"
            key="fab"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={() => setSheetOpen(true)}
            aria-label="اطلبي الآن – اختاري العرض المناسب"
            className="fixed z-30 left-3 sm:left-5 bottom-24 sm:bottom-28 group"
            style={{ marginBottom: "env(safe-area-inset-bottom)" }}
          >
            {/* Pulse ring */}
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-teal/25 animate-ping pointer-events-none"
              style={{ animationDuration: "2.4s" }}
            />

            {/* Pill */}
            <span className="relative inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-br from-teal to-teal-dark text-ivory font-bold text-xs sm:text-sm pl-2.5 pr-3.5 sm:pl-3 sm:pr-4 py-2.5 sm:py-3 rounded-full shadow-lg shadow-charcoal/25 ring-2 ring-white/40 active:scale-95 transition-transform">
              <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-saffron text-ivory flex items-center justify-center flex-shrink-0 shadow-sm">
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
              </span>
              <span className="whitespace-nowrap">اطلبي الآن</span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Quick Order Bottom Sheet ── */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm"
              onClick={() => setSheetOpen(false)}
              aria-hidden="true"
            />

            {/* Sheet */}
            <motion.div
              key="sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
              className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl flex flex-col"
              style={{ maxHeight: "90dvh", paddingBottom: "env(safe-area-inset-bottom)" }}
              aria-modal="true"
              role="dialog"
              aria-label="اختاري عرضك وأكدي الطلب"
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
                <div className="w-10 h-1 rounded-full bg-border-soft" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-2 pb-4 border-b border-border-soft flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-sand flex-shrink-0">
                    <Image
                      src={product.images.hero}
                      alt={product.shortName}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="text-right">
                    <p className="font-display font-bold text-charcoal text-sm leading-tight">
                      {product.shortName}
                    </p>
                    <p className="text-[11px] text-muted mt-0.5 leading-tight">
                      اختاري الكمية اللي كتناسبك
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSheetOpen(false)}
                  className="w-8 h-8 rounded-full bg-sand hover:bg-border-soft flex items-center justify-center transition-colors flex-shrink-0"
                  aria-label="إغلاق"
                >
                  <X className="w-4 h-4 text-charcoal" />
                </button>
              </div>

              {/* Scrollable offer selector area */}
              <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
                <OfferSelector
                  offers={product.offers}
                  selected={selectedOffer}
                  onChange={onOfferChange}
                />
              </div>

              {/* Sticky buy footer */}
              <div className="flex-shrink-0 border-t border-border-soft bg-white px-5 py-4">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="tabular-nums text-right">
                    <p className="text-[10px] text-muted leading-none mb-1">المجموع</p>
                    <p className="font-display font-extrabold text-2xl text-teal leading-none">
                      {formatMAD(offer.price)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOrder}
                    className="flex-1 flex items-center justify-center gap-2 bg-teal hover:bg-teal-hover text-ivory font-bold text-base px-5 py-3.5 rounded-2xl shadow-lg shadow-teal/20 active:scale-[0.98] transition-all min-h-[52px]"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    أكدي طلبك الآن
                  </button>
                </div>
                <p className="flex items-center justify-center gap-1.5 text-[10px] text-muted text-center">
                  <Sparkles className="w-3 h-3 text-saffron flex-shrink-0" />
                  الدفع عند الاستلام · توصيل مجاني · ضمان 30 يوم
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
