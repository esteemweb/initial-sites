import { test } from "node:test";
import assert from "node:assert/strict";
import {
  quote,
  formatLKR,
  isAvailable,
  cadenceUnavailableReason,
  DEFAULT_SELECTION,
  LOTS,
  SIZE_MULTIPLIER,
  SUBSCRIBER_DISCOUNT,
  SHIPMENTS_PER_YEAR,
  FREE_DELIVERY_THRESHOLD,
  DELIVERY_FEE,
  type Selection,
} from "./pricing.ts";

const sel = (over: Partial<Selection> = {}): Selection => ({
  ...DEFAULT_SELECTION,
  ...over,
});

test("subscriber price is the retail price less the discount", () => {
  const q = quote(sel({ lot: "two-houses", size: "250g" }));
  assert.equal(q.retail, 4200);
  assert.equal(q.perShipment, 3780); // 4200 * 0.9
  assert.equal(q.saved, 420);
});

test("size multipliers are sub-linear — more per shipment costs less per gram", () => {
  const perGram = (s: "250g" | "500g" | "1kg") => {
    const grams = s === "250g" ? 250 : s === "500g" ? 500 : 1000;
    return quote(sel({ lot: "birds-eye-chinna", size: s })).perShipment / grams;
  };
  assert.ok(perGram("500g") < perGram("250g"));
  assert.ok(perGram("1kg") < perGram("500g"));
});

test("delivery is charged below the threshold and free at or above it", () => {
  /* The entry combination is deliberately under the threshold: the cheapest
     lot at the smallest size is LKR 3,780, so it pays delivery. Upsizing
     clears it. Both branches are reachable with real selections — no
     mutation of the price table. */
  const below = quote(sel({ lot: "two-houses", size: "250g" }));
  assert.ok(below.perShipment < FREE_DELIVERY_THRESHOLD);
  assert.equal(below.freeDelivery, false);
  assert.equal(below.delivery, DELIVERY_FEE);
  assert.equal(below.total, below.perShipment + DELIVERY_FEE);

  const above = quote(sel({ lot: "birds-eye-chinna", size: "500g" }));
  assert.ok(above.perShipment >= FREE_DELIVERY_THRESHOLD);
  assert.equal(above.freeDelivery, true);
  assert.equal(above.delivery, 0);
  assert.equal(above.total, above.perShipment);
});

test("every lot clears the delivery threshold by upsizing one step", () => {
  for (const lot of Object.keys(LOTS) as (keyof typeof LOTS)[]) {
    assert.equal(quote(sel({ lot, size: "500g" })).freeDelivery, true, lot);
  }
});

test("annual cost tracks the cadence, not the price", () => {
  const a = quote(sel({ cadence: "4wk" }));
  const b = quote(sel({ cadence: "8wk" }));
  assert.equal(a.perShipment, b.perShipment);
  assert.equal(a.perYear, a.total * SHIPMENTS_PER_YEAR["4wk"]);
  assert.equal(b.perYear, b.total * SHIPMENTS_PER_YEAR["8wk"]);
  assert.ok(a.perYear > b.perYear);
});

test("roast and grind never change the price", () => {
  const base = quote(sel()).total;
  for (const roast of ["light", "medium", "dark"] as const) {
    for (const grind of ["whole", "filter", "espresso"] as const) {
      assert.equal(quote(sel({ roast, grind })).total, base);
    }
  }
});

test("a kilo every fortnight is unavailable, with a reason", () => {
  assert.equal(isAvailable(sel({ size: "1kg", cadence: "2wk" })), false);
  assert.match(cadenceUnavailableReason("1kg", "2wk") ?? "", /stale/);

  assert.equal(isAvailable(sel({ size: "1kg", cadence: "4wk" })), true);
  assert.equal(isAvailable(sel({ size: "500g", cadence: "2wk" })), true);
  assert.equal(cadenceUnavailableReason("500g", "2wk"), null);
});

test("every price lands on a whole 10 LKR", () => {
  for (const lot of Object.keys(LOTS) as (keyof typeof LOTS)[]) {
    for (const size of Object.keys(SIZE_MULTIPLIER) as (keyof typeof SIZE_MULTIPLIER)[]) {
      const q = quote(sel({ lot, size }));
      assert.equal(q.retail % 10, 0, `${lot} ${size} retail`);
      assert.equal(q.perShipment % 10, 0, `${lot} ${size} perShipment`);
    }
  }
});

test("the discount is actually applied to every combination", () => {
  for (const lot of Object.keys(LOTS) as (keyof typeof LOTS)[]) {
    const q = quote(sel({ lot }));
    assert.ok(q.perShipment < q.retail);
    assert.ok(Math.abs(q.saved / q.retail - SUBSCRIBER_DISCOUNT) < 0.01);
  }
});

test("formatLKR groups thousands and never shows decimals", () => {
  assert.equal(formatLKR(4800), "LKR 4,800");
  assert.equal(formatLKR(980), "LKR 980");
  assert.equal(formatLKR(1234567), "LKR 1,234,567");
  assert.equal(formatLKR(3779.6), "LKR 3,780");
});
