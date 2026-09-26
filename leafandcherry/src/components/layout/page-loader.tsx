"use client";

/* pattern: loading screen with the logo animation. Plays on every full page
   load (every refresh); mounted once in the root layout, so client-side
   navigation never replays it.

   Timeline (ms from mount):
     0–380     the stem draws up out of the cherry's crown
     150–650   the cherry swells into place, with a little overshoot
     300–760   the leaf unfurls from the stem tip
     520–900   the bean crease and the leaf rib draw in
     640–1100  the wordmark rises into place
     then      holds until the page has loaded (never less than MIN_SHOW,
               never more than MAX_WAIT), and lifts away like a curtain,
               the hero's blur-up playing underneath (markIntroDone).

   Centred, unlike everything on the page: a splash sits outside the page's
   layout rules, and a lockup reads best on the axis.

   Driven by rAF writing inline styles, not CSS transitions or animations:
   delayed CSS motion was measured to stall in this project's browser
   (design-system §6), and a stalled full-screen overlay would hide the whole
   site. For the same reason it is removed from the tree when done, and a
   timer removes it regardless if rAF never runs. No JS or reduced motion:
   hidden by CSS (u-loader) and skipped here. */
import { useEffect, useRef, useState } from "react";
import { markIntroDone, prefersReducedMotion } from "@/lib/motion";
import { LogoMark } from "@/components/ui/logo";
import { SITE } from "@/content/site";

const MIN_SHOW = 1300;
const MAX_WAIT = 3000;
const LIFT = 700;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const easeOut = (t: number) => 1 - (1 - t) ** 3;
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
const easeOutBack = (t: number) => {
  const c = 1.6;
  return 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2;
};
/** Progress of a phase running from `a` to `b` ms. */
const phase = (age: number, a: number, b: number) => clamp01((age - a) / (b - a));

export function PageLoader() {
  const [done, setDone] = useState(false);
  const screen = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = screen.current;
    if (!el) return;
    const finish = () => {
      markIntroDone();
      document.documentElement.style.overflow = "";
      setDone(true);
    };
    if (prefersReducedMotion()) {
      // Deferred: never set state synchronously inside the effect body.
      const t = window.setTimeout(finish, 0);
      return () => window.clearTimeout(t);
    }

    const part = (name: string) =>
      el.querySelector<SVGElement>(`[data-part="${name}"]`)!;
    const stem = part("stem");
    const leaf = part("leaf");
    const rib = part("rib");
    const cherry = part("cherry");
    const crease = part("crease");
    const word = el.querySelector<HTMLElement>("[data-part='word']")!;
    const lockup = el.querySelector<HTMLElement>("[data-part='lockup']")!;

    // Scale origins in SVG user units: the leaf grows from the stem tip, the
    // cherry from its own centre.
    for (const [node, origin] of [
      [leaf, "28.2px 6.9px"],
      [cherry, "21px 32.2px"],
    ] as const) {
      node.style.transformBox = "view-box";
      node.style.transformOrigin = origin;
    }

    document.documentElement.style.overflow = "hidden";
    const t0 = performance.now();
    let ready = document.readyState === "complete";
    let liftAt = 0;
    let raf = 0;

    const onLoad = () => {
      ready = true;
    };
    window.addEventListener("load", onLoad);
    const bail = window.setTimeout(finish, MAX_WAIT + LIFT + 800);

    const step = (now: number) => {
      const age = now - t0;

      stem.style.strokeDashoffset = String(1 - easeOut(phase(age, 0, 380)));
      cherry.style.scale = String(easeOutBack(phase(age, 150, 650)));
      leaf.style.scale = String(easeOutBack(phase(age, 300, 760)));
      crease.style.strokeDashoffset = String(1 - easeOut(phase(age, 520, 900)));
      rib.style.strokeDashoffset = String(1 - easeOut(phase(age, 560, 900)));
      const w = easeOut(phase(age, 640, 1100));
      word.style.opacity = String(w);
      word.style.translate = `0 ${(1 - w) * 12}px`;

      if (!liftAt && age >= MIN_SHOW && (ready || age >= MAX_WAIT)) {
        liftAt = now;
        markIntroDone(); // the blur-up plays as the curtain rises
      }
      if (liftAt) {
        const f = clamp01((now - liftAt) / LIFT);
        el.style.translate = `0 ${-100 * easeInOut(f)}%`;
        lockup.style.opacity = String(1 - easeOut(clamp01(f * 1.6)));
        if (f >= 1) return finish();
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(bail);
      window.removeEventListener("load", onLoad);
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={screen}
      aria-hidden="true"
      className="u-loader fixed inset-0 z-60 flex items-center justify-center bg-surface"
    >
      <div data-part="lockup" className="flex flex-col items-center gap-6">
        {/* Parts start hidden (dashoffset 1 / scale 0) so nothing flashes
            fully drawn before the animation takes over. */}
        <LogoMark className="u-loader-mark size-24" />
        <p
          data-part="word"
          className="font-display text-2xl u-display-plain opacity-0"
        >
          {SITE.name}
        </p>
      </div>
    </div>
  );
}
