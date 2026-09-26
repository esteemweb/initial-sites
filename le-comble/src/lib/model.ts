/* The house, as numbers. Source: BRIEF.md §5–§8. Copy lives in src/content. */

export type RoomTypeId = "mansarde" | "trame" | "atelier" | "grand-atelier";

export type RoomType = {
  id: RoomTypeId;
  /** How many rooms of this type exist (brief §7). */
  count: number;
  /** Lowest nightly rate in euros (brief §7). */
  from: number;
  maxGuests: number;
  floor: 1 | 2 | 4; // 1 = first floor (the workshop), 2 = second and third, 4 = under the roof
};

export const ROOM_TYPES: readonly RoomType[] = [
  { id: "mansarde", count: 7, from: 190, maxGuests: 2, floor: 4 },
  { id: "trame", count: 9, from: 260, maxGuests: 2, floor: 2 },
  { id: "atelier", count: 2, from: 380, maxGuests: 2, floor: 1 },
  { id: "grand-atelier", count: 1, from: 520, maxGuests: 2, floor: 1 },
];

export const TOTAL_ROOMS = ROOM_TYPES.reduce((n, r) => n + r.count, 0); // 19

export function roomType(id: string): RoomType | undefined {
  return ROOM_TYPES.find((r) => r.id === id);
}

export const BREAKFAST_PER_GUEST = 18; // brief §7
export const MIN_GUEST_AGE = 10; // brief §7
export const MAX_NIGHTS = 14;

/* Restaurant — Navette (brief §5). Days are JS getUTCDay(): 0 = Sunday. */
export const MENU_PRICE = 68;
export const MENU_COURSES = 5;
export const COVERS_DINING_ROOM = 38;
export const COVERS_COURTYARD = 16; // May to September
export const COURTYARD_MONTHS = [5, 6, 7, 8, 9]; // 1-based months

export type Service = "lunch" | "dinner";

export const SERVICE_DAYS: Record<Service, number[]> = {
  dinner: [2, 3, 4, 5, 6], // Tuesday to Saturday
  lunch: [5, 6], // Friday and Saturday
};

export const SITTINGS: Record<Service, string[]> = {
  lunch: ["12:00", "12:30", "13:00", "13:30"],
  dinner: ["19:00", "19:30", "20:00", "20:30", "21:00", "21:30"],
};

/** Seats offered per sitting (tables turn, so a sitting is a share of the room). */
export const SITTING_SEATS: Record<Service, number> = { lunch: 18, dinner: 14 };
export const SITTING_SEATS_COURTYARD = 6;

export const MAX_PARTY = 8; // above this it is a private-hire enquiry
export const TABLE_HOLD_MINUTES = 10;

/* Le Toit (brief §6) */
export const BAR_SEATS = 14;
export const BAR_OPENS = "18:00";

/* Private hire (brief §8) */
export const HIRE_SEATED = 40;
export const HIRE_STANDING = 70;
export const HIRE_REPLY_WORKING_DAYS = 2;
