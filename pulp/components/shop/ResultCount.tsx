import type { ReactElement } from "react";

interface ResultCountProps {
  shown: number;
  total: number;
  filtered: boolean;
}

/**
 * The result count, in brand voice.
 *
 * Announced politely rather than silently: filtering happens without a page
 * load, so a screen reader would otherwise get no signal that the grid behind
 * it had changed.
 *
 * It stays on screen at zero, reading "0 of 14 garments match", with the empty
 * state below carrying the explanation and the way out. The count is the live
 * region, so it is the thing that announces the change either way.
 */
export default function ResultCount({
  shown,
  total,
  filtered,
}: ResultCountProps): ReactElement {
  // The noun agrees with `total`, not `shown` — it follows "of 14" — while the
  // verb agrees with `shown`. So: "1 of 14 garments matches."
  return (
    <p role="status" className="type-label">
      {filtered
        ? `${shown} of ${total} garments ${shown === 1 ? "matches" : "match"}.`
        : `${total} garments. Nothing you have to think about.`}
    </p>
  );
}
