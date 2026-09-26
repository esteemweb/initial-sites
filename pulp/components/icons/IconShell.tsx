import type { ReactElement } from "react";

export interface IconLabelling {
  /** Extra classes for the glyph itself. Size it here: `size-16`, `size-64`. */
  className?: string;
  /** The text equivalent. Each icon supplies its own default. */
  label?: string;
  /** Show the text equivalent beside the glyph instead of only to screen readers. */
  showLabel?: boolean;
  /** The glyph sits next to text that already names it, so it carries no label of its own. */
  decorative?: boolean;
}

interface IconShellProps extends IconLabelling {
  paths: string[];
  /** Used when `label` is not given. */
  defaultLabel: string;
}

/**
 * Renders a glyph with its text equivalent (DESIGN.md §4). Spec marks never
 * carry meaning alone: visible text where there is room, visually-hidden label
 * otherwise, which is the default. Sizing is left to `className` so the same
 * glyph serves 16px UI, 64px section markers and 400px+ page graphics.
 */
export default function IconShell({
  paths,
  defaultLabel,
  className,
  label,
  showLabel = false,
  decorative = false,
}: IconShellProps): ReactElement {
  const text = label ?? defaultLabel;

  const glyph = (
    <svg
      viewBox="0 0 48 48"
      width="1em"
      height="1em"
      fill="currentColor"
      fillRule="evenodd"
      aria-hidden="true"
      focusable="false"
      className={`shrink-0${className ? ` ${className}` : ""}`}
    >
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );

  if (decorative) return glyph;

  return (
    <span className="inline-flex items-center gap-8 align-middle">
      {glyph}
      <span className={showLabel ? "type-label" : "sr-only"}>{text}</span>
    </span>
  );
}
