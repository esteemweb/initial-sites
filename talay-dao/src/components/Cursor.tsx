"use client";

import { useEffect, useRef } from "react";

/* Custom cursor — refs/tandjung-sari §12.

   The reference ships a `.base-cursor` element. The autopsy listed it under
   "expensive / risky to replicate" and the first build skipped it; it is one
   of the small things that makes a page feel responsive to the pointer
   rather than inert.

   A single hairline ring that lerps toward the pointer and swells over
   interactive elements. Deliberately no fill and no blend mode — this system
   is hairline-flat, and a solid dot would be the only filled round object on
   the whole site.

   Disabled entirely for reduced motion and for any device without a fine
   pointer, where it would be meaningless. */

export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    let frame = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let shown = false;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!shown) {
        shown = true;
        el.dataset.visible = "true";
      }
      const interactive = (e.target as Element)?.closest?.("a, button, [tabindex]");
      el.dataset.over = interactive ? "true" : "false";
      wake();
    };

    const onLeave = () => {
      shown = false;
      el.dataset.visible = "false";
    };

    /* Parks once it has caught up with the pointer, and is restarted by the
       next pointermove — rather than holding a 60fps loop open for the life
       of the page. */
    const tick = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) translate(-50%, -50%)`;
      frame =
        Math.abs(tx - x) > 0.1 || Math.abs(ty - y) > 0.1
          ? requestAnimationFrame(tick)
          : 0;
    };

    const wake = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <div ref={ref} aria-hidden="true" className="site-cursor" data-visible="false" />;
}
