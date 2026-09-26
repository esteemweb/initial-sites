"use client";

/* pattern: scroll reveal — autopsy §8, measured verbatim on the reference:
   opacity only (no translate), 200ms, cubic-bezier(0.12, 0, 0.39, 0),
   200ms delay. Motion intensity `subtle`; nothing scales or moves.

   Driven by a rAF-throttled scroll listener rather than IntersectionObserver.
   IO was measured broken in this project's browser — a freshly constructed
   observer on a plain element never fired even once — which left every reveal
   waiting on its failsafe timer and made the whole page simply appear 1.2s
   after load, with no relationship to scrolling at all. The nav's scroll
   listener works in the same browser, so scroll is the reliable signal here.
   One listener per Reveal, coalesced into a single rAF, disconnecting the
   moment it fires. */
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type Props = {
  as?: "div" | "section" | "li";
  className?: string;
  children: React.ReactNode;
};

export function Reveal({ as: Tag = "div", className, children }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* Reduced motion is handled in CSS (globals.css pins .u-reveal to
       opacity 1 under the media query), not here — doing it with setState in
       an effect body causes a cascading render and can flash. */
    let raf = 0;
    let done = false;

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
      if (done) return;
      const r = el.getBoundingClientRect();
      // Same trigger line as the old rootMargin: 10% up from the bottom edge.
      if (r.top < window.innerHeight * 0.9 && r.bottom > 0) {
        done = true;
        setShown(true);
        stop();

        /* Watchdog. The reveal is a CSS opacity transition, and a transition
           that starts but never advances leaves the element stranded at
           opacity 0 — content invisible, not merely un-animated. Observed in
           this project's Chrome, where transitions report playState "running"
           indefinitely (the same wedged-renderer fault that breaks
           IntersectionObserver here). If the fade has not landed shortly after
           it should have, force it. Costs nothing when the browser is healthy;
           prevents a blank page when it is not. */
        window.setTimeout(() => {
          if (parseFloat(getComputedStyle(el).opacity) < 1) {
            /* Cancelling the transition is the point: a running transition
               sits in the animation origin, which outranks inline style, so
               setting opacity alone is ignored while it is stuck. */
            el.style.transition = "none";
            el.style.opacity = "1";
          }
        }, 900);
      }
    };

    function onScroll() {
      if (!raf) raf = requestAnimationFrame(check);
    }

    /* Fallback poll, running the SAME viewport test — not a blanket reveal.
       An earlier version simply showed everything after a timeout, which
       rescued the content but destroyed the effect: by the time you scrolled
       to a section it had already been visible for several seconds, so nothing
       ever faded in. Polling the real geometry means an element still only
       appears when it is genuinely in view, while surviving a browser where
       scroll events or observers misbehave. */
    poll = window.setInterval(check, 400);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll(); // evaluate the first screen without waiting for a scroll

    return stop;
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={cn("u-reveal", shown && "u-reveal-in", className)}
    >
      {children}
    </Tag>
  );
}
