"use client";

import { useEffect, useState } from "react";
import { Moon } from "./moon";
import { worldAt } from "@/lib/worlds";

/* A single moon in the right margin that waxes, new to full, as you read down.
   It takes its ink from the world beneath it (sections carry data-at: 100 is
   page, anything less leaves night at the right edge). */
export function ProgressMoon() {
  const [p, setP] = useState(0);
  const [onPage, setOnPage] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      // half-percent steps: the moon still waxes smoothly, React re-renders rarely
      setP(max > 0 ? Math.round(Math.min(1, Math.max(0, window.scrollY / max)) * 200) / 200 : 1);
      setOnPage(worldAt(window.scrollY + window.innerHeight / 2) >= 100);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const pct = Math.round(p * 100);
  return (
    <div
      className="progress-moon"
      data-ground={onPage ? "page" : "night"}
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      aria-valuetext={`${pct}% read`}
    >
      <Moon lit={p} size={24} />
    </div>
  );
}
