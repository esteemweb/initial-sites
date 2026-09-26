"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Marks [data-reveal] elements with data-in the first time they enter the
 * viewport, then stops watching them, so nothing re-animates on scroll
 * back. The motion itself is CSS, and only exists when <html> carries
 * data-motion, which an inline script sets before first paint unless the
 * visitor prefers reduced motion. No script, no motion: everything is
 * simply there.
 */
export default function Reveal() {
  const path = usePathname();

  useEffect(() => {
    document.documentElement.setAttribute("data-reveal-ready", "");
    if (!document.documentElement.hasAttribute("data-motion")) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          (e.target as HTMLElement).dataset.in = "";
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    const watch = () =>
      document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-in])").forEach((el) => io.observe(el));
    const raf = requestAnimationFrame(watch);
    // content that arrives after the first paint (client navigation, lists
    // that re-sort on the visitor's clock) is picked up too
    // the hero swaps portraits every 5.2s; those changes are not content
    const mo = new MutationObserver((muts) => {
      if (muts.some((m) => !(m.target as Element).closest?.("[data-hero]"))) watch();
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      io.disconnect();
    };
  }, [path]);

  return null;
}
