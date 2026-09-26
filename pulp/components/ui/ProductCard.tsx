import Image from "next/image";
import Link from "next/link";
import type { ReactElement } from "react";
import type { Product } from "@/data/products";
import IconShell from "@/components/icons/IconShell";
import { CHEVRON_GLYPH } from "@/components/icons/glyph-paths";
import Badge from "./Badge";
import { formatPrice } from "@/lib/format";
import { productImage, productImageAlt } from "@/lib/product/image";
import {
  defaultColourway,
  isColourwayLastFew,
  isColourwaySoldOut,
} from "@/lib/stock";

interface ProductCardProps {
  product: Product;
}

/**
 * The product card.
 *
 * pattern: product card anatomy, from the forsure.co autopsy §10, copied to the
 * slot list rather than adapted. Three things and nothing else:
 *
 *   1. Square 1:1 image
 *   2. Title, underlined at rest
 *   3. Full-width `ink` action bar, split into a size control and a divided
 *      price cell
 *
 * The card carries no padding, no border, no background and no shadow. All of
 * its weight is the image and that bar.
 *
 * **This drops three slots §4 previously listed** — fabric weight, colourway
 * swatches and the spec mark row — because the reference card has none of them
 * and the instruction was to copy it. §4 has been amended to match, so the
 * document and the build still agree. What that costs: you can no longer
 * preview a colourway from the grid, and weight and spec now appear only on the
 * product page. The shop's colour and spec filters are unaffected — they never
 * read the card.
 *
 * Two deliberate holds against the reference:
 *
 *   - **Square corners.** The reference rounds its media wrapper 16px; §4 says
 *     square throughout, no exceptions, and that was decided explicitly.
 *   - **The stock badge stays.** The reference has no badge. Dropping sold-out
 *     signalling from the grid would be a functional regression, not a
 *     stylistic one, and §4 classes a badge as an overlay rather than a slot.
 *
 * No state and no client boundary any more: with the swatches gone there is
 * nothing on this card to interact with except two links.
 */
export default function ProductCard({
  product,
}: ProductCardProps): ReactElement {
  const active =
    product.colourways.find((c) => c.slug === defaultColourway(product)) ??
    product.colourways[0];

  const soldOut = isColourwaySoldOut(product, active.slug);
  const lastFew = isColourwayLastFew(product, active.slug);

  return (
    <article className="flex flex-col">
      <Link
        href={`/shop/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-rule"
      >
        {/* The grid is 2-up at every breakpoint (§8), so a card is never wider
            than half the 1200px container plus the gutter either side. */}
        <Image
          src={productImage(product.slug, active.slug)}
          alt={productImageAlt(product.name, active.name)}
          fill
          sizes="(min-width: 1200px) 592px, 50vw"
          className="object-cover"
        />

        {(soldOut || lastFew) && (
          <Badge className="absolute left-0 top-0">
            {soldOut ? "Sold out" : "Last few left"}
          </Badge>
        )}
      </Link>

      <h3 className="mt-16">
        <Link
          href={`/shop/${product.slug}`}
          className="type-base underline decoration-1 underline-offset-4 transition-colors hover:text-rose"
        >
          {product.name}
        </Link>
      </h3>

      {/* pattern: inline action bar, autopsy §10. Links through to the product
          page rather than quick-adding: size and colour both have to be chosen
          and stock is held per variant, so a one-tap add from a grid would have
          to guess at both. */}
      <Link
        href={`/shop/${product.slug}`}
        className="mt-16 flex min-h-48 items-stretch bg-ink text-page transition-colors hover:bg-rose"
      >
        <span className="type-label flex flex-1 items-center justify-center gap-8 px-16 py-8">
          Choose size
          <IconShell
            paths={CHEVRON_GLYPH}
            defaultLabel="Open"
            decorative
            className="size-16"
          />
        </span>
        <span className="type-label flex items-center border-l-2 border-page px-16 py-8">
          {formatPrice(product.price)}
        </span>
      </Link>
    </article>
  );
}
