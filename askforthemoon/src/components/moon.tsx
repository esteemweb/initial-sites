/* The moon, on one 24-unit grid, filled paths only — no strokes. Every glyph
   is a ring (the disc's edge) plus its lit region, so on either ground lit is
   ink and dark is the empty inside of the ring. A new moon is the ring alone.

   `lit` is the illuminated fraction, 0–1. Waxing moons are lit on the right,
   waning moons on the left. The terminator is half an ellipse whose x-radius
   is R·|1 − 2·lit|: bulging into the light for a crescent, out of it for a
   gibbous moon. */

const C = 12; // centre
const R = 11; // outer edge
const RING = 2; // edge thickness: 1px at 12px, still there

const RING_PATH =
  `M ${C - R} ${C} a ${R} ${R} 0 1 0 ${2 * R} 0 a ${R} ${R} 0 1 0 ${-2 * R} 0 Z ` +
  `M ${C - R + RING} ${C} a ${R - RING} ${R - RING} 0 1 0 ${2 * (R - RING)} 0 a ${R - RING} ${R - RING} 0 1 0 ${-2 * (R - RING)} 0 Z`;

export function litPath(lit: number) {
  const k = Math.min(1, Math.max(0, lit));
  if (k <= 0.001) return "";
  const rx = Math.abs(1 - 2 * k) * R;
  const sweep = k < 0.5 ? 0 : 1;
  // right half of the disc, top to bottom, then the terminator back up
  return `M ${C} ${C - R} A ${R} ${R} 0 0 1 ${C} ${C + R} A ${rx} ${R} 0 0 ${sweep} ${C} ${C - R} Z`;
}

export function Moon({
  lit,
  waning = false,
  size = 24,
  className,
  label,
}: {
  lit: number;
  waning?: boolean;
  size?: number;
  className?: string;
  /** a text equivalent; omit only when the surrounding text already says it */
  label?: string;
}) {
  const d = litPath(lit);
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <path d={RING_PATH} fill="currentColor" fillRule="evenodd" />
      {d && <path d={d} fill="currentColor" transform={waning ? `matrix(-1 0 0 1 ${2 * C} 0)` : undefined} />}
    </svg>
  );
}

/* The eight phases, one per chapter: waxing to full at the bakery, then waning
   to nothing at her own kitchen table. */
export const PHASES = [
  { name: "waxing crescent", lit: 0.25, waning: false },
  { name: "first quarter", lit: 0.5, waning: false },
  { name: "waxing gibbous", lit: 0.75, waning: false },
  { name: "full moon", lit: 1, waning: false },
  { name: "waning gibbous", lit: 0.75, waning: true },
  { name: "last quarter", lit: 0.5, waning: true },
  { name: "waning crescent", lit: 0.25, waning: true },
  { name: "new moon", lit: 0, waning: false },
] as const;

/* The glyph's filled shape as a clipPath in objectBoundingBox units, so a copy
   of a title can be cut to exactly the part of it that crosses the moon. One
   per phase; render once per page, outside any Split (ids must be unique). */
export function MoonClips({ indices }: { indices: number[] }) {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      <defs>
        {indices.map((i) => {
          const p = PHASES[i];
          const d = litPath(p.lit);
          const base = "scale(0.0416667)";
          return (
            <clipPath key={i} id={`moon-clip-${i}`} clipPathUnits="objectBoundingBox">
              <path d={RING_PATH} clipRule="evenodd" transform={base} />
              {d && <path d={d} transform={p.waning ? `${base} matrix(-1 0 0 1 24 0)` : base} />}
            </clipPath>
          );
        })}
      </defs>
    </svg>
  );
}
