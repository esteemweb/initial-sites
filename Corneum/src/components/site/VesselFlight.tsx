"use client";

import { useEffect, useRef } from "react";
import { FRAME_COUNT, TUMBLE_END, flightBox, flightFrame, pinFrame, squareIn } from "@/lib/flight";

/* Vessel 01 as one continuous object from the hero into the pin (the
   reference's travelling bottle, done as 90 frames rendered in Blender:
   render/vessel.py --shot flight).

   One fixed canvas above the content (below the header and the mobile buy
   bar). Every animation frame it reads two anchors, the hero slot
   [data-vessel-anchor="hero"] and the pin stage [data-vessel-anchor="pin"],
   and places itself between them by travel progress; inside the pin it
   follows the stage and scrubs by pin progress, then leaves with it. The
   layout never moves (CLS 0): only this canvas's transform changes.

   Loading: frame 1 (the hero still) at once. The other 89 wait for the first
   scroll, so an untouched page costs nothing extra; tumble frames come first,
   every 4th before the rest, then the pin. Each draw uses the nearest frame
   already loaded, so a fast scroll never shows a blank.

   Mounted only when motion is allowed. Until frame 1 is drawn the static
   hero image stays visible; after that it is hidden with opacity (its alt
   text stays for screen readers). The canvas itself is aria-hidden. */

const src = (set: "lg" | "sm", n: number) => `/frames/flight/${set}/${String(n).padStart(4, "0")}.webp`;

function loadOrder() {
  const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  const coarseFirst = (r: number[]) => [...r.filter((n) => n % 4 === 1), ...r.filter((n) => n % 4 !== 1)];
  return [...coarseFirst(range(2, TUMBLE_END)), ...coarseFirst(range(TUMBLE_END + 1, FRAME_COUNT))];
}

export function VesselFlight() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvas.current;
    const heroEl = document.querySelector<HTMLElement>('[data-vessel-anchor="hero"]');
    const pinEl = document.querySelector<HTMLElement>('[data-vessel-anchor="pin"]');
    const track = document.querySelector<HTMLElement>("[data-vessel-track]");
    if (!c || !heroEl || !pinEl || !track) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const set: "lg" | "sm" = window.innerWidth >= 1024 ? "lg" : "sm";
    const native = set === "lg" ? 800 : 600;
    c.width = c.height = native;
    c.style.width = c.style.height = `${native}px`; // scaled to the box by transform

    const frames: (HTMLImageElement | null)[] = Array(FRAME_COUNT + 1).fill(null);
    let drawn = 0;
    let target = 1;
    let raf = 0;
    let cancelled = false;

    const paint = () => {
      // The loaded frame nearest the target (earlier frames win a tie)
      let n = 0;
      for (let d = 0; d < FRAME_COUNT && !n; d++) {
        if (frames[target - d]) n = target - d;
        else if (frames[target + d]) n = target + d;
      }
      const img = frames[n];
      if (!img || n === drawn) return;
      ctx.clearRect(0, 0, native, native);
      ctx.drawImage(img, 0, 0, native, native);
      if (!drawn) document.documentElement.dataset.vesselFlight = "on";
      drawn = n;
    };

    const update = () => {
      raf = 0;
      const vw = window.innerWidth;
      const trackTop = track.getBoundingClientRect().top;
      const trackTravel = track.offsetHeight - window.innerHeight;
      // Travel: 0 at the top of the page, 1 as the pin reaches the top of the viewport
      const pinStart = trackTop + window.scrollY;
      const t = pinStart > 0 ? Math.min(1, window.scrollY / pinStart) : 1;
      const p = trackTravel > 0 ? Math.min(1, Math.max(0, -trackTop / trackTravel)) : 0;

      const pin = squareIn(pinEl.getBoundingClientRect());
      const box = t < 1 ? flightBox(squareIn(heroEl.getBoundingClientRect()), pin, t, vw) : pin;
      c.style.transform = `translate3d(${box.x}px, ${box.y}px, 0) scale(${box.size / native})`;

      target = t < 1 ? flightFrame(t) : pinFrame(p);
      paint();
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const load = async (n: number) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src(set, n);
      try {
        await img.decode();
      } catch {
        return;
      }
      if (cancelled) return;
      frames[n] = img;
      paint(); // redraws only if this frame is nearer the target than the one shown
    };

    let started = false;
    const loadRest = async () => {
      if (started) return;
      started = true;
      for (const n of loadOrder()) {
        if (cancelled) return;
        await load(n);
      }
    };
    const onScroll = () => {
      schedule();
      loadRest();
    };

    update();
    load(1).then(() => {
      if (window.scrollY > 0) loadRest();
    });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", schedule);
      delete document.documentElement.dataset.vesselFlight;
    };
  }, []);

  return (
    <canvas
      ref={canvas}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-10 origin-top-left will-change-transform"
      style={{ transform: "translate3d(-200vw,0,0)" }}
    />
  );
}
