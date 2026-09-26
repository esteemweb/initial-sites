"use client";

import * as Dialog from "@radix-ui/react-dialog";
import type { ReactElement } from "react";
import type { Product } from "@/data/products";
import CloseIcon from "@/components/icons/CloseIcon";
import TextLink from "@/components/ui/TextLink";
import MeasurementTable from "./MeasurementTable";

interface SizeGuideDialogProps {
  product: Product;
}

/**
 * The size guide, in a panel rather than a route — nobody should lose their
 * place on the product page to check a chest measurement.
 *
 * Radix supplies the focus trap, the restore, Escape and the scroll lock; every
 * visual is from `DESIGN.md`, and the panel takes the same treatment as the
 * basket slide-over, §6's one sanctioned exception to a site with no depth.
 *
 * The trigger renders whatever the product carries. Where there are no
 * measurements — the three one-size accessories — the panel says so plainly
 * instead of the control disappearing and leaving a hole, which is the same
 * reasoning §4 applies to the size selector: structure holds.
 *
 * There is a full `/size-guide` page too, linked at the bottom, for the
 * general fit advice that is not about this one garment.
 */
export default function SizeGuideDialog({
  product,
}: SizeGuideDialogProps): ReactElement {
  const hasMeasurements = product.measurements.length > 0;

  return (
    <Dialog.Root>
      <Dialog.Trigger className="type-base self-start underline decoration-1 underline-offset-2 transition-colors hover:text-rose active:translate-y-[1px]">
        Size guide
        <span className="sr-only"> for {product.name}</span>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-40 bg-ink/40
            data-[state=open]:animate-overlay-in
            data-[state=closed]:animate-overlay-out"
        />

        <Dialog.Content
          className="fixed inset-y-0 right-0 z-50 flex w-full max-w-full flex-col
            border-l-2 border-ink bg-page
            data-[state=open]:animate-panel-in
            data-[state=closed]:animate-panel-out
            tablet:w-panel"
        >
          <header className="flex shrink-0 items-center justify-between gap-16 border-b-2 border-ink px-24 py-16">
            <Dialog.Title className="type-lg">Size guide</Dialog.Title>

            <Dialog.Close
              aria-label="Close size guide"
              className="inline-flex size-48 shrink-0 items-center justify-center
                text-ink transition-colors hover:bg-ink hover:text-page
                active:translate-y-[1px]"
            >
              <CloseIcon className="size-24" decorative />
            </Dialog.Close>
          </header>

          <Dialog.Description className="sr-only">
            Measurements for {product.name}.
          </Dialog.Description>

          <div className="flex-1 overflow-y-auto overscroll-contain px-24 py-40">
            <p className="type-label mb-24">{product.name}</p>

            {hasMeasurements ? (
              <MeasurementTable measurements={product.measurements} />
            ) : (
              <p className="type-base measure">
                This one comes in a single size and is not cut to body
                measurements, so there is no chart for it. The fit notes in the
                reviews below are the useful thing here.
              </p>
            )}

            <p className="type-base mt-48">
              <TextLink href="/size-guide">
                How we measure, and what to do between sizes
              </TextLink>
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
