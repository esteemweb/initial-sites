import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { AddToBag } from "@/components/site/AddToBag";
import { BuyBar } from "@/components/site/BuyBar";
import { DoseLine } from "@/components/site/DoseLine";
import { VesselNote } from "@/components/site/VesselNote";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/site/Section";
import { Grid } from "@/components/ui/Grid";
import { MetaList, MetaRow } from "@/components/ui/MetaRow";
import { ProductImage } from "@/components/ui/ProductImage";
import { SpecModal, type SpecRow, type SpecSection } from "@/components/ui/SpecModal";
import { DIRECTIONS, getProduct, products, type Product } from "@/data/products";
import { keepCase } from "@/lib/keepCase";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  const actives = p.actives.value.map((a) => `${a.name} ${a.pct}`).join(", ");
  return {
    title: `${p.name} — Corneum`,
    description: `${p.name}: ${actives || p.purpose.value}. $${p.price.value} ${p.priceNote.toLowerCase()}.`,
  };
}


function sheetFor(p: Product): { sections: SpecSection[]; rows: SpecRow[] } {
  const sections: SpecSection[] = [];
  if (p.inci) sections.push({ label: "Full INCI", value: p.inci.value });
  sections.push({
    label: p.kind === "vessel" ? "Handling" : "Contraindications",
    value: (
      <ul className="grid gap-8">
        {p.contraindications.value.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    ),
  });
  if (p.study) {
    const s = p.study.value;
    sections.push({ label: "Clinical study summary", value: `${s.design} ${s.outcome}` });
  }
  const rows: SpecRow[] = [
    ...p.actives.value.map((a) => ({ label: a.name, value: a.pct, measured: true })),
    ...p.specs.map((s) => ({ label: s.label, value: s.value, measured: s.measured })),
  ];
  return { sections, rows };
}

export default async function ProductPage({ params }: Params) {
  const p = getProduct((await params).slug);
  if (!p) notFound();

  const isVessel = p.kind === "vessel";
  const pair = p.pairsWith ? getProduct(p.pairsWith) : undefined;
  const sheet = sheetFor(p);
  const study = p.study?.value;

  return (
    <main id="content" tabIndex={-1} className="pb-96 outline-none lg:pb-0">
      {/* 1 — Stage: name dominant, actives left, product centre, price and bag in the rail */}
      <Grid as="section" aria-labelledby="product-name" className="gap-y-24 pt-40 pb-64 lg:pb-96">
        <p className="type-data col-span-12 text-ink-muted">
          {p.index} / 06 · {isVessel ? "Vessel" : "Refill"}
        </p>
        <h1 id="product-name" className="type-display title-rise col-span-12 lg:col-span-8">
          {p.name}
        </h1>

        <MetaList>
          <MetaRow label={p.purpose.value} value={isVessel ? "180 × 62 MM · about 480 G" : "30 ML · makes 200 ML"} />
        </MetaList>

        <div className="col-span-12 grid content-start gap-24 lg:col-span-4">
          {isVessel ? (
            <p className="type-h3">Borosilicate glass. Surgical steel. No pump.</p>
          ) : (
            p.actives.value.map((a) => (
              <p key={a.name} className="type-h3">
                {a.name} <span className="text-green">{a.pct}</span>
              </p>
            ))
          )}
          <p className="type-h4 max-w-measure">{p.claim.value}</p>
          {study && (
            <Link href="#evidence" className="type-data inline-flex min-h-48 items-center justify-self-start">
              Evidence: n={study.n}, {study.duration} ↓
            </Link>
          )}
        </div>

        <div className="col-span-12 lg:col-span-4 lg:col-start-5">
          {/* Pairs with the card's image: it morphs into place on navigation */}
          <ViewTransition name={`product-${p.slug}`} share="morph" default="none">
            <ProductImage src={p.image.src} alt={p.image.alt} priority />
          </ViewTransition>
        </div>

        <div className="col-span-12 grid content-start justify-items-start gap-24 lg:col-span-4 lg:col-start-9">
          <p className="grid gap-8">
            <span className="type-h4">${p.price.value}</span>
            <span className="type-data text-ink-muted">
              {p.priceNote}
              {!isVessel && " · lasts about two months"}
            </span>
          </p>
          <AddToBag slug={p.slug} />
          {!isVessel && <VesselNote />}
          <SpecModal triggerLabel="Technical sheet" title={`${p.name} — technical sheet`} sections={sheet.sections} rows={sheet.rows} printable />
        </div>
      </Grid>

      {/* 2 — Specification: the lab label, row by row */}
      <Section id="specification" label="Specification">
        <MetaList>
          {p.actives.value.map((a) => (
            <MetaRow key={a.name} label={a.name} value={a.pct} measured />
          ))}
          {p.specs.map((s) => (
            <MetaRow key={s.label} label={s.label} value={s.value} measured={s.measured} />
          ))}
        </MetaList>
      </Section>

      {/* 3 — What it will not do (the brand speaking: centred), then contraindications in the rail */}
      <Section id="limits" label="What it will not do">
        <p className="type-h3 col-span-12 text-center lg:col-span-8 lg:col-start-3">{p.willNot.value}</p>
        <div className="col-span-12 grid gap-16 lg:col-span-4 lg:col-start-9">
          <h3 className="type-data text-ink-muted">{isVessel ? "Handling" : "Contraindications"}</h3>
          <ul className="border-b border-hairline">
            {p.contraindications.value.map((c) => (
              <li key={c} className="type-body max-w-measure border-t border-hairline py-16">
                {c}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 4 — Directions and the dose line: the page's one orchestrated moment */}
      <Section id="directions" label="Directions">
        <div className="col-span-12 grid content-start gap-24 lg:col-span-4">
          <p className="type-h3">{DIRECTIONS}</p>
          <p className="type-body max-w-measure text-ink-muted">
            {isVessel
              ? "Graduations every 25 ml, like a measuring cylinder. The instruction is the object."
              : "Pour one 30 ml refill into Vessel 01. Top up with water to the 200 ml line. The vial goes in the recycling."}
          </p>
        </div>
        <div className="col-span-10 col-start-2 md:col-span-6 md:col-start-4 lg:col-span-4 lg:col-start-5">
          <DoseLine />
        </div>
        <div className="col-span-12 lg:col-span-4 lg:col-start-9">
          <dl className="border-b border-hairline">
            {[
              ["Concentrate", "30 ML"],
              ["Water", "170 ML"],
              ["Makes", "200 ML"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-16 border-t border-hairline py-16">
                <dt className="type-data text-ink-muted">{k}</dt>
                <dd className="type-data text-green">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* 5 — Evidence: study figures as data ornament */}
      {study && (
        <Section id="evidence" label="Evidence">
          {[
            ["Participants", `n=${study.n}`],
            ["Duration", study.duration],
            ["pH", p.ph?.value ?? "—"],
          ].map(([label, value], i) => (
            <div key={label} className={`col-span-12 grid gap-8 lg:col-span-4 ${["", "lg:col-start-5", "lg:col-start-9"][i]}`}>
              <span className="type-h3 font-mono font-regular uppercase text-green">{value}</span>
              <span className="type-data text-ink-muted">{keepCase(label)}</span>
            </div>
          ))}
          <div className="col-span-12 grid gap-16 lg:col-span-4 lg:col-start-9">
            <p className="type-body max-w-measure">{study.design}</p>
            <p className="type-body max-w-measure">{study.outcome}</p>
          </div>
        </Section>
      )}

      {/* 6 — Pairs with: at most one other product */}
      {pair && (
        <Section id="pairs" label="Use with, at most">
          <div className="col-span-6 lg:col-span-3">
            <Card product={pair} />
          </div>
          <p className="type-body col-span-12 max-w-measure text-ink-muted lg:col-span-4 lg:col-start-9">
            Two products at once, no more. More actives means more irritation, not more result.
          </p>
        </Section>
      )}

      <BuyBar slug={p.slug} name={p.name} price={p.price.value} note={p.priceNote} />
    </main>
  );
}
