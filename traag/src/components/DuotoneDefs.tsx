/**
 * SVG filter definitions for the four hero states. Rendered once, in the
 * layout, so any element can reference them from a CSS `filter: url(#…)`.
 *
 * All four states start from the same grayscale conversion. The CSS side
 * does the cheap arithmetic (contrast, brightness) and these filters do
 * the parts CSS cannot: quantising to a fixed number of tones, cutting at
 * an exact threshold, and mapping the result onto black and ink.
 *
 * Mapping to black ↔ ink is a per-channel lookup table:
 *   R  0.043 → 1.000      (#0B → #FF)
 *   G  0.043 → 0.290      (#0B → #4A)
 *   B  0.043 → 0.000      (#0B → #00)
 * Reversing the tables gives the inverted state.
 */

const BLACK = { r: 11 / 255, g: 11 / 255, b: 11 / 255 };
const INK = { r: 1, g: 74 / 255, b: 0 };

const toInk = {
  r: `${BLACK.r} ${INK.r}`,
  g: `${BLACK.g} ${INK.g}`,
  b: `${BLACK.b} ${INK.b}`,
};
const toInkInverted = {
  r: `${INK.r} ${BLACK.r}`,
  g: `${INK.g} ${BLACK.g}`,
  b: `${INK.b} ${BLACK.b}`,
};

// Six tone levels for the posterised state.
const SIX = "0 0.2 0.4 0.6 0.8 1";

// A discrete table with N entries splits 0–1 into N equal bins. Thirteen
// zeros then twelve ones puts the cut at 13/25 = 52%.
const CUT_52 = Array.from({ length: 25 }, (_, i) => (i < 13 ? 0 : 1)).join(" ");

export default function DuotoneDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      <defs>
        <filter id="dt-poster" colorInterpolationFilters="sRGB">
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncR type="discrete" tableValues={SIX} />
            <feFuncG type="discrete" tableValues={SIX} />
            <feFuncB type="discrete" tableValues={SIX} />
          </feComponentTransfer>
          <feComponentTransfer>
            <feFuncR type="table" tableValues={toInk.r} />
            <feFuncG type="table" tableValues={toInk.g} />
            <feFuncB type="table" tableValues={toInk.b} />
          </feComponentTransfer>
        </filter>

        <filter id="dt-threshold" colorInterpolationFilters="sRGB">
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncR type="discrete" tableValues={CUT_52} />
            <feFuncG type="discrete" tableValues={CUT_52} />
            <feFuncB type="discrete" tableValues={CUT_52} />
          </feComponentTransfer>
          <feComponentTransfer>
            <feFuncR type="table" tableValues={toInk.r} />
            <feFuncG type="table" tableValues={toInk.g} />
            <feFuncB type="table" tableValues={toInk.b} />
          </feComponentTransfer>
        </filter>

        <filter id="dt-inverted" colorInterpolationFilters="sRGB">
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncR type="discrete" tableValues={CUT_52} />
            <feFuncG type="discrete" tableValues={CUT_52} />
            <feFuncB type="discrete" tableValues={CUT_52} />
          </feComponentTransfer>
          <feComponentTransfer>
            <feFuncR type="table" tableValues={toInkInverted.r} />
            <feFuncG type="table" tableValues={toInkInverted.g} />
            <feFuncB type="table" tableValues={toInkInverted.b} />
          </feComponentTransfer>
        </filter>

        {/* Film grain tile for the posterised state. Referenced as a
            pattern fill by the grain overlay so it is one small SVG, not
            an image request. */}
        <filter id="dt-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
    </svg>
  );
}
