"use client";

/* Where each world (section with data-at) sits on the page, in document
   coordinates — measured once, and again when the page resizes. Scroll
   handlers ask this instead of measuring the DOM every frame, so a scroll
   frame reads nothing from layout and can't force a reflow. */

type World = { top: number; bottom: number; at: number };
let worlds: World[] | null = null;
let observed = false;

function measure() {
  worlds = [...document.querySelectorAll<HTMLElement>("[data-at]")].map((el) => {
    const r = el.getBoundingClientRect();
    return { top: r.top + window.scrollY, bottom: r.bottom + window.scrollY, at: Number(el.dataset.at) };
  });
}

export function invalidateWorlds() {
  worlds = null;
}

/** The join (data-at) of the section at a document y position. */
export function worldAt(docY: number): number {
  if (!observed && typeof ResizeObserver !== "undefined") {
    observed = true;
    new ResizeObserver(() => (worlds = null)).observe(document.body);
    document.fonts?.ready.then(() => (worlds = null));
  }
  if (!worlds) measure();
  // innermost match wins (rows sit inside the contents section)
  let found: World | null = null;
  for (const w of worlds!) if (w.top <= docY && w.bottom > docY && (!found || w.top >= found.top)) found = w;
  return found ? found.at : 0;
}
