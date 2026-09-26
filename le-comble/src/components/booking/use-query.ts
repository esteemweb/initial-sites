"use client";

import { useCallback, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/* Booking state lives in the URL (design-system §8): every step can be
   linked to, reloaded, and the back button walks the steps. Personal details
   never go in the URL. `push` for step changes, `replace` for field edits.

   Router updates are asynchronous, so writes also go into an optimistic
   overlay that reads back immediately. The overlay is keyed to the URL it was
   written against and stops applying as soon as the URL changes — no effect
   needed. Without it a checkbox snaps back for a frame and two quick calendar
   clicks read a stale arrival date. */

type Values = Record<string, string | undefined>;
type Overlay = { base: string; values: Values };
const EMPTY: Values = {};

export function useQuery() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const current = params.toString();
  const [overlay, setOverlay] = useState<Overlay>({ base: "", values: EMPTY });
  const pending = useRef<Overlay>({ base: "", values: EMPTY });

  const active = overlay.base === current ? overlay.values : EMPTY;

  const get = useCallback(
    (k: string) => (k in active ? active[k] : (params.get(k) ?? undefined)),
    [params, active],
  );

  const set = useCallback(
    (patch: Record<string, string | number | undefined>, mode: "push" | "replace" = "replace") => {
      const prev = pending.current.base === current ? pending.current.values : EMPTY;
      const values: Values = { ...prev };
      for (const [k, v] of Object.entries(patch)) {
        values[k] = v === undefined || v === "" ? undefined : String(v);
      }
      pending.current = { base: current, values };
      setOverlay(pending.current);

      const next = new URLSearchParams(current);
      for (const [k, v] of Object.entries(values)) {
        if (v === undefined) next.delete(k);
        else next.set(k, v);
      }
      const qs = next.toString();
      router[mode](qs ? `${pathname}?${qs}` : pathname, { scroll: mode === "push" });
    },
    [current, pathname, router],
  );

  return { get, set };
}
