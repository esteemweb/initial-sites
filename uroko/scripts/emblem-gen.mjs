// Generates candidate emblem marks with Higgsfield GPT Image 2.5 (0.25 credits each).
//   HF_SPENT=<so far> node scripts/emblem-gen.mjs
import { execFile } from "node:child_process";
import { writeFileSync } from "node:fs";
import { promisify } from "node:util";
const run = promisify(execFile);
const CAP = 40, spentBefore = Number(process.env.HF_SPENT ?? "0");
const variants = [
  "a sharp symmetrical crest of overlapping fish scales rising to a point, two thin dragon whiskers curling outward from the top, spiked lower edge",
  "a symmetrical tribal-style emblem shaped like a stylised koi scale cluster, angular, with barbed tendrils sweeping left and right like wings",
  "a symmetrical spiky emblem: a central diamond scale flanked by two curved blades, thin spines radiating, the silhouette of a crest or mask",
  "a symmetrical emblem combining a single fish scale, a dragon claw on each side and a small flame at the top, angular and sharp",
];
if (spentBefore + variants.length * 0.25 > CAP) { console.error("over cap"); process.exit(1); }
const bin = process.platform === "win32" ? "higgsfield.cmd" : "higgsfield";
await Promise.all(variants.map(async (v, i) => {
  const prompt = `Flat vector logo mark for a Japanese tattoo studio called Uroko (meaning scales): ${v}. Pure white shape on a solid black background, centred, filling 70% of the frame, single solid silhouette with clean hard edges, no gradients, no shading, no text, no letters, no frame, no background pattern.`;
  const child = run(bin, ["generate", "create", "gpt_image_2_5", "--aspect_ratio", "1:1", "--quality", "low", "--resolution", "1k", "--wait", "--json"], { encoding: "utf8", maxBuffer: 8e6, shell: true });
  child.child.stdin.end(prompt);
  const { stdout } = await child;
  const j = JSON.parse(stdout); const arr = Array.isArray(j) ? j : [j];
  const url = JSON.stringify(arr).match(/https?:\/\/[^"]+\.(?:png|jpe?g|webp)/)?.[0];
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  writeFileSync(`generated/emblem/v${i + 1}.png`, buf);
  console.log(`v${i + 1} saved`);
}));
console.log(`Spent ${variants.length * 0.25} (cumulative ${(spentBefore + variants.length * 0.25).toFixed(2)})`);
