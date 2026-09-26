import type { ReactElement } from "react";
import { REGISTRATION_GLYPH } from "./glyph-paths";

interface LoadingMarkProps {
  /** Sizing classes for the mark. */
  className?: string;
  /** Shown beside the static mark on the reduced-motion path. */
  label?: string;
}

/**
 * The loading state's rotating registration mark (DESIGN.md §4, §9).
 *
 * The reduced-motion path is built alongside the animation rather than after
 * it: rotation is replaced by the same mark held still next to the word
 * "Loading", so the state still reads rather than disappearing. It keeps
 * turning for everyone else, which is the one animation on the site allowed to
 * loop.
 */
export default function LoadingMark({
  className = "size-24",
  label = "Loading",
}: LoadingMarkProps): ReactElement {
  const mark = (
    <svg
      viewBox="0 0 48 48"
      width="1em"
      height="1em"
      fill="currentColor"
      fillRule="evenodd"
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 ${className}`}
    >
      {REGISTRATION_GLYPH.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );

  return (
    <span className="inline-flex items-center gap-8" role="status">
      <span className="inline-flex animate-spin motion-reduce:hidden">
        {mark}
      </span>
      <span className="hidden items-center gap-8 motion-reduce:inline-flex">
        {mark}
        <span className="type-button">{label}</span>
      </span>
      <span className="sr-only motion-reduce:hidden">{label}</span>
    </span>
  );
}
