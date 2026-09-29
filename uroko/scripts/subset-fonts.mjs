// Builds the self-hosted Japanese display font: Shippori Mincho B1 (OFL 1.1,
// via the @fontsource package) subset to exactly the glyphs the site uses,
// one woff2 per weight, written to app/fonts/. Re-run after adding Japanese
// text anywhere in app/, components/ or lib/:
//
//   node scripts/subset-fonts.mjs
//
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import subsetFont from "subset-font";

const roots = ["app", "components", "lib"];
const re = /[　-〿぀-ゟ゠-ヿ一-鿿＀-￯]/g;
const glyphs = new Set("0123456789-–—F ".split(""));

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx?|mdx?|json)$/.test(name)) {
      for (const ch of readFileSync(p, "utf8").matchAll(re)) glyphs.add(ch[0]);
    }
  }
}
roots.forEach(walk);
const text = [...glyphs].join("");

const src = "node_modules/@fontsource/shippori-mincho-b1/files";
mkdirSync("app/fonts", { recursive: true });

for (const weight of ["400", "700"]) {
  const input = readFileSync(join(src, `shippori-mincho-b1-japanese-${weight}-normal.woff2`));
  const out = await subsetFont(input, text, { targetFormat: "woff2" });
  const file = `app/fonts/shippori-mincho-b1-${weight}.woff2`;
  writeFileSync(file, out);
  console.log(`${file}: ${(out.length / 1024).toFixed(1)} KB (${glyphs.size} glyphs requested)`);
}

// Hero masthead: the Latin face of the same family, capitals only, so the
// studio name can be set large in the Mincho serif without a second family.
const caps = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ";
const masthead = await subsetFont(
  readFileSync(join(src, "shippori-mincho-b1-latin-400-normal.woff2")),
  caps,
  { targetFormat: "woff2" },
);
writeFileSync("app/fonts/shippori-mincho-b1-caps-400.woff2", masthead);
console.log(`app/fonts/shippori-mincho-b1-caps-400.woff2: ${(masthead.length / 1024).toFixed(1)} KB`);

// Open Graph images (next/og) need TTF, not WOFF2: one file with the site's
// kanji, one with printable ASCII, both weight 700.
const ascii = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join("");
const ogJa = await subsetFont(
  readFileSync(join(src, "shippori-mincho-b1-japanese-700-normal.woff2")),
  text,
  { targetFormat: "sfnt" },
);
writeFileSync("app/fonts/og-ja.ttf", ogJa);
const ogLatin = await subsetFont(
  readFileSync(join(src, "shippori-mincho-b1-latin-700-normal.woff2")),
  ascii,
  { targetFormat: "sfnt" },
);
writeFileSync("app/fonts/og-latin.ttf", ogLatin);
console.log(`app/fonts/og-ja.ttf: ${(ogJa.length / 1024).toFixed(1)} KB · app/fonts/og-latin.ttf: ${(ogLatin.length / 1024).toFixed(1)} KB`);
