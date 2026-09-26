import type { ReactElement } from "react";
import { SPEC_LABELS, type Product } from "@/data/products";
import ProductCard from "@/components/ui/ProductCard";
import { fabricOf, goesWith } from "@/lib/product/related";

interface GoesWithProps {
  product: Product;
}

/**
 * "Goes with" — four garments that sit alongside this one.
 *
 * The rule in `lib/product/related.ts` matches on fabric first and fit second,
 * so the row is a real answer rather than a merchandising slot. The line
 * underneath names the fabric they share, which makes the claim checkable.
 *
 * Four across at desktop and two below, matching the homepage's featured row.
 * §8's 3-up governs the shop grid specifically.
 */
export default function GoesWith({ product }: GoesWithProps): ReactElement {
  const related = goesWith(product);
  const fabric = fabricOf(product);

  return (
    <section
      aria-labelledby="goes-with-heading"
      className="shell py-40 desktop:py-48"
    >
      <p className="type-label">Same rail</p>
      <h2 id="goes-with-heading" className="type-lg mt-16">
        Goes with.
      </h2>

      {fabric && (
        <p className="type-base measure mt-24">
          Cut from the same cloth as the {product.name} &mdash;{" "}
          {SPEC_LABELS[fabric].toLowerCase()} &mdash; so they wear the same way.
        </p>
      )}

      <div className="mt-64 grid grid-cols-2 gap-8 desktop:gap-16">
        {related.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </section>
  );
}
