/**
 * Order numbers (DESIGN.md §12): `PL-` plus five digits, sequential, first
 * order `PL-10847`.
 *
 * **Sequential per browser.** There is no backend, so there is nothing central
 * for a counter to be sequential against; the next number lives in
 * `localStorage`. Two different browsers will both produce `PL-10847` first.
 * That is a property of a site with no server, not a bug to be found later.
 */

export const FIRST_ORDER_NUMBER = 10847;

const STORAGE_KEY = "pulp-order-sequence-v1";

export function formatOrderNumber(sequence: number): string {
  return `PL-${sequence}`;
}

function readSequence(): number {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return FIRST_ORDER_NUMBER;

    const parsed = Number.parseInt(raw, 10);
    // A hand-edited or corrupted value must not produce PL-NaN, and must not
    // hand out a number below the first one either.
    if (!Number.isSafeInteger(parsed) || parsed < FIRST_ORDER_NUMBER) {
      return FIRST_ORDER_NUMBER;
    }
    return parsed;
  } catch {
    return FIRST_ORDER_NUMBER;
  }
}

/**
 * Claims the next number and advances the counter. Called once, when an order
 * is actually placed — never during a render, or a repaint would burn numbers.
 */
export function takeOrderNumber(): string {
  const sequence = readSequence();

  try {
    window.localStorage.setItem(STORAGE_KEY, String(sequence + 1));
  } catch {
    // Storage blocked or full. The order still gets its number; the next one
    // will simply reuse it, which beats failing the checkout over a counter.
  }

  return formatOrderNumber(sequence);
}
