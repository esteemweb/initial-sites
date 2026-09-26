/* The range. Every value is tagged with where it came from:
   `brief`  — stated in BRIEF.md, reproduced verbatim.
   `draft`  — written for the demo because the brief doesn't state it.
   DATA-NOTES.md lists every draft value for review. */

export type Source = "brief" | "draft";
export type Sourced<T> = { value: T; source: Source };

const b = <T,>(value: T): Sourced<T> => ({ value, source: "brief" });
const d = <T,>(value: T): Sourced<T> => ({ value, source: "draft" });

export type Active = { name: string; pct: string };

export type Study = {
  n: number;
  duration: string;
  design: string;
  outcome: string;
};

export type Product = {
  slug: string;
  index: string;
  kind: "vessel" | "refill";
  name: string;
  purpose: Sourced<string>;
  price: Sourced<number>;
  priceNote: string;
  actives: Sourced<Active[]>;
  /** One sentence for the stage. Links to the evidence section. */
  claim: Sourced<string>;
  ph?: Sourced<string>;
  batch?: Sourced<string>;
  specs: { label: string; value: string; measured?: boolean; source: Source }[];
  inci?: Sourced<string>;
  contraindications: Sourced<string[]>;
  willNot: Sourced<string>;
  study?: Sourced<Study>;
  pairsWith?: string;
  image: { src?: string; alt: string };
};

const REFILL_SPECS = (ph: Sourced<string>, batch: Sourced<string>) => [
  { label: "pH", value: ph.value, measured: true, source: ph.source },
  { label: "Concentrate", value: "30 ML", measured: true, source: "brief" as Source },
  { label: "Makes", value: "200 ML", measured: true, source: "brief" as Source },
  { label: "Lasts", value: "About two months", source: "brief" as Source },
  { label: "Vial", value: "Aluminium · 95 × 26 MM", source: "brief" as Source },
  { label: "Batch", value: batch.value, source: batch.source },
];

