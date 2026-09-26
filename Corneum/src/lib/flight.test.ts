import { test } from "node:test";
import assert from "node:assert/strict";
import { FRAME_COUNT, TUMBLE_END, flightBox, flightFrame, pinFrame, squareIn } from "./flight.ts";

test("the tumble runs from the hero still to its last frame", () => {
  assert.equal(flightFrame(0), 1);
  assert.equal(flightFrame(1), TUMBLE_END);
  assert.equal(flightFrame(-1), 1);
  assert.equal(flightFrame(2), TUMBLE_END);
});

test("the pin picks up exactly where the tumble ends and finishes on the last frame", () => {
  assert.equal(pinFrame(0), TUMBLE_END);
  assert.equal(pinFrame(1), FRAME_COUNT);
});

test("pin steps land on their frame boundaries: turn done at 0.5, fill done at 0.75", () => {
  assert.equal(pinFrame(0.5), 66);
  assert.equal(pinFrame(0.75), 82);
});

test("frames never go backwards as scroll advances", () => {
  let last = 0;
  for (let i = 0; i <= 1000; i++) {
    const t = i / 1000;
    const f = flightFrame(t);
    assert.ok(f >= last);
    last = f;
  }
  for (let i = 0; i <= 1000; i++) {
    const f = pinFrame(i / 1000);
    assert.ok(f >= last);
    last = f;
  }
  assert.equal(last, FRAME_COUNT);
});

const hero = squareIn({ left: 500, top: 200, width: 440, height: 550 });
const pin = squareIn({ left: 500, top: 175, width: 440, height: 550 });

test("the square is as tall as the slot and centred on it", () => {
  assert.deepEqual(hero, { x: 445, y: 200, size: 550 });
});

test("no jump at take-off or hand-off: t 0 is the hero box, t 1 the pin box", () => {
  for (const vw of [390, 1440]) {
    const a = flightBox(hero, pin, 0, vw);
    const b = flightBox(hero, pin, 1, vw);
    for (const k of ["x", "y", "size"] as const) {
      assert.ok(Math.abs(a[k] - hero[k]) < 1e-6, `t=0 ${k} at ${vw}`);
      assert.ok(Math.abs(b[k] - pin[k]) < 1e-6, `t=1 ${k} at ${vw}`);
    }
  }
});

test("mid-flight the vessel swings right (less on a phone) and grows only on desktop", () => {
  const cx = (b: { x: number; size: number }) => b.x + b.size / 2;
  const desk = flightBox(hero, pin, 0.5, 1440);
  const phone = flightBox(hero, pin, 0.5, 390);
  assert.ok(cx(desk) > cx(hero) + 200);
  assert.ok(cx(phone) > cx(hero) && cx(phone) - cx(hero) < cx(desk) - cx(hero));
  assert.ok(desk.size > hero.size);
  assert.ok(Math.abs(phone.size - (hero.size + pin.size) / 2) < 1e-6, "no growth on a phone");
});
