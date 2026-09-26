/* Availability and rates. There is no back end: availability is simulated
   deterministically from the date, so the same date always shows the same
   picture, and it can be tested. Swap these functions for real calls later —
   the components only depend on their signatures. */

import {
  COURTYARD_MONTHS,
  MAX_NIGHTS,
  ROOM_TYPES,
  SERVICE_DAYS,
  SITTINGS,
  SITTING_SEATS,
  SITTING_SEATS_COURTYARD,
  type RoomTypeId,
  type Service,
  roomType,
} from "./model.ts";
import {
  type ISODate,
  diffDays,
  month,
  nightsOf,
  parseISO,
  weekday,
} from "./dates.ts";

/* ── Deterministic noise ─────────────────────────────────────────────── */

/** FNV-1a → [0, 1). */
export function noise(key: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0) / 0x1_0000_0000;
}

export function reference(prefix: string, key: string): string {
  const n = Math.floor(noise(key) * 36 ** 5);
  return `${prefix}-${n.toString(36).toUpperCase().padStart(5, "0")}`;
}

/* ── Seasons and rates ───────────────────────────────────────────────── */

export type SeasonId = "low" | "mid" | "high" | "lumieres";

export const SEASONS: Record<SeasonId, { multiplier: number }> = {
  low: { multiplier: 1 }, // January, February, July, August
  mid: { multiplier: 1.1 }, // March, April, November, December
  high: { multiplier: 1.2 }, // May, June, September, October
  lumieres: { multiplier: 1.5 }, // Fête des Lumières, 5–8 December
};

/** Friday and Saturday nights. */
export const WEEKEND_SUPPLEMENT = 20;

export function season(iso: ISODate): SeasonId {
  const d = parseISO(iso);
  const m = d.getUTCMonth() + 1;
  const day = d.getUTCDate();
  if (m === 12 && day >= 5 && day <= 8) return "lumieres";
  if ([5, 6, 9, 10].includes(m)) return "high";
  if ([3, 4, 11, 12].includes(m)) return "mid";
  return "low";
}

function roundTo5(n: number): number {
  return Math.round(n / 5) * 5;
}

export function isWeekendNight(iso: ISODate): boolean {
  const w = weekday(iso);
  return w === 5 || w === 6;
}

/** Nightly rate for a room type on a given night, in euros. */
export function nightlyRate(type: RoomTypeId, night: ISODate): number {
  const room = roomType(type);
  if (!room) throw new Error(`Unknown room type ${type}`);
  const base = roundTo5(room.from * SEASONS[season(night)].multiplier);
  return base + (isWeekendNight(night) ? WEEKEND_SUPPLEMENT : 0);
}

/* ── Room availability ───────────────────────────────────────────────── */

/** Rooms of a type still free on a given night. */
export function roomsLeft(type: RoomTypeId, night: ISODate): number {
  const room = roomType(type);
  if (!room) return 0;
  const s = season(night);
  let occupancy = isWeekendNight(night) ? 0.72 : 0.5;
  if (s === "high") occupancy += 0.1;
  if (s === "lumieres") occupancy = 0.97;
  occupancy += (noise(`${type}|${night}`) - 0.5) * 0.5;
  const booked = Math.min(room.count, Math.max(0, Math.round(room.count * occupancy)));
  return room.count - booked;
}

export type StayError = "past" | "order" | "too-long" | "too-many-guests";

export function validateStay(
  arrival: ISODate,
  departure: ISODate,
  guests: number,
  today: ISODate,
): StayError | null {
  if (diffDays(today, arrival) < 0) return "past";
  const nights = diffDays(arrival, departure);
  if (nights < 1) return "order";
  if (nights > MAX_NIGHTS) return "too-long";
  if (guests < 1 || guests > Math.max(...ROOM_TYPES.map((r) => r.maxGuests))) {
    return "too-many-guests";
  }
  return null;
}

export type Quote = {
  type: RoomTypeId;
  /** Rooms free on every night of the stay. 0 = unavailable. */
  left: number;
  nights: { date: ISODate; rate: number }[];
  rooms: number; // subtotal for the room
  breakfast: number; // subtotal if breakfast is taken
  total: number; // rooms + breakfast when included
};

export function quote(
  type: RoomTypeId,
  arrival: ISODate,
  departure: ISODate,
  guests: number,
  withBreakfast: boolean,
  breakfastPrice: number,
): Quote {
  const nights = nightsOf(arrival, departure).map((date) => ({
    date,
    rate: nightlyRate(type, date),
  }));
  const left = nights.length
    ? Math.min(...nights.map((n) => roomsLeft(type, n.date)))
    : 0;
  const rooms = nights.reduce((sum, n) => sum + n.rate, 0);
  const breakfast = nights.length * guests * breakfastPrice;
  return {
    type,
    left,
    nights,
    rooms,
    breakfast,
    total: rooms + (withBreakfast ? breakfast : 0),
  };
}

/* ── Restaurant ──────────────────────────────────────────────────────── */

export function servicesOn(iso: ISODate): Service[] {
  const w = weekday(iso);
  return (["lunch", "dinner"] as Service[]).filter((s) => SERVICE_DAYS[s].includes(w));
}

export function isOpen(iso: ISODate): boolean {
  return servicesOn(iso).length > 0;
}

export type Sitting = { time: string; capacity: number; left: number };

/** Seats left per sitting. Fuller close to today and at the weekend. */
export function sittings(iso: ISODate, service: Service, today: ISODate): Sitting[] {
  if (!servicesOn(iso).includes(service)) return [];
  const courtyard = COURTYARD_MONTHS.includes(month(iso)) ? SITTING_SEATS_COURTYARD : 0;
  const capacity = SITTING_SEATS[service] + courtyard;
  const ahead = Math.max(0, diffDays(today, iso));
  const soon = Math.max(0, 1 - ahead / 21); // within three weeks fills up
  const weekend = weekday(iso) >= 5 ? 0.2 : 0;
  return SITTINGS[service].map((time, i) => {
    // 20:00 and 20:30 are the popular dinner sittings
    const peak = service === "dinner" && (i === 2 || i === 3) ? 0.15 : 0;
    const fill = Math.min(
      1,
      0.15 + soon * 0.55 + weekend + peak + (noise(`${iso}|${service}|${time}`) - 0.5) * 0.4,
    );
    const left = Math.max(0, capacity - Math.round(capacity * Math.max(0, fill)));
    return { time, capacity, left };
  });
}

/** Whether a sitting has not already started (same-day bookings). */
export function sittingIsFuture(iso: ISODate, time: string, today: ISODate, now: Date): boolean {
  if (iso !== today) return diffDays(today, iso) > 0;
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m > now.getHours() * 60 + now.getMinutes() + 60; // one hour's notice
}
