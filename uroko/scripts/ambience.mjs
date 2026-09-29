// Synthesises the studio ambience loop the sound toggle plays: quiet room
// tone, a distant street hum, and the soft tick of tebori hand-poking. Pure
// procedural audio, no samples, so nothing is borrowed from anywhere. Output:
// public/audio/studio-ambience.mp3 (mono, 48 kbps, ~20 s, seamless loop).
//
//   node scripts/ambience.mjs
//
import { mkdirSync, writeFileSync } from "node:fs";
import lamejs from "@breezystack/lamejs";

const SR = 22050;
const SECONDS = 20;
const N = SR * SECONDS;

// Deterministic PRNG so the file is reproducible.
let seed = 0x9e3779b9;
const rnd = () => {
  seed ^= seed << 13;
  seed >>>= 0;
  seed ^= seed >>> 17;
  seed ^= seed << 5;
  seed >>>= 0;
  return seed / 0xffffffff - 0.5;
};

const out = new Float64Array(N);

// 1. Room tone: white noise through two one-pole low-passes, very quiet.
let lp1 = 0;
let lp2 = 0;
for (let i = 0; i < N; i++) {
  const w = rnd();
  lp1 += 0.03 * (w - lp1);
  lp2 += 0.03 * (lp1 - lp2);
  out[i] += lp2 * 1.6;
}

// 2. Street hum: a band of noise that swells and fades slowly, like traffic
//    passing the end of Motomachi street.
let bp = 0;
let bpPrev = 0;
for (let i = 0; i < N; i++) {
  const w = rnd();
  bp += 0.12 * (w - bp);
  const band = bp - bpPrev;
  bpPrev = bp;
  const t = i / SR;
  const swell = 0.5 + 0.5 * Math.sin((2 * Math.PI * t) / SECONDS) * Math.sin((2 * Math.PI * t) / (SECONDS / 3) + 1.1);
  out[i] += band * 0.9 * (0.15 + 0.35 * swell);
}

// 3. Tebori ticks: a short, damped click every ~0.42 s with slight jitter,
//    every fourth one a touch firmer. Two bars of it, then a pause, as if the
//    artist paused to wipe.
const tickEvery = 0.42;
const pattern = [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1];
let k = 0;
for (let t = 0.3; t < SECONDS - 0.5; t += tickEvery + (rnd() * 0.03)) {
  const on = pattern[k % pattern.length];
  k++;
  if (!on) continue;
  const firm = k % 4 === 0 ? 1.3 : 1;
  const start = Math.floor(t * SR);
  const len = Math.floor(SR * 0.012);
  const f = 2400 + rnd() * 600;
  for (let j = 0; j < len; j++) {
    const env = Math.exp(-j / (len / 5));
    const s = Math.sin((2 * Math.PI * f * j) / SR) * 0.6 + rnd() * 0.8;
    out[start + j] += s * env * 0.28 * firm;
  }
}

// 4. Seamless loop: crossfade the last second into the first second.
const xf = SR;
for (let i = 0; i < xf; i++) {
  const a = i / xf;
  const head = out[i];
  const tail = out[N - xf + i];
  out[i] = head * a + tail * (1 - a);
}
// Trim the tail we blended in so the loop point is clean.
const final = out.subarray(0, N - xf);

// Normalise to a gentle level and convert to 16-bit.
let peak = 0;
for (let i = 0; i < final.length; i++) peak = Math.max(peak, Math.abs(final[i]));
const gain = 0.5 / peak;
const pcm = new Int16Array(final.length);
for (let i = 0; i < final.length; i++) pcm[i] = Math.max(-32768, Math.min(32767, Math.round(final[i] * gain * 32767)));

const enc = new lamejs.Mp3Encoder(1, SR, 48);
const chunks = [];
const block = 1152;
for (let i = 0; i < pcm.length; i += block) {
  const buf = enc.encodeBuffer(pcm.subarray(i, i + block));
  if (buf.length) chunks.push(Buffer.from(buf));
}
const end = enc.flush();
if (end.length) chunks.push(Buffer.from(end));

mkdirSync("public/audio", { recursive: true });
const file = "public/audio/studio-ambience.mp3";
const bytes = Buffer.concat(chunks);
writeFileSync(file, bytes);
console.log(`${file}: ${(bytes.length / 1024).toFixed(1)} KB, ${(final.length / SR).toFixed(1)} s`);
