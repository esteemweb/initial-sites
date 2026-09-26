import type { Metadata } from "next";
import Link from "next/link";
import { BuyBar } from "@/components/site/BuyBar";
import { Section } from "@/components/site/Section";
import { Grid } from "@/components/ui/Grid";
import { FAQ } from "@/data/faq";

export const metadata: Metadata = {
  title: "Questions — Corneum",
  description: "The format, the products and orders: every answer on one page, none hidden behind a click.",
};

/* Everything visible: a clinic doesn't hide answers behind clicks. An
   index of questions at the top links to each answer. */
export default function FaqPage() {
  return (
    <main id="content" tabIndex={-1} className="pb-96 outline-none lg:pb-0">
      <Grid as="section" aria-labelledby="faq-title" className="gap-y-24 pt-40 pb-64 lg:pb-96">
        <p className="type-data col-span-12 text-ink-muted">
          {FAQ.reduce((n, g) => n + g.items.length, 0)} questions
        </p>
        <h1 id="faq-title" className="type-display title-rise col-span-12 lg:col-span-8">
          Questions
        </h1>
        <nav aria-label="Questions" className="col-span-12 lg:col-span-4 lg:col-start-9">
          <ol className="border-b border-hairline">
            {FAQ.flatMap((g) => g.items).map((f) => (
              <li key={f.id} className="border-t border-hairline">
                <a href={`#${f.id}`} className="type-body flex min-h-48 items-center justify-between gap-16 py-8">
                  {f.q}
                  <span aria-hidden>↓</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </Grid>

      {FAQ.map((g) => (
        <Section key={g.id} id={g.id} label={g.label}>
          <dl className="col-span-12 grid grid-cols-subgrid border-b border-hairline">
            {g.items.map((f) => (
              <div key={f.id} id={f.id} className="col-span-12 grid scroll-mt-24 grid-cols-subgrid gap-y-16 border-t border-hairline py-24">
                <dt className="type-h4 col-span-12 lg:col-span-6">{f.q}</dt>
                <dd className="col-span-12 grid content-start justify-items-start gap-8 lg:col-span-4 lg:col-start-9">
                  <p className="type-body max-w-measure">{f.a}</p>
                  {f.link && (
                    <Link href={f.link.href} className="type-data inline-flex min-h-48 items-center">
                      {f.link.label} →
                    </Link>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </Section>
      ))}

      <Section id="contact" label="Still asking">
        <p className="type-body col-span-12 max-w-measure text-ink-muted lg:col-span-6">Contact details will be listed here.</p>
      </Section>

      <BuyBar slug="vessel-01" name="Vessel 01" price={65} note="Bought once" />
    </main>
  );
}
