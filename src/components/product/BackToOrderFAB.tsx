"use client";

import { useEffect, useState } from "react";
import { ArrowUp, ShoppingBag } from "lucide-react";

interface BackToOrderFABProps {
  /** DOM id of the offer block to scroll back to. */
  targetId: string;
}

/**
 * Side-floating "back to order" FAB.
 *
 * Sits on the screen-edge while the user is browsing the long-form content
 * sections (pain points → benefits → ingredients → reviews → FAQ → …) and
 * gives them a second, always-visible shortcut back up to the offer block.
 *
 * Designed to complement (not replace) the bottom StickyBuyBar:
 * - The bottom bar is full, with product thumbnail + price + main CTA.
 * - This side pill is compact, brand-aligned, and unobtrusive — a "by the way,
 *   you can always come back here to order" reminder.
 *
 * Visibility logic:
 * - Hidden while the offer block is in the viewport (no need to bounce back).
 * - Hidden until the user has actually scrolled past it (avoids appearing on
 *   first paint).
 * - Slides in from the side with a gentle pulse ring to draw the eye.
 *
 * Mobile-first: sized down on small screens, with `safe-area-inset` padding to
 * never sit under the iOS home indicator.
 */
export default function BackToOrderFAB({ targetId }: BackToOrderFABProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0.15 }
    );
    obs.observe(target);
    return () => obs.disconnect();
  }, [targetId]);

  function handleClick() {
    const target = document.getElementById(targetId);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="ارجعي لأعلى الصفحة لتأكيد طلبك"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed z-30 left-3 sm:left-5 bottom-24 sm:bottom-28 transition-all duration-300 ease-out ${
        visible
          ? "opacity-100 translate-x-0 pointer-events-auto"
          : "opacity-0 -translate-x-4 pointer-events-none"
      }`}
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Pulse ring — subtle attention without being noisy */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-saffron/30 animate-ping"
        style={{ animationDuration: "2.4s" }}
      />

      {/* Pill */}
      <span className="relative inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-br from-teal to-teal-dark text-ivory font-bold text-xs sm:text-sm pl-2.5 pr-3 sm:pl-3 sm:pr-4 py-2.5 sm:py-3 rounded-full shadow-lg shadow-charcoal/20 ring-2 ring-white/40 active:scale-95 transition-transform">
        <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-saffron text-ivory flex items-center justify-center flex-shrink-0 shadow-sm">
          <ArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={3} />
        </span>
        <span className="flex items-center gap-1 whitespace-nowrap">
          <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-90" />
          اطلبي
        </span>
      </span>
    </button>
  );
}
