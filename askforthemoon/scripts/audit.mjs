// Contrast + overflow + inversion audit. Run against a live server:
//   node scripts/audit.mjs [baseUrl]        (default http://localhost:3007)
// Uses the Chrome installed on this machine (CHROME_PATH to override).
// Writes audits/contrast.md and crops into audits/crops/.
import puppeteer from "puppeteer-core";
import { mkdirSync, writeFileSync } from "node:fs";

const BASE = process.argv[2] ?? "http://localhost:3007";
const CHROME = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const ROUTES = ["/", "/read", "/styleguide", "/this-page-does-not-exist"];
// Self-test: AUDIT_INJECT_CSS="..." adds a stylesheet to every page (e.g. to
// reintroduce a known defect and prove the audit catches it).
const INJECT = process.env.AUDIT_INJECT_CSS;
const WIDTHS = [390, 768, 1024, 1440];
const RATIOS = [1, 1.25, 2];

mkdirSync("audits/crops", { recursive: true });
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
// The moon intro plays on every load; the checks look at the settled page, so
// every tab turns it off before paint. (Section 9 plays it on purpose.)
const rawNewPage = browser.newPage.bind(browser);
browser.newPage = async (opts) => {
  const p = await rawNewPage(opts);
  await p.evaluateOnNewDocument(() => { window.__noIntro = true; });
  return p;
};
const page = await browser.newPage();
// Final states only: the pause line and anything animated render complete.
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);

const out = [];
const log = (s = "") => out.push(s);
const motion = [];
const targets = [];
const keyboard = [];
const scheme = [];

/* ---------- 1. contrast: every text node, on the background it actually sits on */
log("# Audit — contrast, overflow, inversion");
log("");
log(`Run ${new Date().toISOString().slice(0, 16).replace("T", " ")} against ${BASE}. Reduced motion (final states).`);
log("Thresholds: 4.5:1 body; 3:1 large (≥ 24px, or ≥ 18.66px at weight ≥ 700).");
log("");
log("## 1. Contrast");
log("");

const pairs = new Map(); // "fg|bg" -> {ratio, large, where:Set}
const failures = [];

for (const route of ROUTES) {
  for (const w of WIDTHS) {
    await page.setViewport({ width: w, height: 900, deviceScaleFactor: 1 });
    await page.goto(BASE + route, { waitUntil: "networkidle0" });
    if (INJECT) await page.addStyleTag({ content: INJECT });
    await page.evaluate(() => document.fonts.ready);
    const rows = await page.evaluate(collectText);
    for (const r of rows) {
      const key = `${r.fg}|${r.bg}|${r.large ? "L" : "B"}`;
      if (!pairs.has(key)) pairs.set(key, { ...r, where: new Set() });
      pairs.get(key).where.add(`${route} @${w}`);
      const min = r.large ? 3 : 4.5;
      if (r.ratio < min || r.signal) failures.push({ ...r, route, w, min });
    }
  }
}

log("| Text | Background | Size | Ratio | Needs | Result | Seen at |");
log("|---|---|---|---|---|---|---|");
for (const p of [...pairs.values()].sort((a, b) => a.ratio - b.ratio)) {
  const min = p.large ? 3 : 4.5;
  const where = [...p.where].slice(0, 3).join(", ") + (p.where.size > 3 ? ` +${p.where.size - 3}` : "");
  log(`| ${p.fg} | ${p.bg} | ${p.large ? "large" : "body"} | ${p.ratio.toFixed(2)} | ${min} | ${p.ratio >= min ? "pass" : "**FAIL**"} | ${where} |`);
}
log("");
log(failures.length ? `**${failures.length} failing text nodes**:` : "**No failures.**");
for (const f of failures.slice(0, 40)) log(`- ${f.route} @${f.w}: “${f.text}” ${f.fg} on ${f.bg} = ${f.ratio.toFixed(2)}${f.signal ? " (text in signal)" : ""}`);
log("");

