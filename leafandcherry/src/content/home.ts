/* Homepage copy. Shape borrowed from autopsy §9; words are our own. */

/* The label band the hero collapses into on scroll (autopsy §15.4). */
export const HERO_STRIP = [
  "Roasted in Colombo",
  "Grown above Ella",
  "Within 200 km of the cup",
] as const;

export const AUDIENCES = [
  "People who drink it black",
  "People who don't, and shouldn't be judged",
  "Cafés who want the same bag twice",
] as const;

export const STATEMENT = {
  heading: "Sri Lanka has grown coffee for two hundred years. Almost none of it stayed here.",
  body: [
    "The leaf blight of 1869 took the plantations and the British replaced them with tea. What survived went into export sacks and left. For a century the good stuff was something you read about.",
    "We buy from eleven smallholders in Ella and the Knuckles range, roast it in Colombo, and sell most of it within four weeks. Nothing leaves the island unless you ask nicely.",
  ],
} as const;

export const LOTS = [
  {
    lead: "Lot 01",
    label: "Ella · 1,340 m",
    title: "Bird's-eye Chinna",
    body:
      "Washed, dried twelve days on raised beds. Jasmine, tamarind, and a finish like wet bark. Picked in January, roasted the Tuesday after it landed.",
    badge: "Single farm",
    notes: "Tasting notes",
    image: "/images/photo-lot-birds-eye-chinna.webp",
    imageAlt:
      "Coffee cherries drying in a single layer on a raised mesh bed, with a wooden rake at one edge.",
  },
  {
    lead: "Lot 02",
    label: "Knuckles · 1,105 m",
    title: "Hunasgiriya Natural",
    body:
      "Nineteen days on the bed, turned by hand. Stewed plum, cocoa nib, and a long sweetness that outstays the cup. Our most argued-about coffee.",
    badge: "Roasted 12 Sep",
    notes: "Tasting notes",
    image: "/images/photo-lot-hunasgiriya-natural.webp",
    imageAlt:
      "Naturally processed coffee cherries part-dried on a raised bed beside a woven basket.",
  },
  {
    lead: "Lot 03",
    label: "House · blend",
    title: "Two Houses",
    body:
      "Sixty per cent Ella, forty per cent Knuckles. The one we drink at six in the morning before anyone else is awake, which is the only real endorsement.",
    badge: "Medium",
    notes: "Tasting notes",
    image: "/images/photo-lot-two-houses.webp",
    imageAlt:
      "Freshly roasted whole beans and a metal scoop on a scratched steel roasting tray.",
  },
] as const;

export const HOUSES = [
  {
    lead: "01",
    label: "Colombo",
    title: "The roaster is behind glass, and it is loud.",
    body:
      "Drum Lane. A 15 kg drum roaster, a counter, and eleven stools. We roast Tuesday and Friday mornings; if you come then, you will have to speak up. Everything on the shelf was roasted in this room within the last fortnight.",
    meta: ["Tue–Sun, 7am–5pm", "42 Drum Lane, Colombo 03", "No bookings"],
  },
  {
    lead: "02",
    label: "Ella",
    title: "Hill country quiet, and no music at all.",
    body:
      "Passara Road, forty minutes from the farms. Six tables, a long window, and the coffee that did not need to travel. We do not play music here. People have asked us to. We have thought about it.",
    meta: ["Daily, 7am–4pm", "Passara Road, Ella 90090", "Cash or card"],
  },
] as const;
