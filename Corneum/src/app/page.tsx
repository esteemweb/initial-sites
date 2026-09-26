import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AddToBag } from "@/components/site/AddToBag";
import { BuyBar } from "@/components/site/BuyBar";
import { ReadingLine } from "@/components/site/ReadingLine";
import { VesselPin } from "@/components/site/VesselPin";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/site/Section";
import { Grid } from "@/components/ui/Grid";
import { MetaList, MetaRow } from "@/components/ui/MetaRow";
import { getProduct, products } from "@/data/products";

export const metadata: Metadata = {
  title: "Corneum — clinical scalp care",
  description:
    "Scalp care formulated the way skincare is formulated for the face. A glass-and-steel vessel you buy once, 30 ml concentrate refills with every active and percentage on the front.",
};


/* BRIEF §4, one blunt line each (the last from §2). */
const AGAINST = [
  { term: "Wellness", line: "No adaptogens, no rituals. This is not a mood." },
  { term: "Vagueness", line: "A brand that won't state the concentration has a low concentration." },
  { term: "Hope", line: "No volumising, no thickening. Nobody can promise those." },
  { term: "Beige minimalism", line: "The product of a clinic, not a lifestyle." },
];

/* BRIEF §9: what the people who buy it are dealing with. */
const CONDITIONS = [
  { slug: "postpartum-thinning", name: "Thinning after pregnancy" },
  { slug: "seborrhoeic-dermatitis", name: "Seborrhoeic dermatitis" },
  { slug: "post-menopausal-density", name: "Post-menopausal density loss" },
  { slug: "stress-shedding", name: "Stress shedding" },
];

