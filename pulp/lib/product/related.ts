import { PRODUCTS, type Product, type SpecCode } from "@/data/products";

/**
 * "Goes with" — four garments that genuinely sit alongside this one.
 *
 * The previous rule matched on wash temperature, which made sense when the icon
 * set was ISO care symbols and the section was called "wash with". It does not
 * survive the rebrand: nobody choosing a hoodie cares that a tote washes at the
 * same temperature. This matches on what the spec marks now describe.
 *
 * Ranked, best match first, and always filled to four:
 *
 * 1. Same fabric **and** same fit — the closest thing to a sibling
 * 2. Same fabric — different cut, same hand
 * 3. Nearest by fabric weight — nothing else in common, so weight
 *
 * Inside a tier the nearest weight comes first and catalogue order breaks what
 * is left, so the row is fully deterministic: the same product always produces
 * the same four in the same order.
 */

const FIT_CODES: SpecCode[] = ["fit-boxy", "fit-relaxed", "fit-slim"];
const FABRIC_CODES: SpecCode[] = [
  "heavy-jersey",
  "loopback",
  "twill",
  "ribbed",
  "canvas",
];

function pick(product: Product, group: SpecCode[]): SpecCode | null {
  return product.spec.find((code) => group.includes(code)) ?? null;
}

export function fitOf(product: Product): SpecCode | null {
  return pick(product, FIT_CODES);
}

export function fabricOf(product: Product): SpecCode | null {
  return pick(product, FABRIC_CODES);
}

/** Lower is better. Unranked entries sort after every ranked one. */
function rank(product: Product, other: Product): number {
  const sameFabric = fabricOf(product) === fabricOf(other);
  const sameFit = fitOf(product) === fitOf(other);

  if (sameFabric && sameFit) return 0;
  if (sameFabric) return 1;
  return 2;
}

/**
 * Distance in GSM, used only to order within a tier. A garment with no `gsm` —
 * the lambswool beanie — has no weight to compare, so it sorts to the back of
 * its tier rather than pretending to be 0gsm and looking like the lightest
 * thing in the range.
 */
function weightDistance(product: Product, other: Product): number {
  if (product.gsm === null || other.gsm === null) return Number.MAX_SAFE_INTEGER;
  return Math.abs(product.gsm - other.gsm);
}

export const RELATED_COUNT = 4;

export function goesWith(product: Product, count = RELATED_COUNT): Product[] {
  const order = new Map(PRODUCTS.map((p, index) => [p.id, index]));

  return PRODUCTS.filter((other) => other.id !== product.id)
    .map((other) => ({
      other,
      tier: rank(product, other),
      distance: weightDistance(product, other),
      index: order.get(other.id) ?? 0,
    }))
    .sort(
      (a, b) => a.tier - b.tier || a.distance - b.distance || a.index - b.index,
    )
    .slice(0, count)
    .map((entry) => entry.other);
}
