"use client";

/* Scroll-driven reveal registry.

   Replaces IntersectionObserver for every reveal on the page.

   WHY: in rail mode the panels move by a CSS transform on the track, not by
   scrolling. IntersectionObserver is not reliably recomputed for an
   ancestor transform, so reveals fired late and erratically — panels sat
   fully on screen with their text still at opacity 0, which is what read as
   "blank spaces". Measuring the element's own rect on each scroll frame is
   immune to that, because getBoundingClientRect always reflects the applied
   transform.

   One shared listener and one rAF for the whole page, rather than an
   observer per element. Entries unregister themselves once shown. */

type Entry = { el: HTMLElement; show: () => void; margin: number };

const entries = new Set<Entry>();
let lastRun = 0;
let listening = false;

/* Deliberately NOT rAF-scheduled.

   requestAnimationFrame is throttled to zero in background tabs, under low
   power, and in some automation contexts — observed dead in testing here.
   Revealing the page's content is not an animation nicety; if it does not
   run, the site is blank. So the check runs directly on the scroll event,
   throttled by timestamp. Twenty getBoundingClientRect calls is cheap, and
   scroll events are already coalesced by the browser. */
const THROTTLE_MS = 80;

function check() {
  lastRun = performance.now();
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  for (const entry of [...entries]) {
    const r = entry.el.getBoundingClientRect();
    /* Visible, or within `margin` of entering — on either axis, so the same
       code serves the horizontal rail and the vertical fallback. */
    const nearX = r.left < vw + entry.margin && r.right > -entry.margin;
    const nearY = r.top < vh + entry.margin && r.bottom > -entry.margin;
    if (nearX && nearY) {
      entries.delete(entry);
      entry.show();
    }
  }

  if (entries.size === 0) stop();
}

let trailing: ReturnType<typeof setTimeout> | undefined;

/* Leading edge AND trailing edge. A leading-only throttle drops the final
   scroll event whenever it lands inside the window, so whatever is on
   screen when scrolling stops never gets checked and stays hidden — which
   is exactly how three on-screen panels stayed blank. */
function schedule() {
  const since = performance.now() - lastRun;
  if (since >= THROTTLE_MS) {
    check();
    return;
  }
  if (trailing) return;
  trailing = setTimeout(() => {
    trailing = undefined;
    check();
  }, THROTTLE_MS - since);
}

function stop() {
  if (trailing) {
    clearTimeout(trailing);
    trailing = undefined;
  }
  if (!listening) return;
  window.removeEventListener("scroll", schedule);
  window.removeEventListener("resize", schedule);
  listening = false;
}

export function registerReveal(el: HTMLElement, show: () => void, margin = 0.3) {
  const entry: Entry = {
    el,
    show,
    margin: Math.round(window.innerWidth * margin),
  };
  entries.add(entry);

  if (!listening) {
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    listening = true;
  }
  /* Check immediately so anything already on screen at mount reveals now
     rather than waiting for the first scroll. Bypasses the throttle. */
  check();

  return () => {
    entries.delete(entry);
  };
}
