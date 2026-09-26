"use client";

import { useId, type ReactElement } from "react";
import IconShell from "@/components/icons/IconShell";
import { CHEVRON_GLYPH } from "@/components/icons/glyph-paths";
import { SORTS, isSortKey, type SortKey } from "@/lib/shop/filters";

interface SortSelectProps {
  value: SortKey;
  onChange: (sort: SortKey) => void;
  className?: string;
}

/**
 * The sort control (DESIGN.md §4 form fields): square, 2px `ink` border, 16px
 * padding, Space Mono label above.
 *
 * A native `<select>`, so the options open as the platform's own list — a
 * proper picker wheel on a phone, and full keyboard support everywhere — rather
 * than a listbox rebuilt from divs. Only the marker is replaced: the user
 * agent's is grey and rounded, and §4 allows neither.
 */
export default function SortSelect({
  value,
  onChange,
  className = "",
}: SortSelectProps): ReactElement {
  const id = useId();

  return (
    <div className={`flex flex-col gap-8 ${className}`}>
      <label htmlFor={id} className="type-label">
        Sort
      </label>

      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => {
            if (isSortKey(event.target.value)) onChange(event.target.value);
          }}
          className="type-base w-full appearance-none border-2 border-ink bg-page
            py-16 pl-16 pr-48 text-ink focus:border-rose"
        >
          {Object.entries(SORTS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>

        <IconShell
          paths={CHEVRON_GLYPH}
          defaultLabel="Open"
          decorative
          className="pointer-events-none absolute right-16 top-1/2 size-16 -translate-y-1/2"
        />
      </div>
    </div>
  );
}
