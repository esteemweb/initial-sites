import { artists } from "@/lib/content/artists";
import { motifs } from "@/lib/content/motifs";
import { findSlot } from "./slots";
import { TEST_LAST4, type CardErrors } from "./card";

export const placements = [
  "Forearm",
  "Upper arm",
  "Half sleeve",
  "Full sleeve",
  "Chest",
  "Ribs",
  "Back",
  "Thigh",
  "Calf",
  "Not sure yet",
] as const;

export const sizes = [
  { id: "small", label: "Small", note: "one sitting" },
  { id: "medium", label: "Medium", note: "2–4 sessions" },
  { id: "large", label: "Large", note: "5+ sessions" },
  { id: "suit", label: "Body suit", note: "a long conversation" },
] as const;

export type ConsultationInput = {
  name: string;
  email: string;
  phone?: string;
  artist?: string;
  motif?: string;
  placement: string;
  size: "small" | "medium" | "large" | "suit";
  method: "any" | "tebori" | "machine";
  slot: string;
  message?: string;
};

export type FieldErrors = Partial<Record<keyof ConsultationInput | "age" | "form", string>>;

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

/** Longest accepted values; they also keep the booking cookie well under the browser's size limit. */
export const LIMITS = { name: 100, email: 254, phone: 30, message: 1000 } as const;

export function parseConsultation(fd: FormData): { data?: ConsultationInput; errors: FieldErrors } {
  const errors: FieldErrors = {};
  const name = str(fd, "name");
  const email = str(fd, "email");
  const phone = str(fd, "phone");
  const artist = str(fd, "artist");
  const motif = str(fd, "motif");
  const placement = str(fd, "placement");
  const size = str(fd, "size") as ConsultationInput["size"];
  const method = str(fd, "method") as ConsultationInput["method"];
  const slot = str(fd, "slot");
  const message = str(fd, "message").slice(0, LIMITS.message);
  const age = fd.get("age") === "on";

  if (name.length < 2) errors.name = "Tell us what to call you.";
  else if (name.length > LIMITS.name) errors.name = `Keep it under ${LIMITS.name} characters.`;
  if (email.length > LIMITS.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "That email does not look right.";
  if (phone && (phone.length > LIMITS.phone || !/^[+\d][\d\s()-]{6,}$/.test(phone))) errors.phone = "Digits, spaces and + only.";
  if (artist && !artists.some((a) => a.slug === artist)) errors.artist = "Choose an artist from the list.";
  if (motif && !motifs.some((m) => m.slug === motif)) errors.motif = "Choose a motif from the list.";
  if (!placements.includes(placement as (typeof placements)[number])) errors.placement = "Pick a placement, or “not sure yet”.";
  if (!sizes.some((s) => s.id === size)) errors.size = "Pick a rough size.";
  if (!["any", "tebori", "machine"].includes(method)) errors.method = "Pick a method, or “either”.";
  const s = findSlot(slot);
  if (!s) errors.slot = "Pick a consultation time.";
  else if (s.taken) errors.slot = "That time was just taken. Pick another.";
  if (!age) errors.age = "You need to be 20 or over.";

  if (Object.keys(errors).length) return { errors };
  return {
    errors,
    data: {
      name,
      email,
      phone: phone || undefined,
      artist: artist || undefined,
      motif: motif || undefined,
      placement,
      size,
      method,
      slot,
      message: message || undefined,
    },
  };
}

// The deposit is checked in the browser (lib/booking/card.ts); the server only
// ever receives the last four digits, and accepts them only for a test card.
export type DepositErrors = CardErrors;

export function parseDeposit(fd: FormData): { last4?: string; errors: DepositErrors } {
  const last4 = str(fd, "last4");
  if (!/^\d{4}$/.test(last4) || !TEST_LAST4.has(last4))
    return { errors: { form: "Use a test card, for example 4242 4242 4242 4242. Real cards are not accepted." } };
  return { errors: {}, last4 };
}
