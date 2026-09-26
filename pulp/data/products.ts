// PULP — product catalogue
// This file is content. Do not invent, extend or replace entries.
// Stock is held per colourway per size. Sold-out and low-stock states
// are derived from these numbers, never hard-coded.

export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "ONE";

export type Category =
  | "t-shirts"
  | "sweats"
  | "outerwear"
  | "trousers"
  | "accessories";

export type FitVerdict = "runs-small" | "true-to-size" | "runs-large";

/**
 * Spec marks. Each maps to one drawn mark and one text equivalent.
 *
 * Three groups, in card priority order: fit, then print, then fabric
 * (DESIGN.md §4). A product carries exactly one code from each group.
 */
export type SpecCode =
  | "fit-boxy"
  | "fit-relaxed"
  | "fit-slim"
  | "screen-print"
  | "embroidered"
  | "no-print"
  | "heavy-jersey"
  | "loopback"
  | "twill"
  | "ribbed"
  | "canvas";

export const SPEC_LABELS: Record<SpecCode, string> = {
  "fit-boxy": "Boxy fit",
  "fit-relaxed": "Relaxed fit",
  "fit-slim": "Slim fit",
  "screen-print": "Screen printed",
  embroidered: "Embroidered",
  "no-print": "No print",
  "heavy-jersey": "Heavy jersey",
  loopback: "Loopback cotton",
  twill: "Cotton twill",
  ribbed: "Ribbed knit",
  canvas: "Cotton canvas",
};

export interface Colourway {
  slug: string;
  name: string;
  /** True garment colour. Content, not brand palette. */
  hex: string;
}

export interface Review {
  author: string;
  date: string; // ISO
  rating: 1 | 2 | 3 | 4 | 5;
  fit: FitVerdict;
  title: string;
  body: string;
}

export interface Measurement {
  size: Size;
  chest?: number; // cm, flat
  length?: number; // cm
  waist?: number; // cm, flat
  inseam?: number; // cm
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number; // GBP
  gsm: number | null; // null for yarn-led accessories
  composition: string;
  origin: string;
  strapline: string; // brand voice, display use
  description: string; // plain, Inter, sentence case
  spec: SpecCode[];
  colourways: Colourway[];
  sizes: Size[];
  /** stock[colourwaySlug][size] */
  stock: Record<string, Partial<Record<Size, number>>>;
  measurements: Measurement[];
  reviews: Review[];
  restocked?: boolean;
}

// Shared colourways — the same ink across products keeps the swatch language
// consistent. Three of these share a name with an interface ink on purpose:
// the clothes come off the same press.
const FLUORO: Colourway = { slug: "fluoro", name: "Fluoro", hex: "#FF2D6F" };
const VOLT: Colourway = { slug: "volt", name: "Volt", hex: "#D9FF00" };
const ULTRA: Colourway = { slug: "ultra", name: "Ultra", hex: "#1B4DFF" };
const TANGERINE: Colourway = {
  slug: "tangerine",
  name: "Tangerine",
  hex: "#FF6A13",
};
const VIOLET: Colourway = { slug: "violet", name: "Violet", hex: "#7B2CFF" };
const LIME: Colourway = { slug: "lime", name: "Lime", hex: "#4CE600" };
const CHALK: Colourway = { slug: "chalk", name: "Chalk", hex: "#F6F1E4" };
const JET: Colourway = { slug: "jet", name: "Jet", hex: "#111111" };

const APPAREL: Size[] = ["XS", "S", "M", "L", "XL", "XXL"];
const ONE_SIZE: Size[] = ["ONE"];

