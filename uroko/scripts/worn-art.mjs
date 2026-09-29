// Realistic photos of each motif tattooed on the body, for the revolving motif
// cards. Each motif has its own shot (placement from its own data, skin tone,
// angle, shot size) so the set does not repeat itself; see `shots` below. Generated with Nano Banana 2 (Gemini) on Higgsfield.
// To stay inside the 30-credit site cap, one 2K image holds a 2x2 grid of four
// hands (2 credits for four at 2K); each motif's plate is passed as a reference so
// the tattoo matches its artwork. The grid is split on its white gutters.
//
//   HF_SPENT=27.72 node --experimental-strip-types scripts/worn-art.mjs [--groups 0,1] [--only a,b,c,d] [--resolution 1k|2k] [--dry | --spend]
//   --resplit <grid,...> re-crops saved grids (free). Without --spend nothing is generated.
//
// Output: public/motifs/worn/<slug>.webp (800x1000). Raw grids in generated/worn/.
// --dry prints every prompt and the cost without calling Higgsfield.
import { execFile } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { promisify } from "node:util";
import sharp from "sharp";

const run = promisify(execFile);
const CAP = 40; // raised from 30 by the user on 2026-09-28
const RES = opt0("resolution", "2k");
const COST = RES === "1k" ? 1.5 : 2; // nano_banana_flash: 1k bills 1.5, 2k bills 2
const DRY = process.argv.includes("--dry") || !process.argv.includes("--spend");
function opt0(name, dflt) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : dflt;
}
const SPENT_BEFORE = Number(process.env.HF_SPENT ?? "NaN");
if (Number.isNaN(SPENT_BEFORE)) {
  console.error("Set HF_SPENT to the credits already spent on this site.");
  process.exit(1);
}
const args = process.argv.slice(2);
const opt = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : dflt;
};

const { motifs } = await import("../lib/content/motifs.ts");

// Re-crop saved grids without generating anything: --resplit koi-ryu-tora-hebi[,next-grid]
// Handled first and exits, so it can never fall through to a paid run.
const resplitArg = opt("resplit", "");
if (resplitArg) {
  const { readFileSync } = await import("node:fs");
  for (const name of resplitArg.split(",").filter(Boolean)) {
    const group = name.split("-").map((slug) => motifs.find((m) => m.slug === slug));
    if (group.some((m) => !m)) throw new Error(`unknown slug in ${name}`);
    await split(readFileSync(`generated/worn/${name}.png`), group);
    console.log(`re-split ${name}`);
  }
  process.exit(0);
}

// Paid runs need an explicit --spend flag (and HF_SPENT); anything else is a dry run.

const all = [];
for (let i = 0; i < motifs.length; i += 4) all.push(motifs.slice(i, i + 4));
const only = opt("only", "").split(",").filter(Boolean);
const groupIdx = opt("groups", "").split(",").filter(Boolean).map(Number);
const groups = only.length ? [motifs.filter((m) => only.includes(m.slug))] : groupIdx.length ? groupIdx.map((i) => all[i]) : all;
if (groups.some((g) => g.length !== 4)) throw new Error("Every grid needs exactly four motifs.");

const planned = groups.length * COST;
if (!DRY && SPENT_BEFORE + planned > CAP) {
  console.error(`Refusing: ${planned} planned + ${SPENT_BEFORE} spent passes the ${CAP} cap.`);
  process.exit(1);
}
console.log(`Planned ${groups.length} grid(s) × ${COST} = ${planned} credits → running total ${(SPENT_BEFORE + planned).toFixed(2)} / ${CAP}`);
mkdirSync("generated/worn", { recursive: true });
mkdirSync("public/motifs/worn", { recursive: true });
const bin = process.platform === "win32" ? "higgsfield.cmd" : "higgsfield";

const pos = ["top left", "top right", "bottom left", "bottom right"];

