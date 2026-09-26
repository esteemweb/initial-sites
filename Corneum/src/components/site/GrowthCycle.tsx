import { useId } from "react";

/* The hair growth cycle as three rows, not to scale (anagen is hundreds of
   times longer than catagen). Durations are the commonly published ranges:
   anagen 2–7 years, catagen 2–3 weeks, telogen about 3 months. Drafted
   (DATA-NOTES.md). 340 wide so labels stay ≥14px on a phone. */
const PHASES = [
  { name: "Anagen · growth", duration: "2–7 years", w: 150, fill: true },
  { name: "Catagen · transition", duration: "2–3 weeks", w: 20, fill: false },
  { name: "Telogen · rest", duration: "About 3 months", w: 44, fill: false },
];

export function GrowthCycle({ className = "" }: { className?: string }) {
  const titleId = useId();
  const descId = useId();
  return (
    <svg viewBox="0 0 340 220" role="img" aria-labelledby={`${titleId} ${descId}`} className={`w-full text-ink ${className}`}>
      <title id={titleId}>The hair growth cycle</title>
      <desc id={descId}>
        Three phases. Anagen, growth, lasts two to seven years. Catagen, transition, lasts two to three weeks. Telogen,
        rest, lasts about three months, after which the hair is shed and the cycle starts again. Not to scale.
      </desc>
      {PHASES.map((p, i) => {
        const y = 10 + i * 64;
        return (
          <g key={p.name}>
            <rect
              x="0"
              y={y}
              width={p.w}
              height="40"
              fill={p.fill ? "currentColor" : "none"}
              fillOpacity={p.fill ? 0.12 : 0}
              stroke="currentColor"
              strokeWidth="1"
            />
            <g className="type-data" fill="currentColor">
              <text x={p.w + 12} y={y + 16}>
                {p.name}
              </text>
              <text x={p.w + 12} y={y + 36} className="fill-green">
                {p.duration}
              </text>
            </g>
          </g>
        );
      })}
      <text x="0" y="212" className="type-data" fill="currentColor" fillOpacity="0.6">
        Not to scale
      </text>
    </svg>
  );
}
