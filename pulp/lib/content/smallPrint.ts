/**
 * The three small-print pages: delivery and returns, privacy, terms.
 *
 * Real text, deliberately no design effort beyond the shared type roles — the
 * brief calls these stubs and a portfolio build should not spend its attention
 * here. Quiet register throughout (§11).
 *
 * Commerce figures are stated to match `lib/commerce.ts` rather than invented
 * again: £4.95 standard, free over £75, £9.95 express. If those change, this
 * copy is the second place to update — noted here so it is not forgotten.
 */

export interface SmallPrintSection {
  heading: string;
  paragraphs: string[];
}

export interface SmallPrintPage {
  title: string;
  intro: string;
  sections: SmallPrintSection[];
}

export const DELIVERY_RETURNS: SmallPrintPage = {
  title: "Delivery and returns",
  intro:
    "Where we ship, what it costs, how long it takes, and what to do if you want to send something back.",
  sections: [
    {
      heading: "Delivery",
      paragraphs: [
        "Standard delivery is £4.95 and arrives in three to five working days. It is free on orders over £75.",
        "Express delivery is £9.95 and arrives the next working day if ordered before 2pm. Express is charged on every order regardless of value — the free-delivery threshold applies to standard post only.",
        "Working days are Monday to Friday, excluding public holidays. We do not dispatch or deliver at weekends.",
        "We currently ship to United Kingdom addresses only.",
      ],
    },
    {
      heading: "Tracking",
      paragraphs: [
        "You will get a confirmation email when the order is placed and a second one with a tracking link when it leaves us. If the second email has not arrived within two working days, contact us and we will look into it.",
      ],
    },
    {
      heading: "Returns",
      paragraphs: [
        "You have 30 days from delivery to return anything, for any reason or none. Returns are free.",
        "Items need to be unworn and unwashed with the care label still attached. We are not precious about the packaging — the garment bag is fine, the outer box does not matter.",
        "Start a return by replying to your order confirmation email with the order number and what you are sending back. We will send a prepaid label.",
        "Refunds go back to the original payment method within five working days of the return reaching us. Delivery charges are refunded if you return the whole order, and not if you return part of it.",
      ],
    },
    {
      heading: "Faults",
      paragraphs: [
        "If something arrives faulty, or fails in a way that is not fair wear and tear, tell us and we will replace it or refund it. This is in addition to the 30-day window and in addition to your statutory rights, which nothing on this page affects.",
      ],
    },
  ],
};

export const PRIVACY: SmallPrintPage = {
  title: "Privacy",
  intro:
    "What we collect, why, and how long we keep it. Short, because we collect very little.",
  sections: [
    {
      heading: "What we collect",
      paragraphs: [
        "When you place an order we collect your name, email address, phone number and delivery address. We need the address to send the order, the email to confirm it, and the phone number because couriers ask for one.",
        "If you sign up to the newsletter we collect your email address and nothing else.",
        "There are no accounts on this site, so there is no password and no profile.",
      ],
    },
    {
      heading: "What we do not collect",
      paragraphs: [
        "We do not collect card details. There is no payment step on this site.",
        "We do not run advertising trackers, and we do not sell or share your details with anybody for marketing.",
      ],
    },
    {
      heading: "Storage on your device",
      paragraphs: [
        "Your basket, and your most recent order confirmation, are stored in your browser so they survive a refresh. A half-completed checkout is held for the tab you are using and cleared when you close it. None of this is sent anywhere, and clearing your browser data removes all of it.",
      ],
    },
    {
      heading: "How long we keep it",
      paragraphs: [
        "Order records are kept for six years, which is what UK tax rules require. Newsletter subscriptions are kept until you unsubscribe, which you can do from the link in any email.",
        "You can ask us what we hold about you, ask for it to be corrected, or ask for it to be deleted, by replying to any email we have sent you.",
      ],
    },
  ],
};

export const TERMS: SmallPrintPage = {
  title: "Terms",
  intro: "The terms you agree to by ordering from this site.",
  sections: [
    {
      heading: "Orders",
      paragraphs: [
        "An order is an offer to buy. The contract is formed when we confirm dispatch, not when you place it.",
        "We may decline or cancel an order if an item is out of stock, if the price was listed incorrectly, or if we cannot deliver to the address given. If we cancel, you are refunded in full.",
      ],
    },
    {
      heading: "Prices",
      paragraphs: [
        "Prices are in pounds sterling and include VAT at the current UK rate. Delivery is charged separately and shown before you place the order.",
        "We may change prices at any time, but never after you have placed an order.",
      ],
    },
    {
      heading: "Products",
      paragraphs: [
        "Colours on screen are as accurate as we can make them, and will still vary between displays. Measurements are given flat and have a tolerance of about one centimetre either way, which is normal for cut-and-sewn cotton.",
        "Natural fibres vary between batches. Slight differences in shade or handle between two garments in the same colourway are a property of the material, not a fault.",
      ],
    },
    {
      heading: "Liability",
      paragraphs: [
        "Nothing here limits our liability for death or personal injury caused by negligence, for fraud, or for anything else that cannot lawfully be limited. Your statutory rights are unaffected.",
        "These terms are governed by the law of England and Wales.",
      ],
    },
  ],
};
