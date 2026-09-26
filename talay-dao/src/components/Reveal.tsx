"use client";

import { useEffect, useRef, useState } from "react";
import { registerReveal } from "@/components/revealRegistry";

/* Scroll reveal — design-system.md §6.
   TAKEN from refs/tandjung-sari §8: opacity + translate on the reference's
   exact curve, cubic-bezier(0.24, 0.43, 0.15, 0.97) at 800ms. Its stagger
   was applied from JS and the autopsy recorded it as `not measurable`, so
   the value below is OURS, not the reference's — see the token note in
   design-system.md.

   Isolated client leaf: the panels around it stay Server Components.

   prefers-reduced-motion is honoured twice over — the CSS collapses the
   transition, and this component skips the transform entirely. The
   reference ships no reduced-motion query at all. */

export function Reveal({
  children,
  index = 0,
  className = "",
}: {
  children: React.ReactNode;
  /** Position within a stagger group */
  index?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    /* Scroll-driven, not IntersectionObserver: the rail moves panels with a
       transform, which IO does not reliably re-evaluate. See
       revealRegistry.ts. */
    return registerReveal(el, () => setShown(true));
  }, []);

  return (
    <div
      ref={ref}
      data-parallax
      className={`transition-reveal ${shown ? "translate-y-0 opacity-100" : "translate-y-lg opacity-0"} ${className}`}
      style={{
        transitionDelay: shown ? `calc(var(--duration-stagger) * ${index})` : "0ms",
      }}
    >
      {children}
    </div>
  );
}
