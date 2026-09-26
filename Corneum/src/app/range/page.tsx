import type { Metadata } from "next";
import Link from "next/link";
import { ViewTransition } from "react";
import { AddToBag } from "@/components/site/AddToBag";
import { BuyBar } from "@/components/site/BuyBar";
import { Section } from "@/components/site/Section";
import { Grid } from "@/components/ui/Grid";
import { MetaRow } from "@/components/ui/MetaRow";
import { ProductImage } from "@/components/ui/ProductImage";
import { SpecTable, type SpecColumn } from "@/components/ui/SpecTable";
import { CONCERNS, getProduct, products, type Product } from "@/data/products";

export const metadata: Metadata = {
  title: "The range — Corneum",
  description:
    "Six products, deliberately few. Vessel 01, and five 30 ml concentrate refills compared by active, percentage, pH and price.",
};


function Actives({ p }: { p: Product }) {
  return (
    <span className="type-data grid gap-8">
      {p.actives.value.map((a) => (
        <span key={a.name}>
          {a.name} <span className="text-green">{a.pct}</span>
        </span>
      ))}
    </span>
  );
}

/* Columns on the 12-col grid. Price sits at col 9, the start of the facts rail. */
const COLUMNS: SpecColumn<Product>[] = [
  {
    key: "product",
    header: "Product",
    place: "col-span-2 col-start-1",
    cell: (p) => (
      <Link href={`/range/${p.slug}`} className="grid min-h-48 content-center">
        <span className="type-data text-ink-muted">{p.index}</span>
        <span className="type-h4">{p.name}</span>
      </Link>
    ),
  },
  { key: "actives", header: "Actives", place: "col-span-3 col-start-3", cell: (p) => <Actives p={p} /> },
  { key: "for", header: "For", place: "col-span-2 col-start-6", cell: (p) => <span className="type-body">{p.purpose.value}</span> },
  { key: "ph", header: "pH", place: "col-span-1 col-start-8", cell: (p) => <span className="type-data text-green">{p.ph?.value}</span> },
  {
    key: "price",
    header: "Price",
    place: "col-span-1 col-start-9",
    cell: (p) => <span className="type-data">${p.price.value}</span>,
  },
  { key: "makes", header: "Makes", place: "col-span-1 col-start-10", cell: () => <span className="type-data text-green">200 ML</span> },
  {
    key: "add",
    header: "Bag",
    place: "col-span-2 col-start-11",
    end: true,
    cell: (p) => <AddToBag slug={p.slug} variant="secondary" showQty={false} label="Add" ariaLabel={`Add ${p.name} to bag`} />,
  },
];

