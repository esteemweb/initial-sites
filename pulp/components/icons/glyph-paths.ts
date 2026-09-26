import type { SpecCode } from "@/data/products";

/* ---------------------------------------------------------------------------
   PULP — glyph geometry (DESIGN.md §4)

   The spec mark set is this site's icon library, drawn in the print register:
   registration targets, crop marks, halftone and flat geometry. Every mark is
   drawn to one set of rules so they sit together at 16px UI, 64px section
   markers and 400px+ page graphics without redrawing:

     - 48-unit grid, artwork inset to roughly 4–44.
     - Filled paths only. No `stroke`, no `stroke-width`, anywhere.
       Outlines are closed shapes: an outer subpath and an inner subpath in
       the same path, resolved with `fill-rule: evenodd`.
     - Minimum limb 3 units, which is 1px at the 16px UI size. Limbs here
       run 3.5–5 so the set holds at the small size.
     - Three groups read as three shapes: fit marks are outlines, print marks
       are square frames, fabric marks are rules and dots.

   Each mark is an array of path `d` strings. Separate entries rather than one
   path because `fill-rule: evenodd` would knock holes wherever two subpaths
   overlap.
   --------------------------------------------------------------------------- */

/** Solid dot. Radius 2.5 puts 5 units across, comfortably over the limb minimum. */
function dot(cx: number, cy: number, r = 2.5): string {
  return `M${cx} ${cy - r} A${r} ${r} 0 1 0 ${cx} ${cy + r} A${r} ${r} 0 1 0 ${cx} ${cy - r} Z`;
}

/** Horizontal rule, 4 units thick, spanning x1 to x2 at y. */
function hRule(x1: number, x2: number, y: number, t = 4): string {
  return `M${x1} ${y} H${x2} V${y + t} H${x1} Z`;
}

/** Vertical rule, 4 units thick, spanning y1 to y2 at x. */
function vRule(x: number, y1: number, y2: number, t = 4): string {
  return `M${x} ${y1} H${x + t} V${y2} H${x} Z`;
}

/** Open rectangle outline, 4-unit limb, resolved with evenodd. */
function frame(x: number, y: number, w: number, h: number, t = 4): string {
  return `M${x} ${y} H${x + w} V${y + h} H${x} Z M${x + t} ${y + t} H${x + w - t} V${y + h - t} H${x + t} Z`;
}

/* --- Fit: outlines, wide to narrow -------------------------------------- */

const BOXY = frame(4, 10, 40, 28);
const RELAXED = frame(8, 8, 32, 32);
const SLIM = frame(15, 6, 18, 36);

/* --- Print: square frames, filled to empty ------------------------------ */

/** Registration square, filled — ink laid down. */
const SCREEN = "M8 8 H40 V40 H8 Z";

/** Cross-stitch — two crossed bars inside a frame. */
const STITCH: string[] = [
  frame(8, 8, 32, 32, 3.5),
  "M16.5 15 L33 31.5 L30.5 34 L14 17.5 Z",
  "M33 17.5 L16.5 34 L14 31.5 L30.5 15 Z",
];

/** Empty frame — nothing applied. */
const EMPTY = frame(8, 8, 32, 32, 3.5);

/* --- Fabric: rules and dots --------------------------------------------- */

/** Dense halftone — a 3×3 grid of dots. */
const HALFTONE: string[] = [
  dot(14, 14),
  dot(24, 14),
  dot(34, 14),
  dot(14, 24),
  dot(24, 24),
  dot(34, 24),
  dot(14, 34),
  dot(24, 34),
  dot(34, 34),
];

/** Loopback — three open loops in a row. */
const LOOPS: string[] = [
  "M8 32 A8 8 0 0 1 24 32 L20 32 A4 4 0 0 0 12 32 Z",
  "M18 32 A8 8 0 0 1 34 32 L30 32 A4 4 0 0 0 22 32 Z",
  "M28 32 A8 8 0 0 1 44 32 L40 32 A4 4 0 0 0 32 32 Z",
  hRule(8, 44, 34),
];

/** Twill — three diagonal rules. */
const DIAGONALS: string[] = [
  "M6 34 L26 14 L30 18 L10 38 Z",
  "M16 38 L36 18 L40 22 L20 42 Z",
  "M8 22 L20 10 L24 14 L12 26 Z",
];

/** Rib — four vertical rules. */
const RIBS: string[] = [
  vRule(10, 8, 40),
  vRule(19, 8, 40),
  vRule(28, 8, 40),
  vRule(37, 8, 40),
];

/** Canvas — a plain crosshatch. */
const CROSSHATCH: string[] = [
  hRule(6, 42, 14),
  hRule(6, 42, 28),
  vRule(14, 6, 42),
  vRule(28, 6, 42),
];

export const SPEC_GLYPHS: Record<SpecCode, string[]> = {
  "fit-boxy": [BOXY],
  "fit-relaxed": [RELAXED],
  "fit-slim": [SLIM],
  "screen-print": [SCREEN],
  embroidered: STITCH,
  "no-print": [EMPTY],
  "heavy-jersey": HALFTONE,
  loopback: LOOPS,
  twill: DIAGONALS,
  ribbed: RIBS,
  canvas: CROSSHATCH,
};

/* ---------------------------------------------------------------------------
   UI icons. Drawn to the same rules as the marks above (DESIGN.md §4).
   --------------------------------------------------------------------------- */

/** Basket: rectangular body and a handle, so it reads apart from the frames. */
export const CART_GLYPH: string[] = [
  "M6 20 H42 V43 H6 Z M9.5 23.5 H38.5 V39.5 H9.5 Z",
  "M15 20 A9 9 0 0 1 33 20 L29.5 20 A5.5 5.5 0 0 0 18.5 20 Z",
];

/** Close: two crossed bars, the same mark the stitch uses. */
export const CLOSE_GLYPH: string[] = [
  "M11 14.5 L14.5 11 L37 33.5 L33.5 37 Z",
  "M33.5 11 L37 14.5 L14.5 37 L11 33.5 Z",
];

/**
 * Registration mark (DESIGN.md §4, §9). A press target: outer ring, crosshair
 * limbs and a centre dot. This is the loading mark — the one thing on the site
 * allowed to loop — and the rotation reads because the limbs break the ring.
 */
export const REGISTRATION_GLYPH: string[] = [
  "M24 6 A18 18 0 1 0 24 42 A18 18 0 1 0 24 6 Z M24 10 A14 14 0 1 1 24 38 A14 14 0 1 1 24 10 Z",
  vRule(22, 2, 16),
  vRule(22, 32, 46),
  hRule(2, 16, 22),
  hRule(32, 46, 22),
  dot(24, 24, 3),
];

/** Stepper controls. Drawn to the mark rules rather than set as type. */
export const MINUS_GLYPH: string[] = ["M12 21.5 H36 V26.5 H12 Z"];

export const PLUS_GLYPH: string[] = [
  "M21.5 12 H26.5 V21.5 H36 V26.5 H26.5 V36 H21.5 V26.5 H12 V21.5 H21.5 Z",
];

/**
 * Chevron, for the sort control. The native select marker is grey and rounded,
 * which §4 rules out, so the select drops it and this takes its place.
 */
export const CHEVRON_GLYPH: string[] = [
  "M11.46 17.46 L24 30 L36.54 17.46 L40.08 21 L24 37.07 L7.93 21 Z",
];
