"use client";

import Image from "next/image";
import type { ReactElement } from "react";
import QuantityStepper from "@/components/ui/QuantityStepper";
import { formatPrice } from "@/lib/format";
import { toPounds } from "@/lib/commerce";
import { productImage } from "@/lib/product/image";
import type { ResolvedLine } from "@/lib/basket/state";

interface BasketLineItemProps {
  line: ResolvedLine;
  onQuantityChange: (key: string, quantity: number) => void;
  onRemove: (key: string) => void;
}

/**
 * The basket line item (DESIGN.md §4) — its own component, not a product card.
 *
 * Image, name, chosen size and colour as text, quantity stepper, line price,
 * remove. **No swatches and no spec marks**: swatches earn their place where
 * the customer is still choosing, and by the basket they have chosen.
 *
 * The stepper is capped at the units left in this size of this colourway, so
 * the basket cannot be stepped into overselling. The reducer clamps as well —
 * this is the visible half of the same rule, not a substitute for it.
 */
export default function BasketLineItem({
  line,
  onQuantityChange,
  onRemove,
}: BasketLineItemProps): ReactElement {
  const { key, product, colourway, available } = line;
  const size = line.line.size;

  // "ONE" is a data value, not a word to show a customer.
  const sizeLabel = size === "ONE" ? "One size" : size;
  const description = `${product.name}, ${colourway.name}, ${sizeLabel}`;

  return (
    <li className="flex gap-16 border-b-2 border-ink py-24">
      {/* The square shot, matching the product card and §10. Decorative here:
          the name, colour and size all follow as text, so announcing the image
          too would just repeat them. */}
      <div className="relative aspect-square w-80 shrink-0 overflow-hidden bg-rule/40">
        <Image
          src={productImage(product.slug, colourway.slug)}
          alt=""
          aria-hidden="true"
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-8">
        <div className="flex items-start justify-between gap-16">
          <h3 className="type-base">{product.name}</h3>
          <p className="type-base shrink-0">
            {formatPrice(toPounds(line.linePrice))}
          </p>
        </div>

        {/* The choice, as text. Space Mono is the role for spec values (§3). */}
        <p className="type-label">
          {colourway.name} / {sizeLabel}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-16">
          <QuantityStepper
            value={line.line.quantity}
            onChange={(quantity) => onQuantityChange(key, quantity)}
            max={available}
            itemLabel={description}
          />

          {/* A button, styled as the §4 text link: it acts on this page rather
              than navigating, so it must not be an anchor. */}
          <button
            type="button"
            onClick={() => onRemove(key)}
            className="type-base underline decoration-1 underline-offset-2
              transition-colors hover:text-rose active:translate-y-[1px]"
          >
            Remove
            <span className="sr-only"> {description}</span>
          </button>
        </div>
      </div>
    </li>
  );
}
