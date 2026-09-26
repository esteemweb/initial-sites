// Builds public/traag/hero.mp4 (+ poster) from the Higgsfield clips in
// generated/clips. Each clip is pushed through the site's four states —
// plain, posterised with grain, threshold, inverted — with the same
// timing as the CSS fallback: 400ms fade in, 900ms hold, each state
// laid over the one before. Clips join with a 400ms fade.
//
// Run: node scripts/showreel.mjs
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const W = 600;
const H = 750; // 4:5, the desktop hero box
const FPS = 24;
const STATE = 1.3; // 0.4 fade + 0.9 hold
const FADE = 0.4;
const PER = STATE * 4; // 5.2s per portrait

const ORDER = ["c1-front", "c3-profile", "c4-decks", "c2-laugh", "c5-up", "c6-closeup"];
const clips = ORDER.map((n) => path.join("generated", "clips", `${n}.mp4`)).filter((f) => existsSync(f));
if (!clips.length) throw new Error("no clips in generated/clips");

const tmp = path.join("generated", "reel");
mkdirSync(tmp, { recursive: true });
mkdirSync(path.join("public", "traag"), { recursive: true });

const ff = (args) => execFileSync("ffmpeg", ["-v", "error", "-y", ...args], { stdio: "inherit" });

// one static grain frame, reused: moving grain would multiply the file size
const grain = path.join(tmp, "grain.png");
ff(["-f", "lavfi", "-i", `color=c=gray:s=${W}x${H}`, "-vf", "noise=alls=90:allf=u,format=gray", "-frames:v", "1", grain]);

// gray → black (#0B0B0B) … ink (#FF4A00), and the reverse
const toInk = "format=rgb24,lutrgb=r='11+val*244/255':g='11+val*63/255':b='11-val*11/255'";
const toInkInv = "format=rgb24,lutrgb=r='255-val*244/255':g='74-val*63/255':b='val*11/255'";
const base = `fps=${FPS},scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},trim=duration=${PER + FADE},setpts=PTS-STARTPTS,format=gray`;
// CSS contrast(c) then brightness(b), on 0–255
const cb = (c, b) => `lut=y='clip(((val-128)*${c}+128)*${b},0,255)'`;
const threshold = `${cb(2.2, 0.8)},lut=y='if(gte(val,133),255,0)'`; // 52%

const segs = clips.map((clip, i) => {
  const out = path.join(tmp, `seg${i}.mp4`);
  const fc = [
    `[0:v]${base},split=4[a][b][c][d]`,
    `[a]${cb(1.15, 0.85)},format=rgb24[s1]`,
    // posterise to six levels, then grain at ~12%, then black→ink
    `[b]lut=y='floor(val/256*6)*51'[bp];[1:v]format=gray,loop=-1:1,trim=duration=${PER + FADE}[g];[g][bp]blend=all_mode=normal:all_opacity=0.12,${toInk}[s2]`,
    `[c]${threshold},${toInk}[s3]`,
    `[d]${threshold},${toInkInv}[s4]`,
    // each state fades in over the one before, like the CSS stack
    `[s2]format=rgba,fade=t=in:st=${STATE}:d=${FADE}:alpha=1[f2]`,
    `[s3]format=rgba,fade=t=in:st=${STATE * 2}:d=${FADE}:alpha=1[f3]`,
    `[s4]format=rgba,fade=t=in:st=${STATE * 3}:d=${FADE}:alpha=1[f4]`,
    `[s1][f2]overlay=shortest=1[o2];[o2][f3]overlay=shortest=1[o3];[o3][f4]overlay=shortest=1,format=yuv420p[v]`,
  ].join(";");
  ff(["-i", clip, "-i", grain, "-filter_complex", fc, "-map", "[v]", "-an", "-c:v", "libx264", "-crf", "16", "-preset", "fast", out]);
  return out;
});

// join: hard cuts between portraits, as Alvama does. A fade from the
// inverted ink field into the next grey frame reads as mud. Inside each
// portrait the states still fade, 400ms, as on the site.
const inputs = segs.flatMap((s) => ["-i", s]);
const total = segs.length * PER;
const out = path.join("public", "traag", "hero.mp4");
const fc =
  segs.map((_, i) => `[${i}:v]trim=duration=${PER},setpts=PTS-STARTPTS[t${i}]`).join(";") +
  ";" +
  segs.map((_, i) => `[t${i}]`).join("") +
  `concat=n=${segs.length}:v=1:a=0[vo]`;

// flat duotone frames compress very well; the plain and grain states set the bitrate
ff([
  ...inputs,
  "-filter_complex", fc,
  "-map", "[vo]",
  "-an",
  "-c:v", "libx264",
  "-profile:v", "high",
  "-preset", "veryslow",
  "-crf", process.env.CRF || "30",
  "-maxrate", "450k",
  "-bufsize", "900k",
  "-pix_fmt", "yuv420p",
  "-movflags", "+faststart",
  out,
]);

// poster: the first frame, same size, for the <video poster>
ff(["-i", out, "-frames:v", "1", "-q:v", "5", path.join("public", "traag", "poster.jpg")]);

const kb = Math.round(statSync(out).size / 1024);
writeFileSync(path.join(tmp, "report.txt"), `${clips.length} clips, ${total.toFixed(1)}s, ${kb}KB\n`);
console.log(`hero.mp4: ${clips.length} portraits, ${total.toFixed(1)}s loop, ${kb}KB, ${W}x${H}`);
