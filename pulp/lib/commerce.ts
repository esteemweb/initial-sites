/**
 * Commerce values (DESIGN.md §12), plus the two the spec leaves open.
 *
 * The free-delivery threshold, the discount code and its rate are defined in
 * §12. The standard delivery rate is not, and the basket has to show a figure,
 * so it is set here as the single place to change it when checkout's delivery
 * methods arrive.
 *
 * Everything is held in pence. Money in floats drifts — 10% off £45.99 is not
 * a number binary can hold — so the arithmetic stays in integers and converts
 * to pounds only at the formatting edge.
 */

/** DESIGN.md §12 — free delivery at £75. */
export const FREE_DELIVERY_THRESHOLD = 7500;

/** Not defined in §12. The standard rate, and the one the basket quotes. */
export const STANDARD_DELIVERY = 495;

/**
 * Delivery methods. Also absent from §12, so defined here.
 *
 * Free delivery is a **standard-post perk**: over the threshold, standard costs
 * nothing and express still costs £9.95. That keeps the choice a real choice —
 * if the threshold made express free too, nobody over £75 would ever pick
 * standard — and it keeps the basket's promise honest, because the figure the
 * basket quotes is the standard one.
 *
 * Lead times are in **working days**, counted by `lib/checkout/delivery.ts`.
 */
export interface DeliveryMethod {
  label: string;
  /** Pence, before the threshold is applied. */
  price: number;
  /** Whether the free-delivery threshold can zero this method. */
  freeOverThreshold: boolean;
  /** Working days, inclusive range. Equal values mean a single named day. */
  minDays: number;
  maxDays: number;
}

export const DELIVERY_METHODS = {
  standard: {
    label: "Standard delivery",
    price: STANDARD_DELIVERY,
    freeOverThreshold: true,
    minDays: 3,
    maxDays: 5,
  },
  express: {
    label: "Express delivery",
    price: 995,
    freeOverThreshold: false,
    minDays: 1,
    maxDays: 1,
  },
} as const satisfies Record<string, DeliveryMethod>;

export type DeliveryMethodKey = keyof typeof DELIVERY_METHODS;

export const DEFAULT_DELIVERY_METHOD: DeliveryMethodKey = "standard";

export function isDeliveryMethodKey(
  value: string | null | undefined,
): value is DeliveryMethodKey {
  return value != null && value in DELIVERY_METHODS;
}

/** DESIGN.md §12 — WASHDAY, 10% off the subtotal, before delivery. */
export const DISCOUNT_CODE = "WASHDAY";
export const DISCOUNT_RATE = 0.1;

export function toPence(pounds: number): number {
  return Math.round(pounds * 100);
}

export function toPounds(pence: number): number {
  return pence / 100;
}

/** Case and surrounding whitespace do not decide whether a code is valid. */
export function normaliseCode(input: string): string {
  return input.trim().toUpperCase();
}

export function isValidCode(input: string): boolean {
  return normaliseCode(input) === DISCOUNT_CODE;
}

export interface Totals {
  /** Goods only, before any discount. */
  subtotal: number;
  /** Positive when a code is applied, 0 otherwise. */
  discount: number;
  delivery: number;
  deliveryIsFree: boolean;
  total: number;
  /** Pence still to spend before delivery goes free. 0 once it has. */
  remainingForFreeDelivery: number;
}

/**
 * Totals in pence.
 *
 * The discount comes off the subtotal before delivery (§12), but the threshold
 * reads the subtotal *before* the discount: once free delivery is earned, a
 * discount code cannot take it away again and send the progress bar backwards.
 */
export function calculateTotals(
  subtotal: number,
  codeApplied: boolean,
  method: DeliveryMethodKey = DEFAULT_DELIVERY_METHOD,
): Totals {
  const discount = codeApplied ? Math.round(subtotal * DISCOUNT_RATE) : 0;
  const chosen = DELIVERY_METHODS[method];

  // Threshold reads the pre-discount subtotal. An empty basket is not a basket
  // that has earned free delivery, so it is excluded rather than passing on 0.
  // `qualifies` is about the basket; `deliveryIsFree` is about this method, and
  // express never goes free however much is in the basket.
  const qualifies = subtotal > 0 && subtotal >= FREE_DELIVERY_THRESHOLD;
  const deliveryIsFree = qualifies && chosen.freeOverThreshold;
  const delivery = subtotal === 0 || deliveryIsFree ? 0 : chosen.price;

  return {
    subtotal,
    discount,
    delivery,
    deliveryIsFree,
    total: subtotal - discount + delivery,
    remainingForFreeDelivery: Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal),
  };
}
