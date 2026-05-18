"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Minus, Plus, Trash2, ShoppingBag, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import { PRODUCTS } from "@/config/products";
import { formatMAD } from "@/lib/money";
import { trackInitiateCheckout } from "@/lib/tracking";
import { generateEventId } from "@/lib/event-id";
import type { ProductId } from "@/types/product";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  onCheckout,
}: CartDrawerProps) {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const decrementItem = useCartStore((s) => s.decrementItem);
  const addOffer = useCartStore((s) => s.addOffer);
  const getTotal = useCartStore((s) => s.getTotal);

  const total = getTotal();

  // Radix UI Dialog automatically handles body scroll locking, 
  // so we don't need manual overflow manipulation here.

  function handleQuantityChange(
    productId: string,
    offerId: string,
    price: number,
    unitCount: number,
    delta: number
  ) {
    if (delta > 0) {
      addOffer({
        productId,
        offerId,
        quantity: 1,
        unitCount,
        price,
        source: "collection",
      });
    } else {
      decrementItem(productId, offerId);
    }
  }

  function handleCheckout() {
    const eventId = generateEventId();
    trackInitiateCheckout(total, eventId);
    onClose();
    // Delay opening checkout modal slightly to allow cart drawer to start closing smoothly
    setTimeout(() => {
      onCheckout();
    }, 150);
  }

  // Cross-sell products: items not in cart
  const cartProductIds = items.map((i) => i.productId as ProductId);
  const crossSellProducts = PRODUCTS.filter(
    (p) => !cartProductIds.includes(p.id)
  ).slice(0, 2);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            {/* Overlay */}
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm"
                onClick={onClose}
              />
            </Dialog.Overlay>

            {/* Drawer */}
            <Dialog.Content asChild>
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 h-full w-full max-w-md z-50 bg-ivory flex flex-col shadow-2xl"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-border-soft">
                  <Dialog.Title className="font-bold text-xl text-charcoal font-display flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-teal" />
                    سلتك
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl hover:bg-sand transition-colors"
                    aria-label="إغلاق"
                  >
                    <X className="w-5 h-5 text-charcoal" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                  {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-4 px-5">
                      <ShoppingBag className="w-16 h-16 text-border-soft" />
                      <p className="text-muted text-center">
                        السلة فارغة. اختاري منتجاتك وارجعي هنا.
                      </p>
                      <button onClick={onClose} className="btn-primary px-8">
                        تصفحي المنتجات
                      </button>
                    </div>
                  ) : (
                    <div className="p-5 space-y-4">
                      {/* Cart items */}
                      {items.map((item) => {
                        const product = PRODUCTS.find(
                          (p) => p.id === item.productId
                        );
                        if (!product) return null;
                        const offer = product.offers.find(
                          (o) => o.offerId === item.offerId
                        );

                        return (
                          <div
                            key={`${item.productId}-${item.offerId}`}
                            className="bg-white rounded-2xl p-4 border border-border-soft flex gap-3"
                          >
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-sand flex-shrink-0 relative">
                              <Image
                                src={product.images.hero}
                                alt={product.shortName}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-charcoal text-sm leading-snug">
                                {product.shortName}
                              </p>
                              <p className="text-xs text-muted mt-0.5">
                                {offer?.quantity} قطعة × {offer?.label}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="font-bold text-teal">
                                  {formatMAD(item.price * item.quantity)}
                                </span>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() =>
                                      handleQuantityChange(
                                        item.productId,
                                        item.offerId,
                                        item.price,
                                        item.unitCount,
                                        -1
                                      )
                                    }
                                    className="w-7 h-7 rounded-lg bg-sand hover:bg-border-soft flex items-center justify-center transition-colors"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="w-6 text-center text-sm font-semibold">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleQuantityChange(
                                        item.productId,
                                        item.offerId,
                                        item.price,
                                        item.unitCount,
                                        1
                                      )
                                    }
                                    className="w-7 h-7 rounded-lg bg-sand hover:bg-border-soft flex items-center justify-center transition-colors"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      removeItem(item.productId, item.offerId)
                                    }
                                    className="w-7 h-7 rounded-lg hover:bg-red-50 text-muted hover:text-red-500 flex items-center justify-center transition-colors mr-1"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {/* Cross-sells */}
                      {crossSellProducts.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-semibold text-charcoal mb-3">
                            قد يعجبك أيضاً
                          </p>
                          <div className="space-y-2">
                            {crossSellProducts.map((p) => {
                              const crossText =
                                cartProductIds.length > 0
                                  ? p.crossSellText[cartProductIds[0]]
                                  : undefined;
                              return (
                                <button
                                  key={p.id}
                                  onClick={() => {
                                    addOffer({
                                      productId: p.id,
                                      offerId: "cross_sell",
                                      quantity: 1,
                                      unitCount: 1,
                                      price: 149,
                                      source: "cart_cross_sell",
                                    });
                                  }}
                                  className="flex items-center gap-3 bg-white rounded-xl p-3 border border-border-soft hover:border-teal/40 transition-colors w-full text-right text-right"
                                >
                                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-sand flex-shrink-0 relative">
                                    <Image
                                      src={p.images.hero}
                                      alt={p.shortName}
                                      fill
                                      className="object-cover"
                                      sizes="48px"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-charcoal">
                                      {p.shortName}
                                    </p>
                                    {crossText && (
                                      <p className="text-xs text-muted leading-snug mt-0.5 line-clamp-1">
                                        {crossText}
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex flex-col items-end">
                                    <span className="text-[10px] text-muted line-through">
                                      {formatMAD(292)}
                                    </span>
                                    <span className="text-xs font-bold text-teal flex-shrink-0">
                                      + {formatMAD(149)}
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                  <div className="border-t border-border-soft p-5 space-y-3 bg-white">
                    <div className="flex items-center justify-between text-sm text-muted">
                      <span>التوصيل</span>
                      <span className="text-teal font-semibold">مجاني</span>
                    </div>
                    <div className="flex items-center justify-between font-bold text-lg">
                      <span className="text-charcoal">المجموع</span>
                      <span className="text-teal">{formatMAD(total)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted bg-sand rounded-xl px-3 py-2">
                      <Lock className="w-3.5 h-3.5 flex-shrink-0 text-teal" />
                      الدفع عند الاستلام، بلا بطاقة بنكية
                    </div>

                    <button
                      onClick={handleCheckout}
                      className="btn-primary w-full text-base"
                    >
                      إتمام الطلب – الدفع عند الاستلام
                    </button>
                  </div>
                )}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
