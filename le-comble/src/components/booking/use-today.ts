"use client";

import { useSyncExternalStore } from "react";
import { todayISO, type ISODate } from "@/lib/dates";

/* The visitor's calendar date. null during the static render (the server
   can't know it), the real date after hydration — no effect needed. */

const noop = () => () => {};

export function useToday(): ISODate | null {
  return useSyncExternalStore(noop, () => todayISO(), () => null);
}
