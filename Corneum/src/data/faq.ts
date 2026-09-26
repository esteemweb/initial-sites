/* FAQ. Answers quote or condense BRIEF.md where it speaks (`brief`) and are
   drafted where it doesn't (`draft`, listed in DATA-NOTES.md). Nothing here
   states shipping times, returns or prices the brief doesn't give. */

import type { Source } from "./products";

export type Faq = { id: string; q: string; a: string; link?: { href: string; label: string }; source: Source };
export type FaqGroup = { id: string; label: string; items: Faq[] };

export const FAQ: FaqGroup[] = [
  {
    id: "format",
    label: "The format",
    items: [
      {
        id: "why-vessel",
        q: "Why do I have to buy a vessel?",
        a: "Conventional shampoo is 80% water, shipped in plastic. Corneum ships only the part that does something, as a 30 ml concentrate. Vessel 01 is where you add the water. You buy it once.",
        source: "brief",
      },
      {
        id: "how-long",
        q: "How long does a refill last?",
        a: "Each 30 ml refill makes 200 ml and lasts roughly two months.",
        source: "brief",
      },
      {
        id: "how-mix",
        q: "How do I mix it?",
        a: "Pour to collar. Fill to line. Shake once. The line is etched into the glass at 200 ml.",
        link: { href: "/how-it-works", label: "How it works" },
        source: "brief",
      },
      {
        id: "own-bottle",
        q: "Can I use my own bottle?",
        a: "You can. The concentrate doesn't know what it's in. But the dose line is the point: without it you are guessing the dilution.",
        source: "draft",
      },
      {
        id: "plastic",
        q: "Is any of it plastic?",
        a: "No. The vessel is borosilicate glass and 316 steel. The vial is aluminium. The mailer is paper. No tissue, stickers or sample sachets.",
        source: "brief",
      },
      {
        id: "pump",
        q: "Why no pump?",
        a: "Pumps are plastic, they fail, and they can't be recycled. Corneum pours.",
        source: "brief",
      },
    ],
  },
  {
    id: "products",
    label: "The products",
    items: [
      {
        id: "start",
        q: "Where should I start?",
        a: "With the concern, not the product. The range page maps each concern to one product.",
        link: { href: "/range#choosing", label: "Choosing" },
        source: "draft",
      },
      {
        id: "more-than-two",
        q: "Can I use more than two products?",
        a: "We discourage it. More actives means more irritation, not more result.",
        source: "brief",
      },
      {
        id: "too-strong",
        q: "Is 4% salicylic acid too strong?",
        a: "Cleanse contains 4% salicylic acid. That's a clinical concentration. If your scalp is already irritated, start with Cleanse Mild or you will make it worse.",
        link: { href: "/range/cleanse-mild", label: "Cleanse Mild" },
        source: "brief",
      },
      {
        id: "thicker",
        q: "Will Density make my hair thicker?",
        a: "This will not make your hair thicker. Nothing makes hair thicker. It may increase the number of follicles in an active growth phase, which is a different claim, and the one we can support.",
        source: "brief",
      },
      {
        id: "reset-long",
        q: "Can I stay on Reset?",
        a: "No. Reset is an intensive six-week course. Six weeks, then stop. If the problem returns, see a clinician.",
        source: "draft",
      },
    ],
  },
  {
    id: "orders",
    label: "Orders",
    items: [
      {
        id: "first-order",
        q: "Does my first order need a vessel?",
        a: "Yes. Refills pour into Vessel 01, so a first order has to include one.",
        source: "brief",
      },
      {
        id: "refills-only",
        q: "Can I order refills without a vessel?",
        a: "Once you have bought a vessel, yes. Accounts aren't part of this site yet, so a past order is only remembered in the browser you ordered from.",
        source: "brief",
      },
      {
        id: "payment",
        q: "Is payment taken?",
        a: "No payment is taken on this site.",
        source: "brief",
      },
      {
        id: "arrive",
        q: "How do refills arrive?",
        a: "In a flat paper sleeve, slim enough to post through a letterbox. No courier, no box.",
        source: "brief",
      },
    ],
  },
];
