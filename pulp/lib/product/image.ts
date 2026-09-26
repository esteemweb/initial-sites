/**
 * Product photography paths (DESIGN.md §10).
 *
 * Every catalogue variant has exactly one shot, named `{product}-{colourway}.jpg`
 * under `public/products/`, square, flat-lay, generated against `IMAGE-BRIEF.md`.
 * There is no fallback and deliberately so: a missing file is a catalogue error
 * that should be loud in development, not papered over with a grey box in
 * production.
 *
 * Kept here rather than inlined so the naming scheme has one owner — the card,
 * the gallery and the brief all have to agree on it.
 */

export function productImage(
  productSlug: string,
  colourwaySlug: string,
): string {
  return `/products/${productSlug}-${colourwaySlug}.jpg`;
}

/**
 * Alt text names the garment and the colour, because the colour is the thing a
 * swatch promised and the photograph is the only evidence of it.
 */
export function productImageAlt(
  productName: string,
  colourwayName: string,
): string {
  return `${productName} in ${colourwayName}, laid flat`;
}
