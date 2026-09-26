"use client";

import { useEffect, useRef, type ReactElement } from "react";
import { PRODUCTS } from "@/data/products";

/**
 * The weight strip: every fabric weight in the range, at `display` scale, on a
 * full-bleed `signal` band.
 *
 * This is the homepage's one orchestrated moment, and §9 allows exactly one. It
 * is also the only thing on the page that responds to scroll — §7 rules out
 * scroll animation as a default, so spending it here means nothing else gets to.
 *
 * **The mechanic is a real scroll container, not a transform.** The strip is
 * `overflow-x-auto` at all times and the page scroll drives its `scrollLeft`.
 * That one choice covers every path without a second implementation: with
 * scripting the numbers track the page; under `prefers-reduced-motion` the
 * listener never attaches and the reader scrolls or swipes it themselves; with
 * no scripting at all it is still an ordinary scroll region. No number is ever
 * unreachable, and there is no hover anywhere in it.
 *
 * Weights are derived from the catalogue rather than typed out. The Warm Iron
 * Beanie is lambswool and carries no GSM, so it is simply not here.
 */

interface Weight {
  id: string;
  gsm: number;
  name: string;
}

const WEIGHTS: Weight[] = PRODUCTS.flatMap((product) =>
  product.gsm === null
    ? []
    : [{ id: product.id, gsm: product.gsm, name: product.name }],
).sort((a, b) => a.gsm - b.gsm);

const LABEL = "Fabric weight, every garment";

export default function WeightStrip(): ReactElement {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const scroller = scrollerRef.current;
    if (!section || !scroller) return;

    // The static equivalent is the scroll container itself, which is always
    // there. Bailing out here leaves a strip the reader moves at their own
    // pace rather than one that has quietly lost most of its content.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();

      // 0 as the band enters at the bottom of the viewport, 1 as it leaves at
      // the top, so the full range is traversed by the time it is gone.
      const travel = window.innerHeight + rect.height;
      const progress = Math.min(
        1,
        Math.max(0, (window.innerHeight - rect.top) / travel),
      );

      scroller.scrollLeft =
        progress * (scroller.scrollWidth - scroller.clientWidth);
    };

    // Listening on window, and writing to an element's scrollLeft: element
    // scroll does not bubble, so this cannot feed itself.
    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="weight-heading"
      className="bg-rose py-80 text-page desktop:py-96"
    >
      <div className="shell">
        <h2 id="weight-heading" className="type-label">
          {LABEL}
        </h2>
      </div>

      {/* Focusable so the strip can be scrolled from the keyboard, which an
          overflow container does not get on its own.

          `relative` is load-bearing, not decoration. `sr-only` is absolutely
          positioned, and an absolute element is only clipped by an ancestor
          that is its containing block. Left static, this container would scroll
          its own content correctly while the hidden unit labels sat at their
          static positions 6000px to the right, escaping the clip and putting a
          horizontal scrollbar on the whole page. */}
      <div
        ref={scrollerRef}
        tabIndex={0}
        role="region"
        aria-label={LABEL}
        className="relative mt-40 overflow-x-auto overscroll-x-contain px-24 desktop:px-64"
      >
        <ul className="flex w-max items-end gap-40 desktop:gap-96">
          {WEIGHTS.map((weight) => (
            <li key={weight.id}>
              <p className="type-display">
                {weight.gsm}
                <span className="sr-only"> gsm</span>
              </p>
              <p className="type-label mt-16">{weight.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
