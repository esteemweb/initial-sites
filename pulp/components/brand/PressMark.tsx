import type { ReactElement } from "react";
import { REGISTRATION_GLYPH } from "@/components/icons/glyph-paths";

interface PressMarkProps {
  className?: string;
}

/**
 * The 404's registration mark: one turn on arrival, then still.
 *
 * Not the loading mark. §9 permits exactly one forever-loop on this site and
 * that is it; a 404 mark spinning indefinitely would be decorative motion,
 * which §7 and §9 both rule out. A single 400ms rotation answers the one action
 * available — landing here — then stops, which keeps it inside §9's 600ms
 * ceiling and spends the page's one orchestrated moment.
 *
 * Decorative: the heading beside it says what has happened in words, so nothing
 * depends on seeing this move or seeing it at all. Under reduced motion the
 * global rule collapses the animation and the mark simply sits there, which is
 * the same end state everybody else reaches 400ms later.
 */
export default function PressMark({
  className = "symbol-graphic",
}: PressMarkProps): ReactElement {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="currentColor"
      fillRule="evenodd"
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 animate-tumble-once ${className}`}
    >
      {REGISTRATION_GLYPH.map((d: string) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