/* ---------- 1b. contrast with motion on: the dimmed (unread) words */
log("### 1b. Contrast with motion on (unread words dimmed)");
log("");
{
  const mp = await browser.newPage();
  const dim = [];
  for (const w of WIDTHS) {
    await mp.setViewport({ width: w, height: 900, deviceScaleFactor: 1 });
    await mp.goto(BASE + "/", { waitUntil: "networkidle0" });
    await mp.evaluate(() => document.fonts.ready);
    await new Promise((r) => setTimeout(r, 300));
    const rows = (await mp.evaluate(collectText)).filter((r) => r.dimmed);
    for (const r of rows) {
      const min = r.large ? 3 : 4.5;
      if (r.ratio < min) dim.push({ ...r, w, min });
    }
    if (w === 1440) log(`${rows.length} dimmed text nodes measured at 1440 (top of page); lowest ratio ${rows.length ? Math.min(...rows.map((r) => r.ratio)).toFixed(2) : "n/a"}.`);
  }
  await mp.close();
  failures.push(...dim.map((d) => ({ ...d, route: "/ (motion on)" })));
  log(dim.length ? dim.slice(0, 20).map((f) => `- **@${f.w}: “${f.text}” ${f.fg} on ${f.bg} = ${f.ratio.toFixed(2)}**`).join("\n") : "**No dimmed word falls below its threshold.**");
  log("");
}

/* ---------- 2. horizontal overflow, every 40px from 320 to 1920 */
log("## 2. Horizontal overflow (320–1920 px, every 40 px)");
log("");
const overflow = [];
for (const route of ["/", "/read"]) {
  for (let w = 320; w <= 1920; w += 40) {
    for (const h of [700, 1000]) {
      await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
      await page.goto(BASE + route, { waitUntil: "networkidle0" });
      await page.evaluate(() => document.fonts.ready);
      const r = await page.evaluate(() => {
        const t = document.querySelector(".hero .layer-dark .hero-title");
        const layer = document.querySelector(".hero .layer-dark");
        let title = null;
        if (t && layer) {
          const cs = getComputedStyle(layer);
          const contentRight = layer.getBoundingClientRect().right - parseFloat(cs.paddingRight);
          const right = Math.max(...[...t.querySelectorAll(".w")].map((e) => e.getBoundingClientRect().right));
          title = { right: Math.round(right), contentRight: Math.round(contentRight) };
        }
        return { sw: document.documentElement.scrollWidth, iw: innerWidth, title };
      });
      const bad = r.sw > r.iw || (r.title && r.title.right > r.title.contentRight + 0.5);
      if (bad) overflow.push(`${route} ${w}×${h}: page ${r.sw}/${r.iw}` + (r.title ? `, title right ${r.title.right} vs content ${r.title.contentRight}` : ""));
    }
  }
}
log(overflow.length ? overflow.map((s) => `- **${s}**`).join("\n") : "**None.** Page width equals viewport and the hero title stays inside the content box at every size tested.");
log("");

