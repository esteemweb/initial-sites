"use client";

import { useEffect, useRef } from "react";

/* Horizontal filmstrip — refs/tandjung-sari §2.

   The reference lays its panels in a flex row 15,993.6px wide (11.11
   viewport-widths at 1440) and moves it sideways. Below its mobile
   breakpoint the same track becomes `display: block` and the page reverts
   to a conventional vertical scroll — so touch users never meet the
   horizontal mechanic at all. Both behaviours are reproduced here.

   MECHANISM — deliberately not the reference's.
   The reference hijacks the wheel. The autopsy flagged that as a weakness:
   no native scrollbar, no keyboard paging, no position feedback across an
   11-viewport document, and nothing for `prefers-reduced-motion` to fall
   back to. Instead this uses the sticky-track technique: a tall spacer
   drives ordinary vertical scrolling, and a sticky viewport translates the
   row horizontally in proportion. The result on screen is the same
   filmstrip; the scrollbar, keyboard, trackpad and reduced-motion
   behaviour all stay native.

   The spacer's height equals the horizontal distance to travel, so one
   pixel of wheel movement is one pixel of sideways travel — the motion
   reads 1:1 rather than geared. */

export function Rail({ children }: { children: React.ReactNode }) {
  const spacer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sp = spacer.current;
    const tr = track.current;
    if (!sp || !tr) return;

    const mq = window.matchMedia("(min-width: 40rem)");
    let distance = 0;
    let frame = 0;

    const layout = () => {
      if (!mq.matches) {
        /* Vertical mode: hand the page back to normal flow. */
        sp.style.height = "";
        tr.style.transform = "";
        document.documentElement.dataset.rail = "off";
        distance = 0;
        return;
      }
      document.documentElement.dataset.rail = "on";
      distance = Math.max(0, tr.scrollWidth - window.innerWidth);
      /* Vertical room to travel == horizontal distance, so scrolling is 1:1. */
      sp.style.height = `${distance + window.innerHeight}px`;
      update();
    };

    const update = () => {
      if (distance <= 0) return;
      const top = sp.offsetTop;
      const progress = Math.min(
        1,
        Math.max(0, (window.scrollY - top) / distance),
      );
      tr.style.transform = `translate3d(${-(progress * distance).toFixed(2)}px, 0, 0)`;
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    layout();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", layout);
    mq.addEventListener("change", layout);

    /* Panel widths depend on fonts and images settling. */
    const ro = new ResizeObserver(layout);
    ro.observe(tr);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", layout);
      mq.removeEventListener("change", layout);
      ro.disconnect();
      delete document.documentElement.dataset.rail;
    };
  }, []);

  return (
    <div ref={spacer} className="rail-spacer">
      <div className="rail-viewport">
        <div ref={track} className="rail-track">
          {children}
        </div>
      </div>
    </div>
  );
}
