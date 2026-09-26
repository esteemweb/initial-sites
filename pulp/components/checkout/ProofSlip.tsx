import type { ReactElement } from "react";
import { SPEC_LABELS } from "@/data/products";
import SpecMark from "@/components/icons/SpecMark";
import Wordmark from "@/components/brand/Wordmark";
import { DELIVERY_METHODS, toPounds } from "@/lib/commerce";
import { formatPrice } from "@/lib/format";
import { addressLines } from "@/lib/checkout/validation";
import type { PlacedOrder } from "@/lib/checkout/order";

interface ProofSlipProps {
  order: PlacedOrder;
}

/**
 * The order confirmation, set as the proof slip a print shop signs off a run
 * against (DESIGN.md §12).
 *
 * Space Mono throughout, because §3 gives mono to spec values and a proof slip
 * is nothing but spec values. The order number is the one exception: no mono
 * role exists above 13px, and the single figure a customer may have to read out
 * over the phone takes `lg`.
 *
 * Text is left-aligned. §5 reserves centre for full-bleed ink blocks and the
 * 404, so the panel is centred on the page but its contents are not — that is
 * layout, not text alignment.
 *
 * **Crop marks, not a dashed border.** A real proof carries registration and
 * trim marks outside the live area, and they are the one piece of print
 * furniture that reads instantly as "proof" rather than "receipt". They are
 * built from 2px `ink` rules, so nothing enters the system that was not already
 * in it.
 */

/**
 * Trim marks at one corner. Two rules meeting at a right angle, inset from the
 * corner the way a real trim mark clears the live area.
 *
 * `position` picks which corner, and the rules flip accordingly.
 */
function TrimMark({
  corner,
}: {
  corner: "tl" | "tr" | "bl" | "br";
}): ReactElement {
  const vertical = corner.startsWith("t") ? "top-0" : "bottom-0";
  const horizontal = corner.endsWith("l") ? "left-0" : "right-0";

  return (
    <span aria-hidden="true" className={`absolute ${vertical} ${horizontal} size-24`}>
      <span className={`absolute ${vertical} ${horizontal} h-2 w-24 bg-ink`} />
      <span className={`absolute ${vertical} ${horizontal} h-24 w-2 bg-ink`} />
    </span>
  );
}

export default function ProofSlip({ order }: ProofSlipProps): ReactElement {
  const placed = new Date(order.placedAt);

  // Fixed locale, so the printed date does not shift between the server render
  // and the browser's.
  const printedOn = Number.isNaN(placed.getTime())
    ? null
    : placed.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

  return (
    <div className="relative w-panel max-w-full border-2 border-ink bg-page p-24">
      <TrimMark corner="tl" />
      <TrimMark corner="tr" />
      <TrimMark corner="bl" />
      <TrimMark corner="br" />

      <div className="flex items-baseline justify-between gap-16">
        <Wordmark className="type-label" />
        <p className="type-label text-ink/60">Proof</p>
      </div>

      <p className="type-label mt-40">Job number</p>
      <p className="type-lg mt-8">{order.number}</p>
      {printedOn && (
        <p className="type-label mt-8 text-ink/60">Passed {printedOn}</p>
      )}

      {/* The spec marks across everything ordered, deduplicated and in
          canonical order. Each keeps its text equivalent beside it (§4). */}
      <p className="type-label mt-40">Spec</p>
      <ul className="mt-16 flex flex-col gap-16">
        {order.spec.map((code) => (
          <li key={code} className="flex items-center gap-16">
            <SpecMark code={code} className="size-24" decorative />
            <span className="type-label">{SPEC_LABELS[code]}</span>
          </li>
        ))}
      </ul>
      <p className="type-label mt-16 text-ink/60">
        Covers every garment in this run
      </p>

      <div className="mt-40 border-t-2 border-ink pt-24">
        <p className="type-label">Run</p>
        <ul className="mt-16 flex flex-col gap-16">
          {order.lines.map((line) => (
            <li key={`${line.name}-${line.colourway}-${line.size}`}>
              <p className="type-label">
                {line.quantity} &times; {line.name}
              </p>
              <p className="type-label mt-8 text-ink/60">
                {line.colourway} / {line.size} &middot;{" "}
                {formatPrice(toPounds(line.linePrice))}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <dl className="mt-40 flex flex-col gap-16 border-t-2 border-ink pt-24">
        <div className="flex justify-between gap-16">
          <dt className="type-label">Subtotal</dt>
          <dd className="type-label">
            {formatPrice(toPounds(order.totals.subtotal))}
          </dd>
        </div>

        {order.totals.discount > 0 && (
          <div className="flex justify-between gap-16">
            <dt className="type-label">Discount</dt>
            <dd className="type-label">
              &minus;{formatPrice(toPounds(order.totals.discount))}
            </dd>
          </div>
        )}

        <div className="flex justify-between gap-16">
          <dt className="type-label">{DELIVERY_METHODS[order.method].label}</dt>
          <dd className="type-label">
            {order.totals.deliveryIsFree
              ? "Free"
              : formatPrice(toPounds(order.totals.delivery))}
          </dd>
        </div>

        <div className="flex justify-between gap-16 border-t-2 border-ink pt-16">
          <dt className="type-label">Total paid</dt>
          <dd className="type-label">
            {formatPrice(toPounds(order.totals.total))}
          </dd>
        </div>
      </dl>

      <div className="mt-40 border-t-2 border-ink pt-24">
        <p className="type-label">Ship to</p>
        <address className="type-label mt-16 not-italic">
          {addressLines(order.details).map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </address>
        <p className="type-label mt-16">{order.estimate}</p>
      </div>

      <p className="type-label mt-40 text-ink/60">
        Printed and sewn in Portugal &middot; Small runs &middot; Loud colours
      </p>
    </div>
  );
}
