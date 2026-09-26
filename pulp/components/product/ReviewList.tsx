import type { ReactElement } from "react";
import type { Review } from "@/data/products";
import {
  FIT_LABELS,
  averageRating,
  fitCounts,
  showsDistribution,
} from "@/lib/product/reviews";
import FitDistribution from "./FitDistribution";
import ReviewItem from "./ReviewItem";

interface ReviewListProps {
  reviews: Review[];
  productName: string;
}

/**
 * Reviews (DESIGN.md §4).
 *
 * The count always shows. The fit-distribution bar renders only at five or
 * more; below that the verdicts are listed as text — which, with today's
 * catalogue, is every product, since the fullest has four.
 *
 * Reviews are shown newest first. The catalogue happens to list them that way
 * already, but a page should not depend on the order of a data file, so it is
 * sorted here.
 */
export default function ReviewList({
  reviews,
  productName,
}: ReviewListProps): ReactElement {
  const average = averageRating(reviews);
  const distribution = showsDistribution(reviews);

  const newestFirst = [...reviews].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <section aria-labelledby="reviews-heading" className="shell py-40 desktop:py-48">
      <p className="type-label">What people say</p>
      <h2 id="reviews-heading" className="type-lg mt-16">
        {reviews.length === 0
          ? "No reviews yet."
          : `${reviews.length} ${reviews.length === 1 ? "review" : "reviews"}.`}
      </h2>

      {reviews.length === 0 ? (
        <p className="type-base measure mt-24">
          Nobody has written about {productName} yet. The measurements in the
          size guide are the best thing to go on for now.
        </p>
      ) : (
        <>
          <p className="type-base mt-24">
            {average} out of 5 on average.
          </p>

          <div className="mt-48 measure">
            {distribution ? (
              <FitDistribution reviews={reviews} />
            ) : (
              // Under five reviews the verdicts are listed, not charted.
              <div>
                <p className="type-label">How it fits</p>
                <ul className="mt-16 flex flex-col gap-8">
                  {fitCounts(reviews)
                    .filter((row) => row.count > 0)
                    .map((row) => (
                      <li key={row.verdict} className="type-base">
                        {row.count}{" "}
                        {row.count === 1 ? "reviewer says" : "reviewers say"}{" "}
                        {FIT_LABELS[row.verdict].toLowerCase()}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>

          <ul className="mt-64">
            {newestFirst.map((review) => (
              <ReviewItem key={`${review.author}-${review.date}`} review={review} />
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
