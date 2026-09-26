"use client";

import type { ReactElement, ReactNode } from "react";

interface FilterChipProps {
  name: string;
  value: string;
  checked: boolean;
  onToggle: () => void;
  /** A swatch or a spec glyph. Always alongside the label, never instead of it. */
  leading?: ReactNode;
  children: ReactNode;
}

/**
 * One filter value.
 *
 * A native checkbox with an `sr-only` input and a styled label — the pattern
 * `SizeSelector` and `ColourwaySwatch` already use here. Selection, focus and
 * the space key come from the browser, so it works from a pointer, a finger and
 * a keyboard without any of it being re-implemented, and nothing about it is
 * hover-only.
 *
 * Selected inverts to `ink`, the same way a chosen size does, so the two read
 * as the same idea in two places. Minimum 48px tall for touch (§8).
 */
export default function FilterChip({
  name,
  value,
  checked,
  onToggle,
  leading,
  children,
}: FilterChipProps): ReactElement {
  return (
    <label className="cursor-pointer">
      <input
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        onChange={onToggle}
        className="peer sr-only"
      />
      <span
        className="type-label flex min-h-48 items-center gap-8 border-2 border-ink px-8 py-8
          transition-colors
          peer-checked:bg-ink peer-checked:text-page
          peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2
          peer-focus-visible:outline-ultra"
      >
        {leading}
        {children}
      </span>
    </label>
  );
}
