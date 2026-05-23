"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  ShoppingBag,
  Menu,
  X,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
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

/* ─────────────────────────────────────────────────────────────
   Kinetic typography: split a label into per-letter spans so we
   can stagger a hover-rise. RTL-safe because each glyph keeps its
   logical order and we only translate on Y.
   ───────────────────────────────────────────────────────────── */
function KineticText({ text }: { text: string }) {
  return (
    <span className="inline-flex">
      {Array.from(text).map((ch, i) => (
        <span key={i} className="kinetic-letter">
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
  const [clockTime, setClockTime] = useState("");

  const itemCount = useCartStore((s) => s.getItemCount());
  const openCart = useCartStore((s) => s.openCart);
  const isCartOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const openCheckout = useCheckoutStore((s) => s.openCheckout);
  const pathname = usePathname();

  const navRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  /* ─── mount + scroll morph ─── */
  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ─── live UTC+1 clock for the status ribbon ─── */
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const hh = d.getHours().toString().padStart(2, "0");
      const mm = d.getMinutes().toString().padStart(2, "0");
      const ss = d.getSeconds().toString().padStart(2, "0");
      setClockTime(`${hh}:${mm}:${ss}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  /* ─── lock scroll when mobile overlay is open ─── */
  useEffect(() => {
    if (mobileOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [mobileOpen]);

  /* ─── close mobile on route change ─── */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  /* ─── magnetic cursor aura inside the capsule ─── */
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = navRef.current;
    if (!el) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    rafRef.current = requestAnimationFrame(() => {
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
      el.style.setProperty("--aura-opacity", "1");
    });
  }, []);
  const handleMouseLeave = useCallback(() => {
    const el = navRef.current;
    if (!el) return;
    el.style.setProperty("--aura-opacity", "0");
  }, []);

  const navLinks = [
    { href: "/", label: "الرئيسية", labelEn: "INDEX" },
    ...(!isSoftPage
      ? [{ href: "/products", label: "المجموعة", labelEn: "COLLECTION" }]
      : []),
    { href: "/about", label: "عن أطلس", labelEn: "ATELIER" },
    { href: "/contact", label: "تواصل معنا", labelEn: "CONTACT" },
  ];

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
          [01] SYSTEM RIBBON — kinetic top status bar with live clock,
          coordinates, and a streaming marquee of brand signals.
          ═══════════════════════════════════════════════════════════ */}
      <div className="relative z-[60] bg-charcoal text-ivory/90 overflow-hidden">
        <div aria-hidden className="absolute inset-0 noise-overlay" />
        <div aria-hidden className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-saffron/70 to-transparent" />

        <div className="container-max relative">
          <div className="flex items-center justify-between gap-4 h-8 text-[10px] font-mono-ui uppercase">
            {/* Right (RTL start) — live status */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="flex items-center gap-1.5">
                <span className="live-dot" />
                <span className="text-emerald-300">SYS // ONLINE</span>
              </span>
              <span className="hidden sm:inline text-ivory/40">·</span>
              <span className="hidden sm:inline tabular-nums text-ivory/70">
                {clockTime || "00:00:00"} <span className="text-saffron/80">UTC+1</span>
              </span>
            </div>

            {/* Center marquee */}
            <div className="hidden md:flex relative flex-1 overflow-hidden mask-fade">
              <div className="marquee-track">
                {Array.from({ length: 2 }).map((_, dup) => (
                  <div key={dup} className="flex items-center gap-8 pl-8">
                    {[
                      "PHARMA · BOTANIC · 2050 INTERFACE",
                      "ONSSA CERTIFIED",
                      "FREE SHIPPING · ALL MOROCCO",
                      "CASH ON DELIVERY",
                      "30-DAY GUARANTEE",
                      "ATLAS // PURE — MAR · 34.0331° N",
                    ].map((t, i) => (
                      <span key={`${dup}-${i}`} className="flex items-center gap-3 text-ivory/60 whitespace-nowrap">
                        <span className="w-1 h-1 rounded-full bg-saffron" />
                        <span>{t}</span>
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Left (RTL end) — coordinates */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="hidden sm:inline tabular-nums text-ivory/60">
                34.020° N · 6.841° W
              </span>
              <span className="hidden sm:inline text-ivory/40">·</span>
              <span className="text-saffron animate-[ap-blink_2.5s_ease-in-out_infinite]">
                REC ●
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          [02] FLOATING NAV CAPSULE — sticky, glass, holographic edge.
          Morphs (shrinks + pulls in from edges) once user scrolls.
          ═══════════════════════════════════════════════════════════ */}
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-500 ease-out will-change-transform",
          scrolled ? "pt-3 pb-2" : "pt-3 pb-3"
        )}
      >
        <div
          className={cn(
            "mx-auto transition-all duration-500 ease-out",
            scrolled
              ? "max-w-5xl px-3 sm:px-4"
              : "max-w-7xl px-3 sm:px-6 lg:px-8"
          )}
        >
          <div
            ref={navRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={cn(
              "holo-ring cursor-aura scanline relative flex items-center justify-between",
              "rounded-full bg-white/55 backdrop-blur-xl backdrop-saturate-150",
              "supports-[backdrop-filter]:bg-white/40",
              "shadow-[0_18px_48px_-18px_rgba(16,38,34,0.25)]",
              "border border-white/40",
              scrolled ? "px-3 sm:px-4 h-14" : "px-4 sm:px-6 h-16 sm:h-[68px]"
            )}
            style={{
              ["--aura-opacity" as string]: 0,
            }}
          >
            {/* ── Right (RTL start) — Logo block ── */}
            <Link
              href="/"
              className="relative z-10 flex items-center gap-2.5 group"
            >
              <span className="relative">
                <span
                  aria-hidden
                  className="absolute -inset-2 rounded-full bg-saffron/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
                <Image
                  src="/logo.png"
                  alt="Atlas Pure Logo"
                  width={40}
                  height={40}
                  className={cn(
                    "relative object-contain transition-transform duration-500",
                    "group-hover:scale-[1.08] group-hover:rotate-[6deg]"
                  )}
                />
              </span>
              <div className="leading-none">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display font-extrabold text-[15px] sm:text-base text-charcoal tracking-tight">
                    أطلس بيور
                  </span>
                  <span
                    aria-hidden
                    className="hidden sm:inline-block w-px h-3 bg-saffron/50"
                  />
                  <span className="hidden sm:inline font-mono-ui text-[9px] font-bold text-saffron uppercase tracking-[0.22em]">
                    Atlas//Pure
                  </span>
                </div>
                <span className="hidden sm:flex items-center gap-1 mt-1 font-mono-ui text-[8px] text-muted uppercase tracking-[0.18em]">
                  <Sparkles className="w-2.5 h-2.5 text-saffron" />
                  Pharma-Botanic · v.2050
                </span>
              </div>
            </Link>

            {/* ── Center — Kinetic Nav (desktop) ── */}
            <nav className="hidden md:flex relative z-10 items-center gap-1">
              {navLinks.map((link) => {
                const active =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname?.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "kinetic-link relative group px-3 lg:px-4 py-2 rounded-full font-bold text-[13.5px] tracking-tight transition-colors",
                      active
                        ? "text-charcoal"
                        : "text-charcoal/75 hover:text-charcoal"
                    )}
                  >
                    {/* Hover capsule fill */}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-0 rounded-full bg-charcoal/5 scale-90 opacity-0",
                        "group-hover:opacity-100 group-hover:scale-100",
                        "transition-all duration-300"
                      )}
                    />
                    <span className="relative flex items-center gap-2">
                      {/* Active orbit dot */}
                      {active && (
                        <span
                          aria-hidden
                          className="w-1.5 h-1.5 rounded-full bg-saffron shadow-[0_0_8px_rgba(184,134,47,0.8)]"
                        />
                      )}
                      <KineticText text={link.label} />
                    </span>
                    {/* En micro-label appears on hover */}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute left-1/2 -translate-x-1/2 -bottom-3.5 font-mono-ui text-[8px] tracking-[0.32em] text-saffron uppercase",
                        "opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300"
                      )}
                    >
                      {link.labelEn}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* ── Left (RTL end) — Cart + menu ── */}
            <div className="relative z-10 flex items-center gap-2">
              {/* Mobile signal pulse — replaces nav on small screens */}
              <span className="md:hidden font-mono-ui text-[9px] font-bold text-teal tracking-[0.28em] flex items-center gap-1.5">
                <span className="live-dot" />
                LIVE
              </span>

              {!isSoftPage && (
                <button
                  onClick={() => openCart()}
                  aria-label="السلة"
                  className={cn(
                    "relative inline-flex items-center gap-2 rounded-full",
                    "h-10 sm:h-11 px-3.5 sm:px-4",
                    "bg-charcoal text-ivory font-bold text-xs sm:text-[13px]",
                    "shadow-[0_10px_28px_-10px_rgba(16,38,34,0.65)]",
                    "hover:bg-teal-deep hover:shadow-[0_14px_34px_-10px_rgba(14,92,74,0.65)]",
                    "active:scale-95 transition-all duration-300 group/cart",
                    "overflow-hidden"
                  )}
                >
                  {/* Inner shimmer */}
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-saffron/30 to-transparent translate-x-[-120%] group-hover/cart:translate-x-[120%] transition-transform duration-700"
                  />
                  <ShoppingBag className="relative w-4 h-4" strokeWidth={2} />
                  <span className="relative hidden sm:inline tracking-wide">
                    السلة
                  </span>
                  {/* Counter chip */}
                  <span
                    className={cn(
                      "relative inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full",
                      "font-mono-ui text-[10px] font-extrabold tabular-nums",
                      mounted && itemCount > 0
                        ? "bg-gradient-gold text-charcoal"
                        : "bg-white/15 text-ivory/70"
                    )}
                  >
                    {mounted ? (itemCount > 99 ? "99+" : itemCount) : 0}
                  </span>
                  {/* Orbit pulse when items > 0 */}
                  {mounted && itemCount > 0 && (
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-full ring-2 ring-saffron/40 animate-[ap-pulse-ring_2.4s_ease-out_infinite]"
                    />
                  )}
                </button>
              )}

              {/* Menu button */}
              <button
                onClick={() => setMobileOpen(true)}
                aria-label="القائمة"
                className={cn(
                  "md:hidden relative inline-flex items-center justify-center rounded-full",
                  "w-10 h-10 sm:w-11 sm:h-11",
                  "bg-white/70 border border-white/60 text-charcoal",
                  "hover:bg-white hover:shadow-soft active:scale-95 transition-all"
                )}
              >
                <Menu className="w-5 h-5" strokeWidth={2.25} />
              </button>

              {/* Desktop overlay-trigger (icon style) */}
              <button
                onClick={() => setMobileOpen(true)}
                aria-label="فتح القائمة الموسعة"
                className={cn(
                  "hidden md:inline-flex items-center justify-center rounded-full",
                  "w-11 h-11 ml-1",
                  "bg-white/70 border border-white/60 text-charcoal",
                  "hover:bg-white hover:rotate-90 transition-all duration-500"
                )}
                title="القائمة الموسعة"
              >
                <span aria-hidden className="flex flex-col gap-1">
                  <span className="block w-4 h-px bg-charcoal" />
                  <span className="block w-2.5 h-px bg-charcoal ml-auto" />
                  <span className="block w-4 h-px bg-charcoal" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════
          [03] CINEMATIC OVERLAY MENU — full-screen, dark gradient
          stage with massive kinetic Arabic typography, en monogram
          numbering, gold mesh, and a quick-actions row.
          ═══════════════════════════════════════════════════════════ */}
      <div
        className={cn(
          "fixed inset-0 z-[80] transition-all duration-500",
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        aria-hidden={!mobileOpen}
      >
        {/* Stage background */}
        <div
          className={cn(
            "absolute inset-0 bg-charcoal",
            "bg-[radial-gradient(80rem_60rem_at_100%_0%,rgba(184,134,47,0.18),transparent_60%),radial-gradient(60rem_45rem_at_0%_100%,rgba(14,92,74,0.30),transparent_55%)]"
          )}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(184,134,47,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(184,134,47,0.6) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div aria-hidden className="absolute inset-0 noise-overlay" />

        {/* Close + meta */}
        <div className="absolute top-0 inset-x-0 z-10">
          <div className="container-max h-16 sm:h-20 flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono-ui text-[10px] uppercase tracking-[0.28em] text-ivory/60">
              <span className="live-dot" />
              <span>Atlas // Pure — Menu System</span>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="إغلاق"
              className="group relative w-11 h-11 rounded-full bg-white/5 border border-white/15 backdrop-blur-md hover:bg-white/10 transition-colors flex items-center justify-center"
            >
              <X className="w-5 h-5 text-ivory group-hover:rotate-90 transition-transform duration-500" />
              <span
                aria-hidden
                className="absolute inset-0 rounded-full ring-2 ring-saffron/0 group-hover:ring-saffron/40 transition-all duration-500"
              />
            </button>
          </div>
          <div className="hairline-gold" />
        </div>

        {/* Body */}
        <div className="absolute inset-0 flex flex-col">
          <div className="flex-1 container-max flex items-center pt-20 pb-8">
            <nav className="w-full">
              <ul className="space-y-2 sm:space-y-3">
                {navLinks.map((link, i) => {
                  const active =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname?.startsWith(link.href);
                  return (
                    <li
                      key={link.href}
                      className={cn(
                        "transition-all",
                        mobileOpen
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-6"
                      )}
                      style={{
                        transitionDuration: "700ms",
                        transitionTimingFunction:
                          "cubic-bezier(.2,.8,.2,1)",
                        transitionDelay: mobileOpen
                          ? `${120 + i * 80}ms`
                          : "0ms",
                      }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="group relative flex items-baseline gap-4 sm:gap-6 py-3 sm:py-4 border-b border-white/10 hover:border-saffron/50 transition-colors"
                      >
                        <span className="font-mono-ui text-[10px] sm:text-xs text-saffron/80 tracking-[0.28em] tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="kinetic-link flex-1">
                          <span
                            className={cn(
                              "block font-display font-extrabold leading-[1.05]",
                              "text-[44px] sm:text-6xl md:text-7xl",
                              active
                                ? "text-ivory"
                                : "text-ivory/85 group-hover:text-ivory"
                            )}
                          >
                            <KineticText text={link.label} />
                          </span>
                          <span className="block mt-1.5 font-mono-ui text-[10px] sm:text-xs uppercase tracking-[0.32em] text-saffron/70">
                            — {link.labelEn}
                          </span>
                        </span>
                        <ArrowUpRight
                          className={cn(
                            "shrink-0 w-6 h-6 sm:w-7 sm:h-7 text-ivory/40 group-hover:text-saffron",
                            "translate-x-0 translate-y-0 group-hover:-translate-y-1 group-hover:translate-x-1",
                            "transition-all duration-500"
                          )}
                          strokeWidth={1.5}
                        />
                        {active && (
                          <span
                            aria-hidden
                            className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-gradient-gold rounded-full shadow-[0_0_18px_rgba(184,134,47,0.7)]"
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
              <div className="flex items-center gap-4 text-ivory/60 font-mono-ui text-[10px] uppercase tracking-[0.28em]">
                <span className="text-gold-gradient font-bold">
                  Pharma · Botanic
                </span>
                <span className="hidden sm:inline">·</span>
                <span className="hidden sm:inline">MAR // 2050</span>
                <span className="hidden sm:inline">·</span>
                <span className="hidden sm:inline tabular-nums">
                  {clockTime || "00:00:00"}
                </span>
              </div>
              {!isSoftPage && (
                <Link
                  href="/products"
                  onClick={() => setMobileOpen(false)}
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-gold text-charcoal font-extrabold text-sm px-5 py-3 hover:shadow-gold transition-all"
                >
                  <span>تسوقي المجموعة</span>
                  <ArrowUpRight
                    className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform"
                    strokeWidth={2.5}
                  />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

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
