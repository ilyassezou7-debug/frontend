"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart-store";
import { useCheckoutStore } from "@/store/checkout-store";
import CartDrawer from "@/components/cart/CartDrawer";
import CheckoutFlow from "@/components/checkout/CheckoutFlow";

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
          <div className="flex items-center justify-between h-16">
            {/* Brand - Right side (RTL) */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-teal flex items-center justify-center flex-shrink-0 group-hover:bg-teal-hover transition-colors">
                <span className="text-ivory font-bold text-lg font-display">A</span>
              </div>
              <div className="leading-tight">
                <p className="font-bold text-lg text-charcoal font-display leading-none">
                  أطلس بيور
                </p>
                <p className="text-xs text-muted tracking-wide">Atlas Pure</p>
              </div>
            </Link>

            {/* Desktop nav - Center */}
            <nav className="hidden md:flex items-center gap-8">
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

            {/* Cart - Left side (RTL = left) */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => openCart()}
                className="relative p-2 rounded-xl hover:bg-sand transition-colors"
                aria-label="السلة"
              >
                <ShoppingBag className="w-6 h-6 text-charcoal" />
                {mounted && itemCount > 0 && (
                  <span className="absolute -top-1 -left-1 bg-teal text-ivory text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-xl hover:bg-sand transition-colors"
                aria-label="القائمة"
              >
                {mobileOpen ? (
                  <X className="w-6 h-6 text-charcoal" />
                ) : (
                  <Menu className="w-6 h-6 text-charcoal" />
                )}
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
