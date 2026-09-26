import { test } from "node:test";
import assert from "node:assert/strict";
import { canCheckout, cleanBag, cleanOrders, orderHasVessel, ownsVessel } from "./rules.ts";

const refill = { slug: "cleanse", qty: 1 };
const vessel = { slug: "vessel-01", qty: 1 };

test("an empty bag cannot check out", () => {
  assert.equal(canCheckout([], []), false);
  assert.equal(canCheckout([], [{ hasVessel: true }]), false);
});

test("a first order of refills only is blocked", () => {
  assert.equal(canCheckout([refill], []), false);
  assert.equal(canCheckout([refill, { slug: "barrier", qty: 2 }], [{ hasVessel: false }]), false);
});

test("a first order with Vessel 01 is allowed", () => {
  assert.equal(canCheckout([vessel], []), true);
  assert.equal(canCheckout([refill, vessel], []), true);
});

test("refills alone are allowed once a vessel has been bought", () => {
  assert.equal(canCheckout([refill], [{ hasVessel: false }, { hasVessel: true }]), true);
});

test("a vessel line with zero quantity does not count", () => {
  assert.equal(orderHasVessel([{ slug: "vessel-01", qty: 0 }]), false);
  assert.equal(canCheckout([refill, { slug: "vessel-01", qty: 0 }], []), false);
});

test("ownership comes only from past orders that included a vessel", () => {
  assert.equal(ownsVessel([]), false);
  assert.equal(ownsVessel([{ hasVessel: false }]), false);
  assert.equal(ownsVessel([{ hasVessel: true }]), true);
});

// Stored data fallback (SECURITY-AUDIT.md, item 7)
const known = (slug: string) => ["vessel-01", "cleanse", "barrier"].includes(slug);

test("a well-formed stored bag is kept exactly as it was", () => {
  const bag = [vessel, { slug: "barrier", qty: 9 }];
  assert.deepEqual(cleanBag(bag, known, 9), bag);
});

test("malformed stored bags fall back to empty, never throw", () => {
  for (const raw of [null, undefined, 42, "cleanse", {}, { slug: "cleanse", qty: 1 }]) {
    assert.deepEqual(cleanBag(raw, known, 9), []);
  }
});

test("bad entries are dropped: unknown product, bad or out-of-range quantity", () => {
  const raw = [refill, { slug: "nope", qty: 1 }, { slug: "cleanse", qty: "2" }, { slug: "barrier", qty: 0 }, { slug: "barrier", qty: 1.5 }, { slug: "barrier", qty: 10 }, null, "x"];
  assert.deepEqual(cleanBag(raw, known, 9), [refill]);
});

test("stored orders: well-formed kept, malformed dropped, items cleaned", () => {
  const good = { id: "CN-260926-1234", items: [vessel], total: 65, date: "2026-09-26T00:00:00.000Z", hasVessel: true };
  assert.deepEqual(cleanOrders([good], known, 9), [good]);
  assert.deepEqual(cleanOrders({ oops: true }, known, 9), []);
  assert.deepEqual(cleanOrders([{ id: 1 }, null, good], known, 9), [good]);
  assert.deepEqual(cleanOrders([{ ...good, items: [vessel, { slug: "nope", qty: 1 }] }], known, 9), [good]);
});
