// Multi-session pieces for the tracker. Demo data: on a real site each piece
// is private to its client and reached through a link the studio sends.

export type SessionStatus = "done" | "healing" | "next" | "planned";

export type Session = {
  n: number;
  date?: string; // ISO date, Japan time
  status: SessionStatus;
  focus: string;
  hours?: number;
  note?: string;
};

export type Piece = {
  id: string;
  client: string; // initial only
  artist: string; // artist slug
  motifs: string[]; // motif slugs
  placement: string;
  method: "tebori" | "machine" | "both";
  started: string;
  totalSessions: number;
  sessions: Session[];
  deposit: number;
  perSession: number;
  aftercare?: string;
};

export const pieces: Piece[] = [
  {
    id: "UR-24-0031",
    client: "K.",
    artist: "kaito",
    motifs: ["ryu", "kumo", "nami"],
    placement: "Full back",
    method: "tebori",
    started: "2025-09-16",
    totalSessions: 18,
    deposit: 30000,
    perSession: 45000,
    aftercare: "Shoulder-blade area healing from session 11. Keep it out of the sun and off the gym for ten days.",
    sessions: [
      { n: 1, date: "2025-09-16", status: "done", focus: "Brush drawing on the body, outline of the dragon's head", hours: 3 },
      { n: 2, date: "2025-10-14", status: "done", focus: "Outline: body and claws", hours: 3.5 },
      { n: 3, date: "2025-11-11", status: "done", focus: "Outline: clouds, upper back", hours: 3.5 },
      { n: 4, date: "2025-12-09", status: "done", focus: "Outline: waves at the base", hours: 3 },
      { n: 5, date: "2026-01-13", status: "done", focus: "Shading: head and mane", hours: 4 },
      { n: 6, date: "2026-02-10", status: "done", focus: "Shading: body scales, upper half", hours: 4 },
      { n: 7, date: "2026-03-10", status: "done", focus: "Shading: body scales, lower half", hours: 4 },
      { n: 8, date: "2026-04-14", status: "done", focus: "Shading: clouds", hours: 3.5 },
      { n: 9, date: "2026-05-12", status: "done", focus: "Shading: waves", hours: 3.5 },
      { n: 10, date: "2026-06-16", status: "done", focus: "Black fill, background left side", hours: 4 },
      { n: 11, date: "2026-08-25", status: "healing", focus: "Black fill, background right side", hours: 4, note: "Skipped July for the client's travel. Healing well at the two-week check." },
      { n: 12, date: "2026-10-13", status: "next", focus: "Red: eyes, tongue, flame accents", hours: 3 },
      { n: 13, status: "planned", focus: "Colour: belly scales, first pass" },
      { n: 14, status: "planned", focus: "Colour: belly scales, second pass" },
      { n: 15, status: "planned", focus: "Colour: clouds, grey wash" },
      { n: 16, status: "planned", focus: "Colour: waves, indigo" },
      { n: 17, status: "planned", focus: "Touch-ups, first pass" },
      { n: 18, status: "planned", focus: "Final touch-ups and photographs" },
    ],
  },
  {
    id: "UR-25-0107",
    client: "A.",
    artist: "mio",
    motifs: ["botan", "kaze"],
    placement: "Half sleeve, right",
    method: "machine",
    started: "2026-05-20",
    totalSessions: 3,
    deposit: 10000,
    perSession: 35000,
    sessions: [
      { n: 1, date: "2026-05-20", status: "done", focus: "Outline: peonies and wind bars", hours: 3 },
      { n: 2, date: "2026-06-24", status: "done", focus: "Colour: petals, red and wine", hours: 3.5 },
      { n: 3, date: "2026-07-29", status: "done", focus: "Black wind bars, touch-ups, photographs", hours: 3, note: "Healed photographs taken 2 September." },
    ],
  },
  {
    id: "UR-26-0009",
    client: "T.",
    artist: "sho",
    motifs: ["tora", "take"],
    placement: "Left thigh",
    method: "both",
    started: "2026-08-04",
    totalSessions: 6,
    deposit: 15000,
    perSession: 40000,
    aftercare: "Outline healing. Loose trousers for a week; no soaking.",
    sessions: [
      { n: 1, date: "2026-08-04", status: "done", focus: "Outline: tiger (machine)", hours: 3 },
      { n: 2, date: "2026-09-08", status: "healing", focus: "Outline: bamboo (machine)", hours: 2.5 },
      { n: 3, date: "2026-10-06", status: "next", focus: "Shading: tiger stripes (tebori)", hours: 3.5 },
      { n: 4, status: "planned", focus: "Shading: face and paws (tebori)" },
      { n: 5, status: "planned", focus: "Bamboo shading, background" },
      { n: 6, status: "planned", focus: "Touch-ups and photographs" },
    ],
  },
];

export function getPiece(id: string) {
  return pieces.find((p) => p.id.toUpperCase() === id.trim().toUpperCase());
}

export function progress(p: Piece) {
  const done = p.sessions.filter((s) => s.status === "done" || s.status === "healing").length;
  return { done, total: p.totalSessions, ratio: done / p.totalSessions };
}
