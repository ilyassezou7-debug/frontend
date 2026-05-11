"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart-store";
import { useCheckoutStore } from "@/store/checkout-store";
import CartDrawer from "@/components/cart/CartDrawer";
import CheckoutFlow from "@/components/checkout/CheckoutFlow";
import Image from "next/image";

export default function Header() {
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
    { href: "/products", label: "المجموعة" },
    { href: "/about", label: "عن أطلس" },
    { href: "/contact", label: "تواصل معنا" },
  ];

  return (
    <>
      <header className="bg-white shadow-sm border-b border-border-soft relative z-40">
        <div className="container-max">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Right side (RTL start) — Cart & Mobile Menu */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => openCart()}
                className="relative p-1.5 sm:p-2 rounded-xl hover:bg-sand transition-colors group"
                aria-label="السلة"
              >
                <div className="relative">
                  <ShoppingBag
                    className="w-6 h-6 sm:w-7 sm:h-7 text-charcoal group-hover:text-teal transition-colors"
                    strokeWidth={1.5}
                  />
                  {mounted && itemCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-teal-dark text-white text-[10px] w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center font-bold ring-2 ring-white shadow-sm tabular-nums">
                      {itemCount > 9 ? "9+" : itemCount}
                    </span>
                  )}
                </div>
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-1.5 rounded-xl hover:bg-sand transition-colors"
                aria-label="القائمة"
              >
                {mobileOpen ? (
                  <X className="w-7 h-7 text-charcoal" />
                ) : (
                  <Menu className="w-7 h-7 text-charcoal" />
                )}
              </button>
            </div>

            {/* Center — Desktop Nav */}
            <div className="hidden md:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <nav className="flex items-center gap-6 lg:gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-charcoal hover:text-teal font-bold transition-colors text-[15px]"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Left side (RTL end) — Brand Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2.5 group">
                <Image
                  src="/logo.png"
                  alt="Atlas Pure Logo"
                  width={44}
                  height={44}
                  className="group-hover:scale-105 transition-transform object-contain"
                />
                <div className="leading-tight text-left">
                  <p className="font-bold text-lg sm:text-xl text-charcoal font-display leading-none tracking-wide">
                    أطلس بيور
                  </p>
                  <p className="text-[9px] sm:text-[10px] font-bold text-saffron tracking-[0.15em] mt-1 uppercase">
                    Atlas Pure
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* Mobile nav */}
          {mobileOpen && (
            <div className="md:hidden border-t border-border-soft py-3">
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-2 text-charcoal hover:text-teal hover:bg-sand rounded-xl font-medium transition-colors"
                  >
                    {link.label}
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
