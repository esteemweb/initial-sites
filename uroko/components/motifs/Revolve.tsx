"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Two faces on one card: the plate, and the same motif tattooed on someone.
 * Desktop turns it over on hover (of the card link or the image itself) or keyboard focus (CSS, see .revolve in
 * globals.css). Touch screens have no hover, so a card turns over by itself
 * while it sits in the middle band of the screen and turns back as it leaves.
 * Reduced motion swaps the turn for a crossfade.
 */
export function Revolve({
  front,
  back,
  fill = false,
}: {
  front: ReactNode;
  back: ReactNode;
  /** Stretch to the parent's height (for plates sized by their container) */
  fill?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !matchMedia("(hover: none)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => el.toggleAttribute("data-flipped", entry.isIntersecting),
      { rootMargin: "-35% 0px -35% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={fill ? "revolve h-full" : "revolve"}>
      <div className={fill ? "revolve-inner h-full" : "revolve-inner"}>
        <div className={fill ? "revolve-face h-full" : "revolve-face"}>{front}</div>
        <div className="revolve-face revolve-back">{back}</div>
      </div>
    </div>
  );
}
