import type { ReactElement } from "react";

/**
 * The signature line (DESIGN.md §11) — a named brand asset, not a heading, and
 * exempt from the six-word cap that governs `display`.
 *
 * It is a component so the wording cannot drift between the footer, the 404 and
 * anywhere else it lands. The surface decides the ground it sits on and the
 * type role it takes; the words are fixed.
 */
export const SIGNATURE = "Small runs. Loud colours.";

interface SignatureLineProps {
  /** The type role and any colour for this instance. */
  className?: string;
}

export default function SignatureLine({
  className = "type-lg",
}: SignatureLineProps): ReactElement {
  return <p className={className}>{SIGNATURE}</p>;
}
