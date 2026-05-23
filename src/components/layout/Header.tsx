"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, ArrowUpLeft } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useCheckoutStore } from "@/store/checkout-store";
import { cn } from "@/lib/cn";

const CartDrawer = dynamic(() => import("@/components/cart/CartDrawer"), {
  ssr: false,
});
const CheckoutFlow = dynamic(
  () => import("@/components/checkout/CheckoutFlow"),
  { ssr: false }
);

/* Split a string into per-letter spans for kinetic typography.
   We only translate Y on hover (RTL-safe). Spaces are preserved as nbsp. */
function KineticLetters({ text }: { text: string }) {
  return (
    <span className="inline-flex">
      {Array.from(text).map((ch, i) => (
        <span key={i} className="hdr-kin-letter">
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
}

export default function Header({
  isSoftPage = false,
}: {
  isSoftPage?: boolean;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const itemCount = useCartStore((s) => s.getItemCount());
  const openCart = useCartStore((s) => s.openCart);
  const isCartOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const openCheckout = useCheckoutStore((s) => s.openCheckout);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  /* Single passive scroll listener that only mutates state when the
     threshold is crossed. Cheap, no rAF, no spam re-renders. */
  useEffect(() => {
    let last = false;
    const onScroll = () => {
      const next = window.scrollY > 16;
      if (next !== last) {
        last = next;
        setScrolled(next);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Body-scroll lock while the overlay is open. */
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  /* Auto-close the overlay on route change. */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/", label: "الرئيسية", code: "01" },
    ...(!isSoftPage
      ? [{ href: "/products", label: "المجموعة", code: "02" }]
      : []),
    { href: "/about", label: "عن أطلس", code: "03" },
    { href: "/contact", label: "تواصل معنا", code: "04" },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <>
      {/* ═════════════════════════════════════════════════════════
          FLOATING CAPSULE NAV
          Sticky, detached from edges, with an animated gold conic
          ring (pure CSS @property). Scroll-aware: contracts past
          16px so the focus shifts to content.
          ═════════════════════════════════════════════════════════ */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-[padding] duration-500 ease-out",
          scrolled ? "py-2" : "py-3 md:py-4"
        )}
      >
        <div
          className={cn(
            "mx-auto transition-[max-width,padding] duration-500 ease-out px-3 sm:px-5",
            scrolled ? "max-w-5xl" : "max-w-7xl"
          )}
        >
          <div
            className={cn(
              "hdr-ring hdr-glass relative flex items-center justify-between",
              "rounded-full transition-[height,padding] duration-500 ease-out",
              scrolled
                ? "h-14 px-3 sm:px-4"
                : "h-16 sm:h-[68px] px-3.5 sm:px-5"
            )}
          >
            {/* ── Brand (RTL start = right) ── */}
            <Link
              href="/"
              className="relative z-10 flex items-center gap-2.5 group"
              aria-label="أطلس بيور — الصفحة الرئيسية"
            >
              <span className="relative inline-flex">
                <span
                  aria-hidden
                  className="absolute -inset-2 rounded-full bg-saffron/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
                <Image
                  src="/logo.png"
                  alt="Atlas Pure"
                  width={40}
                  height={40}
                  className="relative object-contain transition-transform duration-500 group-hover:scale-[1.06]"
                  priority
                />
              </span>
              <div className="leading-none">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display font-extrabold text-[15px] sm:text-base text-charcoal tracking-tight">
                    أطلس بيور
                  </span>
                  <span
                    aria-hidden
                    className="hidden sm:inline-block w-px h-3 bg-saffron/45"
                  />
                  <span className="hidden sm:inline hdr-mono text-[9px] font-bold text-saffron">
                    Atlas//Pure
                  </span>
                </div>
                <span className="hidden sm:flex items-center gap-1.5 mt-1 hdr-mono text-[9px] text-muted">
                  <span className="hdr-pulse-dot" />
                  Pharma-Botanic · 2050
                </span>
              </div>
            </Link>

            {/* ── Center: Kinetic Nav (desktop only) ── */}
            <nav
              className="hidden md:flex relative z-10 items-center gap-1"
              aria-label="القائمة الرئيسية"
            >
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "hdr-kin-link relative inline-flex items-center gap-2",
                      "px-3.5 lg:px-4 py-2 rounded-full font-bold text-[13.5px] tracking-tight",
                      "transition-colors duration-300",
                      active
                        ? "text-charcoal"
                        : "text-charcoal/70 hover:text-charcoal"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {/* Hover capsule */}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-0 rounded-full",
                        "bg-charcoal/5 opacity-0 scale-90",
                        "transition-all duration-300",
                        "group-hover:opacity-100",
                        "[.hdr-kin-link:hover_&]:opacity-100 [.hdr-kin-link:hover_&]:scale-100"
                      )}
                    />
                    <span className="relative flex items-center gap-2">
                      {active && (
                        <span
                          aria-hidden
                          className="w-1.5 h-1.5 rounded-full bg-saffron shadow-[0_0_10px_rgba(184,134,47,0.85)]"
                        />
                      )}
                      <KineticLetters text={link.label} />
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* ── Right side (RTL end = left) ── */}
            <div className="relative z-10 flex items-center gap-2 sm:gap-2.5">
              {/* Mobile "LIVE" signal — replaces nav on small screens */}
              <span className="md:hidden inline-flex items-center gap-1.5 hdr-mono text-[9px] font-bold text-teal">
                <span className="hdr-pulse-dot" />
                LIVE
              </span>

              {/* Cart pill */}
              {!isSoftPage && (
                <button
                  onClick={() => openCart()}
                  aria-label={
                    mounted && itemCount > 0
                      ? `السلة (${itemCount} منتوج)`
                      : "السلة"
                  }
                  className={cn(
                    "relative inline-flex items-center gap-2 rounded-full",
                    "h-10 sm:h-11 px-3.5 sm:px-4",
                    "bg-charcoal text-ivory text-xs sm:text-[13px] font-bold tracking-wide",
                    "shadow-[0_12px_28px_-12px_rgba(16,38,34,0.65)]",
                    "hover:shadow-[0_16px_36px_-12px_rgba(14,92,74,0.65)]",
                    "hover:bg-teal-dark active:scale-[0.97]",
                    "transition-all duration-300 overflow-hidden group/cart"
                  )}
                >
                  {/* Inner sheen (RTL-safe: pure opacity fade, no X translation) */}
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-saffron/25 to-transparent opacity-0 group-hover/cart:opacity-100 transition-opacity duration-500"
                  />
                  <ShoppingBag
                    className="relative w-4 h-4"
                    strokeWidth={2}
                  />
                  <span className="relative hidden sm:inline">السلة</span>
                  <span
                    className={cn(
                      "relative inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full",
                      "hdr-mono text-[10px] font-extrabold tabular-nums",
                      "tracking-normal",
                      mounted && itemCount > 0
                        ? "bg-gradient-to-br from-saffron-light to-saffron text-charcoal"
                        : "bg-white/15 text-ivory/70"
                    )}
                  >
                    {mounted ? (itemCount > 99 ? "99+" : itemCount) : 0}
                  </span>
                </button>
              )}

              {/* Menu button — always visible (desktop = expanded view, mobile = overlay) */}
              <button
                onClick={() => setMobileOpen(true)}
                aria-label="فتح القائمة"
                className={cn(
                  "relative inline-flex items-center justify-center rounded-full",
                  "w-10 h-10 sm:w-11 sm:h-11",
                  "bg-white/60 border border-white/60 text-charcoal",
                  "hover:bg-white hover:border-saffron/40",
                  "active:scale-95 transition-all duration-300"
                )}
              >
                <Menu className="md:hidden w-5 h-5" strokeWidth={2.2} />
                <span
                  aria-hidden
                  className="hidden md:flex flex-col items-end gap-[3px]"
                >
                  <span className="block w-4 h-px bg-charcoal" />
                  <span className="block w-2.5 h-px bg-charcoal" />
                  <span className="block w-4 h-px bg-charcoal" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ═════════════════════════════════════════════════════════
          CINEMATIC OVERLAY MENU
          Full-screen on mobile and desktop. Clean, readable, with
          staggered fade-in and a gold accent rail on the active
          route. No fancy translations — purely opacity + Y.
          ═════════════════════════════════════════════════════════ */}
      <div
        className={cn(
          "fixed inset-0 z-[80] transition-opacity duration-500",
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        role="dialog"
        aria-modal="true"
        aria-hidden={!mobileOpen}
      >
        {/* Stage */}
        <div
          aria-hidden
          className="absolute inset-0 bg-charcoal"
          style={{
            backgroundImage:
              "radial-gradient(70rem 50rem at 100% 0%, rgba(184,134,47,0.18), transparent 60%), radial-gradient(55rem 40rem at 0% 100%, rgba(14,92,74,0.32), transparent 55%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(184,134,47,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(184,134,47,0.6) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        {/* Top bar of the overlay */}
        <div className="absolute top-0 inset-x-0 z-10">
          <div className="container-max h-16 sm:h-20 flex items-center justify-between">
            <div className="flex items-center gap-2 hdr-mono text-[10px] text-ivory/65">
              <span className="hdr-pulse-dot" />
              <span>Atlas // Pure — System</span>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="إغلاق القائمة"
              className="group relative w-11 h-11 rounded-full bg-white/5 border border-white/15 backdrop-blur-md hover:bg-white/10 transition-colors flex items-center justify-center"
            >
              <X className="w-5 h-5 text-ivory group-hover:rotate-90 transition-transform duration-500" />
            </button>
          </div>
          <div className="hairline-gold opacity-60" />
        </div>

        {/* Nav body */}
        <div className="absolute inset-0 flex flex-col">
          <div className="flex-1 container-max flex items-center pt-20 pb-8">
            <nav aria-label="القائمة الموسعة" className="w-full">
              <ul
                className={cn(
                  "space-y-1 sm:space-y-2",
                  mobileOpen && "hdr-stagger"
                )}
              >
                {navLinks.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "group relative flex items-baseline gap-4 sm:gap-6",
                          "py-3 sm:py-4 border-b border-white/10",
                          "hover:border-saffron/40 transition-colors duration-300"
                        )}
                        aria-current={active ? "page" : undefined}
                      >
                        <span className="hdr-mono text-[10px] sm:text-xs text-saffron/80 tabular-nums shrink-0">
                          {link.code}
                        </span>
                        <span className="hdr-kin-link flex-1 min-w-0">
                          <span
                            className={cn(
                              "block font-display font-extrabold leading-[1.05]",
                              "text-[40px] sm:text-6xl md:text-7xl",
                              active
                                ? "text-ivory"
                                : "text-ivory/85 group-hover:text-ivory"
                            )}
                          >
                            <KineticLetters text={link.label} />
                          </span>
                        </span>
                        <ArrowUpLeft
                          className={cn(
                            "shrink-0 w-6 h-6 sm:w-7 sm:h-7 text-ivory/40",
                            "group-hover:text-saffron transition-colors duration-300"
                          )}
                          strokeWidth={1.5}
                        />
                        {active && (
                          <span
                            aria-hidden
                            className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-saffron rounded-full shadow-[0_0_18px_rgba(184,134,47,0.7)]"
                          />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Footer of overlay */}
          <div className="border-t border-white/10">
            <div className="container-max py-5 sm:py-6 flex flex-wrap items-center justify-between gap-4">
              <div className="hdr-mono text-[10px] text-ivory/55">
                <span className="text-gold-gradient font-bold">
                  Pharma · Botanic
                </span>
                <span className="mx-2 text-ivory/30">·</span>
                <span>MAR // 2050</span>
              </div>
              {!isSoftPage && (
                <Link
                  href="/products"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-saffron-light to-saffron text-charcoal font-extrabold text-sm px-5 py-3 hover:shadow-gold transition-shadow duration-300"
                >
                  تسوقي المجموعة
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cart Drawer (unchanged contract) */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={closeCart}
        onCheckout={openCheckout}
      />

      {/* Checkout Flow (unchanged contract) */}
      <CheckoutFlow />
    </>
  );
}
