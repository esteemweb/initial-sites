/**
 * Every show, past and upcoming. Dates are local calendar dates, no time
 * zone: a show is "on" the night its doors open. Past shows stay in the
 * list because a DJ's history is the proof.
 */

export type Show = {
  id: string;
  /** YYYY-MM-DD, the night doors open */
  date: string;
  /** door time, 24h */
  doors: string;
  city: string;
  country: "BE" | "NL" | "DE" | "FR";
  venue: string;
  capacity: number;
  soldOut?: boolean;
  /** one short line in her voice, optional */
  note?: string;
  tickets?: string;
};

export const shows: Show[] = [
  {
    id: "2025-11-kelder",
    date: "2025-11-14",
    doors: "23:00",
    city: "ghent",
    country: "BE",
    venue: "kelder",
    capacity: 450,
    note: "first one with my name on the door",
  },
  {
    id: "2025-12-volta",
    date: "2025-12-05",
    doors: "23:00",
    city: "brussels",
    country: "BE",
    venue: "volta",
    capacity: 600,
  },
  {
    id: "2026-01-zuiderdok",
    date: "2026-01-17",
    doors: "00:00",
    city: "antwerp",
    country: "BE",
    venue: "zuiderdok",
    capacity: 500,
  },
  {
    id: "2026-02-loods6",
    date: "2026-02-21",
    doors: "23:00",
    city: "rotterdam",
    country: "NL",
    venue: "loods 6",
    capacity: 550,
  },
  {
    id: "2026-03-halleb",
    date: "2026-03-13",
    doors: "23:00",
    city: "lille",
    country: "FR",
    venue: "la halle b",
    capacity: 400,
  },
  {
    id: "2026-04-kelder",
    date: "2026-04-04",
    doors: "23:00",
    city: "ghent",
    country: "BE",
    venue: "kelder",
    capacity: 450,
    soldOut: true,
    note: "until it finishes",
  },
  {
    id: "2026-05-werk9",
    date: "2026-05-22",
    doors: "00:00",
    city: "berlin",
    country: "DE",
    venue: "werk 9",
    capacity: 700,
  },
  {
    id: "2026-06-ateliers",
    date: "2026-06-27",
    doors: "23:00",
    city: "charleroi",
    country: "BE",
    venue: "les ateliers",
    capacity: 500,
  },
  {
    id: "2026-09-soussol",
    date: "2026-09-05",
    doors: "23:00",
    city: "paris",
    country: "FR",
    venue: "le sous-sol",
    capacity: 480,
    soldOut: true,
  },
  {
    id: "2026-10-volta",
    date: "2026-10-10",
    doors: "23:00",
    city: "brussels",
    country: "BE",
    venue: "volta",
    capacity: 600,
    tickets: "https://example.com/tickets/volta-10-10",
  },
  {
    id: "2026-10-ketelhuis",
    date: "2026-10-30",
    doors: "00:00",
    city: "amsterdam",
    country: "NL",
    venue: "ketelhuis",
    capacity: 650,
    soldOut: true,
    note: "no guest list. ask anyway",
  },
  {
    id: "2026-11-halle2",
    date: "2026-11-21",
    doors: "23:00",
    city: "cologne",
    country: "DE",
    venue: "halle 2",
    capacity: 550,
    tickets: "https://example.com/tickets/halle2-21-11",
  },
  {
    id: "2026-12-kelder",
    date: "2026-12-12",
    doors: "23:00",
    city: "ghent",
    country: "BE",
    venue: "kelder",
    capacity: 450,
    note: "home. until it finishes",
    tickets: "https://example.com/tickets/kelder-12-12",
  },
  {
    id: "2027-01-zuiderdok",
    date: "2027-01-29",
    doors: "00:00",
    city: "antwerp",
    country: "BE",
    venue: "zuiderdok",
    capacity: 500,
    tickets: "https://example.com/tickets/zuiderdok-29-01",
  },
];
