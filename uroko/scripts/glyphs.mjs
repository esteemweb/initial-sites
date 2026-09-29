// Prints every CJK / kana character used in the site's source, so the
// Japanese display font can be subset to exactly those glyphs (see the
// `text` option in app/layout.tsx). Run: node scripts/glyphs.mjs
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const roots = ["app", "components", "lib"];
const re = /[　-〿぀-ゟ゠-ヿ一-鿿＀-￯]/g;
const set = new Set();

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx?|mdx?|json)$/.test(name)) {
      for (const ch of readFileSync(p, "utf8").matchAll(re)) set.add(ch[0]);
    }
  }
}
roots.forEach(walk);
console.log([...set].sort().join(""));
console.log(`\n${set.size} glyphs`);
