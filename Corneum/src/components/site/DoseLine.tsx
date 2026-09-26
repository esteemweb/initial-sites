"use client";

import { useEffect, useRef, useState } from "react";
import { VesselDrawing } from "./VesselDrawing";

/* Product page: the whole drawing, and the page's one orchestrated moment.
   When it enters the viewport the fill rises to the dose line (920 ms,
   ease-enter, once). Server render and no-JS show it already filled; under
   reduced motion it jumps to filled. */
export function DoseLine({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const [filled, setFilled] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) return; // already on screen: leave it filled
    setFilled(false);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFilled(true);
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <VesselDrawing ref={ref} className={className} fill={filled ? 1 : 0} animateFill={filled} />;
}
