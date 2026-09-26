"use client";

import { useEffect, useState } from "react";
import { shows } from "@/data/dates";
import { ddmm, longDate, todayKey } from "@/lib/shows";
import s from "./nextup.module.css";

/** The next four shows as rounded rows. Split on the visitor's clock. */
export default function NextUp({ built }: { built: string }) {
  const [today, setToday] = useState(built);
  useEffect(() => setToday(todayKey()), []);
  const next = [...shows].filter((x) => x.date >= today).sort((a, b) => (a.date < b.date ? -1 : 1)).slice(0, 4);

  if (!next.length) return <p className="t-body">nothing booked. ask.</p>;

  return (
    <ol className={s.rows}>
      {next.map((x) => (
        <li key={x.id} className={s.row}>
          <span className={s.date} aria-hidden="true">
            {ddmm(x.date)}
          </span>
          <span className={s.text}>
            <span className="sr-only">{longDate(x.date)}: </span>
            <span className={s.city}>{x.city}</span> — {x.venue}
            <span className={`${s.meta} t-record`}> · doors {x.doors}</span>
          </span>
          {x.soldOut ? (
            <span className={`${s.status} t-record-label`}>sold out</span>
          ) : x.tickets ? (
            <a href={x.tickets} rel="noopener" className={`${s.status} ${s.tix} t-record-label`} aria-label={`tickets for ${x.venue}, ${x.city}`}>
              tickets
            </a>
          ) : (
            <span className={`${s.status} t-record-label ghost`}>soon</span>
          )}
        </li>
      ))}
    </ol>
  );
}
