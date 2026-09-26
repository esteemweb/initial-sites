"use client";

import { useId, useState, type ReactElement } from "react";
import type { Product, Size } from "@/data/products";
import Badge from "@/components/ui/Badge";
import ColourwaySwatch from "@/components/ui/ColourwaySwatch";
import SizeSelector from "@/components/ui/SizeSelector";
import { formatPrice, weightLabel } from "@/lib/format";
import {
  defaultColourway,
  isColourwaySoldOut,
  isSizeLastFew,
  isSizeSoldOut,
  sizeUnits,
} from "@/lib/stock";
import AddToBasket from "./AddToBasket";
import ProductGallery from "./ProductGallery";
import SizeGuideDialog from "./SizeGuideDialog";
import SpecAccordion from "./SpecAccordion";

interface BuyPanelProps {
  product: Product;
}

/**
 * The garment, and everything needed to buy it.
 *
 * One client component owns the two choices — colourway and size — because the
 * gallery, the swatches, the size selector and the add button all read or write
 * them. Everything below it stays presentational.
 *
 * Hierarchy: the weight is the headline number at `xl`, the name and its
 * strapline sit at `lg` beneath it, and the price at `md`. Straplines are `lg`
 * by §3 and exempt from the seven-character rule, which is why this one can run
 * as long as it does.
 *
 * Changing colourway clears the size. The same letter is a different piece of
 * stock in a different colour — Soot M is sold out where Bone M is not — so
 * carrying the choice across would silently re-point it at something the
 * customer never picked.
 */
export default function BuyPanel({ product }: BuyPanelProps): ReactElement {
  const group = useId();
  const [slug, setSlug] = useState(() => defaultColourway(product));
  const [size, setSize] = useState<Size | null>(() =>
    // A single-size product has nothing to choose, so it starts chosen.
    product.sizes.length === 1 && product.sizes[0] === "ONE" ? "ONE" : null,
  );

  const colourway =
    product.colourways.find((c) => c.slug === slug) ?? product.colourways[0];

  const selectColourway = (next: string) => {
    setSlug(next);
    if (!(product.sizes.length === 1 && product.sizes[0] === "ONE")) {
      setSize(null);
    }
  };

  const available = size ? sizeUnits(product, colourway.slug, size) : 0;
  const lastFew = size ? isSizeLastFew(product, colourway.slug, size) : false;

  return (
    <section className="shell py-40 desktop:py-48">
      <div className="grid gap-64 desktop:grid-cols-2 desktop:gap-96">
        <ProductGallery
          product={product}
          active={colourway}
          onSelect={selectColourway}
        />

        <div className="flex flex-col gap-40">
          <div>
            <div className="flex flex-wrap items-center gap-16">
              <p className="type-label">{product.category.replace("-", " ")}</p>
              {product.restocked && <Badge>Back in stock</Badge>}
            </div>

            {/* The headline number (§3 allows no size between this and `lg`). */}
            <p className="type-xl mt-24">{weightLabel(product)}</p>

            <h1 className="type-lg mt-24">{product.name}</h1>
            <p className="type-lg mt-16 text-rose">{product.strapline}</p>

            <p className="type-md mt-24">{formatPrice(product.price)}</p>
            <p className="type-base measure mt-24">{product.description}</p>
          </div>

          <fieldset>
            <legend className="type-label mb-16">
              Colour &mdash; {colourway.name}
            </legend>
            <div className="flex">
              {product.colourways.map((option) => (
                <ColourwaySwatch
                  key={option.slug}
                  colourway={option}
                  name={`${group}-colour`}
                  checked={option.slug === colourway.slug}
                  onSelect={() => selectColourway(option.slug)}
                  onPreview={() => selectColourway(option.slug)}
                  soldOut={isColourwaySoldOut(product, option.slug)}
                />
              ))}
            </div>
          </fieldset>

          <div className="flex flex-col gap-16">
            <SizeSelector
              name={`${group}-size`}
              sizes={product.sizes}
              value={size}
              onChange={setSize}
              isSoldOut={(s) => isSizeSoldOut(product, colourway.slug, s)}
              isLastFew={(s) => isSizeLastFew(product, colourway.slug, s)}
            />

            {/* Per-size stock, in words. "Last few left" is fewer than 4 in this
                one size of this one colourway (§12) — the size-selector rule,
                not the card's colourway total. */}
            {lastFew && (
              <p className="type-base">
                Only {available} left in{" "}
                {size === "ONE" ? "this one" : size}.
              </p>
            )}

            <SizeGuideDialog product={product} />
          </div>

          <AddToBasket
            product={product}
            colourway={colourway}
            size={size}
            available={available}
          />

          <SpecAccordion product={product} />
        </div>
      </div>
    </section>
  );
}
