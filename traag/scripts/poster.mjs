// Generates public/traag/poster.jpg: the front portrait in hero state 3
// (threshold, black and ink), for the <video poster> once hero.mp4 exists.
// Run: node scripts/poster.mjs
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const src = "src/photos/her-01-front.png";
const out = "public/traag/poster.jpg";
mkdirSync("public/traag", { recursive: true });

const INK = { r: 255, g: 74, b: 0 };
const BLACK = { r: 11, g: 11, b: 11 };

const { data, info } = await sharp(src)
  .grayscale()
  // crush the blacks first: contrast 2.2 around mid-grey, then brightness 0.8
  .linear(2.2 * 0.8, (-(2.2 - 1) * 128) * 0.8)
  .raw()
  .toBuffer({ resolveWithObject: true });

const px = Buffer.alloc(info.width * info.height * 3);
for (let i = 0, j = 0; i < data.length; i += info.channels, j += 3) {
  const on = data[i] >= 0.52 * 255;
  const c = on ? INK : BLACK;
  px[j] = c.r;
  px[j + 1] = c.g;
  px[j + 2] = c.b;
}

await sharp(px, { raw: { width: info.width, height: info.height, channels: 3 } })
  // 1122x1402 → 1440 wide is 1800 tall; the eyes sit at ~32%, so centre the
  // 900px window on them (32% of 1800 minus half the window = 126).
  .resize({ width: 1440 })
  .extract({ left: 0, top: 126, width: 1440, height: 900 })
  .jpeg({ quality: 70 })
  .toFile(out);

console.log("wrote", out, info.width + "x" + info.height, "→ 1440x900");