/* ---------- 3. inversion: pixels either side of every join, every text line crossing it */
log("## 3. Inversion at the join");
log("");
log("For every text line that crosses a join, 12 px strips either side of the join are sampled.");
log("Left of the join the ink must reach night (luminance ≤ 0.03); right of it the ink must reach the lit colour (luminance ≥ 0.55).");
log("");
const inv = [];
let checked = 0;
// "/" as rendered; "/styleguide" with its live join moved to 20%, 58% and 85%.
const CASES = [["/", null], ["/styleguide", 20], ["/styleguide", 58], ["/styleguide", 85]];
for (const dpr of RATIOS) {
  for (const w of WIDTHS) {
   for (const [route, join] of CASES) {
    await page.setViewport({ width: w, height: 900, deviceScaleFactor: dpr });
    await page.goto(BASE + route, { waitUntil: "networkidle0" });
    if (INJECT) await page.addStyleTag({ content: INJECT });
    await page.evaluate(() => document.fonts.ready);
    if (join !== null) {
      await page.evaluate((v) => {
        const input = document.querySelector(".sg-range");
        const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
        set.call(input, String(v));
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }, join);
      await new Promise((r) => setTimeout(r, 200));
    }
    const lines = await page.evaluate(crossingLines);
    for (const l of lines) {
      await page.evaluate((y) => window.scrollTo(0, y), Math.max(0, l.docTop - 200));
      await new Promise((r) => setTimeout(r, 120));
      // puppeteer clips are in document coordinates
      const clip = { x: Math.max(0, l.join - 12), y: l.docTop, width: 24, height: l.height };
      const png = await page.screenshot({ clip, encoding: "base64" });
      const res = await page.evaluate(analyse, png, dpr);
      checked++;
      const ok = (!res.leftInk || res.leftMin <= 0.03) && (!res.rightInk || res.rightMax >= 0.55);
      if (!ok) inv.push(`${route}${join !== null ? ` (join ${join}%)` : ""} ${w}px @${dpr}x — ${l.where}: “${l.text}” left min ${res.leftMin.toFixed(3)}, right max ${res.rightMax.toFixed(3)}`);
    }
   }
    if (dpr === 1.25) {
      await page.goto(BASE + "/", { waitUntil: "networkidle0" });
      await page.evaluate(() => document.fonts.ready);
      for (const n of [3, 6]) {
        const el = await page.$(`.rooms li:nth-child(${n})`);
        if (!el) continue;
        await el.evaluate((e) => e.scrollIntoView({ block: "center" }));
        await new Promise((r) => setTimeout(r, 150));
        await el.screenshot({ path: `audits/crops/row-${n}-${w}.png` });
      }
    }
  }
}
log(`${checked} crossing lines checked on / and on /styleguide (join at 20, 58, 85%), across ${WIDTHS.join("/")} px at ${RATIOS.join("×, ")}× pixel ratio.`);
log("");
log(inv.length ? inv.map((s) => `- **${s}**`).join("\n") : "**Every crossing line inverts at the join.**");
log("");
log("Crops of rows III and VI at each width (1.25×) are in `audits/crops/`.");

/* ---------- 5. motion ceiling: nothing over 600ms, nothing loops */
log("## 5. Motion ceiling");
log("");
{
  const mp = await browser.newPage();
  await mp.goto(BASE + "/", { waitUntil: "networkidle0" });
  const found = await mp.evaluate(() => {
    const out = [];
    const secs = (v) => v.split(",").map((x) => x.trim()).map((x) => (x.endsWith("ms") ? parseFloat(x) / 1000 : parseFloat(x) || 0));
    const walk = (rules) => {
      for (const r of rules) {
        if (r.cssRules && !(r instanceof CSSStyleRule)) walk(r.cssRules);
        if (!(r instanceof CSSStyleRule)) continue;
        const st = r.style;
        const t = st.transitionDuration ? Math.max(...secs(st.transitionDuration)) : 0;
        const a = st.animationDuration ? Math.max(...secs(st.animationDuration)) : 0;
        const inf = /infinite/.test(st.animationIterationCount || "");
        if (t > 0.6 || a > 0.6 || inf) out.push(`${r.selectorText.slice(0, 80)} — transition ${t}s, animation ${a}s${inf ? ", infinite" : ""}`);
        if (r.cssRules) walk(r.cssRules);
      }
    };
    for (const sh of document.styleSheets) {
      try { walk(sh.cssRules); } catch {}
    }
    const running = document.getAnimations().filter((an) => {
      const tm = an.effect?.getTiming?.();
      return tm && ((typeof tm.duration === "number" && tm.duration > 600) || tm.iterations === Infinity);
    }).map((an) => `running: ${an.animationName ?? an.transitionProperty ?? "animation"}`);
    return [...out, ...running];
  });
  await mp.close();
  motion.push(...found);
  log(found.length ? found.map((s) => `- **${s}**`).join("\n") : "**Every transition and animation is 600ms or less; nothing loops.**");
  log("");
}

