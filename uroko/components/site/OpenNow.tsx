"use client";

import { useSyncExternalStore } from "react";
import { site } from "@/lib/content/site";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** Whether the studio is open right now, in Yokohama time, and when that changes. */
function status() {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Tokyo", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  const now = Number(get("hour")) * 60 + Number(get("minute"));
  const today = site.openingHours[day];
  if (today && now >= toMin(today[0]) && now < toMin(today[1])) return { open: true, text: `Open now, until ${today[1]} Yokohama time` };
  if (today && now < toMin(today[0])) return { open: false, text: `Closed now. Opens today at ${today[0]}` };
  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7;
    const h = site.openingHours[d];
    if (h) return { open: false, text: `Closed now. Opens ${i === 1 ? "tomorrow" : DAYS[d]} at ${h[0]}` };
  }
  return null;
}

// Re-check once a minute; the store returns a string so React can compare snapshots.
const subscribe = (cb: () => void) => {
  const id = setInterval(cb, 60_000);
  return () => clearInterval(id);
};
const snapshot = () => JSON.stringify(status());

export function OpenNow({ className = "" }: { className?: string }) {
  const raw = useSyncExternalStore(subscribe, snapshot, () => "null");
  const s = JSON.parse(raw) as ReturnType<typeof status>;
  if (!s) return null;
  return (
    <p className={`flex items-center gap-3 ${className}`}>
      <span className={`inline-block h-2 w-2 rounded-full ${s.open ? "bg-ok" : "bg-shu-bright"}`} aria-hidden="true" />
      {s.text}
    </p>
  );
}