export default function Home() {
  const vessel = getProduct("vessel-01")!;

  return (
    <main id="content" tabIndex={-1} className="pb-96 outline-none lg:pb-0">
      {/* 1 — Hero: the premise as the dominant element; the vessel, its price and the bag in the rail */}
      <Grid as="section" aria-labelledby="home-title" className="gap-y-24 pt-40 pb-64 lg:pb-96">
        <p className="type-data col-span-12 text-ink-muted">Clinical scalp care · Boston</p>
        {/* Staggered: line two starts at col 3, so the grid breaks diagonally */}
        <h1 id="home-title" className="col-span-12 grid grid-cols-subgrid">
          <span className="type-display title-rise col-span-12">Hair is dead.</span>
          <span className="type-display title-rise title-rise-2 col-span-10 col-start-3">The scalp is alive.</span>
        </h1>

        <p className="type-h4 col-span-12 max-w-measure pt-24 lg:col-span-4">
          Formulated for the scalp the way skincare is formulated for the face.
        </p>

        <div className="col-span-12 lg:col-span-4 lg:col-start-5 lg:row-span-2">
          {/* Vessel 01 at rest: the first frame of its flight into the pin
              (VesselFlight). The canvas takes over from this still once it has
              drawn; without motion or JS the still simply stays. */}
          <div data-vessel-anchor="hero" className="relative aspect-4/5 w-full">
            <Image
              data-vessel-still
              src="/frames/flight/lg/0001.webp"
              alt={vessel.image.alt}
              fill
              priority
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="rounded-none object-cover"
            />
          </div>
        </div>

        <div className="col-span-12 grid content-start justify-items-start gap-24 lg:col-span-4 lg:col-start-9 lg:pt-24">
          <p className="grid gap-8">
            <span className="type-data">Vessel 01</span>
            <span className="type-h4">$65</span>
            <span className="type-data text-ink-muted">Bought once · refills from $38</span>
          </p>
          <div className="flex flex-wrap gap-16">
            <AddToBag slug="vessel-01" label="Add Vessel 01" showQty={false} />
            <Button variant="secondary" href="/how-it-works">
              How it works
            </Button>
          </div>
          <dl className="grid gap-8">
            <div className="flex gap-16">
              <dt className="type-data text-ink-muted">One refill</dt>
              <dd className="type-data text-green">30 ML → 200 ML</dd>
            </div>
            <div className="flex gap-16">
              <dt className="type-data text-ink-muted">Weighs</dt>
              <dd className="type-data text-green">40 G, not 400</dd>
            </div>
          </dl>
        </div>
      </Grid>

      {/* 2 — The premise: the brand speaking, so it is centred */}
      <Section id="premise" label="The premise">
        <ReadingLine
          text="You cannot fix hair. You can only change the skin it grows from."
          className="type-h3 col-span-12 text-center lg:col-span-8 lg:col-start-3"
        />
      </Section>

      {/* 3 — Vessel 01, pinned: the page's one orchestrated moment */}
      <section aria-labelledby="vessel-label" className="border-t border-hairline pt-64 lg:pt-96">
        <Grid>
          <h2 id="vessel-label" className="type-data col-span-12">
            Vessel 01
          </h2>
        </Grid>
        <VesselPin />
      </section>

      {/* 4 — The format */}
      <Section id="format" label="The format">
        <p className="type-h3 col-span-12 lg:col-span-6">Most shampoo is water. You already have water.</p>
        <MetaList>
          <MetaRow label="Conventional shampoo" value="80% water" measured />
          <MetaRow label="Corneum refill" value="40 G, not 400" measured />
          <MetaRow label="One refill" value="30 ML makes 200 ML" measured />
          <MetaRow label="Lasts" value="About two months" />
          <MetaRow label="Packaging" value="Aluminium and paper. No plastic." />
        </MetaList>
      </Section>

      {/* 5 — The range: the one card design */}
      <Section id="range" label="The range">
        <p className="type-body col-span-12 max-w-measure lg:col-span-4 lg:col-start-9">
          Six products. Deliberately few. Use no more than two at once.
        </p>
        {products.map((p) => (
          <div key={p.slug} className="col-span-6 lg:col-span-4">
            <Card product={p} />
          </div>
        ))}
      </Section>

      {/* 6 — What it stands against */}
      <Section id="against" label="What it stands against">
        <ul className="col-span-12 grid grid-cols-subgrid border-b border-hairline">
          {AGAINST.map((a) => (
            <li key={a.term} className="col-span-12 grid grid-cols-subgrid gap-y-8 border-t border-hairline py-24">
              <span className="type-h4 col-span-12 lg:col-span-6">{a.term}</span>
              <span className="type-body col-span-12 max-w-measure lg:col-span-4 lg:col-start-9">{a.line}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* 7 — Who made it */}
      <Section id="founder" label="Who made it">
        <div className="col-span-12 grid content-start justify-items-start gap-24 lg:col-span-6">
          <p className="type-h3">Dr Elena Vasquez-Moreau. Trichologist.</p>
          <p className="type-body max-w-measure">
            Fourteen years in a dermatology practice on Commonwealth Avenue, writing compounding prescriptions for
            patients whose $60 shampoo was making them worse.
          </p>
          <Button variant="secondary" href="/founder">
            The founder
          </Button>
        </div>
        <MetaList>
          <MetaRow label="Founded" value="2021" measured />
          <MetaRow label="In practice" value="14 years" measured />
          <MetaRow label="City" value="Boston" />
        </MetaList>
      </Section>

      {/* 8 — Conditions library, previewed */}
      <Section id="conditions" label="Scalp conditions">
        <p className="type-h4 col-span-12 max-w-measure lg:col-span-6">Read about the condition before you buy anything for it.</p>
        <ul className="col-span-12 border-b border-hairline lg:col-span-4 lg:col-start-9 lg:row-start-2">
          {CONDITIONS.map((c) => (
            <li key={c.slug} className="border-t border-hairline">
              <Link href={`/conditions/${c.slug}`} className="type-body flex min-h-48 items-center justify-between gap-16 py-8">
                {c.name}
                <span aria-hidden>→</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <BuyBar slug="vessel-01" name="Vessel 01" price={65} note="Bought once" />
    </main>
  );
}