/* ---------- 4. occlusion: nothing may cover a word */
log("## 4. Occlusion — nothing covers a word");
log("");
log("Every visible line of text is sampled at 5 points; the topmost element there must be the text itself,");
log("its own inverted copy, or its own knockout copy. Pointer-events are forced on so decorative layers count.");
log("Occluders are objects: images, glyphs, numeral tabs, log lines, the progress moon, found objects,");
log("and inputs (unless invisible). Excluded by design: the fixed header (shows only on scroll-up) and the mobile buy bar");
log("(below 1024; the page reserves its height so nothing rests under it, but text passes under it while scrolling).");
log("");
const occ = new Map();
for (const route of ["/", "/read", "/styleguide"]) {
  for (const w of WIDTHS) {
    await page.setViewport({ width: w, height: 900, deviceScaleFactor: 1 });
    await page.goto(BASE + route, { waitUntil: "networkidle0" });
    if (INJECT) await page.addStyleTag({ content: INJECT });
    await page.evaluate(() => document.fonts.ready);
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < total; y += 640) {
      await page.evaluate((y) => window.scrollTo(0, y), y);
      await new Promise((r) => setTimeout(r, 120));
      for (const b of await page.evaluate(occlusion)) occ.set(`${route} @${w}: “${b.text}” covered by ${b.by}`, true);
    }
  }
}
log(occ.size ? [...occ.keys()].slice(0, 60).map((s) => `- **${s}**`).join("\n") : "**Nothing covers a word** on /, /read or /styleguide at 390, 768, 1024 or 1440.");
log("");


/* ---------- 6. touch targets at 390 */
log("## 6. Touch targets (390 px)");
log("");
{
  const tp = await browser.newPage();
  await tp.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await tp.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const small = [];
  for (const route of ["/", "/read", "/styleguide", "/this-page-does-not-exist"]) {
    await tp.goto(BASE + route, { waitUntil: "networkidle0" });
    const found = await tp.evaluate(() => {
      const out = [];
      const els = document.querySelectorAll("a[href], button, label.format, input:not([type=radio]), summary");
      for (const el of els) {
        if (el.closest("[inert], .layer-lit, .sr-only")) continue;
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden") continue;
        if (el.classList.contains("skip")) continue; // appears on focus only, 48px tall when shown
        let r = el.getBoundingClientRect();
        let w = r.width, h = r.height;
        // include a ::after hit-area extension
        const after = getComputedStyle(el, "::after");
        if (after.content !== "none" && after.position === "absolute") {
          w = Math.max(w, parseFloat(after.width) || 0);
          h = Math.max(h, parseFloat(after.height) || 0);
        }
        if (!w || !h) continue;
        if (w < 47.5 || h < 47.5) out.push(`${el.tagName.toLowerCase()} “${(el.innerText || el.getAttribute("aria-label") || "").trim().slice(0, 30)}” ${Math.round(w)}×${Math.round(h)}`);
      }
      return out;
    });
    small.push(...found.map((f) => `${route}: ${f}`));
  }
  await tp.close();
  targets.push(...small);
  log(small.length ? small.map((s) => `- **${s}**`).join("\n") : "**Every link, button and control is at least 48×48 px** on /, /read, /styleguide and the 404.");
  log("");
}

