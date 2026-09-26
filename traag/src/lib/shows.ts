import { shows, type Show } from "@/data/dates";

/** Local calendar date as YYYY-MM-DD. */
export function todayKey(now: Date = new Date()) {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const byDate = (a: Show, b: Show) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0);

/** Shows on or after today, soonest first. A show counts as upcoming on the night itself. */
export function upcoming(now: Date = new Date()) {
  const t = todayKey(now);
  return shows.filter((s) => s.date >= t).sort(byDate);
}

/** Shows before today, most recent first. */
export function past(now: Date = new Date()) {
  const t = todayKey(now);
  return shows
    .filter((s) => s.date < t)
    .sort(byDate)
    .reverse();
}

/** The genuinely next show, or null when nothing is booked. */
export function nextShow(now: Date = new Date()): Show | null {
  return upcoming(now)[0] ?? null;
}

/** 04.04 */
export function ddmm(date: string) {
  const [, m, d] = date.split("-");
  return `${d}.${m}`;
}

/** 04.04.2026 */
export function ddmmyyyy(date: string) {
  const [y, m, d] = date.split("-");
  return `${d}.${m}.${y}`;
}

/** sat 4 april 2026, for screen readers and datetime labels */
export function longDate(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
