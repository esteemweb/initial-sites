/* The scalp conditions library. BRIEF §9 names four conditions
   (thinning after pregnancy, seborrhoeic dermatitis, post-menopausal
   density loss, stress shedding); flaking and a sensitised scalp are added
   because the range treats them directly (§5).

   All medical text is DRAFTED for the demo: general, well-established
   dermatology in the brand's voice, round figures only. Every entry is
   tagged `draft` and listed in DATA-NOTES.md for clinical review. */

import type { Source } from "./products";

export type Condition = {
  slug: string;
  index: string;
  name: string;
  clinicalName: string;
  /** One line for the index. */
  summary: string;
  whatItIs: string;
  signs: string[];
  data: { label: string; value: string }[];
  helps: string;
  /** Product slugs, at most two. Empty when nothing we sell helps. */
  products: string[];
  clinicianIf: string[];
  source: Source;
};

const CLINICIAN_ALWAYS = [
  "Hair loss is sudden, or comes out in round patches.",
  "The scalp is painful, weeping, crusting or smells.",
  "You see scarring, or skin where hair no longer grows back.",
  "Hair loss comes with fatigue, weight change or feeling cold.",
];

export const conditions: Condition[] = [
  {
    slug: "flaking",
    index: "01",
    name: "Flaking and build-up",
    clinicalName: "Pityriasis capitis",
    summary: "Dead skin shed faster than it clears. The most common scalp complaint there is.",
    whatItIs:
      "The scalp renews its outer layer continuously. When cells shed faster than they clear, they stick together into visible flakes. It is not caused by poor hygiene.",
    signs: ["Small white or grey flakes on hair and clothing", "Mild itch", "Worse in winter and with infrequent washing"],
    data: [
      { label: "Typical onset", value: "Adolescence onwards" },
      { label: "Course", value: "Comes and goes" },
      { label: "Contagious", value: "No" },
    ],
    helps: "Loosening the scale so it washes away. Salicylic acid does this; wash three times a week and it usually settles within a month.",
    products: ["cleanse"],
    clinicianIf: ["Flakes are thick, yellow and greasy, or the skin underneath is red: that is more likely seborrhoeic dermatitis.", ...CLINICIAN_ALWAYS],
    source: "draft",
  },
  {
    slug: "seborrhoeic-dermatitis",
    index: "02",
    name: "Seborrhoeic dermatitis",
    clinicalName: "Seborrhoeic dermatitis",
    summary: "Inflammation driven by a yeast that lives on everyone's scalp. Chronic, and it relapses.",
    whatItIs:
      "An inflammatory reaction to Malassezia, a yeast normally present on the skin. It is not an infection you caught, and it is not an allergy. It tends to return, so the aim is control, not cure.",
    signs: ["Greasy, yellowish scale", "Red, itchy skin beneath it", "Also at the eyebrows, sides of the nose and behind the ears"],
    data: [
      { label: "Typical onset", value: "Adults, often 20s–50s" },
      { label: "Course", value: "Chronic, relapsing" },
      { label: "Contagious", value: "No" },
    ],
    helps: "An antifungal to bring the yeast down, then keeping scale under control. Reset is a six-week course; Cleanse maintains afterwards.",
    products: ["reset", "cleanse"],
    clinicianIf: ["It spreads beyond the scalp and face, or doesn't improve after a six-week course.", ...CLINICIAN_ALWAYS],
    source: "draft",
  },
  {
    slug: "sensitised-scalp",
    index: "03",
    name: "A sensitised scalp",
    clinicalName: "Sensitive scalp",
    summary: "A scalp that stings, burns or itches with products it used to tolerate.",
    whatItIs:
      "A scalp whose barrier is compromised reacts to things it once handled: fragrance, strong surfactants, acids. Often it follows over-washing, colouring or a harsh treatment.",
    signs: ["Stinging or burning after washing", "Tightness", "Itch without visible flaking"],
    data: [
      { label: "Typical onset", value: "Any age" },
      { label: "Course", value: "Improves as the barrier recovers" },
      { label: "Contagious", value: "No" },
    ],
    helps: "Fewer products, gentler ones, and time for the barrier to repair. Start with Cleanse Mild; add Barrier if it stays tight.",
    products: ["cleanse-mild", "barrier"],
    clinicianIf: ["You see a rash, blisters or swelling after a product: that may be contact dermatitis.", ...CLINICIAN_ALWAYS],
    source: "draft",
  },
  {
    slug: "postpartum-thinning",
    index: "04",
    name: "Thinning after pregnancy",
    clinicalName: "Postpartum telogen effluvium",
    summary: "Heavy shedding a few months after giving birth. Common, temporary, and alarming.",
    whatItIs:
      "Pregnancy holds more hairs in their growth phase. After birth they move into the resting phase together, and fall out together a few months later. The follicles are not damaged.",
    signs: ["Shedding in handfuls, often around the hairline", "Starts two to four months after birth", "No bald patches"],
    data: [
      { label: "Typical onset", value: "2–4 months after birth" },
      { label: "Course", value: "Usually resolves within a year" },
      { label: "Contagious", value: "No" },
    ],
    helps: "Time. We have nothing that speeds it up, and we won't sell you something that claims to.",
    products: [],
    clinicianIf: ["Shedding continues beyond a year, or you also feel exhausted: thyroid and iron levels are worth checking.", ...CLINICIAN_ALWAYS],
    source: "draft",
  },
  {
    slug: "stress-shedding",
    index: "05",
    name: "Stress shedding",
    clinicalName: "Acute telogen effluvium",
    summary: "Diffuse shedding that arrives months after a shock to the system.",
    whatItIs:
      "Illness, surgery, a crash diet or a severe stress can push many hairs into the resting phase at once. They shed around three months later, which is why the cause is easy to miss.",
    signs: ["More hair than usual in the shower and on the brush", "Thinning all over, not in patches", "Starts two to three months after the trigger"],
    data: [
      { label: "Typical onset", value: "2–3 months after a trigger" },
      { label: "Course", value: "Usually settles within 6 months" },
      { label: "Contagious", value: "No" },
    ],
    helps:
      "Removing the trigger, and waiting. Once shedding has stopped, Density may help more follicles into their growth phase. It will not stop the shedding itself.",
    products: ["density"],
    clinicianIf: ["Shedding lasts longer than six months: it may have become chronic, or have another cause.", ...CLINICIAN_ALWAYS],
    source: "draft",
  },
  {
    slug: "post-menopausal-density",
    index: "06",
    name: "Post-menopausal density loss",
    clinicalName: "Female pattern hair loss",
    summary: "Gradual thinning at the crown and parting as hormones change.",
    whatItIs:
      "Follicles gradually shrink and spend less time in their growth phase, so hair becomes finer and sparser, most visibly along the parting. It develops over years.",
    signs: ["A widening parting", "More scalp visible at the crown", "The hairline itself usually holds"],
    data: [
      { label: "Typical onset", value: "Often around menopause" },
      { label: "Course", value: "Gradual, over years" },
      { label: "Contagious", value: "No" },
    ],
    helps:
      "Density may increase the number of follicles in an active growth phase. It will not make hair thicker. A clinician can discuss medical treatments that work differently.",
    products: ["density"],
    clinicianIf: ["Thinning is rapid, or comes with acne or excess facial hair: hormone tests may be needed.", ...CLINICIAN_ALWAYS],
    source: "draft",
  },
];

export const getCondition = (slug: string) => conditions.find((c) => c.slug === slug);