/* ---------- 7. keyboard: order, reach, visible focus */
log("## 7. Keyboard");
log("");
for (const route of ["/", "/read"]) {
  const kp = await browser.newPage();
  await kp.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await kp.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await kp.goto(BASE + route, { waitUntil: "networkidle0" });
  const order = [];
  const invisible = [];
  let buyLinks = 0;
  for (let i = 0; i < 90; i++) {
    await kp.keyboard.press("Tab");
    await new Promise((r) => setTimeout(r, 60));
    const f = await kp.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const cx = Math.min(innerWidth - 1, Math.max(0, r.left + r.width / 2));
      const cy = Math.min(innerHeight - 1, Math.max(0, r.top + r.height / 2));
      const top = document.elementFromPoint(cx, cy);
      return {
        label: (el.getAttribute("aria-label") || el.innerText || el.value || el.tagName).trim().replace(/\s+/g, " ").slice(0, 40),
        inBuy: !!el.closest("#buy"),
        visible: r.width > 0 && r.height > 0 && !el.closest("[inert]") && cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0 && (!top || el.contains(top) || top.contains(el) || top === el),
        key: el.outerHTML.slice(0, 80),
      };
    });
    if (!f) break;
    if (order.length && order[0].key === f.key) break; // wrapped
    order.push(f);
    if (!f.visible) invisible.push(f.label);
    if (f.inBuy) buyLinks++;
  }
  await kp.close();
  keyboard.push(...invisible.map((l) => `${route}: focus not visible on “${l}”`));
  if (route === "/" && buyLinks === 0) keyboard.push("/: focus never reaches the buy section");
  log(`**${route}** — ${order.length} tab stops, ${buyLinks} in the buy section. Order: ${order.map((o) => o.label).join(" → ")}`);
  log("");
}
log(keyboard.length ? keyboard.map((s) => `- **${s}**`).join("\n") : "**Every tab stop is visible, and focus reaches the buy links.**");
log("");

/* ---------- 8. system light vs dark: the site sets its own colours */
log("## 8. System light vs dark");
log("");
{
  const shots = async (scheme, route, w) => {
    const sp = await browser.newPage();
    await sp.emulateMediaFeatures([
      { name: "prefers-reduced-motion", value: "reduce" },
      { name: "prefers-color-scheme", value: scheme },
    ]);
    await sp.setViewport({ width: w, height: 900, deviceScaleFactor: 1 });
    await sp.goto(BASE + route, { waitUntil: "networkidle0" });
    await sp.evaluate(() => document.fonts.ready);
    const total = await sp.evaluate(() => document.documentElement.scrollHeight);
    const out = [];
    for (let y = 0; y < total; y += Math.ceil(total / 5)) {
      await sp.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), y);
      await new Promise((r) => setTimeout(r, 250));
      // lazy images start loading on scroll: wait for every one on screen, or
      // one scheme can be caught mid-load and "differ" from the other
      await sp
        .waitForFunction(
          () => [...document.images].every((i) => { const r = i.getBoundingClientRect(); return r.bottom < 0 || r.top > innerHeight || (i.complete && i.naturalWidth > 0); }),
          { timeout: 5000 },
        )
        .catch(() => {});
      // scroll-driven UI (the mobile buy bar, the progress moon) updates a
      // frame or two after the scroll, later when the machine is busy: shoot
      // until two consecutive frames agree
      let shot = await sp.screenshot({ type: "png" });
      for (let k = 0; k < 6; k++) {
        await new Promise((r) => setTimeout(r, 150));
        const next = await sp.screenshot({ type: "png" });
        if (Buffer.from(next).equals(Buffer.from(shot))) break;
        shot = next;
      }
      out.push(shot);
    }
    await sp.close();
    return out;
  };
  // Very large glyphs rasterise with tiny run-to-run noise (measured: ≤ 6 of
  // 765 colour units even light-vs-light), so a pixel only counts as
  // different above 12. A real scheme difference is far larger.
  const dp = await browser.newPage();
  const pixelDiff = (x, y) =>
    dp.evaluate(async (x, y) => {
      const load = async (src) => {
        const i = new Image();
        i.src = "data:image/png;base64," + src;
        await i.decode();
        const cv = document.createElement("canvas");
        cv.width = i.width;
        cv.height = i.height;
        const c = cv.getContext("2d");
        c.drawImage(i, 0, 0);
        return c.getImageData(0, 0, i.width, i.height).data;
      };
      const [a, b] = [await load(x), await load(y)];
      if (a.length !== b.length) return { n: -1, max: 999 };
      let n = 0, max = 0;
      for (let k = 0; k < a.length; k += 4) {
        const d = Math.abs(a[k] - b[k]) + Math.abs(a[k + 1] - b[k + 1]) + Math.abs(a[k + 2] - b[k + 2]);
        if (d > max) max = d;
        if (d > 12) n++;
      }
      return { n, max };
    }, x, y);
  const diffs = [];
  let compared = 0;
  let noise = 0;
  for (const route of ["/", "/read", "/styleguide", "/this-page-does-not-exist"]) {
    for (const w of WIDTHS) {
      const [a, b] = [await shots("light", route, w), await shots("dark", route, w)];
      for (let i = 0; i < a.length; i++) {
        compared++;
        const r = await pixelDiff(Buffer.from(a[i]).toString("base64"), Buffer.from(b[i]).toString("base64"));
        noise = Math.max(noise, r.max);
        if (r.n !== 0) diffs.push(`${route} @${w}, frame ${i + 1}: ${r.n} px over threshold (max Δ ${r.max})`);
      }
    }
  }
  await dp.close();
  scheme.push(...diffs);
  log(diffs.length ? diffs.map((s) => `- **differs: ${s}**`).join("\n") : `**No difference under light and dark** — ${compared} frames across 4 routes × 4 widths; largest per-pixel delta ${noise} of 765 (render noise; threshold 12).`);
  log("");
}

