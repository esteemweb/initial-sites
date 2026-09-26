"use client";

import Image from "next/image";
import { useId, type ReactElement } from "react";
import type { Colourway, Product } from "@/data/products";
import Badge from "@/components/ui/Badge";
import { productImage, productImageAlt } from "@/lib/product/image";
import { isColourwayLastFew, isColourwaySoldOut } from "@/lib/stock";

interface ProductGalleryProps {
  product: Product;
  active: Colourway;
  onSelect: (slug: string) => void;
}

/**
 * The gallery: a 1:1 main frame over a rail of 1:1 thumbnails, one per
 * colourway (DESIGN.md §10 — product photography is square, matching the §8
 * grid so a shot never letterboxes).
 *
 * Both the frame and the rail carry the real photograph now. The rail shows the
 * garment rather than a flat hex chip: once a shot exists, a chip is strictly
 * less information for the same space. The `§4` swatches in the buy panel keep
 * the flat hex, because there the job is naming a colour, not previewing a
 * picture.
 *
 * The rail is a radio group, the same native pattern the swatches use, so
 * arrow keys move through it and the current image is announced. It drives the
 * same state as the §4 swatches in the buy panel below — two affordances for
 * one choice, which is how a product page is actually used: people reach for
 * the picture as often as the swatch.
 *
 * Changing colourway cross-fades the frame in 150ms (§9). Nothing here needs
 * hover: selection is a tap, a click or a keypress.
 */
export default function ProductGallery({
  product,
  active,
  onSelect,
}: ProductGalleryProps): ReactElement {
  const group = useId();
  const soldOut = isColourwaySoldOut(product, active.slug);
  const lastFew = isColourwayLastFew(product, active.slug);

  return (
    <div className="flex flex-col gap-16">
      <div className="relative aspect-square w-full overflow-hidden bg-rule/40">
        {/* Keyed on the slug so React swaps the node and the fade restarts. */}
        <Image
          key={active.slug}
          src={productImage(product.slug, active.slug)}
          alt={productImageAlt(product.name, active.name)}
          fill
          priority
          sizes="(min-width: 1024px) 592px, 100vw"
          className="animate-[overlay-in_150ms_ease-out] object-cover"
        />

        {(soldOut || lastFew) && (
          <Badge className="absolute left-0 top-0">
            {soldOut ? "Sold out" : "Last few left"}
          </Badge>
        )}
      </div>

      <fieldset>
        <legend className="sr-only">Colour shown — {product.name}</legend>
        <ul className="flex flex-wrap gap-16">
          {product.colourways.map((colourway) => (
            <li key={colourway.slug}>
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name={`${group}-gallery`}
                  value={colourway.slug}
                  checked={colourway.slug === active.slug}
                  onChange={() => onSelect(colourway.slug)}
                  className="peer sr-only"
                />
                <span
                  className="type-label flex w-64 flex-col gap-8 border-2 border-transparent p-8
                    peer-checked:border-ink
                    peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2
                    peer-focus-visible:outline-ultra"
                >
                  <span className="relative block aspect-square w-full overflow-hidden border border-rule">
                    <Image
                      src={productImage(product.slug, colourway.slug)}
                      alt=""
                      aria-hidden="true"
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </span>
                  {colourway.name}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
    </div>
  );
}
