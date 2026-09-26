import { test } from "node:test";
import assert from "node:assert/strict";
import { TRAIL, field, jelly, trailPoint } from "./jelly.ts";

test("jelly starts at full push, swings back past zero, and dies out", () => {
  assert.equal(jelly(0), 1);
  assert.ok(jelly(0.35) < 0, "overshoots the other way (the wobble)");
  assert.ok(Math.abs(jelly(TRAIL.life)) < 0.01, "gone by the end of a point's life");
});

test("a push is felt near the pointer and not far away", () => {
  const p = trailPoint(500, 300, 10, 0, 0)!;
  const [near] = field([p], 500, 300, 0);
  const [far] = field([p], 1200, 300, 0);
  assert.ok(near > 15, `near: ${near}`);
  assert.equal(far, 0);
});

test("a fast flick is capped", () => {
  const p = trailPoint(0, 0, 400, 0, 0)!;
  assert.ok(p.px <= TRAIL.max + 1e-9);
});

test("tiny jitters leave no trail", () => {
  assert.equal(trailPoint(0, 0, 0.2, 0.2, 0), null);
});