export const PRODUCTS: Product[] = [  {
    id: "PL-01",
    slug: "riso-tee",
    name: "Riso Tee",
    category: "t-shirts",
    price: 42,
    gsm: 240,
    composition: "100% organic cotton",
    origin: "Knitted and printed in Portugal",
    strapline: "TOUCH GRASS.",
    description:
      "A boxy 240gsm tee with TOUCH GRASS printed across the whole back in heavy condensed capitals, sitting on a thick halftone band of grass. Screen printed one colour at a time. Pre-shrunk, ribbed collar that holds its shape.",
    spec: ["fit-boxy", "screen-print", "heavy-jersey"],
    colourways: [FLUORO, ULTRA, CHALK],
    sizes: APPAREL,
    stock: {
      fluoro: { XS: 14, S: 26, M: 33, L: 19, XL: 8, XXL: 3 },
      ultra: { XS: 9, S: 21, M: 0, L: 24, XL: 15, XXL: 5 },
      chalk: { XS: 2, S: 12, M: 18, L: 9, XL: 0, XXL: 1 },
    },
    measurements: [
      { size: "XS", chest: 51, length: 65 },
      { size: "S", chest: 54, length: 67 },
      { size: "M", chest: 57, length: 70 },
      { size: "L", chest: 60, length: 72 },
      { size: "XL", chest: 63, length: 74 },
      { size: "XXL", chest: 66, length: 76 },
    ],
    reviews: [
      {
        author: "Noor H.",
        date: "2026-08-19",
        rating: 5,
        fit: "true-to-size",
        title: "The pink is properly loud",
        body: "Photos do not do it justice, it is genuinely fluorescent. Medium fits exactly like the measurements say and the print has not cracked after a month of wearing it.",
      },
      {
        author: "Jonah R.",
        date: "2026-07-30",
        rating: 4,
        fit: "runs-large",
        title: "Size down if you want it fitted",
        body: "Boxy means boxy. I went large and it is roomy, which I wanted, but a medium would have been closer to a normal fit.",
      },
      {
        author: "Elif K.",
        date: "2026-06-22",
        rating: 5,
        fit: "true-to-size",
        title: "Bought a second one",
        body: "Washes well at 30, no fading worth mentioning. The collar is the bit that usually goes on a cheap tee and this one still sits flat.",
      },
    ],
  },  {
    id: "PL-02",
    slug: "baby-tee",
    name: "Baby Tee",
    category: "t-shirts",
    price: 34,
    gsm: 200,
    composition: "95% organic cotton, 5% elastane",
    origin: "Knitted and printed in Portugal",
    strapline: "SEEN. NOT REPLIED.",
    description:
      "A cropped slim tee at 200gsm with a small typing-indicator bubble printed at the centre front, three dots and no message coming. Fine ribbed collar, cap sleeves, cut close.",
    spec: ["fit-slim", "screen-print", "heavy-jersey"],
    colourways: [VIOLET, LIME, JET],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: {
      violet: { XS: 11, S: 17, M: 22, L: 10, XL: 4 },
      lime: { XS: 6, S: 14, M: 19, L: 7, XL: 2 },
      jet: { XS: 8, S: 20, M: 25, L: 13, XL: 6 },
    },
    measurements: [
      { size: "XS", chest: 38, length: 40 },
      { size: "S", chest: 41, length: 42 },
      { size: "M", chest: 44, length: 44 },
      { size: "L", chest: 47, length: 46 },
      { size: "XL", chest: 50, length: 48 },
    ],
    reviews: [
      {
        author: "Mina A.",
        date: "2026-08-05",
        rating: 5,
        fit: "runs-small",
        title: "Take one up",
        body: "It is a baby tee so it is meant to be tight, but I went up a size and it sits much better. The violet is brilliant.",
      },
      {
        author: "Cass D.",
        date: "2026-07-11",
        rating: 4,
        fit: "runs-small",
        title: "Good, short",
        body: "Shorter in the body than I expected. Fine on me but worth knowing before you order.",
      },
    ],
  },  {
    id: "PL-03",
    slug: "studio-hoodie",
    name: "Studio Hoodie",
    category: "sweats",
    price: 98,
    gsm: 420,
    composition: "80% organic cotton, 20% recycled polyester",
    origin: "Knitted and printed in Portugal",
    strapline: "NEVER CATCHING UP.",
    description:
      "420gsm loopback cotton carrying a single enormous notification badge across the back, reading 99+. Nothing else on it. Double-layer hood, kangaroo pocket, ribbed cuffs and hem.",
    spec: ["fit-boxy", "screen-print", "loopback"],
    colourways: [JET, TANGERINE, CHALK],
    sizes: APPAREL,
    stock: {
      jet: { XS: 6, S: 15, M: 23, L: 18, XL: 11, XXL: 4 },
      tangerine: { XS: 4, S: 11, M: 17, L: 13, XL: 7, XXL: 2 },
      chalk: { XS: 3, S: 9, M: 0, L: 10, XL: 5, XXL: 1 },
    },
    measurements: [
      { size: "XS", chest: 56, length: 64 },
      { size: "S", chest: 59, length: 66 },
      { size: "M", chest: 62, length: 68 },
      { size: "L", chest: 65, length: 70 },
      { size: "XL", chest: 68, length: 72 },
      { size: "XXL", chest: 71, length: 74 },
    ],
    reviews: [
      {
        author: "Danielle O.",
        date: "2026-08-21",
        rating: 5,
        fit: "true-to-size",
        title: "Worth the money",
        body: "Heaviest hoodie I own by a distance. It stands up on its own and it has not sagged at the pocket, which every other one I have owned did.",
      },
      {
        author: "Sam W.",
        date: "2026-08-02",
        rating: 5,
        fit: "runs-large",
        title: "Huge, in a good way",
        body: "Very boxy and cropped at the hem. If you want it to sit normally take a size down.",
      },
      {
        author: "Ren T.",
        date: "2026-07-15",
        rating: 4,
        fit: "true-to-size",
        title: "Print is thick",
        body: "The back print is properly opaque, you can feel it. Wash it inside out and it will be fine.",
      },
      {
        author: "Kofi B.",
        date: "2026-06-30",
        rating: 5,
        fit: "true-to-size",
        title: "Tangerine is the one",
        body: "Bought the orange and it is much brighter in person. Zero complaints.",
      },
    ],
    restocked: true,
  },  {
    id: "PL-04",
    slug: "press-crew",
    name: "Press Crew",
    category: "sweats",
    price: 88,
    gsm: 380,
    composition: "100% organic cotton",
    origin: "Knitted and embroidered in Portugal",
    strapline: "NINE HOURS AND TWELVE MINUTES.",
    description:
      "A 380gsm loopback crew printed with a week of usage as a bar chart, seven bars climbing to a daily average nobody wants to see. Reads as pure graphic from a distance and as an accusation up close.",
    spec: ["fit-relaxed", "screen-print", "loopback"],
    colourways: [CHALK, VIOLET, ULTRA],
    sizes: APPAREL,
    stock: {
      chalk: { XS: 8, S: 19, M: 26, L: 17, XL: 10, XXL: 3 },
      violet: { XS: 5, S: 13, M: 20, L: 14, XL: 8, XXL: 2 },
      ultra: { XS: 7, S: 16, M: 22, L: 15, XL: 9, XXL: 4 },
    },
    measurements: [
      { size: "XS", chest: 54, length: 62 },
      { size: "S", chest: 57, length: 64 },
      { size: "M", chest: 60, length: 66 },
      { size: "L", chest: 63, length: 68 },
      { size: "XL", chest: 66, length: 70 },
      { size: "XXL", chest: 69, length: 72 },
    ],
    reviews: [
      {
        author: "Isla M.",
        date: "2026-08-09",
        rating: 5,
        fit: "true-to-size",
        title: "Better than the hoodie for layering",
        body: "Same weight, no hood bunching under a jacket. The embroidery is small and neat rather than a logo slapped on.",
      },
      {
        author: "Bo E.",
        date: "2026-07-03",
        rating: 5,
        fit: "true-to-size",
        title: "Collar holds",
        body: "Three months in and the neck has not stretched at all.",
      },
    ],
  },  {
    id: "PL-05",
    slug: "coach-jacket",
    name: "Coach Jacket",
    category: "outerwear",
    price: 115,
    gsm: 320,
    composition: "100% organic cotton twill",
    origin: "Woven and printed in Portugal",
    strapline: "FIVE SECONDS OF YOUR LIFE.",
    description:
      "A 320gsm cotton twill coach jacket with an oversized SKIP AD button printed across the back, countdown included. Snap front, elasticated cuffs, unlined.",
    spec: ["fit-relaxed", "screen-print", "twill"],
    colourways: [JET, ULTRA],
    sizes: APPAREL,
    stock: {
      jet: { XS: 5, S: 12, M: 18, L: 14, XL: 8, XXL: 3 },
      ultra: { XS: 3, S: 8, M: 13, L: 10, XL: 0, XXL: 1 },
    },
    measurements: [
      { size: "XS", chest: 56, length: 66 },
      { size: "S", chest: 59, length: 68 },
      { size: "M", chest: 62, length: 70 },
      { size: "L", chest: 65, length: 72 },
      { size: "XL", chest: 68, length: 74 },
      { size: "XXL", chest: 71, length: 76 },
    ],
    reviews: [
      {
        author: "Marcus L.",
        date: "2026-08-16",
        rating: 5,
        fit: "true-to-size",
        title: "Exactly what I wanted",
        body: "Proper coach jacket cut, not slim. Snaps are solid and the print across the back is huge.",
      },
      {
        author: "Yuki N.",
        date: "2026-07-19",
        rating: 4,
        fit: "runs-large",
        title: "Roomy",
        body: "Fits over a hoodie easily, which I think is the idea. On its own it is quite a lot of jacket.",
      },
    ],
  },  {
    id: "PL-06",
    slug: "utility-cargo",
    name: "Utility Cargo",
    category: "trousers",
    price: 108,
    gsm: 300,
    composition: "100% organic cotton twill",
    origin: "Woven and sewn in Portugal",
    strapline: "DO NOT PERCEIVE ME.",
    description:
      "Relaxed cargo trousers in 300gsm twill, wide through the leg, with DO NOT PERCEIVE ME printed small and low on the left thigh where only people already looking will find it. Flap pockets on both sides that actually hold things.",
    spec: ["fit-relaxed", "screen-print", "twill"],
    colourways: [JET, CHALK, LIME],
    sizes: APPAREL,
    stock: {
      jet: { XS: 6, S: 16, M: 22, L: 17, XL: 10, XXL: 3 },
      chalk: { XS: 4, S: 11, M: 16, L: 12, XL: 7, XXL: 2 },
      lime: { XS: 2, S: 7, M: 12, L: 9, XL: 4, XXL: 1 },
    },
    measurements: [
      { size: "XS", waist: 36, inseam: 74 },
      { size: "S", waist: 39, inseam: 75 },
      { size: "M", waist: 42, inseam: 76 },
      { size: "L", waist: 45, inseam: 77 },
      { size: "XL", waist: 48, inseam: 78 },
      { size: "XXL", waist: 51, inseam: 79 },
    ],
    reviews: [
      {
        author: "Kwame A.",
        date: "2026-08-14",
        rating: 5,
        fit: "true-to-size",
        title: "Wide and stays wide",
        body: "No taper at all, which is what I wanted. The adjuster tabs mean the waist actually fits.",
      },
      {
        author: "Hannah P.",
        date: "2026-07-08",
        rating: 4,
        fit: "runs-large",
        title: "Take the smaller waist",
        body: "Between sizes I went up and had to pull the tabs all the way in. Go down.",
      },
    ],
  },  {
    id: "PL-07",
    slug: "six-panel-cap",
    name: "Six-Panel Cap",
    category: "accessories",
    price: 38,
    gsm: 300,
    composition: "100% organic cotton twill",
    origin: "Made in Portugal",
    strapline: "OFFLINE.",
    description:
      "A six-panel cap in 300gsm twill with a struck-through wifi symbol embroidered on the front panel in a single tonal thread. Structured crown, curved brim, no other branding anywhere on it.",
    spec: ["fit-relaxed", "embroidered", "twill"],
    colourways: [JET, VOLT],
    sizes: ONE_SIZE,
    stock: {
      jet: { ONE: 24 },
      volt: { ONE: 3 },
    },
    measurements: [],
    reviews: [
      {
        author: "Tam S.",
        date: "2026-08-11",
        rating: 5,
        fit: "true-to-size",
        title: "Actually unstructured",
        body: "Sits flat rather than standing up off the head. Strap has plenty of adjustment.",
      },
    ],
  },  {
    id: "PL-08",
    slug: "flat-tote",
    name: "Flat Tote",
    category: "accessories",
    price: 28,
    gsm: 400,
    composition: "100% organic cotton canvas",
    origin: "Woven and printed in Portugal",
    strapline: "ACCEPTS EVERYTHING.",
    description:
      "A 400gsm cotton canvas tote printed with a cookie consent banner and its ACCEPT ALL button, which is the only button anyone has ever pressed. Flat webbing handles, no gusset, squares off when it is full.",
    spec: ["fit-boxy", "screen-print", "canvas"],
    colourways: [CHALK, ULTRA],
    sizes: ONE_SIZE,
    stock: {
      chalk: { ONE: 31 },
      ultra: { ONE: 2 },
    },
    measurements: [],
    reviews: [
      {
        author: "Jo M.",
        date: "2026-07-21",
        rating: 5,
        fit: "true-to-size",
        title: "Holds a laptop and a shop",
        body: "Canvas is thick enough that it does not collapse when empty. Handles are wide so they do not cut in.",
      },
      {
        author: "Alex V.",
        date: "2026-06-14",
        rating: 4,
        fit: "true-to-size",
        title: "Print is crisp",
        body: "One colour, sharp edges, no cracking after a few washes.",
      },
    ],
  },
  {
    id: "PL-09",
    slug: "long-sleeve",
    name: "Long Sleeve",
    category: "t-shirts",
    price: 45,
    gsm: 260,
    composition: "100% organic cotton",
    origin: "Cut and made in Portugal",
    strapline: "NOTHING ON IT.",
    description:
      "A relaxed long-sleeve tee at 260gsm with ribbed cuffs and a flat ribbed collar. No print, no mark, nothing at all. The one in the range you can wear to see family.",
    spec: ["fit-relaxed", "no-print", "heavy-jersey"],
    colourways: [CHALK, JET],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    stock: {
      chalk: { XS: 12, S: 24, M: 31, L: 22, XL: 11, XXL: 4 },
      jet: { XS: 2, S: 9, M: 14, L: 7, XL: 0, XXL: 1 },
    },
    measurements: [
      { size: "XS", chest: 53, length: 68 },
      { size: "S", chest: 56, length: 70 },
      { size: "M", chest: 59, length: 73 },
      { size: "L", chest: 62, length: 75 },
      { size: "XL", chest: 65, length: 77 },
      { size: "XXL", chest: 68, length: 79 },
    ],
    reviews: [
      {
        author: "Yusuf A.",
        date: "2026-08-30",
        rating: 5,
        fit: "true-to-size",
        title: "The plain one earns its place",
        body: "Bought it to layer under the hoodie and now it is the thing I wear most. Cuffs have not gone slack after a month.",
      },
    ],
  },
  {
    id: "PL-10",
    slug: "pocket-tee",
    name: "Pocket Tee",
    category: "t-shirts",
    price: 44,
    gsm: 240,
    composition: "100% organic cotton",
    origin: "Cut and made in Portugal",
    strapline: "POINT AT SOMETHING.",
    description:
      "A relaxed 240gsm tee with a patch pocket at the left chest and a cursor arrow embroidered just above it in a single tonal thread. Pocket is stitched on all three sides and actually holds a phone.",
    spec: ["fit-relaxed", "embroidered", "heavy-jersey"],
    colourways: [ULTRA, CHALK],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    stock: {
      ultra: { XS: 8, S: 17, M: 0, L: 19, XL: 13, XXL: 6 },
      chalk: { XS: 12, S: 24, M: 31, L: 22, XL: 11, XXL: 4 },
    },
    measurements: [
      { size: "XS", chest: 54, length: 69 },
      { size: "S", chest: 57, length: 71 },
      { size: "M", chest: 60, length: 74 },
      { size: "L", chest: 63, length: 76 },
      { size: "XL", chest: 66, length: 78 },
      { size: "XXL", chest: 69, length: 80 },
    ],
    reviews: [],
  },
  {
    id: "PL-11",
    slug: "rib-vest",
    name: "Rib Vest",
    category: "t-shirts",
    price: 34,
    gsm: 220,
    composition: "95% organic cotton, 5% elastane",
    origin: "Cut and made in Portugal",
    strapline: "SUMMER LAYER. WINTER BASE.",
    description:
      "A close-cut ribbed vest at 220gsm with narrow straps and a scooped neck. The rib recovers rather than stretching out, so it sits close without going slack by the afternoon.",
    spec: ["fit-slim", "no-print", "ribbed"],
    colourways: [CHALK, JET],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    stock: {
      chalk: { XS: 2, S: 9, M: 14, L: 7, XL: 0, XXL: 1 },
      jet: { XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
    },
    measurements: [
      { size: "XS", chest: 44, length: 62 },
      { size: "S", chest: 47, length: 64 },
      { size: "M", chest: 50, length: 67 },
      { size: "L", chest: 53, length: 69 },
      { size: "XL", chest: 56, length: 71 },
      { size: "XXL", chest: 59, length: 73 },
    ],
    reviews: [
      {
        author: "Mara T.",
        date: "2026-07-14",
        rating: 4,
        fit: "runs-small",
        title: "Size up if you are between",
        body: "Lovely rib and the chalk is a proper off-white, not grey. I am usually an S and went M in the end.",
      },
    ],
  },
  {
    id: "PL-12",
    slug: "ringer-tee",
    name: "Ringer Tee",
    category: "t-shirts",
    price: 46,
    gsm: 220,
    composition: "100% organic cotton",
    origin: "Cut and made in Portugal",
    strapline: "TRIM THAT DOES THE TALKING.",
    description:
      "A boxy ringer with contrast ribbed binding at the collar and sleeve openings, and a small asterisk embroidered at the left chest. Short in the body, wide across the shoulder.",
    spec: ["fit-boxy", "embroidered", "ribbed"],
    colourways: [FLUORO, CHALK],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    stock: {
      fluoro: { XS: 12, S: 24, M: 31, L: 22, XL: 11, XXL: 4 },
      chalk: { XS: 0, S: 3, M: 6, L: 2, XL: 1, XXL: 0 },
    },
    measurements: [
      { size: "XS", chest: 55, length: 66 },
      { size: "S", chest: 58, length: 68 },
      { size: "M", chest: 61, length: 71 },
      { size: "L", chest: 64, length: 73 },
      { size: "XL", chest: 67, length: 75 },
      { size: "XXL", chest: 70, length: 77 },
    ],
    reviews: [],
  },
  {
    id: "PL-13",
    slug: "zip-hood",
    name: "Zip Hood",
    category: "sweats",
    price: 105,
    gsm: 400,
    composition: "100% organic cotton",
    origin: "Cut and made in Portugal",
    strapline: "ZIP IT.",
    description:
      "A 400gsm loopback zip hood with a two-way metal zip, a lined hood and deep side pockets. Completely unprinted, because a zip through the middle ruins a back print anyway.",
    spec: ["fit-relaxed", "no-print", "loopback"],
    colourways: [JET, CHALK],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    stock: {
      jet: { XS: 15, S: 28, M: 36, L: 27, XL: 16, XXL: 9 },
      chalk: { XS: 8, S: 17, M: 0, L: 19, XL: 13, XXL: 6 },
    },
    measurements: [
      { size: "XS", chest: 57, length: 68 },
      { size: "S", chest: 60, length: 70 },
      { size: "M", chest: 63, length: 73 },
      { size: "L", chest: 66, length: 75 },
      { size: "XL", chest: 69, length: 77 },
      { size: "XXL", chest: 72, length: 79 },
    ],
    reviews: [
      {
        author: "Priya N.",
        date: "2026-09-02",
        rating: 5,
        fit: "true-to-size",
        title: "Heavier than it looks",
        body: "The weight is the whole point. Zip runs smooth and the hood actually stays up in wind.",
      },
    ],
  },
  {
    id: "PL-14",
    slug: "half-zip",
    name: "Half-Zip",
    category: "sweats",
    price: 92,
    gsm: 380,
    composition: "100% organic cotton",
    origin: "Cut and made in Portugal",
    strapline: "HALFWAY IS FINE.",
    description:
      "A boxy 380gsm half-zip with a stand collar and a power symbol embroidered at the left chest. Zip stops at the sternum, which is as much commitment as this garment asks for.",
    spec: ["fit-boxy", "embroidered", "loopback"],
    colourways: [VOLT, JET],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    stock: {
      volt: { XS: 2, S: 9, M: 14, L: 7, XL: 0, XXL: 1 },
      jet: { XS: 12, S: 24, M: 31, L: 22, XL: 11, XXL: 4 },
    },
    measurements: [
      { size: "XS", chest: 58, length: 66 },
      { size: "S", chest: 61, length: 68 },
      { size: "M", chest: 64, length: 71 },
      { size: "L", chest: 67, length: 73 },
      { size: "XL", chest: 70, length: 75 },
      { size: "XXL", chest: 73, length: 77 },
    ],
    reviews: [],
  },
  {
    id: "PL-15",
    slug: "rib-crew",
    name: "Rib Crew",
    category: "sweats",
    price: 78,
    gsm: 300,
    composition: "92% organic cotton, 8% elastane",
    origin: "Cut and made in Portugal",
    strapline: "PAUSED.",
    description:
      "A fitted ribbed crew at 300gsm, cut close through the body with two small pause bars embroidered at the left chest. Heavier than a rib top and lighter than a sweat, which is the gap it exists to fill.",
    spec: ["fit-slim", "embroidered", "ribbed"],
    colourways: [VIOLET, CHALK],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    stock: {
      violet: { XS: 8, S: 17, M: 0, L: 19, XL: 13, XXL: 6 },
      chalk: { XS: 2, S: 9, M: 14, L: 7, XL: 0, XXL: 1 },
    },
    measurements: [
      { size: "XS", chest: 48, length: 64 },
      { size: "S", chest: 51, length: 66 },
      { size: "M", chest: 54, length: 69 },
      { size: "L", chest: 57, length: 71 },
      { size: "XL", chest: 60, length: 73 },
      { size: "XXL", chest: 63, length: 75 },
    ],
    reviews: [
      {
        author: "Elif K.",
        date: "2026-08-11",
        rating: 4,
        fit: "true-to-size",
        title: "Sits close without clinging",
        body: "Rib is dense enough that it holds its shape. Violet is genuinely purple, not maroon.",
      },
    ],
  },
  {
    id: "PL-16",
    slug: "sweat-vest",
    name: "Sweat Vest",
    category: "sweats",
    price: 72,
    gsm: 320,
    composition: "100% organic cotton",
    origin: "Cut and made in Portugal",
    strapline: "LEFT ON READ.",
    description:
      "A sleeveless 320gsm sweat with dropped armholes and LEFT ON READ printed across the back under two delivered ticks. Wears over a long sleeve most of the year and on its own for about three weeks.",
    spec: ["fit-boxy", "screen-print", "heavy-jersey"],
    colourways: [LIME, JET],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    stock: {
      lime: { XS: 12, S: 24, M: 31, L: 22, XL: 11, XXL: 4 },
      jet: { XS: 0, S: 3, M: 6, L: 2, XL: 1, XXL: 0 },
    },
    measurements: [
      { size: "XS", chest: 59, length: 65 },
      { size: "S", chest: 62, length: 67 },
      { size: "M", chest: 65, length: 70 },
      { size: "L", chest: 68, length: 72 },
      { size: "XL", chest: 71, length: 74 },
      { size: "XXL", chest: 74, length: 76 },
    ],
    reviews: [],
  },
  {
    id: "PL-17",
    slug: "bomber",
    name: "Bomber",
    category: "outerwear",
    price: 145,
    gsm: 340,
    composition: "100% cotton twill",
    origin: "Cut and made in Portugal",
    strapline: "ARE YOU STILL WATCHING?",
    description:
      "A boxy cotton twill bomber with ribbed collar, cuffs and hem, and a full back print asking the question nobody wants at 2am. Unlined, so it works from March.",
    spec: ["fit-boxy", "screen-print", "twill"],
    colourways: [JET, TANGERINE],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    stock: {
      jet: { XS: 8, S: 17, M: 0, L: 19, XL: 13, XXL: 6 },
      tangerine: { XS: 2, S: 9, M: 14, L: 7, XL: 0, XXL: 1 },
    },
    measurements: [
      { size: "XS", chest: 60, length: 64 },
      { size: "S", chest: 63, length: 66 },
      { size: "M", chest: 66, length: 69 },
      { size: "L", chest: 69, length: 71 },
      { size: "XL", chest: 72, length: 73 },
      { size: "XXL", chest: 75, length: 75 },
    ],
    reviews: [
      {
        author: "Tomas R.",
        date: "2026-09-05",
        rating: 5,
        fit: "runs-large",
        title: "Genuinely funny and genuinely well made",
        body: "Ordered L, could have taken M. The print is thick and sits flat, no cracking so far.",
      },
    ],
  },
  {
    id: "PL-18",
    slug: "anorak",
    name: "Anorak",
    category: "outerwear",
    price: 130,
    gsm: 300,
    composition: "100% cotton twill",
    origin: "Cut and made in Portugal",
    strapline: "OVER YOUR HEAD.",
    description:
      "A half-placket cotton twill anorak with a drawcord hood and one large kangaroo pocket across the front. Pulls on over everything. No print anywhere, so the colour does the work.",
    spec: ["fit-relaxed", "no-print", "twill"],
    colourways: [ULTRA, CHALK],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    stock: {
      ultra: { XS: 12, S: 24, M: 31, L: 22, XL: 11, XXL: 4 },
      chalk: { XS: 8, S: 17, M: 0, L: 19, XL: 13, XXL: 6 },
    },
    measurements: [
      { size: "XS", chest: 62, length: 72 },
      { size: "S", chest: 65, length: 74 },
      { size: "M", chest: 68, length: 77 },
      { size: "L", chest: 71, length: 79 },
      { size: "XL", chest: 74, length: 81 },
      { size: "XXL", chest: 77, length: 83 },
    ],
    reviews: [],
  },
  {
    id: "PL-19",
    slug: "work-overshirt",
    name: "Work Overshirt",
    category: "outerwear",
    price: 118,
    gsm: 340,
    composition: "100% cotton canvas",
    origin: "Cut and made in Portugal",
    strapline: "SHIRT. JACKET. NEITHER. BOTH.",
    description:
      "A boxy canvas overshirt with two flap chest pockets and a reload arrow embroidered above the left one. Stiff out of the bag and properly broken in by about the tenth wear.",
    spec: ["fit-boxy", "embroidered", "canvas"],
    colourways: [LIME, JET],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    stock: {
      lime: { XS: 2, S: 9, M: 14, L: 7, XL: 0, XXL: 1 },
      jet: { XS: 15, S: 28, M: 36, L: 27, XL: 16, XXL: 9 },
    },
    measurements: [
      { size: "XS", chest: 59, length: 70 },
      { size: "S", chest: 62, length: 72 },
      { size: "M", chest: 65, length: 75 },
      { size: "L", chest: 68, length: 77 },
      { size: "XL", chest: 71, length: 79 },
      { size: "XXL", chest: 74, length: 81 },
    ],
    reviews: [
      {
        author: "Sam O.",
        date: "2026-07-28",
        rating: 4,
        fit: "true-to-size",
        title: "Stiff at first, worth it",
        body: "First two weeks it wears like cardboard and then it drops. Pockets are big enough for a passport.",
      },
    ],
  },
  {
    id: "PL-20",
    slug: "chore-jacket",
    name: "Chore Jacket",
    category: "outerwear",
    price: 125,
    gsm: 360,
    composition: "100% cotton canvas",
    origin: "Cut and made in Portugal",
    strapline: "THREE POCKETS. NO OPINIONS.",
    description:
      "A relaxed 360gsm canvas chore jacket with three patch pockets and a flat collar. Entirely unprinted and entirely unbothered about it.",
    spec: ["fit-relaxed", "no-print", "canvas"],
    colourways: [CHALK, JET],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    stock: {
      chalk: { XS: 8, S: 17, M: 0, L: 19, XL: 13, XXL: 6 },
      jet: { XS: 12, S: 24, M: 31, L: 22, XL: 11, XXL: 4 },
    },
    measurements: [
      { size: "XS", chest: 61, length: 71 },
      { size: "S", chest: 64, length: 73 },
      { size: "M", chest: 67, length: 76 },
      { size: "L", chest: 70, length: 78 },
      { size: "XL", chest: 73, length: 80 },
      { size: "XXL", chest: 76, length: 82 },
    ],
    reviews: [],
  },
  {
    id: "PL-21",
    slug: "canvas-vest",
    name: "Canvas Vest",
    category: "outerwear",
    price: 95,
    gsm: 360,
    composition: "100% cotton canvas",
    origin: "Cut and made in Portugal",
    strapline: "EJECT.",
    description:
      "A close-cut sleeveless canvas vest with four front pockets and an eject triangle embroidered at the left chest. Layers over a hood without adding bulk through the arm.",
    spec: ["fit-slim", "embroidered", "canvas"],
    colourways: [TANGERINE, JET],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    stock: {
      tangerine: { XS: 0, S: 3, M: 6, L: 2, XL: 1, XXL: 0 },
      jet: { XS: 2, S: 9, M: 14, L: 7, XL: 0, XXL: 1 },
    },
    measurements: [
      { size: "XS", chest: 52, length: 62 },
      { size: "S", chest: 55, length: 64 },
      { size: "M", chest: 58, length: 67 },
      { size: "L", chest: 61, length: 69 },
      { size: "XL", chest: 64, length: 71 },
      { size: "XXL", chest: 67, length: 73 },
    ],
    reviews: [],
  },
  {
    id: "PL-22",
    slug: "pleat-trouser",
    name: "Pleat Trouser",
    category: "trousers",
    price: 98,
    gsm: 300,
    composition: "100% cotton twill",
    origin: "Cut and made in Portugal",
    strapline: "ONE PLEAT. NOTHING ELSE.",
    description:
      "A single-pleat cotton twill trouser with a pressed front crease and a tapered leg. No print, no patch, no branding. The crease survives a wash if you hang them damp.",
    spec: ["fit-slim", "no-print", "twill"],
    colourways: [CHALK, JET],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    stock: {
      chalk: { XS: 2, S: 9, M: 14, L: 7, XL: 0, XXL: 1 },
      jet: { XS: 12, S: 24, M: 31, L: 22, XL: 11, XXL: 4 },
    },
    measurements: [
      { size: "XS", waist: 38, inseam: 74 },
      { size: "S", waist: 41, inseam: 75 },
      { size: "M", waist: 44, inseam: 76 },
      { size: "L", waist: 47, inseam: 77 },
      { size: "XL", waist: 50, inseam: 78 },
      { size: "XXL", waist: 53, inseam: 79 },
    ],
    reviews: [
      {
        author: "Joon P.",
        date: "2026-08-22",
        rating: 4,
        fit: "true-to-size",
        title: "Smarter than the rest of the range",
        body: "These go with a shirt, which nothing else here does. Crease holds up better than expected.",
      },
    ],
  },
  {
    id: "PL-23",
    slug: "sweat-pant",
    name: "Sweat Pant",
    category: "trousers",
    price: 85,
    gsm: 400,
    composition: "100% organic cotton",
    origin: "Cut and made in Portugal",
    strapline: "THE HOODIE, BUT LEGS.",
    description:
      "400gsm loopback sweat pants with a drawcord waist, ribbed cuffs and deep side pockets. Same cloth as the Zip Hood, on purpose, so the two sit together without looking like a tracksuit.",
    spec: ["fit-relaxed", "no-print", "loopback"],
    colourways: [JET, CHALK],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    stock: {
      jet: { XS: 15, S: 28, M: 36, L: 27, XL: 16, XXL: 9 },
      chalk: { XS: 8, S: 17, M: 0, L: 19, XL: 13, XXL: 6 },
    },
    measurements: [
      { size: "XS", waist: 36, inseam: 72 },
      { size: "S", waist: 39, inseam: 73 },
      { size: "M", waist: 42, inseam: 74 },
      { size: "L", waist: 45, inseam: 75 },
      { size: "XL", waist: 48, inseam: 76 },
      { size: "XXL", waist: 51, inseam: 77 },
    ],
    reviews: [],
  },
  {
    id: "PL-24",
    slug: "loop-short",
    name: "Loop Short",
    category: "trousers",
    price: 58,
    gsm: 380,
    composition: "100% organic cotton",
    origin: "Cut and made in Portugal",
    strapline: "ABOVE THE KNEE.",
    description:
      "A 380gsm loopback short cut above the knee with a drawcord waist and no cuff. Unprinted. The open loops on the inside are visible and that is the whole texture.",
    spec: ["fit-slim", "no-print", "loopback"],
    colourways: [VIOLET, JET],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    stock: {
      violet: { XS: 12, S: 24, M: 31, L: 22, XL: 11, XXL: 4 },
      jet: { XS: 0, S: 3, M: 6, L: 2, XL: 1, XXL: 0 },
    },
    measurements: [
      { size: "XS", waist: 36, inseam: 20 },
      { size: "S", waist: 39, inseam: 21 },
      { size: "M", waist: 42, inseam: 22 },
      { size: "L", waist: 45, inseam: 23 },
      { size: "XL", waist: 48, inseam: 24 },
      { size: "XXL", waist: 51, inseam: 25 },
    ],
    reviews: [],
  },
  {
    id: "PL-25",
    slug: "jersey-short",
    name: "Jersey Short",
    category: "trousers",
    price: 48,
    gsm: 240,
    composition: "100% organic cotton",
    origin: "Cut and made in Portugal",
    strapline: "MUTED.",
    description:
      "A light 240gsm jersey short with an elasticated waist and a muted-speaker symbol embroidered low on the left leg. The one thing here you can sleep in without regret.",
    spec: ["fit-slim", "embroidered", "heavy-jersey"],
    colourways: [FLUORO, JET],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    stock: {
      fluoro: { XS: 8, S: 17, M: 0, L: 19, XL: 13, XXL: 6 },
      jet: { XS: 2, S: 9, M: 14, L: 7, XL: 0, XXL: 1 },
    },
    measurements: [
      { size: "XS", waist: 35, inseam: 18 },
      { size: "S", waist: 38, inseam: 19 },
      { size: "M", waist: 41, inseam: 20 },
      { size: "L", waist: 44, inseam: 21 },
      { size: "XL", waist: 47, inseam: 22 },
      { size: "XXL", waist: 50, inseam: 23 },
    ],
    reviews: [],
  },
  {
    id: "PL-26",
    slug: "canvas-pant",
    name: "Canvas Pant",
    category: "trousers",
    price: 96,
    gsm: 360,
    composition: "100% cotton canvas",
    origin: "Cut and made in Portugal",
    strapline: "STIFF UNTIL IT IS NOT.",
    description:
      "A wide straight-leg canvas trouser with a plain front and two back patch pockets. Nothing printed on it. Softens a noticeable amount by the third wash and keeps going from there.",
    spec: ["fit-boxy", "no-print", "canvas"],
    colourways: [CHALK, LIME],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    stock: {
      chalk: { XS: 12, S: 24, M: 31, L: 22, XL: 11, XXL: 4 },
      lime: { XS: 2, S: 9, M: 14, L: 7, XL: 0, XXL: 1 },
    },
    measurements: [
      { size: "XS", waist: 40, inseam: 73 },
      { size: "S", waist: 43, inseam: 74 },
      { size: "M", waist: 46, inseam: 75 },
      { size: "L", waist: 49, inseam: 76 },
      { size: "XL", waist: 52, inseam: 77 },
      { size: "XXL", waist: 55, inseam: 78 },
    ],
    reviews: [
      {
        author: "Ade F.",
        date: "2026-09-10",
        rating: 5,
        fit: "true-to-size",
        title: "Wide without being clownish",
        body: "The leg is generous but it still breaks properly over a shoe. Chalk shows marks, worth knowing.",
      },
    ],
  },
  {
    id: "PL-27",
    slug: "ribbed-beanie",
    name: "Ribbed Beanie",
    category: "accessories",
    price: 32,
    gsm: null,
    composition: "100% lambswool",
    origin: "Knitted in Scotland",
    strapline: "COLD EARS ARE A CHOICE.",
    description:
      "A close-knit lambswool beanie with a deep folded cuff and a small hourglass embroidered on the front of the fold. Knitted in Scotland, which is where the wool already was.",
    spec: ["fit-slim", "embroidered", "ribbed"],
    colourways: [JET, FLUORO],
    sizes: ["ONE"],
    stock: {
      jet: { ONE: 26 },
      fluoro: { ONE: 3 },
    },
    measurements: [],
    reviews: [
      {
        author: "Niamh D.",
        date: "2026-09-01",
        rating: 5,
        fit: "true-to-size",
        title: "Not itchy, which is rare",
        body: "Proper lambswool and it does not scratch. Cuff is deep enough to pull right over the ears.",
      },
    ],
  },
  {
    id: "PL-28",
    slug: "rib-sock",
    name: "Rib Sock",
    category: "accessories",
    price: 14,
    gsm: null,
    composition: "80% organic cotton, 17% polyamide, 3% elastane",
    origin: "Cut and made in Portugal",
    strapline: "TWO PAIRS. NO LOGO.",
    description:
      "A two-pack of ribbed cotton socks with a reinforced heel and toe and a plain cuff. No logo on the ankle, which turns out to be surprisingly hard to buy.",
    spec: ["fit-slim", "no-print", "ribbed"],
    colourways: [VOLT, JET],
    sizes: ["ONE"],
    stock: {
      volt: { ONE: 26 },
      jet: { ONE: 26 },
    },
    measurements: [],
    reviews: [],
  },
  {
    id: "PL-29",
    slug: "watch-cap",
    name: "Watch Cap",
    category: "accessories",
    price: 30,
    gsm: null,
    composition: "100% merino wool",
    origin: "Knitted in Scotland",
    strapline: "DONE.",
    description:
      "A short merino watch cap that sits above the ear rather than over it, with a single tick embroidered on the cuff. Finer gauge than the Ribbed Beanie and less bulk under a hood.",
    spec: ["fit-slim", "embroidered", "ribbed"],
    colourways: [ULTRA, CHALK],
    sizes: ["ONE"],
    stock: {
      ultra: { ONE: 3 },
      chalk: { ONE: 26 },
    },
    measurements: [],
    reviews: [],
  },
  {
    id: "PL-30",
    slug: "duffle-bag",
    name: "Duffle Bag",
    category: "accessories",
    price: 88,
    gsm: 420,
    composition: "100% cotton canvas",
    origin: "Cut and made in Portugal",
    strapline: "STORAGE ALMOST FULL.",
    description:
      "A 420gsm canvas duffle with a full-length zip, webbing handles and a detachable strap, printed with a storage bar that has almost nothing left in it. Holds a long weekend.",
    spec: ["fit-boxy", "screen-print", "canvas"],
    colourways: [JET, ULTRA],
    sizes: ["ONE"],
    stock: {
      jet: { ONE: 26 },
      ultra: { ONE: 0 },
    },
    measurements: [],
    reviews: [
      {
        author: "Kit M.",
        date: "2026-08-17",
        rating: 4,
        fit: "true-to-size",
        title: "The joke is good, the bag is better",
        body: "Canvas is thick enough that it stands up on its own when packed. Strap clips feel solid.",
      },
    ],
  },
];

export function totalStock(product: Product): number {
  return Object.values(product.stock)
    .flatMap((sizes) => Object.values(sizes))
    .reduce((total, units) => total + units, 0);
}

export function stockFor(
  product: Product,
  colourway: string,
  size: Size,
): number {
  return product.stock[colourway]?.[size] ?? 0;
}

export function isSoldOut(
  product: Product,
  colourway: string,
  size: Size,
): boolean {
  return stockFor(product, colourway, size) === 0;
}

export function isLowStock(
  product: Product,
  colourway: string,
  size: Size,
): boolean {
  const units = stockFor(product, colourway, size);
  return units > 0 && units < 4;
}
