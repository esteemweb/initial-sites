import {
  SPEC_LABELS,
  PRODUCTS,
  type SpecCode,
  type Category,
  type Colourway,
  type Product,
  type Size,
} from "@/data/products";
import { sizeUnits } from "@/lib/stock";

/**
 * The shop's facets and its matching rule. Pure — no React, no URL, so the
 * behaviour can be reasoned about and later tested on its own.
 *
 * Every facet is derived from the catalogue rather than typed out, so the bar
 * can never offer a value that matches nothing. `wash-40` is defined in
 * `SPEC_LABELS` but no product carries it, and so it never appears.
 */

export interface Selection {
  sizes: Size[];
  colourways: string[];
  categories: Category[];
  spec: SpecCode[];
}

export const EMPTY_SELECTION: Selection = {
  sizes: [],
  colourways: [],
  categories: [],
  spec: [],
};

export function isEmptySelection(selection: Selection): boolean {
  return (
    selection.sizes.length === 0 &&
    selection.colourways.length === 0 &&
    selection.categories.length === 0 &&
    selection.spec.length === 0
  );
}

export function selectionCount(selection: Selection): number {
  return (
    selection.sizes.length +
    selection.colourways.length +
    selection.categories.length +
    selection.spec.length
  );
}

/* --------------------------------------------------------------------------
   Facets, derived from the catalogue
   -------------------------------------------------------------------------- */

/** Catalogue order, not alphabetical — XS before S before M. */
const SIZE_ORDER: Size[] = ["XS", "S", "M", "L", "XL", "XXL", "ONE"];

export const SIZE_FACET: Size[] = SIZE_ORDER.filter((size) =>
  PRODUCTS.some((product) => product.sizes.includes(size)),
);

/** "ONE" is a data value. Nobody shopping for a beanie is looking for "ONE". */
export function sizeLabel(size: Size): string {
  return size === "ONE" ? "One size" : size;
}

/** First appearance in the catalogue wins, so the swatch order is stable. */
export const COLOURWAY_FACET: Colourway[] = (() => {
  const seen = new Map<string, Colourway>();
  for (const product of PRODUCTS) {
    for (const colourway of product.colourways) {
      if (!seen.has(colourway.slug)) seen.set(colourway.slug, colourway);
    }
  }
  return [...seen.values()];
})();

const CATEGORY_LABELS: Record<Category, string> = {
  "t-shirts": "T-shirts",
  sweats: "Sweats",
  outerwear: "Outerwear",
  trousers: "Trousers",
  accessories: "Accessories",
};

export const CATEGORY_FACET: Category[] = (
  Object.keys(CATEGORY_LABELS) as Category[]
).filter((category) =>
  PRODUCTS.some((product) => product.category === category),
);

export function categoryLabel(category: Category): string {
  return CATEGORY_LABELS[category];
}

/** Only the codes something in the range actually carries. */
export const SPEC_FACET: SpecCode[] = (
  Object.keys(SPEC_LABELS) as SpecCode[]
).filter((code) => PRODUCTS.some((product) => product.spec.includes(code)));

/* --------------------------------------------------------------------------
   Matching
   -------------------------------------------------------------------------- */

/**
 * Size and colour are one test, not two.
 *
 * A product passes if **some (colourway, size) pair satisfies every selected
 * size and colour constraint and has stock**. Ticking M and Soot therefore
 * drops the Tumble Tee, which sells both an M and a Soot but no Soot M — the
 * grid never offers a variant that cannot be bought.
 *
 * With neither facet selected the stock condition does not apply at all, so a
 * product that has sold out entirely still appears carrying its §4 sold-out
 * badge. The grid is a catalogue, and §4 shows sold-out states rather than
 * hiding them.
 */
function matchesVariant(product: Product, selection: Selection): boolean {
  const { sizes, colourways } = selection;
  if (sizes.length === 0 && colourways.length === 0) return true;

  const candidateColourways =
    colourways.length === 0
      ? product.colourways
      : product.colourways.filter((c) => colourways.includes(c.slug));
  if (candidateColourways.length === 0) return false;

  const candidateSizes =
    sizes.length === 0
      ? product.sizes
      : product.sizes.filter((size) => sizes.includes(size));
  if (candidateSizes.length === 0) return false;

  return candidateColourways.some((colourway) =>
    candidateSizes.some((size) => sizeUnits(product, colourway.slug, size) > 0),
  );
}

/**
 * Within a facet the values OR together; across facets they AND. Standard
 * faceted behaviour, and applied to all four so the bar reads consistently —
 * ticking two spec marks widens the results rather than narrowing them.
 */
export function matches(product: Product, selection: Selection): boolean {
  if (
    selection.categories.length > 0 &&
    !selection.categories.includes(product.category)
  ) {
    return false;
  }

  if (
    selection.spec.length > 0 &&
    !selection.spec.some((code) => product.spec.includes(code))
  ) {
    return false;
  }

  return matchesVariant(product, selection);
}

/* --------------------------------------------------------------------------
   Sorting
   -------------------------------------------------------------------------- */

export const SORTS = {
  featured: "Featured",
  "price-asc": "Price, low to high",
  "price-desc": "Price, high to low",
  "weight-desc": "Heaviest first",
} as const;

export type SortKey = keyof typeof SORTS;

export const DEFAULT_SORT: SortKey = "featured";

export function isSortKey(value: string | null): value is SortKey {
  return value !== null && value in SORTS;
}

export function sortProducts(products: Product[], sort: SortKey): Product[] {
  const sorted = [...products];

  switch (sort) {
    case "featured":
      // Catalogue order. Already in it — copy and leave alone.
      return sorted;
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "weight-desc":
      // The Warm Iron Beanie is lambswool and carries no gsm. It sorts last
      // rather than as a zero, which would read as the lightest thing here.
      return sorted.sort((a, b) => (b.gsm ?? -1) - (a.gsm ?? -1));
  }
}

export function browse(selection: Selection, sort: SortKey): Product[] {
  return sortProducts(
    PRODUCTS.filter((product) => matches(product, selection)),
    sort,
  );
}
