"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Show } from "@/data/dates";
import { ddmm, longDate, nextShow } from "@/lib/shows";
import s from "./livemarker.module.css";

/**
 * Always the genuinely next show. Computed on the client from the
 * visitor's clock, so a statically built page never shows last night.
 * Renders an empty chip of the same height on the server, so nothing
 * shifts when the text arrives.
 */
export default function LiveMarker() {
  const [show, setShow] = useState<Show | null | undefined>(undefined);

  useEffect(() => {
    setShow(nextShow(new Date()));
  }, []);

  if (show === undefined) {
    return <div className={`${s.live} t-record-label`} aria-hidden="true" />;
  }

  if (show === null) {
    return (
      <Link href="/dates" className={`${s.live} t-record-label`}>
        <span className={s.text}>nothing booked</span>
      </Link>
    );
  }

  return (
    // The spoken name starts with exactly what is on screen (WCAG 2.5.3,
    // so voice control users can say what they see); the long date follows
    // as hidden context.
    <Link href="/dates" className={`${s.live} t-record-label`}>
      <span className={s.dot} aria-hidden="true" />
      <span className={s.text}>
        {ddmm(show.date)} {show.venue} — {show.city}
      </span>
      <span className="sr-only">, next show, {longDate(show.date)}</span>
    </Link>
  );
}