/* ---------- 9. the moon intro: plays once, gets out of the way */
log("## 9. Intro");
log("");
const intro = [];
{
  const ip = await rawNewPage();
  await ip.setViewport({ width: 1440, height: 900 });
  await ip.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  const early = await ip.evaluate(() => {
    const el = document.querySelector(".intro");
    return !!el && getComputedStyle(el).display !== "none" && getComputedStyle(el).visibility === "visible";
  });
  await new Promise((r) => setTimeout(r, 3500));
  const late = await ip.evaluate(() => {
    const el = document.querySelector(".intro");
    const top = document.elementFromPoint(innerWidth / 2, innerHeight / 2);
    return { hidden: !el || getComputedStyle(el).visibility === "hidden", covering: !!top?.closest(".intro") };
  });
  await ip.reload({ waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 300));
  const again = await ip.evaluate(() => getComputedStyle(document.querySelector(".intro")).visibility === "visible");
  await ip.close();
  const rp = await rawNewPage();
  await rp.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await rp.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  const reduced = await rp.evaluate(() => getComputedStyle(document.querySelector(".intro")).display);
  await rp.close();
  if (!early) intro.push("the intro is not showing on a first visit");
  if (!late.hidden || late.covering) intro.push("the intro is still in the way after 3.5s");
  if (!again) intro.push("the intro does not play again on reload");
  if (reduced !== "none") intro.push("the intro renders under reduced motion");
  log(intro.length ? intro.map((s) => `- **${s}**`).join("\n") : "**Plays on a first visit, is gone and non-blocking by 3.5s, plays again on every reload, and never renders under reduced motion.**");
  log("");
}

writeFileSync("audits/contrast.md", out.join("\n") + "\n");
await browser.close();
console.log(out.join("\n"));
process.exit(failures.length || overflow.length || inv.length || occ.size || motion.length || targets.length || keyboard.length || scheme.length || intro.length ? 1 : 0);

