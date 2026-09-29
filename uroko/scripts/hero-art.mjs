// Hero photography for the home page, generated with Higgsfield. Explores
// cheaply with Soul Cinematic, then renders the chosen frame with a stronger
// model. Raw files land in generated/hero/ (ignored). Budget-capped: pass the
// running total in HF_SPENT; the script refuses to pass the 30-credit site cap.
//
//   HF_SPENT=9.75 node scripts/hero-art.mjs --model soul_cinematic --only front-a,back-a --ratio 16:9
//
import { execFile } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { promisify } from "node:util";

const run = promisify(execFile);
const CAP = 40; // raised from 30 by the user on 2026-09-28
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
const model = opt("model", "soul_cinematic");
const ratio = opt("ratio", "16:9");
const suffix = opt("suffix", "");
const only = opt("only", "").split(",").map((s) => s.trim()).filter(Boolean);
const cost = { soul_cinematic: 0.12, nano_banana_pro: 2, gpt_image_2_5: 1.5 }[model];
if (!cost) throw new Error(`No known cost for ${model}`);

const look =
  "Fine-art studio photograph, medium format film, natural skin texture, rich deep blacks, restrained colour. " +
  "Backdrop: a hand-painted canvas backdrop in deep oxblood red, mottled like old master paintings, falling to black at the edges and top. " +
  "One soft key light from high on the left, Rembrandt lighting, gentle falloff. The figure is centred with generous empty backdrop on both sides and above the head. " +
  "Quiet, dignified, timeless, like a museum portrait. The tattoos are authentic traditional Japanese irezumi done by a master: bold black outlines, " +
  "smooth gradient shading, faded indigo, vermilion and ochre, wind bars and waves binding the motifs together. " +
  "No text, no letters, no logos, no jewellery, no props.";

const shots = {
  "front-a":
    "A Japanese man in his forties, lean, bare-chested, wearing loose black hakama trousers, standing still facing the camera, arms relaxed at his sides, head slightly bowed, eyes closed. " +
    "A traditional munewari body suit: a dragon among clouds and waves covering both shoulders, the upper arms and the chest, with the classic untattooed strip down the centre of the chest. Framed from the hips up.",
  "front-b":
    "A Japanese man in his thirties with a shaved head, bare-chested, standing facing the camera with his gaze lowered, hands loosely clasped in front. " +
    "A traditional body suit of koi climbing a waterfall and red peonies covering the chest, shoulders and both arms to the elbows, open strip down the middle of the chest. Framed from the waist up.",
  "back-a":
    "A Japanese man seated on a low wooden stool with his back to the camera, a dark kimono lowered to his waist, head turned slightly so his profile shows. " +
    "His whole back is a traditional irezumi back piece of a dragon coiling through clouds, from the shoulders down past the waist. Framed from the stool up.",
  "back-b":
    "A Japanese man kneeling in seiza with his back to the camera, bare back, a black hakama at the waist, head bowed. " +
    "His whole back is a traditional irezumi back piece of Fudō Myōō surrounded by flames and a coiling dragon, shoulders down to the waist. Framed from the knees up.",
  "kimono-a":
    "A Japanese woman in her thirties, back three-quarters to the camera, a black silk kimono slipped down off both shoulders and held at her chest, hair pinned up, looking down over her shoulder. " +
    "Her upper back and one arm carry a traditional irezumi of red peonies and a koi among waves. Tasteful, editorial. Framed from the waist up.",
  "kimono-b":
    "A Japanese woman standing with her back to the camera, a dark indigo kimono lowered to her waist, arms folded in front, head turned so her profile shows. " +
    "Her whole back is a traditional irezumi back piece of a phoenix with chrysanthemums and clouds. Tasteful, editorial. Framed from the waist up.",
};

const list = Object.entries(shots).filter(([k]) => !only.length || only.includes(k));
const planned = list.length * cost;
if (SPENT_BEFORE + planned > CAP) {
  console.error(`Refusing: ${planned} planned + ${SPENT_BEFORE} spent passes the ${CAP} cap.`);
  process.exit(1);
}
console.log(`Planned ${list.length} × ${cost} = ${planned.toFixed(2)} credits (running total after: ${(SPENT_BEFORE + planned).toFixed(2)} / ${CAP})`);
mkdirSync("generated/hero", { recursive: true });

const bin = process.platform === "win32" ? "higgsfield.cmd" : "higgsfield";
const params = {
  soul_cinematic: ["--aspect_ratio", ratio, "--quality", "2k"],
  nano_banana_pro: ["--aspect_ratio", ratio, "--resolution", "2k"],
  gpt_image_2_5: ["--aspect_ratio", ratio, "--quality", "high", "--resolution", "2k"],
}[model];

async function generate([key, subject]) {
  const child = run(bin, ["generate", "create", model, ...params, "--wait", "--json"], {
    encoding: "utf8",
    maxBuffer: 8 * 1024 * 1024,
    shell: true,
  });
  child.child.stdin.end(`${look} Subject: ${subject}`);
  const { stdout } = await child;
  const json = JSON.parse(stdout);
  // Prefer the full-resolution result over the compressed preview (min_result_url)
  const first = Array.isArray(json) ? json[0] : json;
  const url = first?.result_url ?? findUrl(Array.isArray(json) ? json : [json]);
  if (!url) throw new Error(`${key}: no result URL in ${stdout.slice(0, 300)}`);
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  const out = `generated/hero/${key}-${model}${suffix}.png`;
  writeFileSync(out, buf);
  console.log(`${key}: ${out} (${(buf.length / 1024).toFixed(0)} KB)`);
}

const failures = [];
await Promise.all(list.map((e) => generate(e).catch((err) => { failures.push(e[0]); console.error(`FAILED ${e[0]}: ${String(err.message).slice(0, 300)}`); })));
console.log(`Done.${failures.length ? ` Failed: ${failures.join(", ")}` : ""}`);

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
