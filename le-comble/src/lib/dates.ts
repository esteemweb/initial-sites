/* Calendar dates as "YYYY-MM-DD" strings, computed in UTC so a date never
   shifts with the visitor's timezone. */

export type ISODate = string;

export function toISO(d: Date): ISODate {
  return d.toISOString().slice(0, 10);
}

export function parseISO(iso: ISODate): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function isISODate(value: string | null | undefined): value is ISODate {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return toISO(parseISO(value)) === value;
}

export function addDays(iso: ISODate, n: number): ISODate {
  const d = parseISO(iso);
  d.setUTCDate(d.getUTCDate() + n);
  return toISO(d);
}

export function diffDays(from: ISODate, to: ISODate): number {
  return Math.round((parseISO(to).getTime() - parseISO(from).getTime()) / 86_400_000);
}

export function weekday(iso: ISODate): number {
  return parseISO(iso).getUTCDay();
}

export function month(iso: ISODate): number {
  return parseISO(iso).getUTCMonth() + 1;
}

/** Local "today" of the visitor, as a calendar date. */
export function todayISO(now: Date = new Date()): ISODate {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Each night of a stay: arrival inclusive, departure exclusive. */
export function nightsOf(arrival: ISODate, departure: ISODate): ISODate[] {
  const n = diffDays(arrival, departure);
  return Array.from({ length: Math.max(0, n) }, (_, i) => addDays(arrival, i));
}

/** Add working days (Mon–Fri), skipping weekends. */
export function addWorkingDays(iso: ISODate, n: number): ISODate {
  let d = iso;
  let left = n;
  while (left > 0) {
    d = addDays(d, 1);
    const w = weekday(d);
    if (w !== 0 && w !== 6) left--;
  }
  return d;
}

/** The month grid for a calendar: leading nulls so Monday is column one. */
export function monthGrid(year: number, month1: number): (ISODate | null)[] {
  const first = new Date(Date.UTC(year, month1 - 1, 1));
  const lead = (first.getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(year, month1, 0)).getUTCDate();
  const cells: (ISODate | null)[] = Array(lead).fill(null);
  for (let d = 1; d <= days; d++) {
    cells.push(toISO(new Date(Date.UTC(year, month1 - 1, d))));
  }
  return cells;
}

export function formatDate(
  iso: ISODate,
  lang: "fr" | "en",
  opts: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long" },
): string {
  return new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-GB", {
    ...opts,
    timeZone: "UTC",
  }).format(parseISO(iso));
}

export function formatMonth(year: number, month1: number, lang: "fr" | "en"): string {
  return new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month1 - 1, 1)));
}

/** "19:30" → "19 h 30" in French, unchanged in English. */
export function formatTime(hhmm: string, lang: "fr" | "en"): string {
  if (lang === "en") return hhmm;
  const [h, m] = hhmm.split(":");
  return m === "00" ? `${Number(h)} h` : `${Number(h)} h ${m}`;
}
