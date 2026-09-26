/* Subscription pricing. Pure functions only — the widget renders this, it
   never computes inline (PHASE-1-PLAN step 5).

   ⚠ PLACEHOLDER FIGURES. Every LKR amount and every multiplier below is
   invented. They are shaped so the maths is real and testable, but the
   numbers must be replaced with the actual retail card before launch —
   see PHASE-1-PLAN "Open items". Swap the values, not the structure. */

export type LotId = "birds-eye-chinna" | "hunasgiriya-natural" | "two-houses";
export type Roast = "light" | "medium" | "dark";
export type Grind = "whole" | "filter" | "espresso";
export type Size = "250g" | "500g" | "1kg";
export type Cadence = "2wk" | "4wk" | "8wk";

export type Selection = {
  lot: LotId;
  roast: Roast;
  grind: Grind;
  size: Size;
  cadence: Cadence;
};

/** Retail price of 250 g, in LKR. Everything else derives from this. */
export const LOTS: Record<LotId, { label: string; origin: string; base: number }> = {
  "birds-eye-chinna": { label: "Bird's-eye Chinna", origin: "Ella · 1,340 m", base: 5800 },
  "hunasgiriya-natural": { label: "Hunasgiriya Natural", origin: "Knuckles · 1,105 m", base: 5000 },
  "two-houses": { label: "Two Houses", origin: "House blend", base: 4200 },
};

/** Not linear: buying more per shipment costs less per gram. */
export const SIZE_MULTIPLIER: Record<Size, number> = {
  "250g": 1,
  "500g": 1.9,
  "1kg": 3.6,
};

export const SUBSCRIBER_DISCOUNT = 0.1;

/** Colombo delivery is free above this; below it, a flat fee applies. */
export const FREE_DELIVERY_THRESHOLD = 4000;
export const DELIVERY_FEE = 350;

export const SHIPMENTS_PER_YEAR: Record<Cadence, number> = {
  "2wk": 26,
  "4wk": 13,
  "8wk": 6,
};

export const ROASTS: Roast[] = ["light", "medium", "dark"];
export const GRINDS: Grind[] = ["whole", "filter", "espresso"];
export const SIZES: Size[] = ["250g", "500g", "1kg"];
export const CADENCES: Cadence[] = ["2wk", "4wk", "8wk"];

/**
 * A kilo every fortnight is more coffee than a household drinks before it
 * goes stale, so we do not sell it. Returns a reason when unavailable, which
 * the widget shows as helper text rather than silently greying the option out.
 */
export function cadenceUnavailableReason(size: Size, cadence: Cadence): string | null {
  if (size === "1kg" && cadence === "2wk") {
    return "A kilo every fortnight goes stale before you finish it. Pick 4 or 8 weeks.";
  }
  return null;
}

export function isAvailable(sel: Selection): boolean {
  return cadenceUnavailableReason(sel.size, sel.cadence) === null;
}

/** Round to the nearest 10 LKR — nobody prices coffee to the rupee. */
const round10 = (n: number) => Math.round(n / 10) * 10;

export type Quote = {
  /** What the same bag costs without a subscription. */
  retail: number;
  /** Per shipment, after the subscriber discount. */
  perShipment: number;
  /** Saved per shipment versus retail. */
  saved: number;
  delivery: number;
  total: number;
  perYear: number;
  freeDelivery: boolean;
};

export function quote(sel: Selection): Quote {
  const retail = round10(LOTS[sel.lot].base * SIZE_MULTIPLIER[sel.size]);
  const perShipment = round10(retail * (1 - SUBSCRIBER_DISCOUNT));
  const freeDelivery = perShipment >= FREE_DELIVERY_THRESHOLD;
  const delivery = freeDelivery ? 0 : DELIVERY_FEE;

  return {
    retail,
    perShipment,
    saved: retail - perShipment,
    delivery,
    freeDelivery,
    total: perShipment + delivery,
    perYear: (perShipment + delivery) * SHIPMENTS_PER_YEAR[sel.cadence],
  };
}

/** Deterministic on server and client — Intl output can differ between them. */
export function formatLKR(amount: number): string {
  return `LKR ${Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

export const SIZE_LABEL: Record<Size, string> = {
  "250g": "250 g",
  "500g": "500 g",
  "1kg": "1 kg",
};

export const CADENCE_LABEL: Record<Cadence, string> = {
  "2wk": "2 weeks",
  "4wk": "4 weeks",
  "8wk": "8 weeks",
};

export const GRIND_LABEL: Record<Grind, string> = {
  whole: "Whole bean",
  filter: "Filter",
  espresso: "Espresso",
};

export const ROAST_LABEL: Record<Roast, string> = {
  light: "Light",
  medium: "Medium",
  dark: "Dark",
};

export const DEFAULT_SELECTION: Selection = {
  lot: "two-houses",
  roast: "medium",
  grind: "whole",
  size: "250g",
  cadence: "4wk",
};