export default function RangePage() {
  const vessel = getProduct("vessel-01")!;
  const refills = products.filter((p) => p.kind === "refill");

  return (
    <main id="content" tabIndex={-1} className="pb-96 outline-none lg:pb-0">
      {/* Header */}
      <Grid as="section" aria-labelledby="range-title" className="gap-y-24 pt-40 pb-64 lg:pb-96">
        <p className="type-data col-span-12 text-ink-muted">06 products</p>
        <h1 id="range-title" className="type-display title-rise col-span-12 lg:col-span-8">
          The range
        </h1>
        <p className="type-h4 col-span-12 max-w-measure lg:col-span-4 lg:col-start-9">
          Six products. Deliberately few. Use no more than two at once.
        </p>
      </Grid>

      {/* Vessel 01: bought once, first */}
      <Section id="vessel" label="01 — Bought once">
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <ViewTransition name="product-vessel-01" share="morph" default="none">
            <ProductImage src={vessel.image.src} alt={vessel.image.alt} sizes="(min-width: 1024px) 25vw, 100vw" />
          </ViewTransition>
        </div>
        <div className="col-span-12 grid content-start gap-24 md:col-span-6 lg:col-span-4 lg:col-start-5">
          <Link href="/range/vessel-01" className="type-h3 inline-flex min-h-48 items-center justify-self-start">
            Vessel 01
          </Link>
          <p className="type-body max-w-measure">
            Glass and steel. Everything else pours into it. A first order has to include one.
          </p>
          <dl className="border-b border-hairline">
            {vessel.specs.slice(0, 3).map((s) => (
              <div key={s.label} className="flex justify-between gap-16 border-t border-hairline py-16">
                <dt className="type-data text-ink-muted">{s.label}</dt>
                <dd className="type-data text-green">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="col-span-12 grid content-start justify-items-start gap-24 lg:col-span-4 lg:col-start-9">
          <p className="grid gap-8">
            <span className="type-h4">${vessel.price.value}</span>
            <span className="type-data text-ink-muted">Bought once</span>
          </p>
          <AddToBag slug="vessel-01" label="Add Vessel 01" />
          <Link href="/range/vessel-01" className="type-data inline-flex min-h-48 items-center">
            Full specification →
          </Link>
        </div>
      </Section>

      {/* The refills, compared */}
      <Section id="refills" label="02–06 — Refills, compared">
        <p className="type-body col-span-12 max-w-measure text-ink-muted lg:col-span-4 lg:col-start-9">
          Every refill is 30 ml of concentrate. It makes 200 ml in Vessel 01 and lasts about two months.
        </p>

        {/* ≥1024: one table on the page grid */}
        <SpecTable caption="Refills compared by active, purpose, pH, price and yield" columns={COLUMNS} rows={refills} rowKey={(p) => p.slug} className="hidden lg:grid" />

        {/* <1024: the same data as stacked blocks */}
        <ol className="col-span-12 grid gap-40 lg:hidden">
          {refills.map((p) => (
            <li key={p.slug} className="grid gap-16">
              <Link href={`/range/${p.slug}`} className="grid">
                <span className="type-data text-ink-muted">{p.index}</span>
                <span className="type-h3">{p.name}</span>
              </Link>
              <dl className="grid grid-cols-12 gap-x-20 border-b border-hairline">
                <MetaRow label="Actives" value={<Actives p={p} />} />
                <MetaRow label="For" value={p.purpose.value} />
                <MetaRow label="pH" value={p.ph?.value} measured />
                <MetaRow label="Price" value={`$${p.price.value}`} />
              </dl>
              <AddToBag slug={p.slug} variant="secondary" ariaLabel={`Add to bag, ${p.name}`} />
            </li>
          ))}
        </ol>
      </Section>

      {/* Choosing, at most two */}
      <Section id="choosing" label="Choosing">
        <p className="type-h3 col-span-12 lg:col-span-6">Start with the concern, not the product.</p>
        <ul className="col-span-12 grid grid-cols-subgrid border-b border-hairline">
          {CONCERNS.map((c) => {
            const p = getProduct(c.product)!;
            return (
              <li key={c.concern} className="col-span-12 grid grid-cols-subgrid gap-y-8 border-t border-hairline py-24">
                <span className="type-h4 col-span-12 lg:col-span-6">{c.concern}</span>
                <span className="col-span-12 grid content-start justify-items-start gap-8 lg:col-span-4 lg:col-start-9">
                  <Link href={`/range/${p.slug}`} className="type-data inline-flex min-h-48 items-center gap-8">
                    {p.name}
                    {p.actives.value[0] && <span className="text-green">{p.actives.value[0].pct}</span>} →
                  </Link>
                  <span className="type-body max-w-measure text-ink-muted">{c.note}</span>
                  {c.condition && (
                    <Link href={`/conditions/${c.condition}`} className="type-data inline-flex min-h-48 items-center">
                      Read about the condition →
                    </Link>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* The rule: the brand speaking, centred */}
      <Section id="rule" label="The rule">
        <p className="type-h3 col-span-12 text-center lg:col-span-8 lg:col-start-3">
          Two at once, no more. More actives means more irritation, not more result.
        </p>
      </Section>

      <BuyBar slug="vessel-01" name="Vessel 01" price={65} note="Bought once" />
    </main>
  );
}
