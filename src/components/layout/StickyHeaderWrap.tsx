"use client";

import { useEffect, useRef, useState } from "react";

interface StickyHeaderWrapProps {
  children: React.ReactNode;
}

/**
 * Auto-hiding sticky wrapper for the header + announcement bar.
 *
 * Behavior:
 *   - Always visible at the very top of the page (first ~80px of scroll).
 *   - Slides up out of view when the user is scrolling down through content.
 *   - Slides back in the moment the user scrolls up — including the
 *     programmatic "back to order" scroll triggered by the sticky CTA / FAB.
 *
 * Why `sticky top-0` + transform (and not `fixed`):
 *   - `sticky` keeps the element's static layout footprint, so we don't
 *     introduce phantom top-padding on every page or jolt the layout when
 *     toggling visibility.
 *   - Translating a sticky element visually slides it out of view while its
 *     scroll-anchoring position stays stable.
 *
 * Implementation notes:
 *   - Scroll is sampled inside `requestAnimationFrame` (passive listener) so
 *     this stays buttery on low-end Android phones.
 *   - A small movement threshold (`MOVE_THRESHOLD`) avoids "flicker" when the
 *     user is just nudging the page.
 */
const TOP_SHOW_ZONE = 80;
const MOVE_THRESHOLD = 8;

export default function StickyHeaderWrap({ children }: StickyHeaderWrapProps) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastY.current = window.scrollY;

    function onScroll() {
      if (ticking.current) return;
      ticking.current = true;

      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        const dy = y - lastY.current;

        if (y < TOP_SHOW_ZONE) {
          setHidden(false);
        } else if (dy > MOVE_THRESHOLD) {
          setHidden(true);
        } else if (dy < -MOVE_THRESHOLD) {
          setHidden(false);
        }

        lastY.current = y;
        ticking.current = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`sticky top-0 z-50 w-full flex flex-col will-change-transform transition-transform duration-300 ease-out ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
      data-header-hidden={hidden}
    >
      {children}
    </div>
  );
}
