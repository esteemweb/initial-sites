/* The business rule (BRIEF §12), kept pure so it can be tested on its own:
   a first order must include Vessel 01; refills alone are allowed only
   once a vessel has been bought. `src/lib/cart.tsx` reads it for the bag
   and checkout. */

export const VESSEL = "vessel-01";

export type Line = { slug: string; qty: number };
export type PastOrder = { hasVessel: boolean };

export function orderHasVessel(items: readonly Line[]) {
  return items.some((i) => i.slug === VESSEL && i.qty > 0);
}

export function ownsVessel(orders: readonly PastOrder[]) {
  return orders.some((o) => o.hasVessel);
}

export function canCheckout(items: readonly Line[], orders: readonly PastOrder[]) {
  return items.length > 0 && (orderHasVessel(items) || ownsVessel(orders));
}

/* Stored bag and order history come from the visitor's own browser storage
   (SECURITY-AUDIT.md, item 7). If that data is ever malformed (hand-edited,
   or left by an older version), keep only well-formed entries for products
   that exist, so the bag falls back to empty instead of failing to render.
   Normal visitors never notice: their stored data is always well formed. */
const isObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;

function isLine(v: unknown, isKnown: (slug: string) => boolean, maxQty: number): v is Line {
  return (
    isObject(v) &&
    typeof v.slug === "string" &&
    isKnown(v.slug) &&
    typeof v.qty === "number" &&
    Number.isInteger(v.qty) &&
    v.qty >= 1 &&
    v.qty <= maxQty
  );
}

export function cleanBag(raw: unknown, isKnown: (slug: string) => boolean, maxQty: number): Line[] {
  return Array.isArray(raw) ? raw.filter((v) => isLine(v, isKnown, maxQty)) : [];
}

export type StoredOrder = { id: string; items: Line[]; total: number; date: string; hasVessel: boolean };

export function cleanOrders(raw: unknown, isKnown: (slug: string) => boolean, maxQty: number): StoredOrder[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (o): o is StoredOrder =>
        isObject(o) &&
        typeof o.id === "string" &&
        typeof o.total === "number" &&
        typeof o.date === "string" &&
        typeof o.hasVessel === "boolean" &&
        Array.isArray(o.items),
    )
    .map((o) => ({ ...o, items: cleanBag(o.items, isKnown, maxQty) }));
}
