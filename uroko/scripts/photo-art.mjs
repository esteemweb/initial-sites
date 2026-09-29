// Generates the site's atmospheric photography with Higgsfield (GPT Image
// 2.5) and writes optimised WebP files to public/photos/. One shared style,
// short per-shot subjects, no faces, no text. Budget-capped like motif-art.
//
//   node scripts/photo-art.mjs [--only studio-night,needles] [--quality low|medium]
//
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
const only = opt("only", "").split(",").map((s) => s.trim()).filter(Boolean);
const costPer = { low: 0.25, medium: 0.5, high: 1.5 }[quality];

const style =
  "Cinematic photograph, low key, a single warm light source, deep blacks, fine film grain, muted colour with one " +
  "vermilion red accent, shallow depth of field, quiet and still. No text, no lettering, no logos, no faces, no people " +
  "looking at the camera.";

const shots = {
  "ink-water": { ratio: "16:9", w: 1920, h: 1080, subject: "black sumi ink dispersing slowly in dark water, one thread of vermilion pigment, macro, abstract" },
  "studio-night": { ratio: "16:9", w: 1920, h: 1080, subject: "a small Japanese tattoo studio at night: a leather chair, wooden floor, paper lantern, tools laid on a cloth, window with rain" },
  "motomachi-rain": { ratio: "16:9", w: 1920, h: 1080, subject: "an empty shopping street in Yokohama at night in the rain, wet pavement reflecting shop light, a second-floor window lit, long lens" },
  needles: { ratio: "4:5", w: 1200, h: 1500, subject: "a tebori hand-poke rod with a cluster of needles resting on dark cloth beside a small dish of black ink, macro" },
  "hand-tebori": { ratio: "4:5", w: 1200, h: 1500, subject: "a gloved hand holding a long tebori rod against skin, tight crop on the hands and the rod only, dark background" },
  "brush-drawing": { ratio: "4:5", w: 1200, h: 1500, subject: "a hand with a sumi brush drawing a dragon outline on washi paper, ink stone beside it, tight crop on hand and paper" },
  "washi-ink": { ratio: "4:5", w: 1200, h: 1500, subject: "a stack of washi paper, an ink stone and a stick of sumi ink, one red seal stamp, still life on dark wood" },
  "back-piece": { ratio: "4:5", w: 1200, h: 1500, subject: "a healed black and grey Japanese dragon back tattoo, seen from behind, shoulders and back only, head out of frame, side light" },
};

const list = Object.entries(shots).filter(([k]) => !only.length || only.includes(k));
const planned = list.length * costPer;
if (SPENT_BEFORE + planned > CAP) {
  console.error(`Refusing: ${planned} planned + ${SPENT_BEFORE} spent passes the ${CAP} cap.`);
  process.exit(1);
}
mkdirSync("public/photos", { recursive: true });
mkdirSync("generated/photos", { recursive: true });

const bin = process.platform === "win32" ? "higgsfield.cmd" : "higgsfield";
let spent = SPENT_BEFORE;

async function generate([key, s]) {
  const child = run(
    bin,
    ["generate", "create", "gpt_image_2_5", "--aspect_ratio", s.ratio, "--quality", quality, "--resolution", "1k", "--wait", "--json"],
    { encoding: "utf8", maxBuffer: 8 * 1024 * 1024, shell: true },
  );
  child.child.stdin.end(`${style} Subject: ${s.subject}.`);
  const { stdout } = await child;
  spent += costPer;
  const json = JSON.parse(stdout);
  const url = findUrl(Array.isArray(json) ? json : [json]);
  if (!url) throw new Error(`${key}: no result URL`);
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  writeFileSync(`generated/photos/${key}.png`, buf);
  const web = `public/photos/${key}.webp`;
  const info = await sharp(buf).resize(s.w, s.h, { fit: "cover" }).webp({ quality: 72 }).toFile(web);
  console.log(`${key}: ${web} ${(info.size / 1024).toFixed(0)} KB · spent ${spent.toFixed(2)} / ${CAP}`);
}

const failures = [];
await Promise.all(
  list.map((entry) =>
    generate(entry).catch((e) => {
      failures.push(entry[0]);
      console.error(`FAILED ${entry[0]}: ${String(e.message).slice(0, 200)}`);
    }),
  ),
);
console.log(`Done. Spent this run: ${(spent - SPENT_BEFORE).toFixed(2)} (cumulative ${spent.toFixed(2)}).${failures.length ? ` Failed: ${failures.join(", ")}` : ""}`);

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
