"use client";

import { useEffect } from "react";

/* You read at the pace the page sets: in the long passages, words below the
   reading line (75% down the viewport) sit at 60% — clear, still 4.6:1 or
   better — and come to full as the line crosses them, in a soft sweep left to
   right along the line being crossed. It follows scroll both ways.

   Cheap by construction: passage and word positions are measured once (and
   again on resize). A scroll frame reads only window.scrollY and then writes,
   so it can never force a layout. Opacity is the only property written. Inverted copies (the
   lit layer of a Split) mirror their twin. Reduced motion: nothing dims. */

type Word = { els: HTMLElement[]; x: number; y: number; h: number; o: number };
type Block = { el: HTMLElement; docTop: number; w: number; h: number; words: Word[]; state: "above" | "below" | "live" | "" };

const DIM = 0.6;
const LINE = 0.75;

export function ReadPace() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    root.classList.add("pace-on");
    let blocks: Block[] = [];
    let raf = 0;

    /* the same passage inside the inverted (lit) copy of a Split, if any */
    const twinOf = (b: HTMLElement) => {
      const dark = b.closest(".split > .layer-dark");
      const lit = dark?.parentElement?.querySelector(":scope > .layer-lit");
      if (!dark || !lit) return null;
      const i = [...dark.querySelectorAll(".pace")].indexOf(b);
      return (lit.querySelectorAll<HTMLElement>(".pace")[i] as HTMLElement) ?? null;
    };

    const measure = () => {
      blocks = [...document.querySelectorAll<HTMLElement>(".pace")]
        .filter((b) => !b.closest(".layer-lit"))
        .map((b) => {
          const br = b.getBoundingClientRect();
          const twin = twinOf(b);
          const own = [...b.querySelectorAll<HTMLElement>(".w-pace")];
          const mirror = twin ? [...twin.querySelectorAll<HTMLElement>(".w-pace")] : [];
          return {
            el: b,
            docTop: br.top + window.scrollY,
            w: Math.max(1, br.width),
            h: br.height,
            state: "" as Block["state"],
            words: own.map((w, i) => {
              const r = w.getBoundingClientRect();
              return { els: mirror[i] ? [w, mirror[i]] : [w], x: r.left - br.left, y: r.top - br.top, h: r.height, o: -1 };
            }),
          };
        });
      schedule();
    };

    const set = (w: Word, o: number) => {
      if (Math.abs(w.o - o) < 0.01) return;
      w.o = o;
      const v = o >= 0.999 ? "1" : o <= DIM + 0.001 ? "" : o.toFixed(3);
      for (const el of w.els) el.style.opacity = v === "" ? "" : v;
    };

    const update = () => {
      const vh = window.innerHeight;
      const line = vh * LINE;
      // no layout reads at all: positions were cached by measure()
      const sy = window.scrollY;
      blocks.forEach((b) => {
        const top = b.docTop - sy;
        if (top + b.h <= line) {
          if (b.state !== "above") for (const w of b.words) set(w, 1);
          b.state = "above";
          return;
        }
        if (top >= line) {
          if (b.state !== "below") for (const w of b.words) set(w, DIM);
          b.state = "below";
          return;
        }
        b.state = "live";
        for (const w of b.words) {
          const wt = top + w.y;
          // how much of this word's line has crossed the reading line, 0–1
          const row = Math.min(1, Math.max(0, (line - wt) / w.h));
          // sweep left to right across the crossing line, softly
          const k = Math.min(1, Math.max(0, (row - (w.x / b.w) * 0.85) * 5));
          set(w, DIM + (1 - DIM) * k);
        }
      });
    };

    function schedule() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    }

    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(document.body);
    document.fonts?.ready.then(measure);
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", schedule);
      root.classList.remove("pace-on");
    };
  }, []);
  return null;
}
