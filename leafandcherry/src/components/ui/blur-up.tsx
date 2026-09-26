"use client";

/* pattern: blur-up load — autopsy §15.1. The reference has no loading screen:
   the page paints at once, and its hero opens on a heavily blurred poster that
   sharpens as the real media arrives. Here the blurred 20px placeholder shows
   instantly (MediaFrame `blurDataURL`), and once the real image has loaded it
   eases from blur(16px) to sharp, settling from 106% to 100% scale as it goes
   so the blur's soft edge never shows the frame behind it.

   The starting blur is CSS (u-blur-up), so a photo that loads before
   hydration never shows sharp and then blurs. The tween is rAF writing inline
   `filter`, not a CSS transition — delayed CSS motion stalls in this project's
   browser (design-system §6) — with a watchdog that forces it sharp, so a
   loaded photo can never be left blurred. Until it loads, the blur only ever
   sits on Next's placeholder, which is a blur anyway. No JS or reduced motion: no blur at all. */
import { useEffect, useRef } from "react";
import { onIntroDone, prefersReducedMotion } from "@/lib/motion";

const FROM = 16; // px of blur
const SCALE = 0.06; // start 6% oversize so the blur's soft edge stays offscreen
const DURATION = 900;
const WATCHDOG = DURATION + 600; // from the start of the tween, not from mount
const easeOut = (t: number) => 1 - (1 - t) ** 3;

export function BlurUp({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const img = ref.current?.querySelector("img");
    if (!img) return;
    let settled = false;
    const sharp = () => {
      settled = true;
      img.style.filter = "none";
      img.style.scale = "1";
    };
    if (prefersReducedMotion()) return sharp();

    let raf = 0;
    let guard = 0;
    const play = () => {
      if (settled) return;
      /* Armed here, not on mount: a lazy photo below the fold may not load
         until the reader scrolls to it, minutes later. The guard only makes
         sure a started tween always lands sharp. */
      guard = window.setTimeout(sharp, WATCHDOG);
      const t0 = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / DURATION);
        const k = 1 - easeOut(t);
        img.style.filter = t < 1 ? `blur(${(FROM * k).toFixed(2)}px)` : "none";
        img.style.scale = (1 + SCALE * k).toFixed(4);
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    /* Not until the loading screen starts to lift: behind it, the sharpen
       would play unseen. */
    const unsubscribe = onIntroDone(() => {
      if (img.complete && img.naturalWidth > 0) play();
      else img.addEventListener("load", play, { once: true });
    });

    return () => {
      unsubscribe();
      cancelAnimationFrame(raf);
      window.clearTimeout(guard);
      img.removeEventListener("load", play);
    };
  }, []);

  return (
    <div ref={ref} className={className ? `u-blur-up ${className}` : "u-blur-up"}>
      {children}
    </div>
  );
}
