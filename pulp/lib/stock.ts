import type { Product, Size } from "@/data/products";

/** "Last few left" is fewer than 4 remaining (DESIGN.md §12). */
export const LOW_STOCK_THRESHOLD = 4;

/** Units left in one size of one colourway. Missing entries count as none. */
export function sizeUnits(
  product: Product,
  colourway: string,
  size: Size,
): number {
  return product.stock[colourway]?.[size] ?? 0;
}

export function isSizeSoldOut(
  product: Product,
  colourway: string,
  size: Size,
): boolean {
  return sizeUnits(product, colourway, size) === 0;
}

/**
 * "Last few left" for the size selector (DESIGN.md §12): fewer than 4 left in
 * this one size of this one colourway. This is the surface where the choice is
 * made, so it counts the size, not the colourway. See {@link isColourwayLastFew}.
 */
export function isSizeLastFew(
  product: Product,
  colourway: string,
  size: Size,
): boolean {
  const units = sizeUnits(product, colourway, size);
  return units > 0 && units < LOW_STOCK_THRESHOLD;
}

/** Units left across every size of one colourway. */
export function colourwayUnits(product: Product, colourway: string): number {
  const sizes = product.stock[colourway];
  if (!sizes) return 0;
  return Object.values(sizes).reduce((total, units) => total + units, 0);
}

export function isColourwaySoldOut(
  product: Product,
  colourway: string,
): boolean {
  return colourwayUnits(product, colourway) === 0;
}

/**
 * "Last few left" for a product card badge (DESIGN.md §12): fewer than 4 left
 * in that colour across every size.
 *
 * The sibling rule, {@link isSizeLastFew}, counts a single size. The two are
 * deliberately separate — a card badge cannot represent one size, and the size
 * selector cannot be driven by a colourway total. Do not collapse them.
 */
export function isColourwayLastFew(
  product: Product,
  colourway: string,
): boolean {
  const units = colourwayUnits(product, colourway);
  return units > 0 && units < LOW_STOCK_THRESHOLD;
}

/** The first colourway with stock, falling back to the first listed. */
export function defaultColourway(product: Product): string {
  const available = product.colourways.find(
    (c) => !isColourwaySoldOut(product, c.slug),
  );
  return (available ?? product.colourways[0]).slug;
}
