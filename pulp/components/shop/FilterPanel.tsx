"use client";

import { useId, type ReactElement } from "react";
import { SPEC_LABELS, type SpecCode, type Category, type Size } from "@/data/products";
import SpecMark from "@/components/icons/SpecMark";
import {
  SPEC_FACET,
  CATEGORY_FACET,
  COLOURWAY_FACET,
  SIZE_FACET,
  categoryLabel,
  sizeLabel,
  type Selection,
} from "@/lib/shop/filters";
import FilterChip from "./FilterChip";
import FilterGroup from "./FilterGroup";

interface FilterPanelProps {
  selection: Selection;
  onToggleSize: (size: Size) => void;
  onToggleColourway: (slug: string) => void;
  onToggleCategory: (category: Category) => void;
  onToggleSpec: (code: SpecCode) => void;
  className?: string;
}

/**
 * The four facets. One component, rendered two ways: as a band above the grid
 * from 1024 up, and inside the sheet below it. The controls are identical in
 * both, so there is no second implementation to keep in step.
 *
 * Colour chips carry the swatch **and** the colourway name, and spec chips the
 * glyph **and** its label. §4 does not let a symbol carry meaning alone, and a
 * filter that reads as eight coloured squares is unusable to anyone who cannot
 * tell Ash from Slate at 24px.
 */
export default function FilterPanel({
  selection,
  onToggleSize,
  onToggleColourway,
  onToggleCategory,
  onToggleSpec,
  className = "",
}: FilterPanelProps): ReactElement {
  // Namespaced so the band and the sheet can both be mounted without their
  // checkbox groups colliding.
  const scope = useId();

  return (
    <div
      className={`grid gap-40 tablet:grid-cols-2 desktop:grid-cols-4 ${className}`}
    >
      <FilterGroup legend="Size">
        {SIZE_FACET.map((size) => (
          <FilterChip
            key={size}
            name={`${scope}-size`}
            value={size}
            checked={selection.sizes.includes(size)}
            onToggle={() => onToggleSize(size)}
          >
            {sizeLabel(size)}
          </FilterChip>
        ))}
      </FilterGroup>

      <FilterGroup legend="Colour">
        {COLOURWAY_FACET.map((colourway) => (
          <FilterChip
            key={colourway.slug}
            name={`${scope}-colour`}
            value={colourway.slug}
            checked={selection.colourways.includes(colourway.slug)}
            onToggle={() => onToggleColourway(colourway.slug)}
            leading={
              // True garment colour — content, not palette (§2). The hairline
              // keeps Bone and Rinse from vanishing into the paper ground.
              <span
                aria-hidden="true"
                style={{ backgroundColor: colourway.hex }}
                className="size-24 shrink-0 border border-rule"
              />
            }
          >
            {colourway.name}
          </FilterChip>
        ))}
      </FilterGroup>

      <FilterGroup legend="Type">
        {CATEGORY_FACET.map((category) => (
          <FilterChip
            key={category}
            name={`${scope}-type`}
            value={category}
            checked={selection.categories.includes(category)}
            onToggle={() => onToggleCategory(category)}
          >
            {categoryLabel(category)}
          </FilterChip>
        ))}
      </FilterGroup>

      <FilterGroup legend="Spec">
        {SPEC_FACET.map((code) => (
          <FilterChip
            key={code}
            name={`${scope}-spec`}
            value={code}
            checked={selection.spec.includes(code)}
            onToggle={() => onToggleSpec(code)}
            leading={<SpecMark code={code} className="size-16" decorative />}
          >
            {SPEC_LABELS[code]}
          </FilterChip>
        ))}
      </FilterGroup>
    </div>
  );
}
