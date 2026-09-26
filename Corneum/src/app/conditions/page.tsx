import type { Metadata } from "next";
import Link from "next/link";
import { BuyBar } from "@/components/site/BuyBar";
import { Section } from "@/components/site/Section";
import Image from "next/image";
import { Grid } from "@/components/ui/Grid";
import { conditions } from "@/data/conditions";

export const metadata: Metadata = {
  title: "Scalp conditions — Corneum",
  description:
    "A library of common scalp conditions: what they are, what you'll see, how long they last, what helps, and when to see a clinician.",
};

export default function ConditionsIndex() {
  return (
    <main id="content" tabIndex={-1} className="pb-96 outline-none lg:pb-0">
      <Grid as="section" aria-labelledby="conditions-title" className="gap-y-24 pt-40 pb-64 lg:pb-96">
        <p className="type-data col-span-12 text-ink-muted">Library · 0{conditions.length} conditions</p>
        <h1 id="conditions-title" className="type-display title-rise col-span-12 lg:col-span-8">
          Scalp conditions
        </h1>
        <p className="type-h4 col-span-12 max-w-measure lg:col-span-4 lg:col-start-9">
          Read about the condition before you buy anything for it.
        </p>
        {/* Clinical macro, radius 0, full grid width */}
        <div className="relative col-span-12 aspect-16/9">
          <Image
            src="/images/scalp-macro.jpg"
            alt="Macro photograph of a scalp at trichoscopy magnification: individual hairs emerging from follicle openings along a parting, on pale skin."
            fill
            sizes="100vw"
            className="rounded-none object-cover"
          />
        </div>
      </Grid>

      <Section id="library" label="The library">
        <ol className="col-span-12 grid grid-cols-subgrid border-b border-hairline">
          {conditions.map((c) => (
            <li key={c.slug} className="col-span-12 border-t border-hairline">
              <Link href={`/conditions/${c.slug}`} className="grid-page -mx-20 gap-y-8 py-24">
                <span className="col-span-12 grid content-start lg:col-span-6">
                  <span className="type-data text-ink-muted">{c.index}</span>
                  <span className="type-h3">{c.name}</span>
                </span>
                <span className="col-span-12 grid content-start gap-8 lg:col-span-4 lg:col-start-9">
                  <span className="type-body max-w-measure">{c.summary}</span>
                  <span className="type-data text-ink-muted">
                    {c.data.find((d) => d.label === "Course")?.value} →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
        <p className="type-data col-span-12 text-ink-muted lg:col-span-6">
          General information, not a diagnosis. If you are unsure what you have, see a clinician first.
        </p>
      </Section>

      <BuyBar slug="vessel-01" name="Vessel 01" price={65} note="Bought once" />
    </main>
  );
}
