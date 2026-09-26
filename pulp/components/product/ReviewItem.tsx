import type { ReactElement } from "react";
import type { Review } from "@/data/products";
import { formatReviewDate } from "@/lib/format";
import { FIT_LABELS } from "@/lib/product/reviews";

interface ReviewItemProps {
  review: Review;
}

/**
 * One review: rating, title, body, then who and when, with the fit verdict.
 *
 * The rating is drawn as filled and empty blocks rather than stars — there is
 * no star in the spec set, and §4 says a UI glyph that does not exist there is
 * drawn to match rather than imported from somewhere else. The blocks are
 * decorative; the rating is stated in words for anything reading the page
 * aloud, so it never depends on counting shapes.
 */
export default function ReviewItem({ review }: ReviewItemProps): ReactElement {
  return (
    <li className="border-t-2 border-ink py-40">
      <p className="type-label">
        <span aria-hidden="true">
          {"■".repeat(review.rating)}
          <span className="text-ink/60">{"□".repeat(5 - review.rating)}</span>
        </span>
        <span className="sr-only">{review.rating} out of 5</span>
      </p>

      <h3 className="type-md mt-16">{review.title}</h3>
      <p className="type-base measure mt-16">{review.body}</p>

      <p className="type-label mt-24">
        {review.author} &middot;{" "}
        <time dateTime={review.date}>{formatReviewDate(review.date)}</time>{" "}
        &middot; {FIT_LABELS[review.fit]}
      </p>
    </li>
  );
}
