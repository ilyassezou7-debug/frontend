"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useCartStore } from "@/store/cart-store";
import { useCheckoutStore } from "@/store/checkout-store";
import Image from "next/image";

// Lazy-loaded: only needed after the user opens the cart
const CartDrawer = dynamic(() => import("@/components/cart/CartDrawer"), {
  ssr: false,
});
const CheckoutFlow = dynamic(() => import("@/components/checkout/CheckoutFlow"), {
  ssr: false,
});

export default function Header({ isSoftPage = false }: { isSoftPage?: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const itemCount = useCartStore((s) => s.getItemCount());
  const openCart = useCartStore((s) => s.openCart);
  const isCartOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const openCheckout = useCheckoutStore((s) => s.openCheckout);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { href: "/", label: "الرئيسية" },
    ...(!isSoftPage ? [{ href: "/products", label: "المجموعة" }] : []),
    { href: "/about", label: "عن أطلس" },
    { href: "/contact", label: "تواصل معنا" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 will-change-transform">
        {/* Glass surface */}
        <div className="absolute inset-0 bg-white/75 backdrop-blur-xl backdrop-saturate-150 border-b border-border-soft/70 supports-[backdrop-filter]:bg-white/65" />
        {/* Gold hairline underline */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-saffron/50 to-transparent" />

        <div className="container-max relative">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Right (RTL start) — Brand */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="relative">
                  <span aria-hidden className="absolute inset-0 rounded-full bg-saffron/15 blur-md scale-110 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Image
                    src="/logo.png"
                    alt="Atlas Pure Logo"
                    width={44}
                    height={44}
                    className="relative group-hover:scale-105 transition-transform duration-300 object-contain"
                  />
                </div>
                <div className="leading-tight text-right">
                  <p className="font-bold text-lg sm:text-xl text-charcoal font-display leading-none tracking-wide">
                    أطلس بيور
                  </p>
                  <p className="text-[9px] sm:text-[10px] font-bold text-saffron tracking-[0.22em] mt-1 uppercase">
                    Atlas&nbsp;Pure
                  </p>
                </div>
              </Link>
            </div>

            {/* Center — Desktop Nav */}
            <div className="hidden md:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <nav className="flex items-center gap-7 lg:gap-9">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative text-charcoal hover:text-teal font-bold transition-colors text-[15px] py-1 group"
                  >
                    {link.label}
                    <span aria-hidden className="pointer-events-none absolute -bottom-0.5 inset-x-2 h-[2px] bg-gradient-to-r from-saffron/0 via-saffron to-saffron/0 scale-x-0 group-hover:scale-x-100 origin-center transition-transform duration-300" />
                  </Link>
                ))}
              </nav>
            </div>

            {/* Left (RTL end) — Cart & Menu */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-xl hover:bg-sand/70 active:scale-95 transition-all"
                aria-label="القائمة"
              >
                {mobileOpen ? (
                  <X className="w-6 h-6 text-charcoal" />
                ) : (
                  <Menu className="w-6 h-6 text-charcoal" />
                )}
              </button>

              {!isSoftPage && (
              <button
                onClick={() => openCart()}
                className="relative p-2 sm:p-2.5 rounded-2xl bg-white/60 hover:bg-white border border-border-soft hover:border-teal/30 hover:shadow-soft active:scale-95 transition-all group"
                aria-label="السلة"
              >
                <div className="relative">
                  <ShoppingBag
                    className="w-5 h-5 sm:w-6 sm:h-6 text-charcoal group-hover:text-teal transition-colors"
                    strokeWidth={1.75}
                  />
                  {mounted && itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-br from-saffron-light to-saffron-dark text-white text-[10px] w-[18px] h-[18px] sm:w-5 sm:h-5 px-1 rounded-full flex items-center justify-center font-extrabold ring-2 ring-white shadow tabular-nums">
                      {itemCount > 9 ? "9+" : itemCount}
                    </span>
                  )}
                </div>
              </button>
              )}
            </div>
          </div>

          {/* Mobile nav */}
          {mobileOpen && (
            <div className="md:hidden border-t border-border-soft/70 py-3 animate-fade-up">
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 text-charcoal hover:text-teal hover:bg-sand/60 rounded-xl font-semibold transition-colors flex items-center justify-between"
                  >
                    <span>{link.label}</span>
                    <span aria-hidden className="text-saffron/60 text-xs">›</span>
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={closeCart}
        onCheckout={openCheckout}
      />

      {/* Checkout Flow (modal + upsell) */}
      <CheckoutFlow />
    </>
  );
}
