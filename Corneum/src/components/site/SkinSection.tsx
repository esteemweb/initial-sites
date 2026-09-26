import { useId } from "react";

/* A schematic cross-section of the scalp, not to scale: stratum corneum,
   epidermis, dermis, and one follicle. The point it makes is BRIEF §1's:
   the shaft above the surface is dead; the follicle below is alive.
   The viewBox is 340 wide so the 14-unit labels stay ≥14px on a phone. */
export function SkinSection({ className = "" }: { className?: string }) {
  const titleId = useId();
  const descId = useId();
  return (
    <svg viewBox="0 0 340 290" role="img" aria-labelledby={`${titleId} ${descId}`} className={`w-full text-ink ${className}`}>
      <title id={titleId}>Schematic cross-section of the scalp</title>
      <desc id={descId}>
        From the surface down: the stratum corneum, a thin outer layer of dead cells; the living epidermis; and the
        dermis, where the follicle sits. The hair shaft above the surface is dead. The follicle beneath it is alive.
        Not to scale.
      </desc>

      <g fill="none" stroke="currentColor" strokeWidth="1">
        <line x1="0" x2="150" y1="60" y2="60" strokeWidth="1.5" />
        <line x1="0" x2="150" y1="74" y2="74" />
        <line x1="0" x2="150" y1="120" y2="120" strokeOpacity="0.12" />
        <line x1="0" x2="150" y1="270" y2="270" strokeOpacity="0.12" />
        {Array.from({ length: 8 }, (_, i) => (
          <line key={i} x1={i * 20 + (i % 2) * 6} x2={i * 20 + (i % 2) * 6} y1="60" y2="74" strokeOpacity="0.4" />
        ))}
        <path d="M58 60 L58 214 M82 60 L82 214" />
        <circle cx="70" cy="228" r="18" />
        <line x1="70" x2="70" y1="214" y2="0" strokeWidth="3" />
        <line x1="76" x2="164" y1="20" y2="20" strokeOpacity="0.4" />
        <line x1="150" x2="164" y1="67" y2="67" strokeOpacity="0.4" />
        <line x1="150" x2="164" y1="97" y2="97" strokeOpacity="0.4" />
        <line x1="150" x2="164" y1="180" y2="180" strokeOpacity="0.4" />
        <line x1="88" x2="164" y1="228" y2="228" strokeOpacity="0.4" />
      </g>

      <g className="type-data" fill="currentColor">
        <text x="170" y="25">Hair · dead</text>
        <text x="170" y="72">Stratum corneum</text>
        <text x="170" y="102">Epidermis</text>
        <text x="170" y="185">Dermis</text>
        <text x="170" y="233" className="fill-green">
          Follicle · alive
        </text>
      </g>
    </svg>
  );
}
