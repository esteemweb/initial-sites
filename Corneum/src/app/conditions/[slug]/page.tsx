import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BuyBar } from "@/components/site/BuyBar";
import { Section } from "@/components/site/Section";
import { Card } from "@/components/ui/Card";
import { Grid } from "@/components/ui/Grid";
import { MetaList, MetaRow } from "@/components/ui/MetaRow";
import { conditions, getCondition } from "@/data/conditions";
import { getProduct } from "@/data/products";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return conditions.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const c = getCondition((await params).slug);
  if (!c) return {};
  return { title: `${c.name} — Corneum`, description: c.summary };
}

export default async function ConditionPage({ params }: Params) {
  const c = getCondition((await params).slug);
  if (!c) notFound();
  const related = c.products.map((s) => getProduct(s)).filter((p) => p !== undefined);

  return (
    <main id="content" tabIndex={-1} className="pb-96 outline-none lg:pb-0">
      {/* Stage */}
      <Grid as="section" aria-labelledby="condition-name" className="gap-y-24 pt-40 pb-64 lg:pb-96">
        <p className="type-data col-span-12 text-ink-muted">
          {c.index} / 0{conditions.length} · Condition
        </p>
        <h1 id="condition-name" className="type-display title-rise col-span-12 lg:col-span-10">
          {c.name}
        </h1>
        <MetaList>
          <MetaRow label="Clinical name" value={c.clinicalName} />
        </MetaList>
        <p className="type-h4 col-span-12 max-w-measure lg:col-span-6">{c.whatItIs}</p>
        <div className="col-span-12 grid content-start gap-16 lg:col-span-4 lg:col-start-9">
          <h2 className="type-data text-ink-muted">What you&apos;ll see</h2>
          <ul className="border-b border-hairline">
            {c.signs.map((s) => (
              <li key={s} className="type-body border-t border-hairline py-16">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </Grid>

      {/* Data */}
      <Section id="course" label="Course">
        <MetaList>
          {c.data.map((d) => (
            <MetaRow key={d.label} label={d.label} value={d.value} />
          ))}
        </MetaList>
      </Section>

      {/* What helps: honest, including when the answer is nothing we sell */}
      <Section id="helps" label="What helps">
        <p className="type-h3 col-span-12 lg:col-span-6">{c.helps}</p>
        {related.length > 0 ? (
          <>
            {related.map((p) => (
              <div key={p.slug} className="col-span-6 lg:col-span-3 lg:col-start-auto">
                <Card product={p} />
              </div>
            ))}
            <p className="type-body col-span-12 max-w-measure text-ink-muted lg:col-span-4 lg:col-start-9">
              Two products at once, no more. More actives means more irritation, not more result.
            </p>
          </>
        ) : (
          <p className="type-body col-span-12 max-w-measure text-ink-muted lg:col-span-4 lg:col-start-9">
            Nothing in the range is recommended for this.
          </p>
        )}
      </Section>

      {/* See a clinician: always visible, never collapsed */}
      <Section id="clinician" label="See a clinician if">
        <ul className="col-span-12 border-b border-hairline lg:col-span-8">
          {c.clinicianIf.map((s) => (
            <li key={s} className="type-h4 border-t border-hairline py-24">
              {s}
            </li>
          ))}
        </ul>
        <p className="type-data col-span-12 text-ink-muted lg:col-span-4 lg:col-start-9">
          General information, not a diagnosis.
        </p>
      </Section>

      <BuyBar slug="vessel-01" name="Vessel 01" price={65} note="Bought once" />
    </main>
  );
}
