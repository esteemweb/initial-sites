import type { Product } from "@/data/products";

/**
 * Prices in GBP. Whole pounds render without decimals, which is how the
 * catalogue is priced and how the card reads best; anything that lands on
 * pennies — a discounted subtotal, say — keeps two places so the basket adds up.
 */
export function formatPrice(pounds: number): string {
  return Number.isInteger(pounds)
    ? `£${pounds}`
    : `£${pounds.toFixed(2)}`;
}

/**
 * The product card's third slot (DESIGN.md §4): fabric weight, or a short
 * composition summary where `gsm` is null. Same slot, different content —
 * "70% lambswool, 30% recycled nylon" becomes "Lambswool".
 */
export function weightLabel(product: Product): string {
  if (product.gsm !== null) return `${product.gsm} GSM`;

  const dominant = product.composition.split(",")[0].replace(/^\d+%\s*/, "");
  return dominant.charAt(0).toUpperCase() + dominant.slice(1);
}

/**
 * Review dates. UK long form — "14 August 2026" — because the site is UK-facing
 * and 08/14 versus 14/08 is exactly the ambiguity a review does not need.
 *
 * The locale is pinned rather than left to the visitor's, so the server and the
 * client render the same string and hydration does not mismatch.
 */
export function formatReviewDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
