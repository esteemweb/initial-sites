import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PAIRINGS, PALETTE, checkDisplay, contrast, verdict } from "./palette.ts";

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8").toLowerCase();

test("the palette in code matches the tokens in globals.css", () => {
  assert.match(css, /--color-chaux:\s*#ffffff/);
  assert.match(css, /--color-indigo:\s*#12266b/);
  assert.match(css, /--color-laque:\s*#a5231a/);
  assert.match(css, /--background-color-or:\s*#dda73f/);
  assert.match(css, /--color-ink:\s*var\(--color-chaux\)/);
  assert.match(css, /--color-ground:\s*var\(--color-indigo\)/);
  for (const c of Object.values(PALETTE)) assert.ok(css.includes(c.hex.toLowerCase()), c.hex);
});

test("there are four colours and no fifth", () => {
  const hexes = new Set(css.match(/#[0-9a-f]{6}\b/g));
  assert.deepEqual([...hexes].sort(), ["#12266b", "#a5231a", "#dda73f", "#ffffff"]);
});

test("gold is never registered as a text colour", () => {
  assert.doesNotMatch(css, /--color-or:/);
  assert.doesNotMatch(css, /--text-color-or/);
});

const r = (a: keyof typeof PALETTE, b: keyof typeof PALETTE) => contrast(PALETTE[a].hex, PALETTE[b].hex);

test("measured contrast", () => {
  assert.equal(r("chaux", "laque").toFixed(2), "7.36");
  assert.equal(r("chaux", "indigo").toFixed(2), "13.86"); // the brief said 15.1; the formula says 13.86
  assert.equal(r("indigo", "or").toFixed(2), "6.38");
  assert.equal(r("or", "laque").toFixed(2), "3.39");
  assert.equal(r("or", "chaux").toFixed(2), "2.17");
});

test("verdicts: gold can never carry body text", () => {
  assert.equal(verdict(r("chaux", "laque")), "all");
  assert.equal(verdict(r("indigo", "or")), "all");
  assert.equal(verdict(r("or", "laque")), "large");
  assert.equal(verdict(r("or", "chaux")), "never");
});

test("every allowed text pairing clears 3:1, and the refused ones are refused", () => {
  for (const p of PAIRINGS) {
    if (p.allowed) assert.ok(r(p.fg, p.bg) >= 3, `${p.fg}/${p.bg}`);
  }
  assert.ok(PAIRINGS.some((p) => p.fg === "or" && p.bg === "chaux" && !p.allowed));
});

test("display strings: four words, ten characters", () => {
  assert.equal(checkDisplay("Dix-neuf chambres au-dessus").ok, true);
  assert.equal(checkDisplay("On vient pour dîner. Certains restent dormir.").ok, false);
  assert.equal(checkDisplay("Navette").ok, true);
  assert.equal(checkDisplay("Privatisations").ok, false); // 14 characters
});
