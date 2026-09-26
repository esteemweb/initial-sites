import type { ElementType, ReactElement } from "react";

interface WordmarkProps {
  /** The element the mark renders as. `span` by default; the hero passes `h1`. */
  as?: ElementType;
  className?: string;
}

/**
 * The wordmark (DESIGN.md §5). Set as type — there is no drawn mark and no
 * logo file to source — and skewed 14° forward by the `wordmark` utility.
 * That is the whole treatment: speed, with no added shape.
 *
 * It is a visual, not a link and not a heading. The header wraps it in the
 * home link; the hero passes `as="h1"`; the proof slip and the footer set it
 * at `label`. One component is what makes it match everywhere — the moment
 * two places set the name as plain text, they stop matching.
 */
export default function Wordmark({
  as: Tag = "span",
  className = "",
}: WordmarkProps): ReactElement {
  return <Tag className={`wordmark ${className}`}>Pulp</Tag>;
}