function occlusion() {
  const OCCLUDERS = "img, svg, .room-tab, .log, .progress-moon, .found-over, .title-moon, .buy-rail, input";
  const force = document.createElement("style");
  force.textContent = "*{pointer-events:auto!important}";
  document.head.appendChild(force);
  const describe = (e) =>
    typeof e.className === "string" && e.className.trim()
      ? `${e.tagName.toLowerCase()}.${e.className.trim().split(/\s+/).slice(0, 2).join(".")}`
      : e.tagName.toLowerCase();
  const bad = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const text = n.textContent.replace(/\s+/g, " ").trim();
    if (!text) continue;
    const el = n.parentElement;
    if (el.closest(".sr-only, .site-header, .buy-bar, .layer-lit, .title-knock, [inert], script, style")) continue;
    // The 3D book: only the face turned towards the reader is visible; hit
    // testing ignores backface-visibility, so skip text on the far faces.
    const book = el.closest(".book");
    if (book && !el.closest(`.face-${book.dataset.side ?? "front"}`)) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none" || cs.opacity === "0") continue;
    const range = document.createRange();
    range.selectNodeContents(n);
    for (const r of range.getClientRects()) {
      if (r.width < 3 || r.top < 0 || r.bottom > innerHeight || r.left < 0 || r.right > innerWidth) continue;
      let hit = null;
      for (const fx of [0.1, 0.3, 0.5, 0.7, 0.9]) {
        const top = document.elementFromPoint(r.left + r.width * fx, r.top + r.height / 2);
        if (!top || top === el || el.contains(top) || top.contains(el)) continue;
        const split = el.closest(".split");
        if (split && split.contains(top) && top.closest(".layer-lit")) continue;
        const title = el.closest(".room-title");
        if (title && title.contains(top)) continue;
        if (top.closest(".site-header, .buy-bar")) continue;
        // Only objects can cover a word: images, glyphs, tabs, log lines, the
        // progress moon, found objects. Invisible hit areas (a radio's opacity-0
        // input) don't. Type touching type is a typesetting question, and
        // browsers hit-test a font's full ascent, not its ink.
        const occluder = top.closest(OCCLUDERS);
        if (!occluder) continue;
        if (getComputedStyle(occluder).opacity === "0") continue;
        hit = top;
        break;
      }
      if (hit) {
        bad.push({ text: text.slice(0, 40), by: describe(hit) });
        break;
      }
    }
  }
  force.remove();
  return bad;
}

/* ---------- in-page helpers ---------- */

function collectText() {
  const parse = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const [r, g, b, a = 1] = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
    return { r, g, b, a };
  };
  const hex = ({ r, g, b }) => "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();
  const lum = ({ r, g, b }) => {
    const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
    return (x + 0.05) / (y + 0.05);
  };
  const bgOf = (el) => {
    for (let e = el; e; e = e.parentElement) {
      const c = parse(getComputedStyle(e).backgroundColor);
      if (c && c.a > 0.5) return c;
    }
    return parse(getComputedStyle(document.documentElement).backgroundColor) ?? { r: 255, g: 255, b: 255, a: 1 };
  };
  const opacityOf = (el) => {
    let o = 1;
    for (let e = el; e; e = e.parentElement) o *= parseFloat(getComputedStyle(e).opacity);
    return o;
  };
  const rows = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const text = n.textContent.replace(/\s+/g, " ").trim();
    if (!text) continue;
    const el = n.parentElement;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none") continue;
    if (el.closest(".sr-only") || el.closest("[hidden]")) continue;
    // A knockout copy is clipped to the moon glyph and only ever shows over the
    // glyph's ink, which is the opposite of the copy's colour.
    if (el.closest(".title-knock")) continue;
    const range = document.createRange();
    range.selectNodeContents(n);
    const rect = range.getBoundingClientRect();
    if (!rect.width || !rect.height) continue;
    // Inside a Split, only the part on the layer's own side of the join is visible.
    const layer = el.closest(".split > .layer");
    if (layer) {
      const split = layer.parentElement;
      const sr = split.getBoundingClientRect();
      const px = parseFloat(getComputedStyle(split).getPropertyValue("--at-px"));
      const pct = parseFloat(getComputedStyle(split).getPropertyValue("--at"));
      const join = sr.left + (Number.isNaN(px) ? (sr.width * pct) / 100 : px);
      if (layer.classList.contains("layer-lit") && rect.left >= join) continue;
      if (layer.classList.contains("layer-dark") && rect.right <= join) continue;
    }
    const fg = parse(cs.color);
    const bg = bgOf(el);
    // invisible text (e.g. the buy rail before it has appeared) isn't read
    if (opacityOf(el) < 0.01) continue;
    const a = fg.a * opacityOf(el);
    const mixed = { r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a) };
    const size = parseFloat(cs.fontSize);
    const large = size >= 24 || (size >= 18.66 && Number(cs.fontWeight) >= 700);
    // Signal never carries text, at any size — the palette table on /styleguide
    // shows it as struck-through fills only.
    const signal = fg.r === 200 && fg.g === 69 && fg.b === 45;
    rows.push({ text: text.slice(0, 50), fg: hex(mixed), bg: hex(bg), ratio: ratio(mixed, bg), large, signal, dimmed: opacityOf(el) < 0.99 });
  }
  return rows;
}

