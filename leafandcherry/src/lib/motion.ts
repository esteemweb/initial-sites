"use client";

/* Scroll-driven motion helpers — autopsy §15 (the 2026-09-23 screen
   recording). Everything here is driven by a rAF-throttled scroll listener,
   for the same reason as Reveal: IntersectionObserver was measured broken in
   this project's browser, and delayed CSS transitions can stall. Scroll
   events and rAF are the signals that work. */
import { useEffect, type RefObject } from "react";

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * Writes the element's scroll progress to `name` (default `--p`) on the
 * element itself, from 0 when its top edge is at `start` to 1 when it is at
 * `end`. Both are fractions
 * of the viewport height measured from the viewport top, so `start: 1,
 * end: 0.5` runs from "top edge at the fold" to "top edge at mid-screen", and a
 * negative `end` runs on past the top of the viewport (a pinned section).
 *
 * Under reduced motion the variable is never written, so CSS falls back to
 * whatever default each effect declares in its `var(--p, …)` — every effect
 * picks its resting state as that default.
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  start: number,
  end: number,
  name = "--p",
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const top = el.getBoundingClientRect().top;
      const p = clamp01((start * vh - top) / ((start - end) * vh));
      el.style.setProperty(name, p.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      el.style.removeProperty(name);
    };
  }, [ref, start, end, name]);
}

/**
 * Calls `onEnter` once, the first time the element's top crosses 90% of the
 * viewport height. The same trigger line, scroll listener and 400ms geometry
 * poll as Reveal, so the two fire together.
 */
export function useInViewOnce(
  ref: RefObject<HTMLElement | null>,
  onEnter: () => void,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let poll = 0;
    const stop = () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      if (poll) window.clearInterval(poll);
      raf = 0;
      poll = 0;
    };
    const check = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.9 && r.bottom > 0) {
        stop();
        onEnter();
      }
    };
    function onScroll() {
      if (!raf) raf = requestAnimationFrame(check);
    }

    poll = window.setInterval(check, 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();
    return stop;
  }, [ref, onEnter]);
}

/* The first-load intro. PageLoader calls markIntroDone() as its screen starts
   to lift (or at once, if it is skipped); anything that should play *after*
   the intro rather than behind it — the hero's blur-up — waits on
   onIntroDone. Module state, so it is true for the rest of the session and
   client-side navigation never waits on an intro that will not replay. */
let introDone = false;
const introWaiting = new Set<() => void>();

export function markIntroDone() {
  if (introDone) return;
  introDone = true;
  introWaiting.forEach((cb) => cb());
  introWaiting.clear();
}

/** Runs `cb` once the intro has finished (immediately if it already has).
 *  Returns an unsubscribe function. */
export function onIntroDone(cb: () => void) {
  if (introDone) {
    cb();
    return () => {};
  }
  introWaiting.add(cb);
  return () => {
    introWaiting.delete(cb);
  };
}
