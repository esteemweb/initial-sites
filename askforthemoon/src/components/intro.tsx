"use client";

import { useEffect, type CSSProperties } from "react";
import { book } from "@/lib/content";
import { Moon, PHASES } from "./moon";

/* The first thing you see, on every load: a night field, the title rising a
   letter at a time, a moon waxing from new to full with its phase named as it
   goes, and the book's eight chapter moons lighting up around it. Then the
   orbit spins away and the full moon opens into a window onto the cover.

   Runs on CSS alone, so it finishes without JS; every step is 600ms or less
   and nothing loops. The hero paints underneath from the first frame. JS only
   lets a click, key or scroll hurry it to the end. Reduced motion: none of
   this renders. The waxing matches litPath in moon.tsx: a night ellipse
   narrows off the right half (new → half), then a lit ellipse widens over the
   left half (half → full). */

const NAMES = ["New moon", "Waxing crescent", "First quarter", "Waxing gibbous", "Full moon"];

const i = (n: number) => ({ "--i": n }) as CSSProperties;

export function Intro() {
  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains("intro-off")) return;
    const events = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
    const hurry = () => {
      for (const a of document.getAnimations()) {
        if (a instanceof CSSAnimation && a.animationName.startsWith("intro-") && a.playState !== "finished") a.playbackRate = 8;
      }
      window.dispatchEvent(new Event("intro-skip"));
      off();
    };
    const off = () => events.forEach((e) => window.removeEventListener(e, hurry));
    events.forEach((e) => window.addEventListener(e, hurry, { passive: true, once: true }));
    const done = window.setTimeout(off, 3200);
    return () => {
      off();
      window.clearTimeout(done);
    };
  }, []);

  return (
    <div className="intro" aria-hidden="true">
      <div className="intro-mark">
        <p className="intro-title">
          {[...book.title].map((c, n) => (
            <span key={n} style={i(n)}>
              {c === " " ? " " : c}
            </span>
          ))}
        </p>

        <div className="intro-orbit">
          {PHASES.map((p, n) => (
            <span key={n} className="intro-glyph" style={i(n)}>
              <Moon lit={p.lit} waning={p.waning} size={24} />
            </span>
          ))}
        </div>

        <svg className="intro-moon" viewBox="0 0 24 24" focusable="false">
          <defs>
            <clipPath id="intro-right">
              <rect x="12" y="0" width="12" height="24" />
            </clipPath>
            <clipPath id="intro-left">
              <rect x="0" y="0" width="12.25" height="24" />
            </clipPath>
          </defs>
          <path d="M 12 1 A 11 11 0 0 1 12 23 Z" />
          <g clipPath="url(#intro-right)">
            <ellipse className="intro-shade" cx="12" cy="12" rx="11" ry="11.5" />
          </g>
          <g clipPath="url(#intro-left)">
            <ellipse className="intro-fill" cx="12" cy="12" rx="11" ry="11" />
          </g>
          <path
            fillRule="evenodd"
            d="M 1 12 a 11 11 0 1 0 22 0 a 11 11 0 1 0 -22 0 Z M 3 12 a 9 9 0 1 0 18 0 a 9 9 0 1 0 -18 0 Z"
          />
        </svg>

        <p className="intro-label label">
          <span className="intro-names">
            {NAMES.map((name, n) => (
              <span key={name} style={i(n)}>
                {name}
              </span>
            ))}
          </span>
          <span className="intro-count" />
        </p>
      </div>
    </div>
  );
}
