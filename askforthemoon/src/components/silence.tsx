"use client";

import { useEffect } from "react";

/* Four seconds of nothing. The first time the silence mechanic is fully on
   screen, everything after it fades out and stays out for four seconds, then
   comes back. Scroll stays native — you can scroll, into blank page and night.
   Opacity only: nothing shifts, screen readers keep the text, and moving focus
   into the silenced region ends it at once. Once per load. With reduced motion
   there is no pause; a static [4 sec] caption stands in (CSS). */
export function Silence() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const target = document.querySelector<HTMLElement>(".layer-dark [data-silence-trigger]");
    if (!target) return;
    const body = document.body;
    let done = false;
    let timer = 0;
    let dwell = 0;
    let raf = 0;
    let jumpedAt = 0; // anchor jumps smooth-scroll past row III; they don't count

    const end = () => {
      window.clearTimeout(timer);
      delete body.dataset.silence;
      document.removeEventListener("focusin", onFocus);
    };
    const onFocus = (e: FocusEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("[data-silenced], .rooms > li:nth-child(n+4)") || !el.closest(".rooms > li:nth-child(-n+3), .site-header")) end();
    };
    const start = () => {
      done = true;
      window.removeEventListener("scroll", onScroll);
      body.dataset.silence = "on";
      timer = window.setTimeout(end, 4000);
      document.addEventListener("focusin", onFocus);
    };
    // document position of the line, cached; a scroll frame only reads scrollY
    let pos = { top: 0, bottom: 0 };
    const measure = () => {
      const r = target.getBoundingClientRect();
      pos = { top: r.top + window.scrollY, bottom: r.bottom + window.scrollY };
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    const inView = () => {
      const top = pos.top - window.scrollY;
      const bottom = pos.bottom - window.scrollY;
      return top >= 0 && bottom <= window.innerHeight && top < window.innerHeight * 0.7;
    };
    /* The reader has to arrive: the line must stay in view for 350ms. */
    const check = () => {
      if (done) return;
      if (!inView() || performance.now() - jumpedAt < 1500) {
        window.clearTimeout(dwell);
        dwell = 0;
        return;
      }
      if (!dwell) dwell = window.setTimeout(() => {
        dwell = 0;
        if (!done && inView() && performance.now() - jumpedAt >= 1500) start();
      }, 350);
    };
    const onJump = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a[href^="#"], a[href^="/#"]')) jumpedAt = performance.now();
    };
    const onHash = () => (jumpedAt = performance.now());
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(check);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onJump, true);
    window.addEventListener("hashchange", onHash);
    check();
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onJump, true);
      window.removeEventListener("hashchange", onHash);
      window.clearTimeout(dwell);
      ro.disconnect();
      cancelAnimationFrame(raf);
      end();
    };
  }, []);
  return null;
}
