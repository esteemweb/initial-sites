// Tiles every public/motifs/*.webp into one review image (generated/motifs/contact-sheet.png).
import { readdirSync } from "node:fs";
import sharp from "sharp";

const dir = "public/motifs";
const files = readdirSync(dir).filter((f) => f.endsWith(".webp")).sort();
const w = 240;
const h = 300;
const cols = 6;
const rows = Math.ceil(files.length / cols);
const tiles = await Promise.all(
  files.map(async (f, i) => ({
    input: await sharp(`${dir}/${f}`).resize(w, h).toBuffer(),
    left: (i % cols) * w,
    top: Math.floor(i / cols) * h,
  })),
);
await sharp({ create: { width: cols * w, height: rows * h, channels: 3, background: "#f4efe6" } })
  .composite(tiles)
  .png()
  .toFile("generated/motifs/contact-sheet.png");
console.log(files.join(" "));
