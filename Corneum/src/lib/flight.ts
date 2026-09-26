/* Vessel 01's flight, from the hero into the pin: the frame and the box for
   any point of the scroll. Pure functions, so they can be tested without a
   browser (flight.test.ts).

   Frames (render/vessel.py, --shot flight):
      1       at rest in the hero
      2–36    the tumble, driven by travel t (0 at the top of the page,
              1 when the pin reaches the top of the viewport)
     37–66    half-turn to the front      pin p 0–0.5   (steps 1–2)
     67–82    fill to the 200 ML line     pin p 0.5–0.75 (step 3)
     83–90    cap quarter-turn            pin p 0.75–1  (step 4) */

export const FRAME_COUNT = 90;
export const TUMBLE_END = 36;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const clampFrame = (f: number) => clamp(Math.round(f), 1, FRAME_COUNT);

export const smoothstep = (t: number) => {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
};

export function flightFrame(t: number) {
  return clampFrame(1 + clamp(t, 0, 1) * (TUMBLE_END - 1));
}

export function pinFrame(p: number) {
  const x = clamp(p, 0, 1);
  const f = x < 0.5 ? 36 + (x / 0.5) * 30 : x < 0.75 ? 66 + ((x - 0.5) / 0.25) * 16 : 82 + ((x - 0.75) / 0.25) * 8;
  return clampFrame(f);
}

export type Box = { x: number; y: number; size: number };

/* The frames are square; each anchor slot is 4:5. The vessel is drawn in a
   square as tall as the slot, centred on it (what `object-cover` does to the
   static image, so the hand-over is exact). */
export function squareIn(r: { left: number; top: number; width: number; height: number }): Box {
  return { x: r.left + (r.width - r.height) / 2, y: r.top, size: r.height };
}

/* On the way from the hero to the pin the vessel swings out to the right, over
   the premise line, and on desktop grows a little at mid-flight. Both are zero
   at each end, so there is no jump at take-off or hand-off. On a phone the
   hero slot is already full width, so the vessel does not grow: it would cover
   the premise line. */
export const ARC_DESKTOP = 0.18;
export const ARC_MOBILE = 0.08;
export const GROW = 0.15;

export function flightBox(hero: Box, pin: Box, t: number, viewportWidth: number): Box {
  const x = clamp(t, 0, 1);
  const e = smoothstep(x);
  const bump = Math.sin(Math.PI * x);
  const desktop = viewportWidth >= 1024;
  const arc = viewportWidth * (desktop ? ARC_DESKTOP : ARC_MOBILE) * bump;
  const size = (hero.size + (pin.size - hero.size) * e) * (1 + (desktop ? GROW : 0) * bump);
  const cx = hero.x + hero.size / 2 + (pin.x + pin.size / 2 - (hero.x + hero.size / 2)) * e + arc;
  const cy = hero.y + hero.size / 2 + (pin.y + pin.size / 2 - (hero.y + hero.size / 2)) * e;
  return { x: cx - size / 2, y: cy - size / 2, size };
}