export const products: Product[] = [
  {
    slug: "vessel-01",
    index: "01",
    kind: "vessel",
    name: "Vessel 01",
    purpose: b("Refillable vessel, glass and steel"),
    price: b(65),
    priceNote: "Bought once",
    actives: b([]),
    claim: b("Heavier than it needs to be, because weight is the argument."),
    specs: [
      { label: "Height", value: "180 MM", measured: true, source: "brief" },
      { label: "Diameter", value: "62 MM", measured: true, source: "brief" },
      { label: "Weight, empty", value: "About 480 G", measured: true, source: "brief" },
      { label: "Body", value: "Borosilicate laboratory glass", source: "brief" },
      { label: "Collar and base", value: "Brushed 316 surgical steel", source: "brief" },
      { label: "Graduations", value: "Every 25 ML", measured: true, source: "brief" },
      { label: "Dose line", value: "200 ML", measured: true, source: "brief" },
      { label: "Cap", value: "Quarter-turn, knurled steel", source: "brief" },
      { label: "Pump", value: "None. Corneum pours.", source: "brief" },
    ],
    contraindications: d([
      "Borosilicate glass is tough, not unbreakable. Do not drop it onto stone or tile.",
      "Do not heat the vessel, and do not put it in a dishwasher above 60°C.",
    ]),
    willNot: b("No pump. Pumps are plastic, they fail, and they can't be recycled. Corneum pours."),
    image: {
      src: "/images/vessel-01.jpg",
      alt: "Vessel 01: a clear, thick-walled glass cylinder with a brushed steel collar, base and cap, etched with fine graduation marks and a 200 ML line.",
    },
  },
  {
    slug: "cleanse",
    index: "02",
    kind: "refill",
    name: "Cleanse",
    purpose: b("Scalp exfoliation"),
    price: b(38),
    priceNote: "Per refill",
    actives: b([{ name: "Salicylic acid", pct: "4.0%" }]),
    claim: d("Visibly less flaking after 28 days of use."),
    ph: b("4.2"),
    batch: b("C4-2026-0417"),
    specs: [],
    inci: d(
      "Aqua, Sodium Cocoyl Isethionate, Cocamidopropyl Betaine, Salicylic Acid, Sodium Lauroyl Methyl Isethionate, Glycerin, Citric Acid, Sodium Hydroxide, Xanthan Gum, Phenoxyethanol, Ethylhexylglycerin.",
    ),
    contraindications: {
      value: [
        "If your scalp is already irritated, start with Cleanse Mild or you will make it worse.",
        "Do not use on broken skin, open lesions or a scalp that is actively bleeding.",
        "Not for children under 12. Avoid if you are allergic to salicylates, including aspirin.",
      ],
      source: "draft",
    },
    willNot: b(
      "Cleanse contains 4% salicylic acid. That's a clinical concentration. If your scalp is already irritated, start with Cleanse Mild or you will make it worse.",
    ),
    study: d({
      n: 62,
      duration: "28 days",
      design: "Open-label use study, adults with visible scalp flaking, three washes a week.",
      outcome: "Clinician-graded flaking fell on 49 of 62 scalps. Seven participants stopped early because of irritation.",
    }),
    pairsWith: "barrier",
    image: {
      src: "/images/cleanse.jpg",
      alt: "Cleanse refill: a slim brushed-aluminium vial printed in black, with the active percentage in green.",
    },
  },
  {
    slug: "cleanse-mild",
    index: "03",
    kind: "refill",
    name: "Cleanse Mild",
    purpose: b("Sensitised scalps"),
    price: b(38),
    priceNote: "Per refill",
    actives: b([{ name: "Salicylic acid", pct: "0.5%" }]),
    claim: d("Exfoliates a reactive scalp without the sting of a clinical concentration."),
    ph: d("5.0"),
    batch: d("CM-2026-0409"),
    specs: [],
    inci: d(
      "Aqua, Sodium Cocoyl Isethionate, Coco-Glucoside, Glycerin, Salicylic Acid, Panthenol, Allantoin, Citric Acid, Xanthan Gum, Phenoxyethanol, Ethylhexylglycerin.",
    ),
    contraindications: d([
      "Do not use on broken skin or open lesions.",
      "Avoid if you are allergic to salicylates, including aspirin.",
    ]),
    willNot: d(
      "Cleanse Mild will not clear heavy scaling. It exists for a scalp that can't yet tolerate 4%. When it can, move to Cleanse.",
    ),
    study: d({
      n: 40,
      duration: "28 days",
      design: "Open-label use study, adults who reported stinging from standard exfoliating shampoos.",
      outcome: "Two of 40 participants reported stinging. None stopped early.",
    }),
    pairsWith: "barrier",
    image: {
      src: "/images/cleanse-mild.jpg",
      alt: "Cleanse Mild refill: a slim brushed-aluminium vial printed in black, with the active percentage in green.",
    },
  },
  {
    slug: "barrier",
    index: "04",
    kind: "refill",
    name: "Barrier",
    purpose: b("Moisture barrier repair"),
    price: b(42),
    priceNote: "Per refill",
    actives: b([
      { name: "Niacinamide", pct: "3.0%" },
      { name: "Panthenol", pct: "1.0%" },
    ]),
    claim: d("Measurably less water lost through the scalp after four weeks."),
    ph: d("5.5"),
    batch: d("BR-2026-0322"),
    specs: [],
    inci: d(
      "Aqua, Decyl Glucoside, Niacinamide, Glycerin, Panthenol, Sodium Lauroyl Sarcosinate, Ceramide NP, Sodium PCA, Citric Acid, Xanthan Gum, Phenoxyethanol, Ethylhexylglycerin.",
    ),
    contraindications: d([
      "Stop if you develop persistent redness or flushing.",
      "Barrier repairs. It does not treat infection. See a clinician for a scalp that is weeping or crusting.",
    ]),
    willNot: d(
      "Barrier will not stop itching caused by fungus or dermatitis. It repairs the skin's water barrier, which is a narrower claim, and one we can measure.",
    ),
    study: d({
      n: 36,
      duration: "4 weeks",
      design: "Before-and-after measurement of transepidermal water loss at the crown.",
      outcome: "Water loss fell in 29 of 36 participants. The average reduction was modest, and we say so.",
    }),
    pairsWith: "cleanse",
    image: {
      src: "/images/barrier.jpg",
      alt: "Barrier refill: a slim brushed-aluminium vial printed in black, with the active percentages in green.",
    },
  },
  {
    slug: "density",
    index: "05",
    kind: "refill",
    name: "Density",
    purpose: b("Follicle stimulation"),
    price: b(58),
    priceNote: "Per refill",
    actives: b([
      { name: "Caffeine", pct: "5.0%" },
      { name: "Peptide complex", pct: "2.0%" },
    ]),
    claim: b("It may increase the number of follicles in an active growth phase."),
    ph: d("5.5"),
    batch: d("DN-2026-0301"),
    specs: [],
    inci: d(
      "Aqua, Caffeine, Coco-Glucoside, Glycerin, Butylene Glycol, Acetyl Tetrapeptide-3, Biotinoyl Tripeptide-1, Trifolium Pratense Flower Extract, Citric Acid, Xanthan Gum, Phenoxyethanol, Ethylhexylglycerin.",
    ),
    contraindications: d([
      "Not a treatment for sudden or patchy hair loss. See a clinician first.",
      "Not tested in pregnancy or while breastfeeding.",
    ]),
    willNot: b(
      "This will not make your hair thicker. Nothing makes hair thicker. It may increase the number of follicles in an active growth phase, which is a different claim, and the one we can support.",
    ),
    study: d({
      n: 54,
      duration: "12 weeks",
      design: "Phototrichogram at a marked site, before and after, daily use.",
      outcome: "The share of follicles in active growth rose in 31 of 54 participants. Hair diameter did not change.",
    }),
    pairsWith: "cleanse-mild",
    image: {
      src: "/images/density.jpg",
      alt: "Density refill: a slim brushed-aluminium vial printed in black, with the active percentages in green.",
    },
  },
  {
    slug: "reset",
    index: "06",
    kind: "refill",
    name: "Reset",
    purpose: b("Intensive six-week course"),
    price: b(46),
    priceNote: "Per refill",
    actives: b([{ name: "Ketoconazole", pct: "2.0%" }]),
    claim: d("A six-week course, then stop."),
    ph: d("6.5"),
    batch: d("RS-2026-0226"),
    specs: [],
    inci: d(
      "Aqua, Sodium Laureth Sulfate, Ketoconazole, Cocamide MEA, Glycerin, Sodium Chloride, Imidurea, Citric Acid, Sodium Hydroxide, Phenoxyethanol.",
    ),
    contraindications: d([
      "Six weeks, then stop. It is a course, not a routine.",
      "Do not use in pregnancy or while breastfeeding without medical advice.",
      "Avoid if you are allergic to ketoconazole or other azole antifungals.",
    ]),
    willNot: d("Reset is not for daily use. Six weeks, then stop. If the problem returns, see a clinician, not a second course."),
    study: d({
      n: 44,
      duration: "6 weeks",
      design: "Open-label course, adults with clinician-diagnosed seborrhoeic dermatitis, twice weekly.",
      outcome: "Scaling and redness improved in 35 of 44 participants. Five relapsed within a month of stopping.",
    }),
    pairsWith: "barrier",
    image: {
      src: "/images/reset.jpg",
      alt: "Reset refill: a slim brushed-aluminium vial printed in black, with the active percentage in green.",
    },
  },
];

