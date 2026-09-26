/**
 * `/the-label` — the brand story.
 *
 * The one page that sustains the loud register end to end (§11), because it is
 * the brand talking about itself. Kept as data so the prose can be edited
 * without touching a component.
 *
 * Every factual claim is checked against `data/products.ts`: Portugal for the
 * cotton and the printing, 200gsm at the light end and 420 at the heavy one,
 * eight colourways, screen print and embroidery only.
 */

export interface LabelSection {
  marker: string;
  heading: string;
  paragraphs: string[];
  /** The process shot that sits with this section, if it has one. */
  image?: { caption: string; ratio?: string };
}

export const LABEL_INTRO = [
  "PULP is a printing operation that happens to make clothes. That order matters. Most labels design a garment and then work out what to put on it; we start at the press, with what a screen can actually lay down, and cut the clothes to carry it.",
  "Everything here is printed one colour at a time in runs of a few hundred, in fluorescent inks that were never meant to be subtle. When a run is gone it is gone. There is no core range, no seasonal repeat, no restock of the colour you missed.",
];

export const LABEL_SECTIONS: LabelSection[] = [
  {
    marker: "The press",
    heading: "One colour per pass.",
    paragraphs: [
      "Screen printing works by pushing ink through a mesh, one colour at a time, with the garment sitting still between passes. Every extra colour is another screen, another pass, another chance for the registration to drift by a millimetre. Most brands solve that by printing four colours as a photograph and calling it a graphic.",
      "We do the opposite. One or two inks, laid flat and thick, the way a risograph or a gig poster does it. The colour sits on top of the cotton rather than soaking into it, which is why a fluorescent pink stays fluorescent instead of going dusty pink after a wash.",
      "It also means the ink you see is the ink in the tin. Nothing is simulated by mixing dots, so there is no version of these colours that a screen can render and a shirt cannot.",
    ],
    image: {
      caption:
        "A flood coat of fluorescent pink pulled across the screen before the print stroke.",
    },
  },
  {
    marker: "The cloth",
    heading: "Nothing thin enough to see through.",
    paragraphs: [
      "Thick ink on thin cotton is a bad combination. The print goes stiff, the fabric goes slack around it, and within a few washes you have a panel of plastic hanging off a t-shirt. Weight is not a luxury feature here, it is what stops the print destroying the garment.",
      "Nothing starts below 200gsm. The Riso Tee sits at 240, the Press Crew at 380, and the Studio Hoodie at 420. Heavy enough to hold a flood of ink flat, cut boxy and wide so the print has somewhere to sit.",
      "The trade is that these take longer to dry and are genuinely too warm in August. We are not going to pretend otherwise.",
    ],
    image: {
      caption:
        "Loopback cotton at 420gsm, open loops visible on the reverse before it is cut.",
    },
  },
  {
    marker: "The run",
    heading: "A few hundred, then the screens come down.",
    paragraphs: [
      "A screen has a working life. Once a run is finished the emulsion is stripped, the mesh is reclaimed, and that frame becomes the next design. Reprinting something means starting from the film again, which is expensive enough that we would rather make something new.",
      "So every colourway is a few hundred units and then nothing. That is not scarcity marketing, it is the arithmetic of a small press. It also means the eight colours in the range now are the eight colours in the range now.",
      "Three of them share their names with the inks this website is built from, which is not a coincidence. The site and the clothes come off the same press.",
    ],
  },
  {
    marker: "The make",
    heading: "Printed where it is sewn.",
    paragraphs: [
      "Cotton is knitted, woven, cut, sewn and printed in northern Portugal, in the mills around Porto. Keeping the printing in the same building as the sewing is the unusual part — most labels print onto finished blanks shipped in from somewhere else, and a blank is a compromise somebody else already made for you.",
      "Printing where the garment is made means the ink goes down on panels cut to our spec, on cloth we chose, before the side seams close. Prints can run off the edge of a panel and across a seam because the panel is flat when it happens.",
      "Thirty pieces across five groups, and no more than that at any one time. When a run sells through it leaves the list rather than joining a queue for reprinting, and something else takes the slot. The number stays flat because the press does.",
    ],
    image: {
      caption:
        "Cut panels stacked at the print table, squared up and waiting for the first colour.",
      ratio: "aspect-square",
    },
  },
];
