import type { ReactElement } from "react";
import type { Review } from "@/data/products";
import { FIT_LABELS, fitCounts } from "@/lib/product/reviews";

interface FitDistributionProps {
  reviews: Review[];
}

/**
 * The fit-distribution bar (DESIGN.md §4).
 *
 * Rendered only where there are five or more reviews — the caller enforces the
 * threshold, and below it the verdicts are listed as text instead. A bar drawn
 * from two reviews claims a distribution that two data points cannot support.
 *
 * **Not reachable with today's catalogue.** The fullest product has four
 * reviews. This exists because the rule is the spec's and the data will grow;
 * it is not dead code by accident.
 *
 * Every row carries its label and its count in text. The bar repeats that
 * visually, so it is hidden from assistive software rather than announced as a
 * vaguer second version of the same fact.
 */
export default function FitDistribution({
  reviews,
}: FitDistributionProps): ReactElement {
  const counts = fitCounts(reviews);

  return (
    <ul className="flex flex-col gap-16">
      {counts.map((row) => (
        <li key={row.verdict} className="flex flex-col gap-8">
          <div className="flex items-baseline justify-between gap-16">
            <span className="type-label">{FIT_LABELS[row.verdict]}</span>
            <span className="type-label">
              {row.count} of {reviews.length}
            </span>
          </div>

          <div aria-hidden="true" className="h-8 w-full bg-rule">
            <div className="h-full bg-rose" style={{ width: `${row.percent}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
