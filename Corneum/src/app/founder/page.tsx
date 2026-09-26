import type { Metadata } from "next";
import { BuyBar } from "@/components/site/BuyBar";
import { Section } from "@/components/site/Section";
import { Grid } from "@/components/ui/Grid";
import { MetaList, MetaRow } from "@/components/ui/MetaRow";

export const metadata: Metadata = {
  title: "The founder — Corneum",
  description:
    "Dr Elena Vasquez-Moreau, trichologist. Fourteen years in a dermatology practice on Commonwealth Avenue, Boston. Founded Corneum in 2021.",
};

/* Built only from BRIEF §2 and §13. No portrait (the brief rules out model
   imagery and there is no likeness to use) and no invented quotes: the
   story is told in the third person, in the brief's own sentences. */
export default function FounderPage() {
  return (
    <main id="content" tabIndex={-1} className="pb-96 outline-none lg:pb-0">
      <Grid as="section" aria-labelledby="founder-title" className="gap-y-24 pt-40 pb-64 lg:pb-96">
        <p className="type-data col-span-12 text-ink-muted">The founder</p>
        <h1 id="founder-title" className="type-display title-rise col-span-12 lg:col-span-10">
          Dr Elena Vasquez-Moreau
        </h1>
        <p className="type-h4 col-span-12 max-w-measure lg:col-span-4 lg:col-start-9">Trichologist. Boston.</p>
        <MetaList>
          <MetaRow label="Discipline" value="Trichology" />
          <MetaRow label="In practice" value="14 years" measured />
          <MetaRow label="Where" value="Commonwealth Avenue, Boston" />
          <MetaRow label="Founded Corneum" value="2021" measured />
        </MetaList>
      </Grid>

      <Section id="practice" label="01 — The practice">
        <p className="type-h3 col-span-12 lg:col-span-6">Fourteen years in a dermatology practice.</p>
        <p className="type-body col-span-12 max-w-measure lg:col-span-4 lg:col-start-9">
          Treating the scalp conditions the industry pretends don&apos;t exist, in a practice on Commonwealth Avenue.
        </p>
      </Section>

      <Section id="reason" label="02 — The reason">
        <p className="type-h3 col-span-12 lg:col-span-6">Prescriptions for a problem the shampoo was causing.</p>
        <p className="type-body col-span-12 max-w-measure lg:col-span-4 lg:col-start-9">
          She got tired of writing compounding prescriptions for patients whose $60 shampoo was making them worse.
        </p>
      </Section>

      <Section id="city" label="03 — The city">
        <p className="type-h3 col-span-12 lg:col-span-6">A research city, not a wellness city.</p>
        <p className="type-body col-span-12 max-w-measure lg:col-span-4 lg:col-start-9">
          Boston matters. This is the product of a clinic, not a lifestyle.
        </p>
      </Section>

      {/* The one rule: the brand speaking, centred */}
      <Section id="rule" label="The one rule">
        <p className="type-h3 col-span-12 text-center lg:col-span-8 lg:col-start-3">
          Would a clinic do this? If the answer is no, it doesn&apos;t ship.
        </p>
      </Section>

      <BuyBar slug="vessel-01" name="Vessel 01" price={65} note="Bought once" />
    </main>
  );
}
