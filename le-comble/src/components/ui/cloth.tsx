"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { TRAIL, field, trailPoint, type TrailPoint } from "@/lib/jelly";

/* The liquid cloth and the jelly text — user requests (25 Sep 2026): "make
   background wobble with the movement of mouse … like jelly or liquidy type",
   then "can we make the texts also do the same without making a mess".

   One pointer trail (lib/jelly.ts) drives two things:

   1. The cloth. The page's velvet is drawn again on a WebGL2 canvas fixed
      behind all content, sampled in page coordinates (480 CSS px tiles,
      scrolling with the page) so at rest it matches the CSS tile beneath it
      exactly. A fragment shader sums the trail per pixel and bends the weave;
      a lens swells it under the pointer; a faint sheen where it bends most.

   2. The text, tidily. Heading words (`.jelly-w`, from <JellyText>) take the
      same push at their centre, scaled to a third and capped at 10 px, with a
      small tilt; paragraphs move as whole blocks, a tenth and at most 4 px.
      Transforms only — nothing reflows, text stays sharp. Never moved: a
      link or button itself (only the text inside a link), forms, dialogs,
      photos, panels, the header, the nav, the hero.

   Frames run only while something moves. Not attached for reduced motion,
   touch or a coarse pointer; the cloth also needs WebGL2 (without it the
   text still moves over the static velvet). */

const TILE = 480; // CSS px, same as --silk-size
const TEXTURE = "/texture/silk-indigo-velvet.webp";
const N = TRAIL.size;
const WORD = { k: 0.33, max: 10, tilt: 0.25, maxTilt: 3 }; // px, deg per px, deg
const BLOCK = { k: 0.1, max: 4 };
/* Text inside a link may move — the link's own box, which takes the click,
   never does. Controls, forms and the rest stay still. */
const SKIP = "button, form, dialog, [data-lightbox], .rounded-panel, section[aria-labelledby=hero-title], header, nav, [role=grid], .sr-only, [aria-hidden=true]";
/* never moved themselves (their box takes the click or the typing) — except
   links that read as plain text, see measure() */
const CONTROL = new Set(["A", "BUTTON", "SUMMARY", "LABEL", "INPUT", "SELECT", "TEXTAREA", "OPTION", "svg", "path"]);
/* large type moves like a heading word: more, and with a tilt */
const BIG = ["type-display", "type-xl", "type-lg", "type-md"];

const VERT = `#version 300 es
in vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform float uDpr;
uniform vec2 uScroll;
uniform float uTile;
uniform vec4 uPts[${N}];
uniform float uAge[${N}];
uniform vec3 uLens;
out vec4 o;

void main() {
  vec2 p = gl_FragCoord.xy / uDpr;
  p.y = uRes.y - p.y;
  vec2 d = vec2(0.0);
  for (int i = 0; i < ${N}; i++) {
    float a = uAge[i];
    if (a < 0.0) continue;
    vec2 q = p - uPts[i].xy;
    float fall = exp(-dot(q, q) / ${(TRAIL.radius * TRAIL.radius).toFixed(1)});
    d += uPts[i].zw * fall * exp(-2.2 * a) * cos(9.0 * a);
  }
  vec2 l = p - uLens.xy;
  float lf = exp(-dot(l, l) / ${(1.4 * TRAIL.radius * 1.4 * TRAIL.radius).toFixed(1)});
  d += l * lf * uLens.z * 0.35;
  float bend = clamp(length(d) / ${TRAIL.max.toFixed(1)}, 0.0, 1.0);
  d = clamp(d, vec2(-${TRAIL.max.toFixed(1)}), vec2(${TRAIL.max.toFixed(1)}));
  vec3 c = texture(uTex, (p - d + uScroll) / uTile).rgb;
  c *= 1.0 + 0.06 * bend;
  o = vec4(c, 1.0);
}`;

type Target = { el: HTMLElement; x: number; y: number; word: boolean; width: number; moved: boolean };

