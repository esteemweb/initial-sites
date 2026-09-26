// Builds the found objects — a negotiator's pad, a phone log, a legal letter, a
// hotel notepad and a few margin notes — as transparent WebPs in public/objects/.
//
//   node scripts/make-objects.mjs
//
// Each object is an HTML/SVG page rendered by the Chrome already installed on
// this machine (puppeteer-core, a devDependency). Everything is two colours —
// night and page — so the objects read as case-file photocopies and stay
// inside the palette. The handwriting face (Just Another Hand, OFL) is baked
// into these images only; the site never loads it. Fonts are downloaded once
// into scripts/assets/ and embedded, so later runs work offline. All jitter is
// seeded, so every run produces the same images.
import puppeteer from "puppeteer-core";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const CHROME = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const NIGHT = "#12131A";
const PAGE = "#F2F0EA";
const CHALK = "#C9C7BF";
const OUT = "public/objects";
const FONTS = "scripts/assets/fonts.css";

mkdirSync(OUT, { recursive: true });
mkdirSync("scripts/assets", { recursive: true });

/* ---------- fonts: fetch once, embed as data URLs ---------- */
async function fonts() {
  if (existsSync(FONTS)) return readFileSync(FONTS, "utf8");
  const url =
    "https://fonts.googleapis.com/css2?family=Just+Another+Hand&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&family=JetBrains+Mono:wght@400;600&display=block";
  const ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36";
  let css = await (await fetch(url, { headers: { "user-agent": ua } })).text();
  // keep latin subsets only, then inline each woff2
  css = css
    .split("/*")
    .filter((b) => !b.trim() || /^\s*latin \*\//.test(b))
    .map((b) => (b.trim() ? "/*" + b : b))
    .join("");
  for (const m of [...css.matchAll(/url\((https:[^)]+)\)/g)]) {
    const buf = Buffer.from(await (await fetch(m[1])).arrayBuffer());
    css = css.replace(m[1], `data:font/woff2;base64,${buf.toString("base64")}`);
  }
  writeFileSync(FONTS, css);
  return css;
}

/* ---------- seeded jitter ---------- */
function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}
const j = (r, a) => (r() - 0.5) * 2 * a;

// a hand-drawn line from (x1,y1) to (x2,y2): a few wobbling segments
function handLine(r, x1, y1, x2, y2, wob = 1.4, segs = 5) {
  let d = `M ${x1 + j(r, wob)} ${y1 + j(r, wob)}`;
  for (let i = 1; i <= segs; i++) {
    const t = i / segs;
    d += ` L ${x1 + (x2 - x1) * t + j(r, wob)} ${y1 + (y2 - y1) * t + j(r, wob)}`;
  }
  return d;
}
// a box drawn in one go, overshooting where it closes
function handBox(r, x, y, w, h, wob = 2) {
  return [
    handLine(r, x - 3, y + j(r, 2), x + w + 4, y + j(r, 2), wob),
    handLine(r, x + w + j(r, 2), y - 3, x + w + j(r, 2), y + h + 4, wob),
    handLine(r, x + w + 3, y + h + j(r, 2), x - 4, y + h + j(r, 2), wob),
    handLine(r, x + j(r, 2), y + h + 3, x + j(r, 2), y - 6, wob),
  ].join(" ");
}
// a loose ellipse, not quite closed
function handCircle(r, cx, cy, rx, ry) {
  let d = "";
  const n = 26;
  const start = r() * Math.PI * 2;
  for (let i = 0; i <= n + 3; i++) {
    const a = start + (i / n) * Math.PI * 2;
    const k = 1 + j(r, 0.05) + i * 0.004;
    d += `${i ? " L" : "M"} ${cx + Math.cos(a) * rx * k} ${cy + Math.sin(a) * ry * k}`;
  }
  return d;
}
function handArrow(r, x1, y1, x2, y2) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const hx = (ang) => x2 - Math.cos(a + ang) * 12;
  const hy = (ang) => y2 - Math.sin(a + ang) * 12;
  const mx = (x1 + x2) / 2 + j(r, 8);
  const my = (y1 + y2) / 2 + j(r, 8);
  return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2} M ${hx(0.5)} ${hy(0.5)} L ${x2} ${y2} L ${hx(-0.5)} ${hy(-0.5)}`;
}
// a torn / not-quite-straight edge as a clip polygon (percentages)
function roughClip(r, top = 0.6, others = 0.35) {
  const pts = [];
  for (let i = 0; i <= 24; i++) pts.push(`${(i / 24) * 100}% ${Math.abs(j(r, top))}%`);
  for (let i = 1; i <= 16; i++) pts.push(`${100 - Math.abs(j(r, others))}% ${(i / 16) * 100}%`);
  for (let i = 23; i >= 0; i--) pts.push(`${(i / 24) * 100}% ${100 - Math.abs(j(r, others))}%`);
  for (let i = 15; i >= 1; i--) pts.push(`${Math.abs(j(r, others))}% ${(i / 16) * 100}%`);
  return `polygon(${pts.join(",")})`;
}

/* ---------- shared defs: grain, toner, ink wobble ---------- */
const defs = (seed) => `
<defs>
  <filter id="ink" x="-5%" y="-5%" width="110%" height="110%">
    <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="${seed}" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
  <filter id="grain" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="1" seed="${seed + 3}" result="f"/>
    <feColorMatrix in="f" type="matrix" values="0 0 0 0 0.07  0 0 0 0 0.075  0 0 0 0 0.1  0 0 0 -2.4 1.25" result="g"/>
    <feComposite in="g" in2="SourceAlpha" operator="in"/>
  </filter>
  <filter id="toner" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves="2" seed="${seed + 7}" result="t"/>
    <feColorMatrix in="t" type="matrix" values="0 0 0 0 0.07  0 0 0 0 0.075  0 0 0 0 0.1  0 0 0 -1.1 0.62" result="u"/>
    <feComposite in="u" in2="SourceAlpha" operator="in"/>
  </filter>
