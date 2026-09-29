// Exports the hero figure (the tattooed man, cut out) for the ink-and-scales hero.
// Source: generated/hero/figure-4096.png (4K master + background-remover matte,
// see scripts/hero-art.mjs). His old oxblood backdrop is dropped entirely; the
// patches of it that show through the gaps between arms and trousers below the
// wrists are cleared here, so no red remains around him.
//   node scripts/hero-cutout.mjs
import { mkdirSync } from "node:fs";
import sharp from "sharp";

const { data, info } = await sharp("generated/hero/figure-4096.png").ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const FROM_Y = 1600; // below the wrists: trousers, hands and backdrop only, no red ink
let cleared = 0;
for (let y = FROM_Y; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    // Oxblood backdrop: red with almost no green or blue. Shadowed skin keeps far more of both.
    if (data[i + 3] > 0 && r > 30 && r > g * 3 && r > b * 2.6) {
      data[i + 3] = 0;
      cleared++;
    }
  }
}
const clean = await sharp(data, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();
mkdirSync("public/photos/hero", { recursive: true });
const wide = await sharp(clean).resize(2560).webp({ quality: 86, alphaQuality: 90 }).toFile("public/photos/hero/figure-wide.webp");
// Phones: a tall crop centred on him (same crop as before)
const tall = await sharp(clean).extract({ left: 1384, top: 0, width: 1200, height: 2286 }).webp({ quality: 86, alphaQuality: 90 }).toFile("public/photos/hero/figure-tall.webp");
console.log({ cleared, wide: `${wide.width}x${wide.height} ${(wide.size / 1024) | 0}KB`, tall: `${tall.width}x${tall.height} ${(tall.size / 1024) | 0}KB` });
