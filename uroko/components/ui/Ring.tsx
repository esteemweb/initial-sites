/**
 * Progress ring. Pure SVG: the progress arc is a stroke-dashoffset that
 * transitions once on load (CSS), and stays static under reduced motion.
 * Shows how far a multi-session piece has come.
 */
export function Ring({
  ratio,
  label,
  sub,
  size = 160,
}: {
  ratio: number;
  label: string;
  sub?: string;
  size?: number;
}) {
  const r = 46;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(1, ratio));
  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.5" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="var(--color-shu)"
          strokeWidth="2.5"
          strokeLinecap="butt"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - clamped)}
          className="ring-progress"
          style={{ ["--ring-from" as string]: c }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-display text-3xl font-bold leading-none tabular-nums">{label}</span>
        {sub ? <span className="mt-1 text-xs text-text-muted">{sub}</span> : null}
      </div>
    </div>
  );
}