// One shot per motif. Placement comes from the motif's own `placements`;
// skin tones, angles and shot sizes are spread so no two neighbours match.
const shots = {
  koi: "the calf of a woman with deep brown skin, seen from the side at a low angle, medium shot of the lower leg",
  ryu: "the whole back of a man with light olive skin, seen from behind, medium-wide shot from the shoulders to the waist",
  tora: "the outer thigh of a woman with fair freckled skin, three-quarter angle, close-up",
  hebi: "a snake wrapping around the forearm of a man with very deep brown skin, shot from overhead, close-up",
  tsuru: "the shoulder and upper back of an East Asian woman with light skin, over-the-shoulder view from behind, medium close-up",
  kitsune: "the calf of a man with warm tan skin standing, profile view, medium shot of the leg",
  karajishi: "the thigh of a seated man with medium brown skin, high three-quarter angle looking down, medium close-up",
  botan: "the hip and side of a woman with warm olive skin, side angle, close-up, tasteful",
  sakura: "a small branch along the collarbone of a woman with very fair skin, low three-quarter angle, extreme close-up",
  kiku: "the knee of a man with deep brown skin, leg bent, straight-on close-up",
  momiji: "the ankle and top of the foot of a woman with light tan skin, ground-level low angle, close-up",
  hasu: "the top of the foot of a woman with medium brown skin, shot from overhead, close-up",
  ume: "the inner forearm of an East Asian man, arm raised against soft window light, medium close-up",
  nami: "a full sleeve on the extended arm of a woman with light olive skin, three-quarter angle, medium shot",
  kaze: "the back of the leg from calf to thigh of a man with fair skin, seen from behind, wide shot of the whole leg",
  hannya: "the shoulder of a man with deep brown skin, head turned away in profile, medium close-up",
  fudo: "the chest and stomach of an East Asian man with light skin, straight-on medium shot, face out of frame",
  tengu: "the thigh of a seated woman with deep brown skin, side view, medium shot",
  oni: "the forearm of a man with fair freckled skin, fist toward the camera from a low angle, close-up",
  kumo: "the back of the upper arm and shoulder blade of a woman with warm tan skin, seen from behind, close-up",
  iwa: "the lower back of a man with medium brown skin, seen from behind, close-up",
  take: "the ribs of a woman with fair skin, arm raised, side view, medium close-up, tasteful",
  matsu: "the shoulder blade and upper back of a man with very deep brown skin, three-quarter view from behind, medium shot",
  kaen: "the upper arm of an East Asian woman with light skin, arm bent, profile, close-up",
};

async function upload(slug) {
  const { stdout } = await run(bin, ["upload", "create", `public/motifs/${slug}.webp`, "--json"], { encoding: "utf8", shell: true });
  return JSON.parse(stdout).id;
}

async function grid(group) {
  const panels = group
    .map(
      (m, i) =>
        `Panel ${i + 1} (${pos[i]}): ${shots[m.slug] ?? "the forearm of a person"}, tattooed with the design in reference image ${i + 1} (${m.name.toLowerCase()}), adapted to the curve of the body.`,
    )
    .join(" ");
  const prompt =
    "A 2x2 grid of four separate square-cornered photographs, each a vertical 4:5 frame, separated by thin solid pure white gutters, with a thin white border around the outside. " +
    "Four different people, four different body parts, four different camera angles and framings: the panels must not look alike. " +
    "Each is a realistic editorial photograph of a healed traditional Japanese tattoo on real skin: bold black outlines, colour sitting under the skin and slightly softened by healing, following the body's curves, not a sticker, not a drawing. " +
    "Natural skin texture with pores, fine hairs and creases. Dark, quiet settings (charcoal studio backdrop, dim room, soft window light), low-key light, shallow depth of field, muted colour. " +
    "Faces out of frame or turned away; nobody looks at the camera. Tasteful: clothing (dark cloth, trousers, a lowered kimono) covers everything that is not the tattooed area. No text, no watermark, no jewellery. " +
    panels;
  if (DRY) {
    console.log(`
--- ${group.map((m) => m.slug).join("-")} ---
${prompt}`);
    return;
  }
  const ids = await Promise.all(group.map((m) => upload(m.slug)));
  const cmd = ["generate", "create", "nano_banana_flash", "--aspect_ratio", "4:5", "--resolution", RES, ...ids.flatMap((id) => ["--image", id]), "--wait", "--json"];
  const child = run(bin, cmd, { encoding: "utf8", maxBuffer: 8 * 1024 * 1024, shell: true });
  child.child.stdin.end(prompt);
  const { stdout } = await child;
  const json = JSON.parse(stdout);
  const first = Array.isArray(json) ? json[0] : json;
  if (!first?.result_url) throw new Error(`no result: ${stdout.slice(0, 300)}`);
  const buf = Buffer.from(await (await fetch(first.result_url)).arrayBuffer());
  const name = group.map((m) => m.slug).join("-");
  writeFileSync(`generated/worn/${name}.png`, buf);
  await split(buf, group);
  console.log(`grid ${name}: done`);
}

