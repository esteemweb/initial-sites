"use client";

import { useEffect, useRef } from "react";

/**
 * The hero's scene: a drop of indigo ink blooms in dark water, and the uroko
 * (fish-scale) pattern draws itself outward from it, line by line, with a few
 * scales picked out in vermilion. Plain 2D canvas, about three seconds, then
 * it stops and costs nothing. Starts when the boot screen opens; under
 * prefers-reduced-motion it paints the finished picture at once.
 */
export function HeroInk() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const css = getComputedStyle(document.documentElement);
    const hex = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback;
    const rgb = (h: string) => {
      const n = parseInt(h.replace("#", ""), 16);
      return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
    };
    const ai = rgb(hex("--color-ai", "#1e3553"));
    const shell = rgb(hex("--color-paper", "#eceff0"));
    const shu = rgb(hex("--color-shu-bright", "#ec6a4a"));

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const DURATION = 3.2;
    let w = 0, h = 0, R = 40, cx = 0, cy = 0, maxDist = 1;
    let scales: { x: number; y: number; d: number; accent: boolean }[] = [];
    let raf = 0, t0 = 0, started = false, done = false;

    // Deterministic "random" so the pattern is the same on every load
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

    const layout = () => {
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      const box = canvas.getBoundingClientRect();
      w = box.width;
      h = box.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      R = Math.max(26, Math.min(48, w / 28));
      cx = w * 0.5;
      cy = h * 0.36;
      seed = 7;
      scales = [];
      for (let j = -1, row = 0; j * R < h + R; j++, row++) {
        for (let x = (row % 2 ? R : 0) - R; x < w + 2 * R; x += 2 * R) {
          const y = j * R;
          scales.push({ x, y, d: Math.hypot(x - cx, y - cy), accent: rand() < 0.035 });
        }
      }
      maxDist = Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy)) + R;
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      // Ink bloom: three soft indigo clouds opening out from the drop
      const grow = 1 - Math.exp(-t / 0.9);
      const blobs = [
        [0, 0, 0.62],
        [-0.16, 0.1, 0.44],
        [0.18, 0.06, 0.4],
      ];
      for (const [ox, oy, size] of blobs) {
        const bx = cx + ox * w * grow, by = cy + oy * h * grow;
        const r = Math.max(1, Math.max(w, h) * size * grow);
        const g = ctx.createRadialGradient(bx, by, 0, bx, by, r);
        g.addColorStop(0, `rgba(${ai}, ${0.85 - 0.3 * grow})`);
        g.addColorStop(0.55, `rgba(${ai}, ${0.35 - 0.12 * grow})`);
        g.addColorStop(1, `rgba(${ai}, 0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }
      // Scales: each line draws itself from its lowest point outward as the ink reaches it
      const eased = 1 - Math.pow(1 - Math.min(1, Math.max(0, (t - 0.35) / 2.6)), 3);
      const front = maxDist * eased;
      ctx.lineWidth = 1.1;
      for (const s of scales) {
        const p = Math.min(1, Math.max(0, (front - s.d) / (R * 4)));
        if (p <= 0) continue;
        ctx.strokeStyle = s.accent ? `rgba(${shu}, ${0.75 * p})` : `rgba(${shell}, ${0.17 * p})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, R, Math.PI / 2 - (p * Math.PI) / 2, Math.PI / 2 + (p * Math.PI) / 2);
        ctx.stroke();
      }
    };

    const frame = (now: number) => {
      const t = (now - t0) / 1000;
      draw(t);
      if (t < DURATION) raf = requestAnimationFrame(frame);
      else done = true;
    };

    const start = () => {
      if (started) return;
      started = true;
      if (reduced) {
        draw(DURATION);
        done = true;
        return;
      }
      t0 = performance.now();
      raf = requestAnimationFrame(frame);
    };

    layout();
    const html = document.documentElement;
    // First load: wait for the boot screen to open. Client-side navigation: start now.
    if (html.classList.contains("boot-play") && !html.dataset.revealed && !reduced) {
      addEventListener("uroko:reveal", start, { once: true });
    } else start();

    const ro = new ResizeObserver(() => {
      layout();
      if (done) draw(DURATION);
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("uroko:reveal", start);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}
