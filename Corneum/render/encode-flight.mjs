// Encode the flight (render/flight/{shadow,clear}/*.png, transparent 1400×1400)
// for the home page:
//   public/frames/flight/lg/0001–0090.webp  800×800  desktop
//   public/frames/flight/sm/0001–0090.webp  600×600  mobile
// Alpha is kept: the page (and its type) shows through the glass.
//
// Shadow: frames 1–5 and 31–90 are rendered on the shadow-catcher floor;
// 2–35 also without it. As the vessel lifts off, the shadow fades out, and it
// fades back in as it lands: weight 1 → 0 over the first 40% of the lift.
//
// Run from the project root: node render/encode-flight.mjs [--measure]
import sharp from "sharp";
import { existsSync, mkdirSync, statSync } from "node:fs";
import { join } from "node:path";

const SRC = "render/flight";
const OUT = "public/frames/flight";
const N = 90;
const sets = [
  { dir: "lg", size: 800, q: 70 },
  { dir: "sm", size: 600, q: 68 },
];

// Weight: WebP stores alpha losslessly, and Cycles' denoiser cleans colour but
// not alpha, so the transparent glass's alpha keeps raw sample noise and costs
// ~4× the colour. A slight blur of the alpha channel only (colour untouched,
// so etching and knurl stay sharp) plus fewer alpha levels takes a frame from
// ~51 KB to ~13 KB with no visible banding in the hard shadow.
async function smoothAlpha(png, size) {
  const sized = await sharp(png).resize(size, size).toBuffer();
  const rgb = await sharp(sized).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const a = await sharp(sized).extractChannel(3).blur(0.8).raw().toBuffer();
  return sharp(rgb.data, { raw: rgb.info }).joinChannel(a, { raw: { width: size, height: size, channels: 1 } }).png().toBuffer();
}

const smooth = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
function shadowWeight(f) {
  if (f === 1 || f > 35) return 1;
  const lift = Math.sin((Math.PI * (f - 1)) / 35); // matches pose_flight in vessel.py
  return 1 - smooth(lift / 0.4);
}

async function raw(path) {
  const { data, info } = await sharp(path).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, info };
}

// Premultiplied blend of two straight-alpha RGBA buffers
function blend(a, b, w) {
  const out = Buffer.alloc(a.length);
  for (let i = 0; i < a.length; i += 4) {
    const aa = (a[i + 3] / 255) * w, ba = (b[i + 3] / 255) * (1 - w);
    const al = aa + ba;
    for (let k = 0; k < 3; k++) out[i + k] = al > 0 ? Math.round((a[i + k] * aa + b[i + k] * ba) / al) : 0;
    out[i + 3] = Math.round(al * 255);
  }
  return out;
}

// The strip lights reach below the floor and leave faint grey smudges on the
// shadow catcher at the far left and right. Nothing real goes past 84% of the
// width (the shadow's tip is at ~82%), so the outer edges fade to transparent.
function trimEdges({ data, info }) {
  const { width, height } = info;
  for (let x = 0; x < width; x++) {
    const u = Math.min(x, width - 1 - x) / width;   // distance to the nearer edge
    const keep = smooth((u - 0.12) / 0.04);
    if (keep >= 1) continue;
    for (let y = 0; y < height; y++) {
      const i = (y * width + x) * 4 + 3;
      data[i] = Math.round(data[i] * keep);
    }
  }
  return { data, info };
}

async function frame(f) {
  const name = `${String(f).padStart(4, "0")}.png`;
  const w = shadowWeight(f);
  const shadowPath = join(SRC, "shadow", name), clearPath = join(SRC, "clear", name);
  if (w === 1) return trimEdges(await raw(shadowPath));
  if (w === 0 || !existsSync(shadowPath)) return trimEdges(await raw(clearPath));
  const [s, c] = await Promise.all([raw(shadowPath), raw(clearPath)]);
  return trimEdges({ data: blend(s.data, c.data, w), info: s.info });
}

// Crop: one square for every frame, from the union of everything visible.
// Only alpha above 10 counts (the edges are already trimmed by trimEdges).
function bbox({ data, info }, acc) {
  const { width, height } = info;
  const x0 = 0, x1 = width;
  for (let y = 0; y < height; y++)
    for (let x = x0; x < x1; x++)
      if (data[(y * width + x) * 4 + 3] > 10) {
        if (x < acc.l) acc.l = x;
        if (x > acc.r) acc.r = x;
        if (y < acc.t) acc.t = y;
        if (y > acc.b) acc.b = y;
      }
  return acc;
}

// Two passes (measure, then encode): 90 raw frames would not fit in memory at once
const acc = { l: Infinity, r: -Infinity, t: Infinity, b: -Infinity };
let width = 0, height = 0;
for (let f = 1; f <= N; f++) {
  const fr = await frame(f);
  ({ width, height } = fr.info);
  bbox(fr, acc);
}
const pad = Math.round(width * 0.02);
const side = Math.min(width, height, Math.max(acc.r - acc.l, acc.b - acc.t) + pad * 2);
const cx = (acc.l + acc.r) / 2, cy = (acc.t + acc.b) / 2;
const left = Math.round(Math.min(width - side, Math.max(0, cx - side / 2)));
const top = Math.round(Math.min(height - side, Math.max(0, cy - side / 2)));
console.log(`union l${acc.l} r${acc.r} t${acc.t} b${acc.b} → crop ${side}² at ${left},${top}`);
if (process.argv.includes("--measure")) process.exit(0);

for (const s of sets) mkdirSync(join(OUT, s.dir), { recursive: true });
const totals = Object.fromEntries(sets.map((s) => [s.dir, 0]));
for (let f = 1; f <= N; f++) {
  const fr = await frame(f);
  const buf = await sharp(fr.data, { raw: fr.info }).extract({ left, top, width: side, height: side }).png().toBuffer();
  for (const s of sets) {
    const out = join(OUT, s.dir, `${String(f).padStart(4, "0")}.webp`);
    await sharp(await smoothAlpha(buf, s.size)).webp({ quality: s.q, alphaQuality: 30, effort: 6, smartSubsample: true }).toFile(out);
    totals[s.dir] += statSync(out).size;
  }
}
console.log(`${N} frames`, Object.entries(totals).map(([k, v]) => `${k} ${Math.round(v / 1024)} KB`).join(" · "));