function crossingLines() {
  const out = [];
  document.querySelectorAll(".split").forEach((split) => {
    const dark = split.querySelector(":scope > .layer-dark");
    if (!dark) return;
    const sr = split.getBoundingClientRect();
    const px = parseFloat(getComputedStyle(split).getPropertyValue("--at-px"));
    const pct = parseFloat(getComputedStyle(split).getPropertyValue("--at"));
    const join = sr.left + (Number.isNaN(px) ? (sr.width * pct) / 100 : px);
    // The 3D book is transformed and the back cover inverts the other way round
    // (night on the left); both are checked by eye in crops.
    if (split.closest(".book") || split.classList.contains("cover-back")) return;
    const where = split.closest("li") ? "chapter row" : split.closest(".site-header") ? "header" : split.classList.contains("cover") ? "cover (flat)" : split.closest(".room") || split.classList.contains("room") ? "specimen row" : "hero";
    // Merge rects into visual lines per block (passages are split into word
    // spans for the reading pace, so one line is many small rects).
    const lines = new Map();
    const walker = document.createTreeWalker(dark, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      if (!n.textContent.trim() || n.parentElement.closest(".sr-only, .title-knock")) continue;
      const block = n.parentElement.closest("p, h1, h2, h3, li, figcaption, div") ?? n.parentElement;
      const range = document.createRange();
      range.selectNodeContents(n);
      for (const r of range.getClientRects()) {
        if (!r.width) continue;
        const key = block;
        if (!lines.has(key)) lines.set(key, []);
        const arr = lines.get(key);
        const same = arr.find((l) => Math.abs(l.top - r.top) < 3);
        if (same) {
          same.left = Math.min(same.left, r.left);
          same.right = Math.max(same.right, r.right);
          same.height = Math.max(same.height, r.height);
          same.text += " " + n.textContent.trim();
        } else arr.push({ top: r.top, left: r.left, right: r.right, height: r.height, text: n.textContent.trim() });
      }
    }
    for (const arr of lines.values()) {
      for (const r of arr) {
        if (r.left < join - 12 && r.right > join + 12) {
          out.push({ join: Math.round(join), docTop: Math.round(r.top + window.scrollY), height: Math.max(8, Math.round(r.height)), text: r.text.slice(0, 40), where });
        }
      }
    }
  });
  return out;
}

async function analyse(b64, dpr) {
  const img = new Image();
  img.src = "data:image/png;base64," + b64;
  await img.decode();
  const c = document.createElement("canvas");
  c.width = img.width;
  c.height = img.height;
  const ctx = c.getContext("2d");
  ctx.drawImage(img, 0, 0);
  const d = ctx.getImageData(0, 0, c.width, c.height).data;
  const lum = (r, g, b) => {
    const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const mid = Math.round(c.width / 2);
  const gap = Math.ceil(dpr);
  let leftMin = 1, rightMax = 0, leftInk = false, rightInk = false;
  for (let y = 0; y < c.height; y++) {
    for (let x = 0; x < c.width; x++) {
      if (Math.abs(x - mid) <= gap) continue;
      const i = (y * c.width + x) * 4;
      const L = lum(d[i], d[i + 1], d[i + 2]);
      if (x < mid) {
        leftMin = Math.min(leftMin, L);
        if (L < 0.5) leftInk = true;
      } else {
        rightMax = Math.max(rightMax, L);
        if (L > 0.05) rightInk = true;
      }
    }
  }
  return { leftMin, rightMax, leftInk, rightInk };
}
