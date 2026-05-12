"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BackToOrderFABProps {
  /** DOM id of the section to watch — FAB hides when this is visible. */
  watchId: string;
  /** DOM id of the offer selector to scroll to on click. */
  scrollToId: string;
}

/**
 * Floating pill that appears once the user scrolls past the offer block.
 * Tapping it smoothly scrolls them directly to the offer selector cards.
 */
export default function BackToOrderFAB({ watchId, scrollToId }: BackToOrderFABProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById(watchId);
    if (!target) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0.15 }
    );
    obs.observe(target);
    return () => obs.disconnect();
  }, [watchId]);

  function handleClick() {
    const target = document.getElementById(scrollToId);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="fab"
          type="button"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={handleClick}
          aria-label="ارجعي لقسم العروض لتأكيد طلبك"
          className="fixed z-30 left-3 sm:left-5 bottom-24 sm:bottom-28"
          style={{ marginBottom: "env(safe-area-inset-bottom)" }}
        >
          {/* Pulse ring */}
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-teal/25 animate-ping pointer-events-none"
            style={{ animationDuration: "2.4s" }}
          />

          {/* Pill */}
          <span className="relative inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-br from-teal to-teal-dark text-ivory font-bold text-xs sm:text-sm pl-2.5 pr-3.5 sm:pl-3 sm:pr-4 py-2.5 sm:py-3 rounded-full shadow-lg shadow-charcoal/25 ring-2 ring-white/40 active:scale-95 transition-transform whitespace-nowrap">
            <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-saffron text-ivory flex items-center justify-center flex-shrink-0 shadow-sm">
              <ArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={3} />
            </span>
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-80" />
            العروض
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
