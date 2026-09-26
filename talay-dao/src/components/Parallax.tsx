"use client";

import { useEffect, useRef } from "react";

/* Differential parallax — refs/tandjung-sari §8.

   The reference moves elements at FOUR simultaneous rates, measured at
   -222px (inner img), -642px (.image), -768px (picture / title) and
   -1493px (.content). Images travel slower than their frames, text travels
   fastest. That differential is the mechanism behind its sense of depth,
   and the first build cut it to two rates "for restraint" — which is most
   of why the page read flat.

   ONE SHARED TICKER. The first version of this file started a separate
   requestAnimationFrame loop per instance; at 22 instances that is 22
   callbacks every frame, which froze the render thread outright. All
   instances now register with a single module-level loop that also parks
   itself when nothing is on screen.

   Transforms are written straight to style — no React state, so no
   re-render per frame. Honours prefers-reduced-motion by never registering,
   and carries data-parallax so the global reduced-motion rule clears any
   transform that did land. */

type Item = { el: HTMLElement; rate: number; current: number; target: number };

/* Travel is CLAMPED. The offset is proportional to an element's distance
   from the viewport centre, and in a horizontal track that is 8+ viewports
   wide an element can sit 3000px from centre — at rate -0.14 that is 420px
   of travel, which slid beat media straight over its own caption. Parallax
   is meant to suggest depth, not relocate things.

   32px is chosen to sit under the smallest gap the layout uses between a
   media column and its caption (--spacing-xl, 48px), so travel can never
   close that gap at any scroll position. */
const MAX_TRAVEL = 32;

const items = new Set<Item>();
let frame = 0;

/* The rail turns the page sideways, so the parallax axis has to turn with
   it — otherwise media drifts vertically while the page travels across. */
function horizontal() {
  return document.documentElement.dataset.rail === "on";
}

function measure() {
  const across = horizontal();
  const half = (across ? window.innerWidth : window.innerHeight) / 2;
  for (const item of items) {
    const rect = item.el.getBoundingClientRect();
    /* Offset from the viewport centre on the scrolling axis, so travel is
       zero as the element passes through the middle of the screen and grows
       symmetrically either side. */
    const fromCentre = across
      ? rect.left + rect.width / 2 - half
      : rect.top + rect.height / 2 - half;
    const raw = fromCentre * item.rate;
    item.target = Math.max(-MAX_TRAVEL, Math.min(MAX_TRAVEL, raw));
  }
}

function tick() {
  const across = horizontal();
  let moving = false;
  for (const item of items) {
    /* Light lerp so motion settles rather than tracking scroll 1:1 —
       this is what reads as weight. */
    item.current += (item.target - item.current) * 0.12;
    if (Math.abs(item.target - item.current) > 0.05) moving = true;
    item.el.style.transform = across
      ? `translate3d(${item.current.toFixed(2)}px, 0, 0)`
      : `translate3d(0, ${item.current.toFixed(2)}px, 0)`;
  }
  /* Park when everything has settled. The earlier `moving || items.size`
     never evaluated false, so this ran at 60fps forever, transforming every
     registered element whether or not it had anywhere to go. onScroll calls
     start() again, so nothing is lost by stopping. */
  frame = moving ? requestAnimationFrame(tick) : 0;
}

function start() {
  if (frame || items.size === 0) return;
  measure();
  frame = requestAnimationFrame(tick);
}

function onScroll() {
  measure();
  start();
}

export function Parallax({
  rate = -0.12,
  className = "",
  children,
}: {
  rate?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const item: Item = { el, rate, current: 0, target: 0 };
    items.add(item);

    if (items.size === 1) {
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
    }
    measure();
    item.current = item.target;
    start();

    return () => {
      items.delete(item);
      el.style.transform = "";
      if (items.size === 0) {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };
  }, [rate]);

  return (
    <div ref={ref} data-parallax className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
