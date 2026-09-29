// Draws Uroko's mark: one large fish scale made of overlapping small scales
// (the uroko pattern), white on black, for scripts/emblem-trace.mjs to trace.
//   node scripts/emblem-scales.mjs && node scripts/emblem-trace.mjs generated/emblem/scales.png
// Pure geometry: no image generation, no outside material.
import { mkdirSync } from "node:fs";
import sharp from "sharp";

const S = 1024;
const cx = S / 2;
// Outer silhouette: pointed at the top, round at the bottom, like a single scale.
const top = 70, r = 380, cy = 590;
const silhouette = (k) => {
  const t = cy - (cy - top) * k, rr = r * k;
  return `M${cx},${t} C${cx + rr * 0.55},${cy - rr * 0.95} ${cx + rr},${cy - rr * 0.5} ${cx + rr},${cy} A${rr} ${rr} 0 0 1 ${cx - rr},${cy} C${cx - rr},${cy - rr * 0.5} ${cx - rr * 0.55},${cy - rr * 0.95} ${cx},${t} Z`;
};

// Small scales: rows offset by half a scale, painted from the bottom row up,
// so every row's rounded lower edge sits on top of the row beneath it.
const R = Number(process.env.R ?? 118), gap = 22, dy = R * 0.98;
const DOWN = process.env.DOWN === "1"; // paint top rows last: scallops open downward
const rows = [];
for (let row = 0, y = top + 40; y < cy + r + R; row++, y += dy) {
  const offset = row % 2 ? R : 0;
  const circles = [];
  for (let x = cx - 6 * R + offset; x <= cx + 6 * R; x += 2 * R) circles.push([x, y]);
  rows.push(circles);
}
const scales = (DOWN ? rows : [...rows].reverse())
  .flat()
  .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${R}" fill="#fff" stroke="#000" stroke-width="${gap}"/>`)
  .join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  <rect width="${S}" height="${S}" fill="#000"/>
  <defs><clipPath id="inner"><path d="${silhouette(0.9)}"/></clipPath></defs>
  <path d="${silhouette(1)}" fill="#fff"/>
  <path d="${silhouette(0.94)}" fill="#000"/>
  <g clip-path="url(#inner)">${scales}</g>
</svg>`;

mkdirSync("generated/emblem", { recursive: true });
await sharp(Buffer.from(svg)).png().toFile(process.env.OUT ?? "generated/emblem/scales.png");
console.log("wrote generated/emblem/scales.png");
