// Aftercare guides. General advice, not medical advice; written for this
// fictional studio in our own words.

export type Guide = {
  slug: string;
  ja: string;
  title: string;
  summary: string;
  readMinutes: number;
  sections: { heading: string; body: string[] }[];
};

export const timeline = [
  { when: "Day 0", what: "Leave the film on for the hours your artist told you. Wash with lukewarm water and unscented soap, pat dry, thin layer of ointment." },
  { when: "Days 1–3", what: "Wash twice a day. Expect redness, a little weeping and tenderness. No soaking, no sun, no gym." },
  { when: "Days 4–10", what: "Peeling and itching. Do not pick. Moisturise lightly; loose clothing over the piece." },
  { when: "Weeks 2–4", what: "Surface healed; the skin underneath is still settling. Sunscreen from now on, forever." },
];

export const guides: Guide[] = [
  {
    slug: "tebori-and-machine",
    ja: "手彫り",
    title: "Healing tebori versus machine work",
    summary: "Hand-poked skin heals a little differently. What to expect from each, and why the first week can look worse than it is.",
    readMinutes: 4,
    sections: [
      {
        heading: "The first three days",
        body: [
          "Machine work tends to be redder and more swollen on day one because the needles hit the skin thousands of times a minute. Tebori is slower and the punctures are individual, so the area usually looks calmer at first but weeps a little longer, especially where colour was packed.",
          "Either way: wash twice a day, thin ointment, nothing tight over the area. If you were wrapped in second-skin film, leave it for the time your artist told you and take it off in the shower.",
        ],
      },
      {
        heading: "Peeling",
        body: [
          "Both methods peel between day four and day ten. Tebori shading peels in finer flakes; machine colour can come off in larger sheets that look alarming and take pigment with them. Neither is a problem. Do not pick, do not scrub, do not soak.",
        ],
      },
      {
        heading: "Colour settling",
        body: [
          "Tebori colour looks dull for three to four weeks and then clears as the top layer of skin renews. Machine colour looks brighter sooner. By six weeks they are the same, and the difference you will see for the rest of your life is in the softness of the gradients, not the brightness.",
        ],
      },
    ],
  },
  {
    slug: "large-pieces",
    ja: "背中",
    title: "Back pieces, sleeves and sessions a month apart",
    summary: "How to live with a piece that is healing in one place while the next session is being planned in another.",
    readMinutes: 5,
    sections: [
      {
        heading: "Healing in layers",
        body: [
          "A back piece is tattooed in layers: outline, black, colour, touch-ups. Each session goes over skin that healed a month ago. That skin is fine to work on; skin from the last two weeks is not. That is why sessions are spaced the way they are, and why we will move a date if the previous session is still healing.",
        ],
      },
      {
        heading: "Sleeping and sitting",
        body: [
          "Back and thigh work makes sleeping awkward for a few nights. Clean sheets, loose cotton, and a towel under you if the piece is still weeping. For the first three days after a back session, avoid chairs with hard backs and avoid rucksacks.",
          "Sleeves: keep the arm out of bath water and out of the sun. Long sleeves in loose fabric, not tight compression.",
        ],
      },
      {
        heading: "Between sessions",
        body: [
          "Once the surface has healed, treat the area like any skin: moisturise, sunscreen, no sunburn before the next date. A sunburnt back cannot be tattooed, and we will send you home. Eat and sleep well the day before; sessions are long.",
          "The piece tracker shows what is planned for the next session and roughly how long it will take. Read it before you come so you know what will be sore afterwards.",
        ],
      },
    ],
  },
  {
    slug: "summer",
    ja: "夏",
    title: "Summer, sea and sun",
    summary: "Yokohama summers are hot and wet. Healing through July and August is possible; here is how.",
    readMinutes: 3,
    sections: [
      {
        heading: "Sweat",
        body: [
          "Sweat itself is not a problem; sitting in it is. Rinse the area with plain water when you come in, pat dry, and change out of damp clothes. Skip the gym for the first ten days regardless of season.",
        ],
      },
      {
        heading: "Sea, pools, onsen",
        body: [
          "None for two weeks. Not the sea, not the pool, not the onsen, not a long bath. Soaking opens the healing skin and pulls pigment out. Showers are fine and encouraged.",
        ],
      },
      {
        heading: "Sun",
        body: [
          "No sun on the piece for two weeks, then sunscreen every time it is uncovered, for life. Sun is what fades tattoos; a healed piece kept out of the sun in its first summer will look better at ten years than one that was not.",
        ],
      },
    ],
  },
  {
    slug: "when-to-call",
    ja: "連絡",
    title: "When to message the studio",
    summary: "Most healing looks worse than it is. These are the signs that are not normal, and what to do.",
    readMinutes: 2,
    sections: [
      {
        heading: "Normal",
        body: [
          "Redness that fades over three days. Clear or slightly yellow weeping in the first two days. Itching, flaking, dullness, a little bruising around dense black.",
        ],
      },
      {
        heading: "Message us the same day",
        body: [
          "Redness that spreads outward after day three. Heat in the skin, swelling that gets worse, thick or green discharge, a fever, or red lines running away from the piece. Send a photograph in daylight and we will tell you whether to see a doctor. If in doubt, see a doctor first and tell us after.",
        ],
      },
      {
        heading: "Touch-ups",
        body: [
          "If a spot heals patchy, wait six weeks and send us a photograph. One touch-up session within three months is included in every piece.",
        ],
      },
    ],
  },
];

export function getGuide(slug: string) {
  return guides.find((g) => g.slug === slug);
}
