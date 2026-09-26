"use client";

import { useEffect, useRef, useState } from "react";
import { book } from "@/lib/content";
import { daysSince } from "@/lib/days";

/* The live line: days since (or until) publication, counted in London. The
   page is static: it hydrates with the count from the day it was built (so
   server and client agree), then corrects itself on mount. In the hero, while
   the moon intro plays, it counts up from 0 as the imprint lands (600ms). */
export function DayCount({ built }: { built: number }) {
  const [days, setDays] = useState(built);
  const [final, setFinal] = useState(built);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const target = daysSince(book.publishedISO);
    setFinal(target);
    const root = document.documentElement;
    const intro = document.getAnimations().find((a) => a instanceof CSSAnimation && a.animationName === "intro-open");
    const counting =
      ref.current?.closest(".hero") &&
      intro &&
      !root.classList.contains("intro-off") &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!counting) {
      setDays(target);
      return;
    }
    let raf = 0;
    const start = Number(intro.startTime ?? document.timeline.currentTime ?? 0) + 2700;
    const tick = () => {
      const now = Number(document.timeline.currentTime ?? 0);
      const k = Math.min(1, Math.max(0, (now - start) / 600));
      setDays(Math.round(target * (1 - (1 - k) ** 3)));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const skip = () => {
      cancelAnimationFrame(raf);
      setDays(target);
    };
    window.addEventListener("intro-skip", skip);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("intro-skip", skip);
    };
  }, []);

  const [y, m, d] = book.publishedISO.split("-");
  const shown = days < 0 ? `−${Math.abs(days)}` : String(days);
  // screen readers get the settled number, never the count in flight
  const spoken = final < 0 ? `${Math.abs(final)} days until publication` : `${final} days since publication`;
  return (
    <span ref={ref}>
      <span aria-hidden="true">
        Opened {d}.{m}.{y} · Day {shown}
      </span>
      <span className="sr-only">
        Published {book.published}; {spoken}.
      </span>
    </span>
  );
}
