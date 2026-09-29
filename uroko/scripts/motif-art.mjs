// Generates motif plates with Higgsfield (GPT Image 2.5) and writes optimised
// WebP files to public/motifs/. One shared style prompt, a short per-motif
// description from lib/content/motifs.ts, nothing copied from anywhere.
//
//   node --experimental-strip-types scripts/motif-art.mjs
//        [--quality low|medium] [--only koi,ryu] [--suffix -b] [--concurrency 8]
//
// Budget: the user capped Higgsfield spend at 30 credits for the whole site.
// GPT Image 2.5 costs 0.25 (low) / 0.5 (medium) per image. The script prints
// the running cost and refuses to start a run that would pass the cap.
import { execFile } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { promisify } from "node:util";
import sharp from "sharp";

const run = promisify(execFile);
const CAP = 40; // raised from 30 by the user on 2026-09-28
const SPENT_BEFORE = Number(process.env.HF_SPENT ?? "0");
const args = process.argv.slice(2);
const opt = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : dflt;
};
const quality = opt("quality", "low");
const only = opt("only", "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const suffix = opt("suffix", "");
const concurrency = Number(opt("concurrency", "8"));
const costPer = { low: 0.25, medium: 0.5, high: 1.5 }[quality];

const { motifs } = await import("../lib/content/motifs.ts");
const list = only.length ? motifs.filter((m) => only.includes(m.slug)) : motifs;
const planned = list.length * costPer;
if (SPENT_BEFORE + planned > CAP) {
  console.error(`Refusing: ${planned} credits planned + ${SPENT_BEFORE} spent would pass the ${CAP} credit cap.`);
  process.exit(1);
}

const style =
  "Traditional Japanese tattoo flash (irezumi) drawn as ink and pigment on aged washi paper. " +
  "Confident black sumi outlines, flat colour in vermilion red, indigo blue and soft grey wash, " +
  "sparse composition with breathing room on warm off-white paper with faint fibre texture. " +
  "Edo-period woodblock sensibility, hand-drawn, slightly uneven line weight. " +
  "No text, no lettering, no signature, no frame, no border, no people, no skin, no photograph, no 3D render.";

const subjects = {
  koi: "a single koi carp leaping upward through splashing water, scales patterned, black and red",
  ryu: "a coiling Japanese dragon with three claws among scrolling clouds, no wings, black body with red accents",
  tora: "a tiger in mid-stride with patterned stripes, bamboo stalks behind",
  hebi: "a snake coiling around a branch of peony, grey scales, red flower",
  tsuru: "a red-crowned crane in flight with neck stretched, long feathers, a pine branch",
  kitsune: "a fox with nine tails and small flames at the tail tips, sitting alert",
  karajishi: "a karajishi lion-dog with a curled mane and mask-like face, beside peonies",
  botan: "a large layered peony bloom with leaves, vermilion petals with grey wash",
  sakura: "a spray of cherry blossoms on a dark branch, petals scattering",
  kiku: "a chrysanthemum drawn as a radiating circle of narrow petals with two leaves",
  momiji: "maple leaves in red and grey floating on gently rippling water",
  hasu: "a lotus flower rising from still water with a broad leaf, pink and grey",
  ume: "plum blossoms with five round petals on a bare gnarled branch, snow suggested",
  nami: "stylised ocean waves with curling fingers of foam, indigo and grey, nothing else",
  kaze: "sweeping black wind bars curving across the page, a few small blossoms carried in them",
  hannya: "a hannya mask with horns, wide mouth and metal-leaf eyes, red",
  fudo: "Fudō Myōō seated on a rock holding a sword and rope, a halo of flame behind",
  tengu: "a red-faced tengu with a long nose and a feather fan, wings folded",
  oni: "an oni demon head with horns and tusks, blue-grey skin, fierce",
  kumo: "scrolling stylised clouds with clean black edges and grey shading, sky only",
  iwa: "angular grey rocks with water breaking against them at the base",
  take: "straight jointed bamboo stalks with leaves in clusters of three",
  matsu: "a gnarled pine trunk with dense needle clusters, black and grey",
  kaen: "a tall column of stylised flames in the Japanese tattoo manner, curling tongues of vermilion fire with black outlines and small scrolling curls, rising from the bottom of the page, no figure",
};

mkdirSync("public/motifs", { recursive: true });
mkdirSync("generated/motifs", { recursive: true });

const bin = process.platform === "win32" ? "higgsfield.cmd" : "higgsfield";
let spent = SPENT_BEFORE;

async function generate(m) {
  const subject = subjects[m.slug] ?? `${m.name} (${m.ja})`;
  const prompt = `${style} Subject: ${subject}. Vertical composition, subject centred.`;
  const child = run(
    bin,
    ["generate", "create", "gpt_image_2_5", "--aspect_ratio", "4:5", "--quality", quality, "--resolution", "1k", "--wait", "--json"],
    { encoding: "utf8", maxBuffer: 8 * 1024 * 1024, shell: true },
  );
  child.child.stdin.end(prompt);
  const { stdout } = await child;
  spent += costPer;
  const json = JSON.parse(stdout);
  // Prefer the full-resolution result over the compressed preview (min_result_url)
  const first = Array.isArray(json) ? json[0] : json;
  const url = first?.result_url ?? findUrl(Array.isArray(json) ? json : [json]);
  if (!url) throw new Error(`${m.slug}: no result URL in ${stdout.slice(0, 200)}`);
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  writeFileSync(`generated/motifs/${m.slug}${suffix}.png`, buf);
  const web = `public/motifs/${m.slug}${suffix}.webp`;
  const info = await sharp(buf).resize(800, 1000, { fit: "cover" }).webp({ quality: 78 }).toFile(web);
  console.log(`${m.slug}: ${web} ${(info.size / 1024).toFixed(0)} KB · spent ${spent.toFixed(2)} / ${CAP}`);
}

// Simple worker pool so all motifs run at once, up to `concurrency`.
const queue = [...list];
const failures = [];
await Promise.all(
  Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
    while (queue.length) {
      const m = queue.shift();
      try {
        await generate(m);
      } catch (e) {
        failures.push(m.slug);
        console.error(`FAILED ${m.slug}: ${String(e.message).slice(0, 300)}`);
      }
    }
  }),
);
console.log(`Done. Spent this run: ${(spent - SPENT_BEFORE).toFixed(2)} credits (cumulative ${spent.toFixed(2)}).${failures.length ? ` Failed: ${failures.join(", ")}` : ""}`);

function findUrl(obj) {
  const seen = new Set();
  const walk = (v) => {
    if (!v || typeof v !== "object" || seen.has(v)) return null;
    seen.add(v);
    for (const [k, val] of Object.entries(v)) {
      if (typeof val === "string" && /^https?:\/\/.+\.(png|jpe?g|webp)(\?|$)/i.test(val) && /url|image|result|output|media/i.test(k)) return val;
      const r = walk(val);
      if (r) return r;
    }
    return null;
  };
  return walk(obj);
}