// Find the white gutters (brightest column band near the middle, same for rows) and crop the four panels.
async function split(buf, group) {
  const { data, info } = await sharp(buf).greyscale().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const colMean = (x) => { let s = 0; for (let y = 0; y < H; y++) s += data[y * W + x]; return s / H; };
  const rowMean = (y) => { let s = 0; for (let x = 0; x < W; x++) s += data[y * W + x]; return s / W; };
  const band = (len, mean) => {
    // widest run of near-white lines in the middle 30-70%
    let best = [0, 0], start = -1;
    for (let i = Math.floor(len * 0.3); i < Math.floor(len * 0.7); i++) {
      const white = mean(i) > 235;
      if (white && start < 0) start = i;
      if ((!white || i === Math.floor(len * 0.7) - 1) && start >= 0) {
        if (i - start > best[1] - best[0]) best = [start, i];
        start = -1;
      }
    }
    if (best[1] - best[0] < 2) throw new Error("no white gutter found");
    return best;
  };
  // walk in from the outside while the line is still (near) white
  const edge = (len, mean, from, step) => { let i = from; while (i >= 0 && i < len && mean(i) > 200) i += step; return i; };
  const [cx0, cx1] = band(W, colMean);
  const [cy0, cy1] = band(H, rowMean);
  const L = edge(W, colMean, 0, 1), R = edge(W, colMean, W - 1, -1);
  const T = edge(H, rowMean, 0, 1), B = edge(H, rowMean, H - 1, -1);
  const inset = 10; // stay clear of the gutter's soft edge
  const boxes = [
    [L, T, cx0, cy0],
    [cx1, T, R, cy0],
    [L, cy1, cx0, B],
    [cx1, cy1, R, B],
  ];
  await Promise.all(
    boxes.map(async ([x0, y0, x1, y1], i) => {
      const box = { left: x0 + inset, top: y0 + inset, width: x1 - x0 - 2 * inset, height: y1 - y0 - 2 * inset };
      const t = trim(data, W, box);
      await sharp(buf)
        .extract(t)
        .resize(800, 1000, { fit: "cover" })
        .webp({ quality: 78 })
        .toFile(`public/motifs/worn/${group[i].slug}.webp`);
    }),
  );
}

// Second pass: shave any edge line that is still mostly bright border (cream or
// white gutters vary between grids). Skin and the dark linen never pass the test.
function trim(data, W, { left, top, width, height }) {
  const bright = (x0, y0, dx, dy, n) => {
    let hits = 0;
    for (let k = 0; k < n; k++) if (data[(y0 + k * dy) * W + (x0 + k * dx)] > 200) hits++;
    return hits / n > 0.5;
  };
  const maxX = Math.round(width * 0.1), maxY = Math.round(height * 0.1);
  let l = 0, r = 0, t = 0, b = 0;
  while (l < maxX && bright(left + l, top, 0, 1, height)) l++;
  while (r < maxX && bright(left + width - 1 - r, top, 0, 1, height)) r++;
  while (t < maxY && bright(left, top + t, 1, 0, width)) t++;
  while (b < maxY && bright(left, top + height - 1 - b, 1, 0, width)) b++;
  // plus a 3% margin all round: gutter corners can leave a bright wedge that no full line catches
  const mx = Math.round(width * 0.03), my = Math.round(height * 0.03);
  const pad = (n, m) => (n ? n + 4 : 0) + m;
  return {
    left: left + pad(l, mx),
    top: top + pad(t, my),
    width: width - pad(l, mx) - pad(r, mx),
    height: height - pad(t, my) - pad(b, my),
  };
}

const failures = [];
await Promise.all(groups.map((g) => grid(g).catch((e) => { failures.push(g.map((m) => m.slug).join(",")); console.error(`FAILED ${g.map((m) => m.slug)}: ${String(e.message).slice(0, 300)}`); })));
console.log(`Done.${failures.length ? ` Failed: ${failures.join(" | ")}` : ""}`);
