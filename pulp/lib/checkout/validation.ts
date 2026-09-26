/**
 * Delivery-details validation.
 *
 * Pure, so the rules can be reasoned about and later tested without mounting a
 * form. Checkout is the quiet zone (§11): every message is a plain sentence
 * that says **what is wrong and how to fix it**, with no apology and no joke.
 * "Enter a postcode" is half an answer; "Enter a postcode like SW1A 1AA" is the
 * whole one.
 */

export interface DeliveryDetails {
  name: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  town: string;
  county: string;
  postcode: string;
}

export const EMPTY_DETAILS: DeliveryDetails = {
  name: "",
  email: "",
  phone: "",
  line1: "",
  line2: "",
  town: "",
  county: "",
  postcode: "",
};

export type DetailErrors = Partial<Record<keyof DeliveryDetails, string>>;

/**
 * Tab order, and therefore the order the first error is looked for in. Focusing
 * the first invalid field only helps if "first" means first on screen.
 */
export const DETAIL_FIELDS: (keyof DeliveryDetails)[] = [
  "name",
  "email",
  "phone",
  "line1",
  "line2",
  "town",
  "county",
  "postcode",
];

// Deliberately loose. The job is to catch a typo, not to adjudicate RFC 5322 —
// rejecting a valid address is a worse failure than accepting an invalid one.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// UK postcodes, outward then inward, with the space optional.
const POSTCODE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

/** Digits only, so formatting, spaces and +44 are all somebody's business but ours. */
function digitCount(value: string): number {
  return (value.match(/\d/g) ?? []).length;
}

export function validateDetails(details: DeliveryDetails): DetailErrors {
  const errors: DetailErrors = {};
  const trimmed = (key: keyof DeliveryDetails) => details[key].trim();

  if (trimmed("name") === "") {
    errors.name = "Enter the name the order should be addressed to.";
  }

  const email = trimmed("email");
  if (email === "") {
    errors.email = "Enter an email address so we can send your order confirmation.";
  } else if (!EMAIL.test(email)) {
    errors.email = "Enter an email address like name@example.com";
  }

  // Required because a courier needs a number to call from the doorstep.
  const phone = trimmed("phone");
  if (phone === "") {
    errors.phone = "Enter a phone number for the courier.";
  } else if (digitCount(phone) < 10 || digitCount(phone) > 13) {
    errors.phone = "Enter a phone number like 07700 900123";
  }

  if (trimmed("line1") === "") {
    errors.line1 = "Enter the first line of your address.";
  }

  if (trimmed("town") === "") {
    errors.town = "Enter your town or city.";
  }

  const postcode = trimmed("postcode");
  if (postcode === "") {
    errors.postcode = "Enter your postcode.";
  } else if (!POSTCODE.test(postcode)) {
    errors.postcode = "Enter a postcode like SW1A 1AA";
  }

  // line2 and county are genuinely optional. Plenty of UK addresses have
  // neither, and a required field that many people cannot fill is a wall.
  return errors;
}

export function hasErrors(errors: DetailErrors): boolean {
  return Object.keys(errors).length > 0;
}

/** Postcodes are shown back uppercase, which is how they are written. */
export function normalisePostcode(value: string): string {
  return value.trim().toUpperCase();
}

/** The address as it should appear on a label, blank lines dropped. */
export function addressLines(details: DeliveryDetails): string[] {
  return [
    details.name,
    details.line1,
    details.line2,
    details.town,
    details.county,
    normalisePostcode(details.postcode),
  ]
    .map((line) => line.trim())
    .filter((line) => line !== "");
}
