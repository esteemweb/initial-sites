// Encode the turntable render (render/frames/0052.png, transparent 1600×2000)
// into the Vessel 01 product image, used on range pages and share cards:
//   public/images/vessel-01.jpg   896×1120   front on, filled, on white
// The home page's frames come from the flight instead: render/encode-flight.mjs.
// Run from the project root: node render/encode.mjs
import sharp from "sharp";
import { existsSync } from "node:fs";

const SRC = "render/frames/0052.png";
// The product image sits in a card, so it gets air around the vessel
const PRODUCT_CROP = { left: 60, top: 100, width: 1480, height: 1850 };
// The shadow's soft tail runs past the right edge, so the last 12% fades to white
const fade = (w, h) =>
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff"/></linearGradient></defs><rect x="${Math.round(w * 0.88)}" y="0" width="${Math.round(w * 0.12) + 1}" height="${h}" fill="url(#g)"/></svg>`);

if (!existsSync(SRC)) {
  console.error(`missing ${SRC}: blender -b -P render/vessel.py -- --frames 52 --out render/frames`);
  process.exit(1);
}
const flat = await sharp(SRC).extract(PRODUCT_CROP).flatten({ background: "#ffffff" }).resize(896, 1120).png().toBuffer();
await sharp(flat).composite([{ input: fade(896, 1120) }]).jpeg({ quality: 88, mozjpeg: true }).toFile("public/images/vessel-01.jpg");
console.log("public/images/vessel-01.jpg");
