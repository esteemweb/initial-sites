// Demo booking state. There is no database: the booking travels in a signed,
// httpOnly cookie so the deposit and confirmation pages can read it back and
// nothing can be forged from the client. A real deployment would write to a
// database here and keep the same shape.
import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export type Booking = {
  ref: string;
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
  createdAt: string;
  deposit?: { amount: number; paidAt: string; last4: string };
};

const COOKIE = "uroko_booking";
const SECRET = process.env.BOOKING_SECRET ?? "uroko-demo-secret-change-me";
export const DEPOSIT_JPY = 10000;

function sign(payload: string) {
  return createHmac("sha256", SECRET).update(payload).digest("base64url");
}

export function newRef() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(4);
  const code = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
  return `UR-${code}`;
}

export async function saveBooking(b: Booking) {
  const payload = Buffer.from(JSON.stringify(b)).toString("base64url");
  const jar = await cookies();
  jar.set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
}

export async function readBooking(): Promise<Booking | null> {
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (!raw) return null;
  const dot = raw.lastIndexOf(".");
  if (dot < 0) return null;
  const payload = raw.slice(0, dot);
  const sig = raw.slice(dot + 1);
  const expected = sign(payload);
  if (sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Booking;
  } catch {
    return null;
  }
}

export async function clearBooking() {
  const jar = await cookies();
  jar.delete(COOKIE);
}
