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
    { href: "/products", label: "المنتجات" },
    { href: "/about", label: "من نحن" },
    { href: "/contact", label: "تواصل" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-ivory/95 backdrop-blur-sm shadow-sm border-b border-border-soft">
        <div className="container-max">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Right side (RTL) - Desktop Nav & Mobile Menu */}
            <div className="flex items-center flex-1">
              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 -mr-2 rounded-xl hover:bg-sand transition-colors"
                aria-label="القائمة"
              >
                {mobileOpen ? (
                  <X className="w-6 h-6 text-charcoal" />
                ) : (
                  <Menu className="w-6 h-6 text-charcoal" />
                )}
              </button>

              {/* Desktop nav */}
              <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-charcoal hover:text-teal font-medium transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Center - Brand Logo */}
            <div className="flex-1 flex justify-center">
              <Link href="/" className="flex items-center gap-2.5 group">
                <Image 
                  src="/logo.png" 
                  alt="Atlas Pure Logo" 
                  width={44} 
                  height={44} 
                  className="group-hover:scale-105 transition-transform object-contain"
                />
                <div className="leading-tight hidden sm:block">
                  <p className="font-bold text-xl text-charcoal font-display leading-none tracking-wide">
                    أطلس بيور
                  </p>
                </div>
              </Link>
            </div>

            {/* Left side (RTL) - Cart */}
            <div className="flex items-center justify-end flex-1">
              <button
                onClick={() => openCart()}
                className="relative p-2 -ml-2 rounded-xl hover:bg-sand transition-colors flex items-center gap-2 group"
                aria-label="السلة"
              >
                <span className="hidden sm:block text-sm font-bold text-charcoal group-hover:text-teal transition-colors">السلة</span>
                <div className="relative">
                  <ShoppingBag className="w-6 h-6 text-charcoal group-hover:text-teal transition-colors" />
                  {mounted && itemCount > 0 && (
                    <span className="absolute -top-1.5 -left-1.5 bg-saffron text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold ring-2 ring-ivory shadow-sm">
                      {itemCount > 9 ? "9+" : itemCount}
                    </span>
                  )}
                </div>
              </button>
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
