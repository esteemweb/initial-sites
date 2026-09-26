"use client";

import type { ReactElement, ReactNode } from "react";

interface FilterGroupProps {
  legend: string;
  children: ReactNode;
}

/**
 * One facet: a Space Mono legend over a wrapping row of chips.
 *
 * A real `fieldset` and `legend`, so a screen reader announces "Size" before
 * each of its checkboxes rather than reading seven unlabelled options.
 */
export default function FilterGroup({
  legend,
  children,
}: FilterGroupProps): ReactElement {
  return (
    <fieldset>
      <legend className="type-label mb-16">{legend}</legend>
      <div className="flex flex-wrap gap-8">{children}</div>
    </fieldset>
  );
}
