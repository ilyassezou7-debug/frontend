"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Minus, Plus, Trash2, ShoppingBag, Lock, Gift, Sparkles, ArrowLeft, TrendingUp } from "lucide-react";
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

  // Urgent countdown timer for cross-sell (5 minutes)
  const [timeLeft, setTimeLeft] = useState(300);
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 300)); // loop back for continuous urgency
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Gamified Progress Bar Thresholds
  // Tier 1: Free Shipping (any purchase has it, but let's gamify it at 290 MAD to encourage buying at least 1 full product)
  // Tier 2: Free Mystery Gift (e.g. at 359 MAD - which is exactly the price of 2 items "Most Popular" bundle!)
  const freeShippingThreshold = 290;
  const giftThreshold = 359;

  const shippingProgress = Math.min((total / freeShippingThreshold) * 100, 100);
  const giftProgress = Math.min((total / giftThreshold) * 100, 100);

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
    setTimeout(() => {
      onCheckout();
    }, 150);
  }

  // Cross-sell products: items not in cart
  const cartProductIds = items.map((i) => i.productId as ProductId);
  const crossSellProducts = PRODUCTS.filter(
    (p) => !cartProductIds.includes(p.id)
  ).slice(0, 2);

  // Upgrade Nudge: If they have exactly 1 quantity of a "one" offer, nudge them to upgrade to the "two" offer (Most Popular)
  const singleItemToUpgrade = items.find((item) => item.offerId === "one" && item.quantity === 1);
  const upgradeProduct = singleItemToUpgrade ? PRODUCTS.find((p) => p.id === singleItemToUpgrade.productId) : null;
  const upgradeOffer = upgradeProduct ? upgradeProduct.offers.find((o) => o.offerId === "two") : null;

  function handleUpgrade() {
    if (!singleItemToUpgrade || !upgradeProduct || !upgradeOffer) return;
    // Remove the single item
    removeItem(singleItemToUpgrade.productId, singleItemToUpgrade.offerId);
    // Add the upgraded double item
    addOffer({
      productId: upgradeProduct.id,
      offerId: upgradeOffer.offerId,
      quantity: 1,
      unitCount: upgradeOffer.quantity,
      price: upgradeOffer.price,
      source: "cart_upgrade_nudge",
    });
  }

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
                <div className="flex items-center justify-between p-5 border-b border-border-soft bg-white">
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

                {/* Gamified Progress Bar */}
                {items.length > 0 && (
                  <div className="bg-white px-5 py-4 border-b border-border-soft shadow-sm space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-charcoal">
                      {total < freeShippingThreshold ? (
                        <span className="flex items-center gap-1">
                          <Gift className="w-4 h-4 text-saffron animate-bounce" />
                          باقي ليك <span className="text-teal text-sm">{formatMAD(freeShippingThreshold - total)}</span> وتستفدي من الشحن المجاني!
                        </span>
                      ) : total < giftThreshold ? (
                        <span className="flex items-center gap-1 text-teal">
                          <Sparkles className="w-4 h-4 text-saffron animate-pulse" />
                          حصلت على شحن مجاني! باقي ليك <span className="text-saffron text-sm">{formatMAD(giftThreshold - total)}</span> وتحصلي على هدية مفاجأة مجانية! 🎁
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-xl w-full justify-center">
                          <Gift className="w-4.5 h-4.5 text-saffron animate-bounce" />
                          مبروك! حصلت على الشحن المجاني + هدية مفاجأة مجانية مع طلبيتك! 🎉
                        </span>
                      )}
                    </div>

                    {/* Progress Bar Track */}
                    <div className="relative h-3 bg-sand rounded-full overflow-hidden">
                      {/* Shipping progress */}
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${shippingProgress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal to-teal-hover rounded-full"
                      />
                      {/* Gift progress */}
                      {total >= freeShippingThreshold && (
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${giftProgress}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-hover via-saffron to-saffron-2 rounded-full"
                        />
                      )}
                    </div>

                    {/* Milestones indicators */}
                    <div className="flex justify-between text-[10px] font-bold text-muted px-1">
                      <span className={total >= freeShippingThreshold ? "text-teal" : ""}>شحن مجاني (290 د.م)</span>
                      <span className={total >= giftThreshold ? "text-saffron" : ""}>هدية مجانية (359 د.م) 🎁</span>
                    </div>
                  </div>
                )}

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
                            className="bg-white rounded-2xl p-4 border border-border-soft flex flex-col gap-3 shadow-sm"
                          >
                            <div className="flex gap-3">
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
                          </div>
                        );
                      })}

                      {/* One-Click Upgrade Nudge */}
                      {singleItemToUpgrade && upgradeProduct && upgradeOffer && (
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gradient-to-br from-saffron/10 to-saffron-2/5 border border-saffron/30 rounded-2xl p-4 flex flex-col gap-3 shadow-sm relative overflow-hidden"
                        >
                          <div aria-hidden className="absolute -top-10 -left-10 w-24 h-24 rounded-full bg-saffron/10 blur-xl pointer-events-none" />
                          <div className="flex items-start gap-2.5">
                            <TrendingUp className="w-5 h-5 text-saffron flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="text-xs font-extrabold text-charcoal font-display">ترقية العرض وتوفير هائل! 🚀</h4>
                              <p className="text-xs text-muted leading-relaxed mt-1">
                                رقي طلبك لـ <span className="font-bold text-teal">{upgradeOffer.label}</span> وزيدي قطعة ثانية غير بـ <span className="font-bold text-saffron">{formatMAD(upgradeOffer.price - singleItemToUpgrade.price)}</span> إضافية فقط!
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={handleUpgrade}
                            className="btn-primary btn-shimmer-gold w-full text-xs min-h-[38px] py-2 rounded-xl flex items-center justify-center gap-1.5"
                          >
                            <span>ترقية العرض الآن</span>
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      )}

                      {/* Cross-sells */}
                      {crossSellProducts.length > 0 && (
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-semibold text-charcoal flex items-center gap-1.5">
                              <Sparkles className="w-4 h-4 text-saffron animate-pulse" />
                              قد يعجبك أيضاً
                            </p>
                            <span className="text-[10px] font-bold text-red-500 bg-red-50 border border-red-100 px-2 py-0.5 rounded-md animate-pulse">
                              عرض مؤقت: {formatTime(timeLeft)} ⏳
                            </span>
                          </div>
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
                                  className="group/cross flex items-center gap-3 bg-white rounded-xl p-3 border border-border-soft hover:border-teal/40 hover:shadow-sm transition-all w-full text-right relative overflow-hidden"
                                >
                                  {/* Pulse Glow border for urgency */}
                                  <span className="absolute inset-0 border border-saffron/0 group-hover/cross:border-saffron/40 rounded-xl transition-colors duration-300 pointer-events-none" />
                                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-sand flex-shrink-0 relative">
                                    <Image
                                      src={p.images.hero}
                                      alt={p.shortName}
                                      fill
                                      className="object-cover group-hover/cross:scale-105 transition-transform"
                                      sizes="48px"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-charcoal group-hover/cross:text-teal transition-colors">
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
                  <div className="border-t border-border-soft p-5 space-y-3 bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
                    <div className="flex items-center justify-between text-sm text-muted">
                      <span>التوصيل</span>
                      <span className="text-teal font-semibold">مجاني</span>
                    </div>
                    <div className="flex items-center justify-between font-bold text-lg">
                      <span className="text-charcoal">المجموع</span>
                      <span className="text-teal font-display">{formatMAD(total)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted bg-sand rounded-xl px-3 py-2">
                      <Lock className="w-3.5 h-3.5 flex-shrink-0 text-teal" />
                      الدفع عند الاستلام، بلا بطاقة بنكية
                    </div>

                    <button
                      onClick={handleCheckout}
                      className="btn-primary btn-shimmer-gold w-full text-base py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
                    >
                      <span>إتمام الطلب – الدفع عند الاستلام</span>
                      <ArrowLeft className="w-5 h-5" />
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
