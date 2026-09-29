// Consultation slots for the next two weeks, generated deterministically so
// the demo is stable: studio hours, Mondays closed, a handful of slots
// marked as taken by a simple hash. Times are Japan Standard Time.

export type Slot = { id: string; date: string; time: string; taken: boolean };
export type SlotDay = { date: string; label: string; weekday: string; slots: Slot[] };

const TZ = "Asia/Tokyo";
const TIMES = ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
const SUNDAY_TIMES = ["12:00", "13:00", "14:00", "15:00", "16:00"];

function tokyoDateParts(d: Date) {
  const f = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  });
  const parts = Object.fromEntries(f.formatToParts(d).map((p) => [p.type, p.value]));
  return { iso: `${parts.year}-${parts.month}-${parts.day}`, weekday: parts.weekday as string };
}

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0) % 100;
}

export function consultationSlots(days = 14, from = new Date()): SlotDay[] {
  const out: SlotDay[] = [];
  const start = new Date(from.getTime() + 24 * 3600 * 1000); // from tomorrow
  for (let i = 0; i < days; i++) {
    const d = new Date(start.getTime() + i * 24 * 3600 * 1000);
    const { iso, weekday } = tokyoDateParts(d);
    if (weekday === "Mon") continue;
    const times = weekday === "Sun" ? SUNDAY_TIMES : TIMES;
    const label = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, day: "numeric", month: "short" }).format(d);
    out.push({
      date: iso,
      label,
      weekday,
      slots: times.map((time) => ({ id: `${iso}T${time}`, date: iso, time, taken: hash(iso + time) < 35 })),
    });
  }
  return out;
}

export function findSlot(id: string): Slot | undefined {
  for (const day of consultationSlots()) {
    const s = day.slots.find((x) => x.id === id);
    if (s) return s;
  }
  return undefined;
}

export function formatSlot(id: string) {
  const [date, time] = id.split("T");
  const d = new Date(`${date}T${time}:00+09:00`);
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}
