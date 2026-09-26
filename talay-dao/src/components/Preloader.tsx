"use client";

import { useEffect, useState } from "react";

/* Preloader — refs/tandjung-sari §8.

   TAKEN: the reference ships one (its `.preloader` sits translated -1536px
   after it has run). The autopsy recorded "entrance animation on load:
   present" and the first build had none, so the page simply appeared —
   which is the single biggest reason it felt like a static document rather
   than something arriving.

   A single hairline Archimedean spiral draws itself outward from the centre
   while it turns and the wordmark settles in over it. The canvas behind them
   is not a flat panel: it is one fat spiral stroke, wide enough that its
   turns touch and cover the viewport. On leaving, that stroke unwinds from
   the outside in while the whole sheet turns, so the hero is revealed along
   a swirling edge that closes on the centre; the stage winds into the same
   point just ahead of it. Runs on every mount — every full load and every
   refresh — nothing is remembered between visits.

   Waits for fonts so the wordmark does not swap face mid-reveal.

   Reduced motion: no spiral, no lift, no delay — it is removed on the first
   frame. */

/* r = a + bθ, 3.5 turns, 12 units of viewBox per turn. Deterministic, so
   the server and client render the same path. */
const SPIRAL_PATH = (() => {
  const turns = 3.5;
  const step = 0.08;
  const a = 2;
  const b = 12 / (2 * Math.PI);
  const points: string[] = [];
  for (let t = 0; t <= turns * 2 * Math.PI; t += step) {
    const r = a + b * t;
    points.push(`${(r * Math.cos(t)).toFixed(2)} ${(r * Math.sin(t)).toFixed(2)}`);
  }
  return `M${points.join(" L")}`;
})();

/* The canvas wipe. Four turns, pitch 9, reaching r = 36 in a 100-unit box
   drawn at twice the viewport: the visible half-diagonal is at most 35.4
   units at any aspect, and rotation about the centre does not change that.
   Stroke slightly wider than the pitch so the turns overlap with no seam;
   round caps so the start cap fills the origin. */
const WIPE_TURNS = 4;
const WIPE_PITCH = 9;
const WIPE_PATH = (() => {
  const step = 0.08;
  const b = WIPE_PITCH / (2 * Math.PI);
  const points: string[] = [];
  for (let t = 0; t <= WIPE_TURNS * 2 * Math.PI; t += step) {
    const r = b * t;
    points.push(`${(r * Math.cos(t)).toFixed(2)} ${(r * Math.sin(t)).toFixed(2)}`);
  }
  return `M${points.join(" L")}`;
})();

const HOLD_MS = 620;

/* The hero settle keys on the attribute; the radial carousel's intro spin
   keys on the event, so it starts on the same frame the sheet begins to
   unwind. */
function markLoaded() {
  document.documentElement.dataset.loaded = "true";
  document.dispatchEvent(new CustomEvent("talaydao:loaded"));
}
/* Matches --duration-wipe in globals.css. */
const LEAVE_MS = 720;

export function Preloader() {
  const [state, setState] = useState<"in" | "leaving" | "gone">("in");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setState("gone");
      markLoaded();
      return;
    }

    let leaveTimer: number;
    let goneTimer: number;

    const start = () => {
      /* Hold while the spiral finishes drawing and the wordmark is read. */
      leaveTimer = window.setTimeout(() => {
        setState("leaving");
        markLoaded();
        goneTimer = window.setTimeout(() => setState("gone"), LEAVE_MS);
      }, HOLD_MS);
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(start).catch(start);
    } else {
      start();
    }

    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(goneTimer);
    };
  }, []);

  if (state === "gone") return null;

  return (
    <div
      aria-hidden="true"
      data-state={state}
      className="preloader pointer-events-none fixed inset-0 z-[200] grid place-items-center overflow-hidden"
    >
      <svg
        className="preloader-wipe"
        viewBox="-50 -50 100 100"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
      >
        <path
          d={WIPE_PATH}
          pathLength={1}
          fill="none"
          strokeWidth={WIPE_PITCH * 1.06}
          strokeLinecap="round"
        />
      </svg>
      <div className="preloader-stage relative grid place-items-center">
        <svg
          className="preloader-spiral"
          viewBox="-50 -50 100 100"
          focusable="false"
        >
          <path
            d={SPIRAL_PATH}
            pathLength={1}
            fill="none"
            stroke="currentColor"
            strokeWidth={0.16}
            strokeLinecap="round"
          />
        </svg>
        <span className="preloader-mark absolute inset-0 grid place-items-center font-display text-display text-ink">
          Talay Dao
        </span>
      </div>
    </div>
  );
}
