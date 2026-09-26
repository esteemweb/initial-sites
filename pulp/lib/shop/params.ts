import type { SpecCode, Category, Size } from "@/data/products";
import {
  SPEC_FACET,
  CATEGORY_FACET,
  COLOURWAY_FACET,
  DEFAULT_SORT,
  SIZE_FACET,
  isSortKey,
  type Selection,
  type SortKey,
} from "./filters";

/**
 * The filter state as a query string, and back.
 *
 * Multi-value facets repeat the key — `?size=M&size=L` — so `getAll()` reads
 * them straight out and the URL stays legible to a person.
 *
 * Anything unrecognised is dropped rather than trusted. A hand-edited or stale
 * link cannot put the page into a state the facets do not offer.
 */

export const PARAM = {
  size: "size",
  colour: "colour",
  type: "type",
  spec: "spec",
  sort: "sort",
} as const;

function keep<T extends string>(values: string[], allowed: readonly T[]): T[] {
  // Deduplicated, and returned in facet order rather than URL order, so two
  // links with the same filters in a different order behave identically.
  return allowed.filter((option) => values.includes(option));
}

export function parseSelection(params: URLSearchParams): Selection {
  return {
    sizes: keep<Size>(params.getAll(PARAM.size), SIZE_FACET),
    colourways: keep(
      params.getAll(PARAM.colour),
      COLOURWAY_FACET.map((c) => c.slug),
    ),
    categories: keep<Category>(params.getAll(PARAM.type), CATEGORY_FACET),
    spec: keep<SpecCode>(params.getAll(PARAM.spec), SPEC_FACET),
  };
}

export function parseSort(params: URLSearchParams): SortKey {
  const value = params.get(PARAM.sort);
  return isSortKey(value) ? value : DEFAULT_SORT;
}

/**
 * The query string for a state. Empty facets and the default sort are left out
 * entirely, so an unfiltered shop is a clean `/shop` rather than `/shop?sort=featured`.
 */
export function serialise(selection: Selection, sort: SortKey): string {
  const params = new URLSearchParams();

  for (const size of selection.sizes) params.append(PARAM.size, size);
  for (const slug of selection.colourways) params.append(PARAM.colour, slug);
  for (const category of selection.categories) params.append(PARAM.type, category);
  for (const code of selection.spec) params.append(PARAM.spec, code);
  if (sort !== DEFAULT_SORT) params.set(PARAM.sort, sort);

  return params.toString();
}

/** Adds or removes one value from one facet, leaving the rest alone. */
export function toggle<T extends string>(values: T[], value: T): T[] {
  return values.includes(value)
    ? values.filter((existing) => existing !== value)
    : [...values, value];
}
