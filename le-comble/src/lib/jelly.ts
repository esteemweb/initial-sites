/* The jelly field shared by the cloth (WebGL) and the text (transforms) —
   user requests, 25 Sep 2026: a liquid, jelly background, then "make the
   texts also do the same without making a mess".

   Every pointer move leaves a trail point that pushes whatever is near it
   the way the pointer went, in a round falloff, and then wobbles back as it
   fades: push × e^(−2.2·age) × cos(9·age). The shader in cloth.tsx runs the
   same sum per pixel; `field` runs it for one point on the page. */

export const TRAIL = {
  size: 32, // points kept
  life: 2.6, // s a point lives
  radius: 150, // CSS px falloff
  push: 1.6, // px of push per px of pointer travel
  max: 70, // px, most one point pushes
};

export type TrailPoint = { x: number; y: number; px: number; py: number; t: number };

export function jelly(age: number): number {
  return Math.exp(-2.2 * age) * Math.cos(9 * age);
}

/** The push felt at viewport point (x, y) at time `now` (s). */
export function field(pts: readonly TrailPoint[], x: number, y: number, now: number): [number, number] {
  let dx = 0;
  let dy = 0;
  const r2 = TRAIL.radius * TRAIL.radius;
  for (const p of pts) {
    const qx = x - p.x;
    const qy = y - p.y;
    const d2 = qx * qx + qy * qy;
    if (d2 > 9 * r2) continue; // beyond 3 radii the falloff is ~0
    const f = Math.exp(-d2 / r2) * jelly(now - p.t);
    dx += p.px * f;
    dy += p.py * f;
  }
  return [dx, dy];
}

/** A pointer move becomes a trail point (or nothing, for a jitter). */
export function trailPoint(x: number, y: number, dx: number, dy: number, now: number): TrailPoint | null {
  const len = Math.hypot(dx, dy);
  if (len <= 0.5) return null;
  const k = Math.min(TRAIL.push, TRAIL.max / len);
  return { x, y, px: dx * k, py: dy * k, t: now };
}