function cap(dx: number, dy: number, max: number): [number, number] {
  const m = Math.hypot(dx, dy);
  return m > max ? [(dx / m) * max, (dy / m) * max] : [dx, dy];
}

export function Cloth() {
  const ref = useRef<HTMLCanvasElement>(null);
  const path = usePathname();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let dead = false;
    let raf = 0;
    const pts: TrailPoint[] = [];
    const lens = { x: innerWidth / 2, y: innerHeight / 2, tx: innerWidth / 2, ty: innerHeight / 2, s: 0, vs: 0, ts: 0 };
    let last: { x: number; y: number } | null = null;

    /* ── the text ─────────────────────────────────────────────────────── */
    let targets: Target[] = [];
    const measure = () => {
      for (const t of targets) {
        t.el.style.transform = "";
        delete t.el.dataset.jt;
      }
      targets = [];
      const main = document.querySelector("main");
      if (!main) return;
      // One rule for the whole site, so nothing is left out by accident:
      // every visible element that holds text of its own moves, once (the
      // outermost one; what is inside it moves with it).
      const picked = new Set<Element>();
      for (const el of main.querySelectorAll<HTMLElement>("*")) {
        if (el.closest(SKIP)) continue;
        // a link that reads as text (no box of its own) moves like text; a
        // link shaped as a button or chip, and every other control, does not
        const textLink = el.tagName === "A" && !el.className.includes("rounded-");
        if (CONTROL.has(el.tagName) && !textLink) continue;
        if (el.parentElement && [...picked].some((p) => p.contains(el))) continue;
        const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent!.trim() !== "");
        const word = el.classList.contains("jelly-w") || el.dataset.jelly === "word";
        if (!own && !word) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 1 || r.height < 1) continue; // hidden (closed answers, sr-only)
        picked.add(el);
        const big = word || BIG.some((c) => el.classList.contains(c));
        el.dataset.jt = big ? "w" : "b";
        targets.push({ el, word: big, width: r.width, moved: false, x: r.left + scrollX + r.width / 2, y: r.top + scrollY + r.height / 2 });
      }
    };
    const moveText = (now: number, settle: boolean) => {
      for (const t of targets) {
        const vx = t.x - scrollX;
        const vy = t.y - scrollY;
        if (settle || vy < -200 || vy > innerHeight + 200) {
          if (t.moved) {
            t.el.style.transform = "";
            t.moved = false;
          }
          continue;
        }
        const [fx, fy] = field(pts, vx, vy, now);
        const [dx, dy] = t.word ? cap(fx * WORD.k, fy * WORD.k, WORD.max) : cap(fx * BLOCK.k, fy * BLOCK.k, BLOCK.max);
        if (Math.abs(dx) + Math.abs(dy) < 0.05) {
          if (t.moved) {
            t.el.style.transform = "";
            t.moved = false;
          }
          continue;
        }
        // a wide block tilts less (a long quote barely leans; a word leans fully)
        const lean = WORD.maxTilt * Math.min(1, 240 / t.width);
        const tilt = t.word ? Math.max(-lean, Math.min(lean, dx * WORD.tilt)) : 0;
        t.el.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0)${tilt ? ` rotate(${tilt.toFixed(2)}deg)` : ""}`;
        t.moved = true;
      }
    };

    /* ── the cloth (WebGL2, optional) ─────────────────────────────────── */
    const gl = canvas.getContext("webgl2", { antialias: false, alpha: true, premultipliedAlpha: false });
    let drawCloth: ((now: number) => void) | null = null;
    let sizeCloth = () => {};
    if (gl) {
      const shader = (type: number, src: string) => {
        const s = gl.createShader(type)!;
        gl.shaderSource(s, src);
        gl.compileShader(s);
        return s;
      };
      const prog = gl.createProgram()!;
      gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        gl.useProgram(prog);
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(prog, "a");
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        const u = (name: string) => gl.getUniformLocation(prog, name);
        const U = { res: u("uRes"), dpr: u("uDpr"), scroll: u("uScroll"), tile: u("uTile"), pts: u("uPts"), age: u("uAge"), lens: u("uLens"), tex: u("uTex") };
        let dpr = 1;
        let ready = false;
        const ptData = new Float32Array(N * 4);
        const ageData = new Float32Array(N);
        sizeCloth = () => {
          dpr = Math.min(window.devicePixelRatio || 1, 1.5);
          canvas.width = Math.round(innerWidth * dpr);
          canvas.height = Math.round(innerHeight * dpr);
          gl.viewport(0, 0, canvas.width, canvas.height);
        };
        sizeCloth();
        drawCloth = (now) => {
          if (!ready) return;
          ageData.fill(-1);
          pts.forEach((p, i) => {
            ptData.set([p.x, p.y, p.px, p.py], i * 4);
            ageData[i] = now - p.t;
          });
          gl.uniform2f(U.res, innerWidth, innerHeight);
          gl.uniform1f(U.dpr, dpr);
          gl.uniform2f(U.scroll, scrollX, scrollY);
          gl.uniform1f(U.tile, TILE);
          gl.uniform4fv(U.pts, ptData);
          gl.uniform1fv(U.age, ageData);
          gl.uniform3f(U.lens, lens.x, lens.y, lens.s);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        };
        const img = new Image();
        img.decoding = "async";
        img.src = TEXTURE;
        img.onload = () => {
          if (dead) return;
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
          gl.generateMipmap(gl.TEXTURE_2D);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.uniform1i(U.tex, 0);
          ready = true;
          drawCloth?.(performance.now() / 1000);
          canvas.dataset.ready = "";
          document.documentElement.classList.add("cloth-live");
        };
      }
    }

    /* ── one loop for both ────────────────────────────────────────────── */
    const frame = () => {
      raf = 0;
      if (dead) return;
      const now = performance.now() / 1000;
      while (pts.length && now - pts[0].t > TRAIL.life) pts.shift();
      lens.x += (lens.tx - lens.x) * 0.18;
      lens.y += (lens.ty - lens.y) * 0.18;
      lens.ts *= 0.92;
      lens.vs = (lens.vs + (lens.ts - lens.s) * 0.12) * 0.8;
      lens.s += lens.vs;
      drawCloth?.(now);
      const moving =
        pts.length > 0 || Math.abs(lens.s) > 0.002 || Math.abs(lens.vs) > 0.002 || Math.abs(lens.tx - lens.x) + Math.abs(lens.ty - lens.y) > 0.5;
      moveText(now, pts.length === 0);
      if (moving) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const move = (e: PointerEvent) => {
      lens.tx = e.clientX;
      lens.ty = e.clientY;
      if (last) {
        const p = trailPoint(e.clientX, e.clientY, e.clientX - last.x, e.clientY - last.y, performance.now() / 1000);
        if (p) {
          pts.push(p);
          if (pts.length > N) pts.shift();
          lens.ts = Math.min(1, lens.ts + Math.hypot(p.px, p.py) / (TRAIL.push * 120));
        }
      }
      last = { x: e.clientX, y: e.clientY };
      kick();
    };
    const leave = () => {
      last = null;
    };
    let remeasure = 0;
    const later = () => {
      window.clearTimeout(remeasure);
      remeasure = window.setTimeout(measure, 150);
    };
    const onResize = () => {
      sizeCloth();
      later();
      kick();
    };

    // measure once fonts have settled (word widths depend on them), and
    // again whenever the page's height changes (an accordion opening)
    document.fonts.ready.then(() => !dead && measure());
    const ro = new ResizeObserver(later);
    const main = document.querySelector("main");
    if (main) ro.observe(main);

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(remeasure);
      ro.disconnect();
      for (const t of targets) t.el.style.transform = "";
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", onResize);
      document.documentElement.classList.remove("cloth-live");
    };
  }, [path]);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 -z-10 size-full" />;
}
