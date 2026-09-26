/* Days from a date to today, counted in London. Negative before the date. */
export function daysSince(isoDate: string, now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const today = Date.UTC(get("year"), get("month") - 1, get("day"));
  const [y, m, d] = isoDate.split("-").map(Number);
  return Math.round((today - Date.UTC(y, m - 1, d)) / 86_400_000);
}
