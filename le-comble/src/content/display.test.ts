import { test } from "node:test";
import assert from "node:assert/strict";
import { checkDisplay } from "../lib/palette.ts";
import { HOME } from "./home.ts";
import { RESTAURANT } from "./restaurant.ts";
import { BAR } from "./pages.ts";

/* design-system §3, the bilingual constraint: every string set in
   `type-display` is written French first, four words at most, no word over
   ten characters. Add a string here whenever a page uses type-display. */

const DISPLAY = [
  { where: "home hero", text: HOME.hero.title },
  ...HOME.hero.endings.map((e, i) => ({
    where: `home hero, turning ending ${i + 1}`,
    text: { fr: `${HOME.hero.lead.fr} ${e.fr}`, en: `${HOME.hero.lead.en} ${e.en}` },
  })),
  { where: "restaurant title", text: RESTAURANT.title },
  { where: "bar title", text: BAR.title },
];

for (const d of DISPLAY) {
  test(`display string fits the rule: ${d.where} — "${d.text.fr}"`, () => {
    const r = checkDisplay(d.text.fr);
    assert.ok(r.words <= 4, `${r.words} words`);
    assert.ok(r.longest.length <= 10, `"${r.longest}" is ${r.longest.length} characters`);
    assert.ok(d.text.en.trim().length > 0, "English translation present");
    const en = checkDisplay(d.text.en);
    assert.ok(en.words <= 4, `English: ${en.words} words`);
  });
}
