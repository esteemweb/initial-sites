"use client";

import { useEffect, useState, type RefObject } from "react";

/* 0–1 progress of the window scrolling through an element taller than the
   viewport: 0 when its top reaches the top of the viewport, 1 when its
   bottom reaches the bottom. Native scroll only — a passive listener,
   throttled to one read per animation frame. */
export function useScrollProgress(ref: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const travel = r.height - window.innerHeight;
      setProgress(travel > 0 ? Math.min(1, Math.max(0, -r.top / travel)) : 0);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ref]);

  return progress;
}
