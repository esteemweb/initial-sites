/* The logo — mark plus full wordmark.

   Replaces the "TD" initialism that stood in the rail. An initialism is
   brand shorthand, and shorthand only works once a name is already known;
   for a twelve-villa hotel nobody has heard of, two letters spend the
   site's most permanent piece of real estate saying nothing. The name is
   set in full, always.

   The mark is drawn here rather than set in type: a four-point star inside
   a hairline ring. "Talay Dao" reads as sea of stars, so the seal states
   the name instead of decorating it. It is this project's own drawing —
   the reference's coral device is its trademark and is left behind.

   Two lockups off one component so the mark cannot drift between them:
     vertical   — the chrome spine, reading downward
     horizontal — anywhere else (footer, share cards, print)

   Server Component. There is no state here; the seal's slow turn is a CSS
   animation, which also means it honours prefers-reduced-motion in the
   stylesheet rather than needing a hook. */

export function Logo({
  orientation = "vertical",
  locale = "",
  className = "",
}: {
  orientation?: "vertical" | "horizontal";
  /** The place line under the name. Off by default.

      Measured before it was: upright vertical setting costs ~1.25em of
      column per glyph, so "Koh Yao Noi" ran 170px and the whole logo took
      495px of the spine's 730px — 68% of the column for the one element
      that is on screen at all times, leaving 42px of slack for everything
      below it. The name alone is 317px. The place belongs in the
      horizontal lockup, where the column is not the scarce axis. */
  locale?: string;
  className?: string;
}) {
  const vertical = orientation === "vertical";

  return (
    <span
      className={`flex items-center ${
        vertical ? "flex-col gap-sm" : "flex-row gap-sm"
      } ${className}`}
    >
      <Seal />

      <span
        className={`flex items-center ${
          vertical ? "flex-col gap-xs" : "flex-row gap-sm"
        }`}
      >
        <span
          className={`font-display ${
            vertical ? "logo-wordmark" : "logo-wordmark-h"
          }`}
        >
          Talay Dao
        </span>

        {locale ? (
          <>
            {/* The rule reads as a separator only when it cuts across the
                direction of the stack, so it flips with the lockup. */}
            <span
              aria-hidden="true"
              className={vertical ? "logo-rule" : "logo-rule-v"}
            />
            <span
              aria-hidden="true"
              className={`font-sans uppercase text-accent-lifted ${
                vertical ? "logo-locale" : "text-label"
              }`}
            >
              {locale}
            </span>
          </>
        ) : null}
      </span>
    </span>
  );
}

/* The seal.

   Geometry, so it can be redrawn: a 24-unit box, everything centred on
   (12, 12). Ring at r=11.4 on a 0.6 stroke. Major star at r=9, minor star
   at r=5.2 rotated 45deg, both four-point with concave cubic flanks — the
   concavity is what keeps the points sharp at 34px, where a straight-sided
   star fills in and reads as a diamond.

   The stars sit in their own <g> so the ring stays put while they turn. */
function Seal() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="logo-seal"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="12"
        cy="12"
        r="11.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
        opacity="0.45"
      />
      <g className="logo-star-turn">
        <path
          d="M12 3C12.5 8.1 15.9 11.5 21 12C15.9 12.5 12.5 15.9 12 21C11.5 15.9 8.1 12.5 3 12C8.1 11.5 11.5 8.1 12 3Z"
          fill="currentColor"
        />
        {/* The minor star carries the accent rather than the cream. It is
            the only colour in the spine now that the place line is gone,
            and it costs no column to put it here. `color` inherits into
            SVG, so setting the class on the path makes its currentColor
            resolve to the lifted accent while the ring and the major star
            stay cream. */}
        <path
          d="M12 6.8C12.28 9.72 14.28 11.72 17.2 12C14.28 12.28 12.28 14.28 12 17.2C11.72 14.28 9.72 12.28 6.8 12C9.72 11.72 11.72 9.72 12 6.8Z"
          className="text-accent-lifted"
          fill="currentColor"
          transform="rotate(45 12 12)"
        />
      </g>
    </svg>
  );
}
