import type { ReactElement } from "react";
import { PRODUCTS } from "@/data/products";
import ProductCard from "@/components/ui/ProductCard";
import ButtonLink from "@/components/ui/ButtonLink";

/**
 * Four products from the catalogue: a tee, a hoodie, a trouser and a crew,
 * spanning 320 to 480gsm so the row makes the weight argument as well as the
 * range one.
 *
 * On the grid: §8 specifies 3-up at desktop and 2-up at mobile, and that
 * governs the shop grid. This is a featured row of four, which cannot sit 3-up
 * without orphaning one, so it runs 4-up from 1024 and 2-up below. The
 * distinction is deliberate — do not copy this grid into `/shop`.
 *
 * Cards are looked up by slug rather than index, so reordering the catalogue
 * cannot silently change what the homepage features.
 */

const FEATURED_SLUGS = [
  "riso-tee",
  "studio-hoodie",
  "utility-cargo",
  "press-crew",
];

const FEATURED = FEATURED_SLUGS.map(
  (slug) => PRODUCTS.find((product) => product.slug === slug)!,
);

export default function FeaturedProducts(): ReactElement {
  return (
    <section
      aria-labelledby="featured-heading"
      className="shell py-40 desktop:py-48"
    >
      <p className="type-label">In stock now</p>
      <h2 id="featured-heading" className="type-lg mt-16">
        Four to start with.
      </h2>

      <div className="mt-64 grid grid-cols-2 gap-8 desktop:gap-16">
        {FEATURED.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <ButtonLink href="/shop" variant="secondary" className="mt-64">
        Shop everything
      </ButtonLink>
    </section>
  );
}
