import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { PRODUCTS } from "@/data/products";
import TextLink from "@/components/ui/TextLink";
import BuyPanel from "@/components/product/BuyPanel";
import SpecMarker from "@/components/product/SpecMarker";
import ReviewList from "@/components/product/ReviewList";
import GoesWith from "@/components/product/GoesWith";
import { weightLabel } from "@/lib/format";

/**
 * Product detail.
 *
 * All 14 slugs are known at build time, so all 14 are prerendered and anything
 * else is a 404 rather than a lookup at request time.
 *
 * Section order puts the garment first and the oversized spec mark below the
 * fold as a section marker — it breaks the page rather than opening it.
 */

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

function find(slug: string) {
  return PRODUCTS.find((product) => product.slug === slug);
}

export async function generateMetadata(
  props: PageProps<"/shop/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = find(slug);
  if (!product) return { title: "Not found — PULP" };

  return {
    title: `${product.name} — PULP`,
    // The catalogue's own description, so the search result and the page agree.
    description: `${weightLabel(product)}. ${product.description}`,
  };
}

export default async function ProductPage(
  props: PageProps<"/shop/[slug]">,
): Promise<ReactElement> {
  const { slug } = await props.params;
  const product = find(slug);
  if (!product) notFound();

  return (
    <main>
      <div className="shell pt-40 desktop:pt-80">
        <TextLink href="/shop">Back to the shop</TextLink>
      </div>

      <BuyPanel product={product} />
      <SpecMarker product={product} />
      <ReviewList reviews={product.reviews} productName={product.name} />
      <GoesWith product={product} />
    </main>
  );
}
