import type { Metadata } from "next";
import { AddToBag } from "@/components/site/AddToBag";
import { BuyBar } from "@/components/site/BuyBar";
import { DoseLine } from "@/components/site/DoseLine";
import { Section } from "@/components/site/Section";
import { Button } from "@/components/ui/Button";
import { Grid } from "@/components/ui/Grid";
import { MetaList, MetaRow } from "@/components/ui/MetaRow";
import { DIRECTIONS } from "@/data/products";

export const metadata: Metadata = {
  title: "How it works — Corneum",
  description:
    "A weighted vessel you buy once. Concentrate refills you buy forever. Pour to collar, fill to line, shake once.",
};

/* The vessel and refill explainer (BRIEF §3, §6, §7, §8). Every figure is
   from the brief. The dose-line drawing is the page's one orchestrated
   moment (the fill rises once when it scrolls into view). */
export default function HowItWorksPage() {
  return (
    <main id="content" tabIndex={-1} className="pb-96 outline-none lg:pb-0">
      <Grid as="section" aria-labelledby="how-title" className="gap-y-24 pt-40 pb-64 lg:pb-96">
        <p className="type-data col-span-12 text-ink-muted">The format</p>
        <h1 id="how-title" className="type-display title-rise col-span-12 lg:col-span-10">
          How it works
        </h1>
        <p className="type-h4 col-span-12 max-w-measure lg:col-span-4 lg:col-start-9">
          A weighted vessel you buy once. Concentrate refills you buy forever.
        </p>
      </Grid>

      <Section id="vessel" label="01 — Buy the vessel once">
        <div className="col-span-12 grid content-start justify-items-start gap-24 lg:col-span-6">
          <p className="type-h3">Heavier than it needs to be, because weight is the argument.</p>
          <AddToBag slug="vessel-01" label="Add Vessel 01 · $65" showQty={false} />
        </div>
        <MetaList>
          <MetaRow label="Size" value="180 × 62 MM" measured />
          <MetaRow label="Body" value="Borosilicate laboratory glass" />
          <MetaRow label="Collar and base" value="Brushed 316 surgical steel" />
          <MetaRow label="Price" value="$65, once" />
        </MetaList>
      </Section>

      <Section id="post" label="02 — Refills come by post">
        <p className="type-h3 col-span-12 lg:col-span-6">Slim enough to post through a letterbox. No courier, no box.</p>
        <MetaList>
          <MetaRow label="Vial" value="30 ML aluminium" measured />
          <MetaRow label="Size" value="95 × 26 MM" measured />
          <MetaRow label="Mailer" value="Flat paper sleeve, batch number only" />
        </MetaList>
      </Section>

      <Section id="mix" label="03 — Mix it">
        <div className="col-span-12 grid content-start gap-24 lg:col-span-4">
          <p className="type-h3">{DIRECTIONS}</p>
          <p className="type-body max-w-measure text-ink-muted">The instruction is the object: one line, etched into the glass at 200 ml.</p>
        </div>
        <div className="col-span-10 col-start-2 md:col-span-6 md:col-start-4 lg:col-span-4 lg:col-start-5">
          <DoseLine />
        </div>
        <dl className="col-span-12 border-b border-hairline lg:col-span-4 lg:col-start-9">
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
      </Section>

      <Section id="use" label="04 — Use it">
        <p className="type-h3 col-span-12 lg:col-span-6">About two months. Then the next vial.</p>
        <p className="type-body col-span-12 max-w-measure text-ink-muted lg:col-span-4 lg:col-start-9">
          Use no more than two products at once. More actives means more irritation, not more result.
        </p>
      </Section>

      <Section id="recycle" label="05 — What to throw away">
        <p className="type-h3 col-span-12 lg:col-span-6">Most shampoo is water. You already have water.</p>
        <MetaList>
          <MetaRow label="Vial" value="Metal recycling" />
          <MetaRow label="Sleeve" value="Paper recycling" />
          <MetaRow label="Tissue, stickers, sachets" value="None sent" />
          <MetaRow label="Refill weight" value="40 G, not 400" measured />
          <MetaRow label="Conventional shampoo" value="80% water" measured />
        </MetaList>
      </Section>

      <Grid as="section" aria-label="Start" className="gap-y-24 border-t border-hairline py-64 lg:py-96">
        <p className="type-h3 col-span-12 lg:col-span-6">Start with the vessel.</p>
        <div className="col-span-12 flex flex-wrap gap-16 lg:col-span-4 lg:col-start-9">
          <AddToBag slug="vessel-01" label="Add Vessel 01 · $65" showQty={false} />
          <Button variant="secondary" href="/range">
            See the range
          </Button>
        </div>
      </Grid>

      <BuyBar slug="vessel-01" name="Vessel 01" price={65} note="Bought once" />
    </main>
  );
}
