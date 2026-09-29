"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { consultationSlots } from "@/lib/booking/slots";

function nextOpen() {
  for (const day of consultationSlots()) {
    const s = day.slots.find((x) => !x.taken);
    if (s) return `${day.weekday} ${day.label}, ${s.time}`;
  }
  return null;
}

const noop = () => () => {};

/** The next open consultation, computed in the browser so it's never a stale build-time value. */
export function NextSlot({ className = "", stacked = false }: { className?: string; stacked?: boolean }) {
  const label = useSyncExternalStore(noop, nextOpen, () => null);
  return (
    <Link href="/book" className={`no-underline underline-offset-4 hover:underline ${className}`}>
      {label ? (
        stacked ? (
          <>
            <span className="block text-text-muted">Next consultation</span>
            <span className="block">{label}</span>
          </>
        ) : (
          <>Next consultation: {label}</>
        )
      ) : (
        <>Book a consultation</>
      )}
    </Link>
  );
}
