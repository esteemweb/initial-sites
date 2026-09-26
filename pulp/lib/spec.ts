import { SPEC_LABELS, type SpecCode } from "@/data/products";

/**
 * Spec marks, in three layers.
 *
 * `SPEC_LABELS` in `data/products.ts` is the short name. `SPEC_MEANINGS` says
 * what the mark stands for. Surfaces pick the depth they need — a card shows
 * the label, the homepage key and the product marker show label plus meaning —
 * so the short and long forms can never drift apart.
 *
 * Replaces the ISO care set. Washing instructions live on the physical label;
 * they are no longer the icon library, because a clothing shopper filters on
 * fit and fabric, not on wash temperature.
 */

/**
 * Card mark order is fixed and deterministic (DESIGN.md §4): fit → print →
 * fabric. The card shows the first three by that priority, never the first
 * three of the array.
 */
const SPEC_GROUPS: SpecCode[][] = [
  ["fit-boxy", "fit-relaxed", "fit-slim"],
  ["screen-print", "embroidered", "no-print"],
  ["heavy-jersey", "loopback", "twill", "ribbed", "canvas"],
];

/**
 * The spec codes a product card shows, in priority order. Takes at most one
 * code per group, so a garment can never contribute two fits or two fabrics.
 */
export function cardSpecMarks(spec: SpecCode[], count = 3): SpecCode[] {
  const picked: SpecCode[] = [];

  for (const group of SPEC_GROUPS) {
    const match = spec.find((code) => group.includes(code));
    if (match) picked.push(match);
    if (picked.length === count) break;
  }

  return picked;
}

/** The canonical order, flattened. Used where every mark is listed. */
export const SPEC_ORDER: SpecCode[] = SPEC_GROUPS.flat();

/**
 * Deduplicated codes in canonical order, for a surface covering more than one
 * garment — an order receipt, say. Unlike `cardSpecMarks` this does not take
 * one per group: an order can hold a boxy hoodie and a slim vest, and quietly
 * picking one would be describing something the customer did not buy.
 */
export function orderSpecCodes(codes: SpecCode[]): SpecCode[] {
  const present = new Set(codes);
  return SPEC_ORDER.filter((code) => present.has(code));
}

/** What the mark stands for. One line, for the homepage key. */
export const SPEC_MEANINGS: Record<SpecCode, string> = {
  "fit-boxy": "A wide square outline. Cut straight and wide through the body, with the shoulder seam sitting off the shoulder.",
  "fit-relaxed": "A wide outline with room at the base. Generous without being oversized, and cut to layer over something else.",
  "fit-slim": "A narrow outline. Cut close to the body, following the shoulder rather than dropping off it.",
  "screen-print": "A filled registration square. Ink pushed through a mesh one colour at a time, so it sits on the surface of the cotton.",
  embroidered: "A cross-stitch mark. Thread worked into the fabric rather than printed onto it, so there is nothing to crack or peel.",
  "no-print": "An empty frame. Nothing applied to the garment at all, front or back.",
  "heavy-jersey": "A dense halftone. Single-knit cotton jersey at 200gsm and up, smooth on the face and flat on the reverse.",
  loopback: "A looped mark. Cotton knitted with the loops left open on the inside, which is what makes a sweatshirt warm without being heavy.",
  twill: "A diagonal rule. Woven with an offset weft so the surface runs in visible diagonal lines. Harder wearing than jersey and it holds a crease.",
  ribbed: "Parallel vertical rules. Knitted in raised columns that stretch across and recover, so it sits close without being tight.",
  canvas: "A plain crosshatch. Tightly woven cotton, stiff when new and softer every wash, with almost no stretch.",
};

/** Re-exported so surfaces import one module rather than two. */
export { SPEC_LABELS };