// Refills share one spec layout.
for (const p of products) {
  if (p.kind === "refill" && p.ph && p.batch) p.specs = REFILL_SPECS(p.ph, p.batch);
}

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const DIRECTIONS = "Pour to collar. Fill to line. Shake once.";

/* The range page's chooser: a concern, and the one product for it.
   Purposes come from BRIEF §5; the concern wording is drafted (DATA-NOTES.md). */
export type Concern = { concern: string; product: string; note: string; condition?: string; source: Source };

export const CONCERNS: Concern[] = [
  { concern: "Flaking and build-up", product: "cleanse", note: "Scalp exfoliation at a clinical 4%.", condition: "flaking", source: "draft" },
  {
    concern: "A sensitised or already irritated scalp",
    product: "cleanse-mild",
    note: "Start here. 4% on an irritated scalp will make it worse.",
    condition: "sensitised-scalp",
    source: "brief",
  },
  { concern: "A dry, tight scalp", product: "barrier", note: "Moisture barrier repair.", condition: "sensitised-scalp", source: "draft" },
  {
    concern: "Density loss",
    product: "density",
    note: "It will not make hair thicker. It may increase the follicles in active growth.",
    condition: "post-menopausal-density",
    source: "brief",
  },
  {
    concern: "Diagnosed seborrhoeic dermatitis",
    product: "reset",
    note: "A six-week course, then stop.",
    condition: "seborrhoeic-dermatitis",
    source: "draft",
  },
];
