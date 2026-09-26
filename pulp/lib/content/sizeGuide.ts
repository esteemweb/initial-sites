import type { Category } from "@/data/products";

/**
 * `/size-guide` — fit notes, written per **category** rather than per product.
 *
 * Fourteen near-identical paragraphs would be padding; the fit story genuinely
 * is a property of the style. Quiet register (§11) — sizing is the plain zone.
 */

export const SIZE_GUIDE_INTRO = [
  "Every measurement on this page is taken flat, across the garment, in centimetres. Flat measurements are half the body circumference: a 58cm chest on a tee is a 116cm garment measured all the way round.",
  "To find your size, measure a garment you already own and like the fit of, lay it flat, and compare. That is far more reliable than measuring yourself, because it accounts for how you actually want something to sit.",
];

export const HOW_TO_MEASURE = [
  {
    term: "Chest",
    definition:
      "Measured flat from armhole to armhole, across the widest point of the body, with the garment buttoned or closed.",
  },
  {
    term: "Length",
    definition:
      "Measured from the highest point of the shoulder seam straight down to the hem, not following the curve.",
  },
  {
    term: "Waist",
    definition:
      "Measured flat across the top of the waistband, from edge to edge, with any adjuster tabs left loose.",
  },
  {
    term: "Inseam",
    definition:
      "Measured along the inside leg seam, from the crotch join down to the bottom of the hem.",
  },
];

export const CATEGORY_FIT: Record<Category, string> = {
  "t-shirts":
    "Cut boxy and straight, with a wide body and a shoulder seam that sits slightly off the shoulder. Take your usual size for the intended fit. If you want something closer to the body, size down — the extra room is in the chest and the length is unaffected.",
  sweats:
    "Boxy through the body, with a dropped shoulder and a slightly cropped hem that sits at the top of the hip. They are heavy, so they hang rather than drape. Take your usual size. Between sizes, take the smaller one unless you are layering something substantial underneath.",
  outerwear:
    "Cut to go over a sweat, so there is deliberate room through the chest and the shoulder is dropped further than on a tee. Take your usual size and it will layer; take one down and it will wear as a shirt.",
  trousers:
    "Wide and straight from the hip with no taper, flat-fronted, and sat at the natural waist rather than on the hip. Waist measurements are the finished flat measurement with the adjuster tabs loose. If you are between waist sizes, take the larger — the tabs take in about 4cm.",
  accessories:
    "One size, and not cut to body measurements. The beanie is a standard adult fit with a folded cuff, the cap has a buckle strap at the back with about 8cm of adjustment, and the tote is a fixed 40cm by 45cm with a 30cm handle drop.",
};

export const CATEGORY_ORDER: Category[] = [
  "t-shirts",
  "sweats",
  "outerwear",
  "trousers",
  "accessories",
];

export const CATEGORY_HEADINGS: Record<Category, string> = {
  "t-shirts": "T-shirts",
  sweats: "Sweats",
  outerwear: "Outerwear",
  trousers: "Trousers",
  accessories: "Accessories",
};
