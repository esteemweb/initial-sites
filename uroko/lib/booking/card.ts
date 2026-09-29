// Demo deposit: the card is checked in the visitor's browser and only the last
// four digits of a published test card ever reach the server. Real card
// numbers are refused. Shared by the deposit form (client) and the server
// action, which re-checks the last four against this list.

/** Published payment-provider test numbers. None can be charged anywhere. */
export const TEST_CARDS = [
  "4242424242424242", // Visa
  "4000056655665556", // Visa debit
  "5555555555554444", // Mastercard
  "2223003122003222", // Mastercard (2-series)
  "378282246310005", // American Express
  "6011111111111117", // Discover
  "3056930009020004", // Diners Club
  "3566002020360505", // JCB
] as const;

export const TEST_LAST4 = new Set(TEST_CARDS.map((n) => n.slice(-4)));

export type CardErrors = Partial<Record<"holder" | "number" | "expiry" | "cvc" | "form", string>>;

/** Runs in the browser. Returns the last four digits when everything is valid. */
export function checkTestCard(input: { holder: string; number: string; expiry: string; cvc: string }, now = new Date()) {
  const errors: CardErrors = {};
  const holder = input.holder.trim();
  const number = input.number.replace(/\s+/g, "");
  const expiry = input.expiry.trim();
  const cvc = input.cvc.trim();

  if (holder.length < 2) errors.holder = "Name as printed on the card.";
  else if (holder.length > 100) errors.holder = "Keep it under 100 characters.";
  if (!(TEST_CARDS as readonly string[]).includes(number))
    errors.number = "Use a test card number, for example 4242 4242 4242 4242. Real cards are not accepted.";
  const m = expiry.match(/^(\d{2})\s*\/\s*(\d{2})$/);
  if (!m) errors.expiry = "MM / YY";
  else {
    const mm = Number(m[1]);
    const yy = 2000 + Number(m[2]);
    if (mm < 1 || mm > 12 || yy < now.getFullYear() || (yy === now.getFullYear() && mm < now.getMonth() + 1))
      errors.expiry = "That card has expired.";
  }
  if (!/^\d{3,4}$/.test(cvc)) errors.cvc = "3 or 4 digits.";

  return Object.keys(errors).length ? { errors } : { errors, last4: number.slice(-4) };
}
