import type { FitVerdict, Review } from "@/data/products";

/**
 * Review summaries (DESIGN.md §4).
 *
 * The review count always shows. The fit-distribution bar renders only at five
 * or more reviews; below that the verdicts are listed as text, because a bar
 * drawn from two data points implies a confidence the data has not earned.
 *
 * Worth knowing: no product in the current catalogue reaches five. The Drum
 * Hoodie has four and the median is two, so today every product takes the text
 * path. The bar is built because the rule is the spec's and the data will grow.
 */

export const DISTRIBUTION_THRESHOLD = 5;

export function showsDistribution(reviews: Review[]): boolean {
  return reviews.length >= DISTRIBUTION_THRESHOLD;
}

export const FIT_ORDER: FitVerdict[] = [
  "runs-small",
  "true-to-size",
  "runs-large",
];

export const FIT_LABELS: Record<FitVerdict, string> = {
  "runs-small": "Runs small",
  "true-to-size": "True to size",
  "runs-large": "Runs large",
};

export interface FitCount {
  verdict: FitVerdict;
  count: number;
  /** Whole percent of all reviews. Only meaningful once the bar renders. */
  percent: number;
}

export function fitCounts(reviews: Review[]): FitCount[] {
  return FIT_ORDER.map((verdict) => {
    const count = reviews.filter((review) => review.fit === verdict).length;
    return {
      verdict,
      count,
      percent: reviews.length === 0 ? 0 : Math.round((count / reviews.length) * 100),
    };
  });
}

/** Mean rating to one decimal. Null with no reviews — not 0, which reads as bad. */
export function averageRating(reviews: Review[]): number | null {
  if (reviews.length === 0) return null;
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((total / reviews.length) * 10) / 10;
}

/** The verdict most reviewers gave, for the text path. Ties go to the earlier verdict. */
export function dominantFit(reviews: Review[]): FitVerdict | null {
  if (reviews.length === 0) return null;
  return fitCounts(reviews).reduce((best, current) =>
    current.count > best.count ? current : best,
  ).verdict;
}
