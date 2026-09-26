import type { SpecCode } from "@/data/products";
import type { DeliveryMethodKey, Totals } from "@/lib/commerce";
import type { DeliveryDetails } from "./validation";

/**
 * A placed order, snapshotted at the moment it is placed.
 *
 * It is a **copy**, not a set of references into the catalogue: names, sizes
 * and prices are frozen as they were when the order went through. A receipt
 * that silently re-prices itself when the shop changes is not a receipt.
 *
 * Held in `localStorage` so the confirmation page survives a reload or a direct
 * visit — the basket is emptied on placing the order, so there is nothing left
 * to rebuild it from.
 */

export interface PlacedOrderLine {
  name: string;
  colourway: string;
  size: string;
  quantity: number;
  /** Pence, for the whole line. */
  linePrice: number;
}

export interface PlacedOrder {
  number: string;
  /** ISO, so the confirmation can date itself without a second source. */
  placedAt: string;
  lines: PlacedOrderLine[];
  totals: Totals;
  method: DeliveryMethodKey;
  details: DeliveryDetails;
  /** Spec codes across everything ordered, for the proof slip. */
  spec: SpecCode[];
  /** Estimate text, frozen — recomputing it later would move the date. */
  estimate: string;
}

const STORAGE_KEY = "pulp-last-order-v1";

export function storeOrder(order: PlacedOrder): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
  } catch {
    // The confirmation still renders this session from state in memory; it
    // just will not survive a reload. Not worth failing a placed order over.
  }
}

export function readOrder(): PlacedOrder | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;

    const order = parsed as Partial<PlacedOrder>;
    // Enough of a shape check that a stale or hand-edited entry renders the
    // "no order" state rather than throwing halfway down the page.
    if (
      typeof order.number !== "string" ||
      !Array.isArray(order.lines) ||
      typeof order.totals !== "object" ||
      order.totals === null
    ) {
      return null;
    }

    return order as PlacedOrder;
  } catch {
    return null;
  }
}
