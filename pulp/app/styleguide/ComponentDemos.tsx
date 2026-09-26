"use client";

import { useId, useState, type ReactElement } from "react";
import { PRODUCTS, type Size } from "@/data/products";
import ColourwaySwatch from "@/components/ui/ColourwaySwatch";
import ProductCard from "@/components/ui/ProductCard";
import SizeSelector from "@/components/ui/SizeSelector";
import QuantityStepper from "@/components/ui/QuantityStepper";
import Button from "@/components/ui/Button";
import { useBasket } from "@/components/basket/BasketProvider";
import {
  defaultColourway,
  isColourwaySoldOut,
  isSizeLastFew,
  isSizeSoldOut,
  sizeUnits,
} from "@/lib/stock";

/**
 * The stateful demos for /styleguide. The components themselves are
 * controlled, so the state that drives them lives here rather than inside
 * them — the same way a product page or a basket line will own it.
 */

const RISO_TEE = PRODUCTS.find((p) => p.slug === "riso-tee")!;
const ONE_SIZE_PRODUCT = PRODUCTS.find((p) => p.slug === "six-panel-cap")!;

export function SizeSelectorDemo(): ReactElement {
  const [size, setSize] = useState<Size | null>("S");

  return (
    <div className="flex flex-col gap-40">
      <div>
        <p className="type-label mb-16 text-rose">
          Tumble Tee, Soot — M is sold out and renders disabled
        </p>
        <SizeSelector
          name="demo-size"
          sizes={RISO_TEE.sizes}
          value={size}
          onChange={setSize}
          isSoldOut={(s) => isSizeSoldOut(RISO_TEE, "soot", s)}
          isLastFew={(s) => isSizeLastFew(RISO_TEE, "soot", s)}
        />
        <p className="type-base mt-16">
          Selected: {size ?? "none"}
          {size ? ` — ${sizeUnits(RISO_TEE, "soot", size)} left` : ""}
        </p>
      </div>

      <div>
        <p className="type-label mb-16 text-rose">
          Warm Iron Beanie, Soot — single size, control becomes a label
        </p>
        <SizeSelector
          name="demo-size-one"
          sizes={ONE_SIZE_PRODUCT.sizes}
          value="ONE"
          onChange={() => {}}
          isSoldOut={(s) => isSizeSoldOut(ONE_SIZE_PRODUCT, "soot", s)}
        />
      </div>

      <div>
        <p className="type-label mb-16 text-rose">
          Warm Iron Beanie, Oxblood — single size, sold out
        </p>
        <SizeSelector
          name="demo-size-one-gone"
          sizes={ONE_SIZE_PRODUCT.sizes}
          value="ONE"
          onChange={() => {}}
          isSoldOut={(s) => isSizeSoldOut(ONE_SIZE_PRODUCT, "oxblood", s)}
        />
      </div>
    </div>
  );
}

export function QuantityStepperDemo(): ReactElement {
  const [mid, setMid] = useState(2);
  const [capped, setCapped] = useState(3);

  return (
    <div className="flex flex-col gap-40">
      <div>
        <p className="type-label mb-16 text-rose">
          Default — 19 left in Tumble Tee, Soot, S
        </p>
        <QuantityStepper
          value={mid}
          onChange={setMid}
          max={sizeUnits(RISO_TEE, "soot", "S")}
          itemLabel="Tumble Tee, Soot, S"
        />
      </div>

      <div>
        <p className="type-label mb-16 text-rose">
          At minimum — decrease disabled
        </p>
        <QuantityStepper value={1} onChange={() => {}} max={19} />
      </div>

      <div>
        <p className="type-label mb-16 text-rose">
          At stock ceiling — 3 left in Tumble Tee, Bone, XXL, increase disabled
        </p>
        <QuantityStepper
          value={capped}
          onChange={setCapped}
          max={sizeUnits(RISO_TEE, "bone", "XXL")}
          itemLabel="Tumble Tee, Bone, XXL"
        />
      </div>
    </div>
  );
}

/**
 * The add-to-basket harness.
 *
 * DESIGN.md §4 fixes the product card's six slots, and an add control is not
 * one of them — a card carries no size choice, so it has nothing to add with.
 * The card is therefore left exactly as specified and the controls that make
 * the flow testable sit beside it: colourway, size, then the button.
 *
 * This is a styleguide harness, not the product page. The real add flow, with
 * the 400ms tumble from §9, belongs with the product detail page.
 */
export function AddToBasketDemo(): ReactElement {
  const { add, open } = useBasket();
  const [colourway, setColourway] = useState(() =>
    defaultColourway(RISO_TEE),
  );
  const [size, setSize] = useState<Size | null>(null);
  const groupName = useId();

  const soldOutColourway = isColourwaySoldOut(RISO_TEE, colourway);
  const canAdd = size !== null && !isSizeSoldOut(RISO_TEE, colourway, size);

  return (
    <div className="grid gap-40 tablet:grid-cols-2 tablet:gap-64">
      <ProductCard product={RISO_TEE} />

      <div className="flex flex-col gap-40">
        <fieldset>
          <legend className="type-label mb-16">Colour</legend>
          <div className="flex">
            {RISO_TEE.colourways.map((option) => (
              <ColourwaySwatch
                key={option.slug}
                colourway={option}
                name={groupName}
                checked={option.slug === colourway}
                onSelect={() => {
                  setColourway(option.slug);
                  // The chosen size may not exist in the new colour, so the
                  // choice is cleared rather than silently carried over.
                  setSize(null);
                }}
                soldOut={isColourwaySoldOut(RISO_TEE, option.slug)}
              />
            ))}
          </div>
        </fieldset>

        <SizeSelector
          name={`${groupName}-size`}
          sizes={RISO_TEE.sizes}
          value={size}
          onChange={setSize}
          isSoldOut={(s) => isSizeSoldOut(RISO_TEE, colourway, s)}
          isLastFew={(s) => isSizeLastFew(RISO_TEE, colourway, s)}
        />

        <div className="flex flex-col gap-16">
          <Button
            disabled={!canAdd}
            onClick={() => {
              if (!canAdd || size === null) return;
              add(RISO_TEE.id, colourway, size);
              open();
            }}
          >
            Add to basket
          </Button>

          {/* The disabled button says nothing on its own, so the reason sits
              next to it in plain words. */}
          <p className="type-base" aria-live="polite">
            {soldOutColourway
              ? "This colour is sold out in every size."
              : size === null
                ? "Choose a size to add this to the basket."
                : `${sizeUnits(RISO_TEE, colourway, size)} left in ${size}.`}
          </p>
        </div>
      </div>
    </div>
  );
}
