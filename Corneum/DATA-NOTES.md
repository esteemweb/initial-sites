# Data notes

What on the site comes from `BRIEF.md`, what was drafted for the demo, and what a clinic would flag before launch. Source of truth for the values is `src/data/products.ts`: every field there is tagged `brief` or `draft`.

## From the brief (verbatim)
- All six products, their actives and percentages, and prices: Vessel 01 $65; Cleanse $38; Cleanse Mild $38; Barrier $42; Density $58; Reset $46.
- 30 ml refill makes 200 ml and lasts about two months.
- Cleanse: pH 4.2, batch `C4-2026-0417` (the brief's label example), and the line "If your scalp is already irritated, start with Cleanse Mild or you will make it worse."
- Density: "This will not make your hair thicker…" and "It may increase the number of follicles in an active growth phase."
- Vessel 01: 180 × 62 mm, ~480 g empty, borosilicate glass, brushed 316 steel collar and base, 25 ml graduations, 200 ML line, knurled quarter-turn cap, no pump, and the line "Heavier than it needs to be, because weight is the argument."
- Vial: 30 ml aluminium, 95 × 26 mm. Directions: "Pour to collar. Fill to line. Shake once."
- "Two products at once, no more" follows from §5 ("actively discourages using more than two at once"). The wording is drafted.

## Drafted (check these)
| Field | Products | Notes |
|---|---|---|
| Full INCI | all five refills | Plausible surfactant bases around the stated actives. **Not a real formulation.** |
| pH | Cleanse Mild 5.0, Barrier 5.5, Density 5.5, Reset 6.5 | Only Cleanse's 4.2 is in the brief |
| Batch numbers | all refills except Cleanse | Same `XX-2026-MMDD` pattern as the brief's example |
| Contraindications | all, except Cleanse's first line | Standard cautions for each active (salicylate allergy, azole allergy, pregnancy) |
| Stage claims | Cleanse, Cleanse Mild, Barrier, Reset | Density's claim is from the brief |
| "Will not do" lines | Cleanse Mild, Barrier, Reset | Written in the brief's voice |
| Study figures | all refills | Cleanse uses **n=62, 28 days**, the figures from the build prompt. The others (n=40/28 days, 36/4 weeks, 54/12 weeks, 44/6 weeks) and every outcome sentence are invented. |
| Range chooser concerns | Cleanse, Barrier, Reset rows | Concern wording drafted; Cleanse Mild and Density rows quote the brief |
| Vessel handling notes | Vessel 01 | Drop and heat cautions |
| Water 170 ml | directions | Derived: 200 ml − 30 ml |
| Fill-level geometry | dose-line drawing | Assumes 3 mm walls (56 mm bore), so 200 ml sits ~81 mm above the base. The drawing shows no mm figure for the line. |

## Drafted medical content (step 5): needs clinical review
- **Conditions library** (`src/data/conditions.ts`): every "what it is", sign, onset, course, "what helps" and clinician red-flag line is drafted. The six conditions are the four in brief §9 plus flaking and a sensitised scalp. Figures are round, commonly published ranges only (postpartum shedding starting 2–4 months after birth and resolving within about a year; telogen effluvium starting 2–3 months after a trigger and settling within about 6 months).
- **Hair growth cycle** (`GrowthCycle.tsx`): anagen 2–7 years, catagen 2–3 weeks, telogen about 3 months, as commonly published.
- **Actives mechanisms** (`/science`): one-line pharmacology per active is drafted. Percentages and product mapping are from the brief.
- **Postpartum thinning** deliberately recommends no product ("Time. We have nothing that speeds it up.").

## Drafted (step 7)
- **FAQ** (`src/data/faq.ts`): most answers quote or condense the brief. Drafted: "Can I use my own bottle?", "Where should I start?", "Can I stay on Reset?".
- **Founder page**: the brief's §2 sentences only. No quotes attributed to her, no portrait.
- **How it works**: brief figures only. Recycling routes (vial → metal, sleeve → paper) follow from §7–8.

## Imagery
- **Vessel 01 (the home-page flight and the product image) is a 3D render, not AI and not a photograph.** It is modelled procedurally in Blender to the brief's §6 dimensions and rendered in Cycles (`render/vessel.py`, see `render/README.md`). The fill height uses the 56 mm bore assumption (200 ml ≈ 81 mm up). The flight shows the vessel empty until it fills in the pin, and the hero still is its first frame.
- The other six images in `public/images/` (five vials and the scalp macro) are **AI-generated**, not photographs of a real product. Nano Banana Pro (via the `agy` CLI) made the originals. Vessel 01, Cleanse and Barrier were then recomposed with Higgsfield Seedream 5.0 Flash (0.5 credits each) to fit the shadow. Locally: backgrounds levelled to pure white, cropped to 4:5, and the right 14% faded to white so shadows don't end on a hard edge.
- **Share cards** reuse these images and print the same data (price, actives, percentages). They regenerate on every build, so they stay in sync with `src/data/products.ts`.
- The vial labels print the site's data, including **drafted pH and batch numbers** for every refill except Cleanse. If those values change, the images need regenerating.

## Flags a clinic would raise
1. **Ketoconazole 2% (Reset)** is prescription-only in the US; 1% is the OTC strength. Selling 2% direct would need a prescription pathway or a different strength.
2. **"Follicle stimulation" (Density)** is a structure/function claim that moves a cosmetic toward drug territory under FDA rules. The site keeps the brief's wording.
3. **Dose line height.** Brief §6 says the dose line is etched "200mm from the base" on a 180 mm vessel. The site describes it as the 200 ML fill line, per decision, and gives no height.
4. **No contact channel.** The brief gives no email, phone or address for customers. The FAQ says "Contact details will be listed here."
5. **Study figures are invented** (see above). Every claim on the site links to its evidence section, so this data has to be real before launch.
