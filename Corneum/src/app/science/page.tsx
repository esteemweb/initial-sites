import type { Metadata } from "next";
import Link from "next/link";
import { BuyBar } from "@/components/site/BuyBar";
import { GrowthCycle } from "@/components/site/GrowthCycle";
import { Section } from "@/components/site/Section";
import { SkinSection } from "@/components/site/SkinSection";
import { Grid } from "@/components/ui/Grid";
import { MetaList, MetaRow } from "@/components/ui/MetaRow";
import { SpecTable, type SpecColumn } from "@/components/ui/SpecTable";
import { getProduct } from "@/data/products";

export const metadata: Metadata = {
  title: "The science — Corneum",
  description:
    "Hair is dead; the scalp is skin. What the stratum corneum is, how the growth cycle works, and what each Corneum active does, at what percentage.",
};

/* What each active does. Mechanisms are drafted, general pharmacology
   (DATA-NOTES.md); percentages and products are from BRIEF §5. */
type ActiveRow = { name: string; pct: string; does: string; product: string };
const ACTIVES: ActiveRow[] = [
  { name: "Salicylic acid", pct: "4.0%", does: "A beta hydroxy acid. Loosens the bonds between dead cells so scale washes away.", product: "cleanse" },
  { name: "Salicylic acid", pct: "0.5%", does: "The same mechanism at a dose a sensitised scalp can tolerate.", product: "cleanse-mild" },
  { name: "Niacinamide", pct: "3.0%", does: "Supports the lipids that hold water in the outer layer.", product: "barrier" },
  { name: "Panthenol", pct: "1.0%", does: "Draws water into the skin and calms it.", product: "barrier" },
  { name: "Caffeine", pct: "5.0%", does: "Studied for its effect on the follicle's growth phase.", product: "density" },
  { name: "Peptide complex", pct: "2.0%", does: "Signalling peptides aimed at the follicle environment.", product: "density" },
  { name: "Ketoconazole", pct: "2.0%", does: "An antifungal. Reduces Malassezia, the yeast behind seborrhoeic dermatitis.", product: "reset" },
];

const COLUMNS: SpecColumn<ActiveRow>[] = [
  { key: "active", header: "Active", place: "col-span-2 col-start-1", cell: (a) => <span className="type-data">{a.name}</span> },
  { key: "pct", header: "%", place: "col-span-1 col-start-3", cell: (a) => <span className="type-data text-green">{a.pct}</span> },
  { key: "does", header: "What it does", place: "col-span-5 col-start-4", cell: (a) => <span className="type-body">{a.does}</span> },
  {
    key: "product",
    header: "In",
    place: "col-span-4 col-start-9",
    cell: (a) => (
      <Link href={`/range/${a.product}`} className="type-data inline-flex min-h-48 items-center">
        {getProduct(a.product)?.name} →
      </Link>
    ),
  },
];

export default function SciencePage() {
  return (
    <main id="content" tabIndex={-1} className="pb-96 outline-none lg:pb-0">
      <Grid as="section" aria-labelledby="science-title" className="gap-y-24 pt-40 pb-64 lg:pb-96">
        <p className="type-data col-span-12 text-ink-muted">The argument</p>
        <h1 id="science-title" className="type-display title-rise col-span-12 lg:col-span-8">
          The science
        </h1>
        <p className="type-h4 col-span-12 max-w-measure lg:col-span-4 lg:col-start-9">
          Hair care treats hair. Hair is dead. The scalp is skin, and it&apos;s alive.
        </p>
      </Grid>

      {/* The stratum corneum */}
      <Section id="layer" label="01 — The outer layer">
        <div className="col-span-12 grid content-start gap-24 lg:col-span-4">
          <p className="type-h3">Stratum corneum.</p>
          <p className="type-body max-w-measure">
            The outermost layer of skin, and the name of the company. On the face it gets serums and actives at stated
            concentrations. On the scalp it usually gets conditioner.
          </p>
          <p className="type-body max-w-measure">
            You cannot fix hair. You can only change the skin it grows from. Hair improves as a consequence.
          </p>
        </div>
        <div className="col-span-12 md:col-span-8 md:col-start-3 lg:col-span-4 lg:col-start-5">
          <SkinSection />
        </div>
      </Section>

      {/* The growth cycle */}
      <Section id="cycle" label="02 — The growth cycle">
        <div className="col-span-12 grid content-start gap-24 lg:col-span-4">
          <p className="type-h3">Every follicle cycles.</p>
          <p className="type-body max-w-measure">
            Growth, a short transition, then rest. After rest the hair falls and a new one starts. A shock to the
            system pushes many follicles into rest at once, which is why shedding appears months after its cause.
          </p>
          <Link href="/conditions/stress-shedding" className="type-data inline-flex min-h-48 items-center justify-self-start">
            Stress shedding →
          </Link>
        </div>
        <div className="col-span-12 md:col-span-8 md:col-start-3 lg:col-span-4 lg:col-start-5">
          <GrowthCycle />
        </div>
        <p className="type-body col-span-12 max-w-measure text-ink-muted lg:col-span-4 lg:col-start-9">
          Density&apos;s claim is about this cycle: more follicles in the growth phase. Not thicker hair.
        </p>
      </Section>

      {/* The actives */}
      <Section id="actives" label="03 — The actives">
        <p className="type-body col-span-12 max-w-measure text-ink-muted lg:col-span-4 lg:col-start-9">
          Every active is named with its percentage on the front of the vial. A brand that won&apos;t state the
          concentration has a low concentration.
        </p>
        <SpecTable caption="Corneum actives, their concentration and what they do" columns={COLUMNS} rows={ACTIVES} rowKey={(a) => a.name + a.pct} className="hidden lg:grid" />
        <ol className="col-span-12 grid gap-40 lg:hidden">
          {ACTIVES.map((a) => (
            <li key={a.name + a.pct} className="grid gap-16">
              <p className="type-h4">
                {a.name} <span className="text-green">{a.pct}</span>
              </p>
              <p className="type-body max-w-measure">{a.does}</p>
              <Link href={`/range/${a.product}`} className="type-data inline-flex min-h-48 items-center justify-self-start">
                In {getProduct(a.product)?.name} →
              </Link>
            </li>
          ))}
        </ol>
      </Section>

      {/* pH and concentrate */}
      <Section id="format" label="04 — pH and concentrate">
        <p className="type-h3 col-span-12 lg:col-span-6">Most shampoo is water. You already have water.</p>
        <MetaList>
          <MetaRow label="Cleanse pH" value="4.2" measured />
          <MetaRow label="Conventional shampoo" value="80% water" measured />
          <MetaRow label="Corneum refill" value="40 G, not 400" measured />
          <MetaRow label="One refill" value="30 ML makes 200 ML" measured />
        </MetaList>
      </Section>

      {/* What we won't claim: the brand speaking, centred */}
      <Section id="wont" label="05 — What we won't claim">
        <p className="type-h3 col-span-12 text-center lg:col-span-8 lg:col-start-3">
          No volumising, no thickening, no reversing. Nothing makes hair thicker.
        </p>
      </Section>

      <BuyBar slug="vessel-01" name="Vessel 01" price={65} note="Bought once" />
    </main>
  );
}
