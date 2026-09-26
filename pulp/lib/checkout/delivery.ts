import {
  DELIVERY_METHODS,
  type DeliveryMethodKey,
} from "@/lib/commerce";

/**
 * Delivery estimates, counted from the current date (`CLAUDE.md`).
 *
 * Lead times are working days, so the count skips Saturday and Sunday. Order on
 * a Friday and "next working day" is Monday, not Saturday — which is the whole
 * point of quoting working days rather than days.
 *
 * Public holidays are not modelled. A real shop would need them; saying so here
 * is better than a silent approximation nobody notices until Boxing Day.
 */

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

/** `days` working days after `from`, never landing on a weekend. */
export function addWorkingDays(from: Date, days: number): Date {
  const result = new Date(from.getTime());
  let remaining = Math.max(0, days);

  while (remaining > 0) {
    result.setDate(result.getDate() + 1);
    if (!isWeekend(result)) remaining -= 1;
  }

  return result;
}

export interface DeliveryEstimate {
  earliest: Date;
  latest: Date;
  /** True when the method names a single day rather than a range. */
  single: boolean;
}

export function estimate(
  method: DeliveryMethodKey,
  from: Date = new Date(),
): DeliveryEstimate {
  const { minDays, maxDays } = DELIVERY_METHODS[method];
  return {
    earliest: addWorkingDays(from, minDays),
    latest: addWorkingDays(from, maxDays),
    single: minDays === maxDays,
  };
}

/** "Monday 15 September". Locale pinned so server and client agree. */
export function formatDeliveryDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

/**
 * The estimate as a plain sentence. Quiet zone (§11) — it states the fact and
 * nothing else.
 */
export function describeEstimate(estimateValue: DeliveryEstimate): string {
  if (estimateValue.single) {
    return `Arrives ${formatDeliveryDate(estimateValue.earliest)}`;
  }
  return `Arrives between ${formatDeliveryDate(estimateValue.earliest)} and ${formatDeliveryDate(estimateValue.latest)}`;
}
