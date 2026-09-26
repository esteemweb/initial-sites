"use client";

import * as Accordion from "@radix-ui/react-accordion";
import type { ReactElement, ReactNode } from "react";
import type { Product } from "@/data/products";
import IconShell from "@/components/icons/IconShell";
import { CHEVRON_GLYPH } from "@/components/icons/glyph-paths";
import { weightLabel } from "@/lib/format";
import MeasurementTable from "./MeasurementTable";

interface SpecAccordionProps {
  product: Product;
}

/**
 * Composition, dimensions and origin (DESIGN.md §4 inventory).
 *
 * `@radix-ui/react-accordion`, which `CLAUDE.md` approves for exactly this —
 * product spec accordions. Behaviour only: it gives the disclosure semantics,
 * the arrow-key movement between headers and the `aria-expanded` wiring, and
 * every visual comes from `DESIGN.md`.
 *
 * Content unfolds downward in 200ms (§9), driven by the height Radix measures
 * into `--radix-accordion-content-height`. The global reduced-motion rule
 * collapses that to nothing and the panel simply appears, which is correct
 * here: the state is carried by the content being there, not by the movement.
 *
 * `type="multiple"` — these are three independent facts, not a set of
 * alternatives, so opening origin should not close composition.
 */

const TRIGGER =
  "type-label flex w-full items-center justify-between gap-16 py-24 text-left " +
  "transition-colors hover:text-rose";

function Item({
  value,
  heading,
  children,
}: {
  value: string;
  heading: string;
  children: ReactNode;
}): ReactElement {
  return (
    <Accordion.Item value={value} className="border-b-2 border-ink">
      <Accordion.Header>
        <Accordion.Trigger className={`${TRIGGER} group`}>
          {heading}
          <IconShell
            paths={CHEVRON_GLYPH}
            defaultLabel="Toggle"
            decorative
            className="size-16 shrink-0 transition-transform group-data-[state=open]:rotate-180"
          />
        </Accordion.Trigger>
      </Accordion.Header>

      <Accordion.Content className="overflow-hidden data-[state=closed]:animate-unfold-up data-[state=open]:animate-unfold-down">
        <div className="pb-40">{children}</div>
      </Accordion.Content>
    </Accordion.Item>
  );
}

export default function SpecAccordion({
  product,
}: SpecAccordionProps): ReactElement {
  const hasMeasurements = product.measurements.length > 0;

  return (
    <Accordion.Root type="multiple" className="border-t-2 border-ink">
      <Item value="composition" heading="Composition">
        <dl className="flex flex-col gap-16">
          <div>
            <dt className="type-label">Fabric</dt>
            <dd className="type-base measure mt-8">{product.composition}</dd>
          </div>
          <div>
            <dt className="type-label">Weight</dt>
            <dd className="type-base mt-8">{weightLabel(product)}</dd>
          </div>
        </dl>
      </Item>

      <Item value="dimensions" heading="Dimensions">
        {hasMeasurements ? (
          <MeasurementTable measurements={product.measurements} />
        ) : (
          <p className="type-base measure">
            One size, and not cut to body measurements, so there is no chart for
            this one.
          </p>
        )}
      </Item>

      <Item value="origin" heading="Origin">
        <p className="type-base measure">{product.origin}</p>
      </Item>
    </Accordion.Root>
  );
}