</defs>`;

// paper: page-coloured sheet with rough edges, grain and uneven toner on top
function sheet({ w, h, seed, body, clip }) {
  const r = rng(seed);
  return `
<div class="obj" style="width:${w}px;height:${h}px;clip-path:${clip ?? roughClip(r)}">
  <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${defs(seed)}
    <rect width="${w}" height="${h}" fill="${PAGE}"/>
    ${body(rng(seed + 11))}
    <rect width="${w}" height="${h}" fill="${PAGE}" filter="url(#toner)" opacity=".7"/>
    <rect width="${w}" height="${h}" fill="${PAGE}" filter="url(#grain)" opacity=".32"/>
  </svg>
</div>`;
}

const hand = (x, y, size, text, rot = 0, extra = "") =>
  `<text x="${x}" y="${y}" font-family="Just Another Hand" font-size="${size}" fill="${NIGHT}" transform="rotate(${rot} ${x} ${y})" ${extra}>${text}</text>`;
const mono = (x, y, size, text, weight = 400, extra = "") =>
  `<text x="${x}" y="${y}" font-family="JetBrains Mono" font-size="${size}" font-weight="${weight}" fill="${NIGHT}" letter-spacing="0.06em" ${extra}>${text}</text>`;
const serif = (x, y, size, text, extra = "") =>
  `<text x="${x}" y="${y}" font-family="Newsreader" font-size="${size}" fill="${NIGHT}" ${extra}>${text}</text>`;
const stroke = (d, w = 2.2, colour = NIGHT) =>
  `<path d="${d}" fill="none" stroke="${colour}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" filter="url(#ink)"/>`;

/* ---------- the objects ---------- */
const objects = {
  // chapter IV: Graham's six o'clock, boxed, then crossed out
  pad: sheet({
    w: 300,
    h: 400,
    seed: 41,
    body: (r) => {
      let s = "";
      s += `<rect x="0" y="0" width="300" height="34" fill="${NIGHT}"/>`;
      for (let x = 30; x < 300; x += 48) s += `<circle cx="${x}" cy="17" r="3.2" fill="${PAGE}"/>`;
      for (let y = 70; y < 400; y += 27) s += `<path d="${handLine(r, 0, y, 300, y, 0.3, 3)}" stroke="${NIGHT}" stroke-opacity=".16" stroke-width="1" fill="none"/>`;
      s += `<path d="M 46 34 L 46 400 M 50 34 L 50 400" stroke="${NIGHT}" stroke-opacity=".28" stroke-width="1"/>`;
      s += `<g filter="url(#ink)">`;
      s += hand(62, 90, 34, "Graham —", -1.5);
      s += hand(80, 150, 58, "6.00", -2);
      s += `</g>`;
      s += stroke(handBox(r, 72, 104, 104, 58), 2.4);
      s += stroke(handLine(r, 64, 150, 186, 116, 1.2, 3), 2.6);
      s += `<g filter="url(#ink)">`;
      s += hand(62, 218, 36, "who says six?", 1);
      s += `</g>`;
      s += stroke(handLine(r, 60, 226, 214, 222, 1.6, 6), 1.8);
      s += `<g filter="url(#ink)">`;
      s += hand(62, 280, 36, "8.00 → theirs", -1);
      s += hand(62, 334, 36, "ask the forty", 0.5);
      s += `</g>`;
      // coffee ring
      s += `<path d="${handCircle(r, 236, 344, 44, 42)}" fill="none" stroke="${NIGHT}" stroke-opacity=".18" stroke-width="5" filter="url(#ink)"/>`;
      return s;
    },
  }),

  // chapter I: the family line, printed on a strip with tractor-feed holes
  log: sheet({
    w: 360,
    h: 250,
    seed: 17,
    body: (r) => {
      let s = "";
      for (let y = 16; y < 250; y += 24) s += `<circle cx="14" cy="${y}" r="4.5" fill="${NIGHT}" fill-opacity=".85"/>`;
      s += `<path d="M 28 0 L 28 250" stroke="${NIGHT}" stroke-opacity=".25" stroke-dasharray="2 4" stroke-width="1"/>`;
      s += mono(44, 34, 12, "FAMILY LINE — 14/15 MAR", 600);
      s += mono(44, 54, 10, "EXPORT 16.58  PAGE 1/1");
      s += `<path d="M 44 66 L 344 66" stroke="${NIGHT}" stroke-width="1"/>`;
      s += mono(44, 86, 10, "TIME   DIR  DURATION   NOTE", 600);
      const rows = [
        ["09.14", "OUT", "00:01:52", "agency"],
        ["11.52", "IN ", "00:11:04", "demand"],
        ["13.07", "OUT", "00:02:31", "—"],
        ["16.40", "IN ", "00:00:04", ""],
      ];
      rows.forEach((row, i) => (s += mono(44, 114 + i * 26, 11, row.join("  ").replace(/ /g, "&#160;"))));
      s += stroke(handCircle(r, 150, 188, 112, 17), 2);
      s += `<g filter="url(#ink)">${hand(232, 228, 30, "no speech", -3)}</g>`;
      s += stroke(handArrow(r, 226, 214, 246, 196), 1.8);
      return s;
    },
  }),

  // chapter V: the founder's drag-along notice, a name blacked out, folded in three
  letter: sheet({
    w: 300,
    h: 390,
    seed: 55,
    body: (r) => {
      let s = "";
      s += serif(28, 48, 17, "ASHDOWN VEY", `font-weight="600" letter-spacing="0.2em"`);
      s += serif(28, 66, 10, "Solicitors · 9 Fenwick Row · London EC4", `font-style="italic"`);
      s += `<path d="M 28 80 L 272 80" stroke="${NIGHT}" stroke-width=".8"/>`;
      s += mono(28, 102, 8.5, "OUR REF AV/2291/DR   14 MARCH");
      s += serif(28, 132, 11, "Re:", `font-weight="600"`);
      s += `<path d="M 50 124 L 150 123 L 151 136 L 49 137 Z" fill="${NIGHT}" filter="url(#ink)"/>`;
      s += serif(158, 132, 11, "— clause 14.2 notice", `font-weight="600"`);
      const body = [
        "We act for the holders of a majority of the",
        "issued shares. Our clients have accepted an",
        "offer for the entire share capital of the",
        "Company. Under clause 14.2 you are required",
        "to transfer your shares on the same terms",
        "within fourteen days of this notice.",
        "",
        "We would ask that you do not contact our",
        "clients directly. Your position as a founder",
        "has been noted, and does not alter the",
        "operation of the clause.",
      ];
      body.forEach((line, i) => (s += serif(28, 162 + i * 17, 10.5, line)));
      s += serif(28, 354, 10.5, "Yours faithfully,");
      // the signature, blacked out too
      s += `<path d="M 28 364 L 132 362 L 133 377 L 27 378 Z" fill="${NIGHT}" filter="url(#ink)"/>`;
      // fold lines at thirds
      s += `<path d="M 0 130 L 300 131 M 0 260 L 300 259" stroke="${NIGHT}" stroke-opacity=".14" stroke-width="1.4"/>`;
      // staple
      s += `<path d="M 16 12 L 34 10" stroke="${NIGHT}" stroke-opacity=".7" stroke-width="2"/>`;
      return s;
    },
  }),

  // chapter I: the cards were written in the hotel at six that morning
  notepad: sheet({
    w: 260,
    h: 330,
    seed: 23,
    clip: roughClip(rng(99), 1.8, 0.3),
    body: (r) => {
      let s = "";
      s += mono(22, 34, 9, "HOTEL · LEKKI PHASE 1 · LAGOS", 600);
      s += `<path d="M 22 44 L 238 44" stroke="${NIGHT}" stroke-width=".8"/>`;
      s += mono(22, 58, 7.5, "ROOM 412");
      s += `<g filter="url(#ink)">`;
      s += hand(24, 112, 42, "SAY NOTHING.", -1.5);
      s += hand(24, 170, 34, "WHAT WOULD HE", 0.5);
      s += hand(24, 206, 34, "NEED TO SEE?", 0.5);
      s += hand(24, 270, 30, "2ND MAN — YOUNGER", -1);
      s += `</g>`;
      s += stroke(handLine(r, 22, 122, 196, 118, 1.4, 6), 2);
      s += stroke(handLine(r, 20, 280, 214, 284, 1.2, 6), 1.6);
      return s;
    },
  }),
};

// margin notes: ink only, transparent, in two inks — chalk for night, night for page
const notes = [
  { id: "never-first", text: "never first", w: 190, h: 90, arrow: [150, 40, 178, 76], rot: -4 },
  { id: "who-set-it", text: "who set it?", w: 190, h: 90, arrow: [140, 44, 176, 74], rot: 3 },
  { id: "never-asks", text: "she never asks", w: 230, h: 90, arrow: [20, 44, 6, 80], rot: -2 },
];
for (const n of notes) {
  for (const [ink, colour] of [["chalk", CHALK], ["night", NIGHT]]) {
    const r = rng(n.id.length * 31);
    objects[`note-${n.id}-${ink}`] = `
<div class="obj" style="width:${n.w}px;height:${n.h}px">
  <svg width="${n.w}" height="${n.h}" viewBox="0 0 ${n.w} ${n.h}" xmlns="http://www.w3.org/2000/svg">
    ${defs(n.id.length)}
    <g filter="url(#ink)">
      <text x="12" y="40" font-family="Just Another Hand" font-size="36" fill="${colour}" transform="rotate(${n.rot} 12 40)">${n.text}</text>
    </g>
    ${stroke(handArrow(r, ...n.arrow), 2, colour)}
  </svg>
</div>`;
  }
}

/* ---------- render ---------- */
const css = await fonts();
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 800, height: 800, deviceScaleFactor: 2 });
for (const [name, markup] of Object.entries(objects)) {
  await page.setContent(
    `<!doctype html><html><head><style>${css}
      html,body{margin:0;background:transparent}
      .obj{display:inline-block}
    </style></head><body>${markup}</body></html>`,
    { waitUntil: "load" },
  );
  await page.evaluate(() => document.fonts.ready);
  const el = await page.$(".obj");
  const file = `${OUT}/${name}.webp`;
  await el.screenshot({ path: file, type: "webp", quality: 72, omitBackground: true });
  console.log(file);
}
await browser.close();
