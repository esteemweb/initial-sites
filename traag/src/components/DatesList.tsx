"use client";

import { useEffect, useState } from "react";
import type { Show } from "@/data/dates";
import { shows } from "@/data/dates";
import { ddmmyyyy, longDate, todayKey } from "@/lib/shows";
import s from "./dates.module.css";

const WEEKDAY = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
function weekday(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return WEEKDAY[new Date(y, m - 1, d).getDay()];
}

function Row({ show, past, i }: { show: Show; past?: boolean; i: number }) {
  let status: React.ReactNode;
  if (show.soldOut) status = <span className={s.sold}>SOLD OUT</span>;
  else if (past) status = <span>played</span>;
  else if (show.tickets)
    status = (
      <a href={show.tickets} rel="noopener" className={s.tix} aria-label={`tickets for ${show.venue}, ${show.city}, ${longDate(show.date)}`}>
        tickets →
      </a>
    );
  else status = <span>soon</span>;

  return (
    <li className={`${s.row} ${past ? s.past : ""}`} style={{ "--i": Math.min(i, 7) } as React.CSSProperties}>
      <span className={s.date}>
        <time dateTime={show.date}>
          <span className="sr-only">{longDate(show.date)}</span>
          <span aria-hidden="true">{ddmmyyyy(show.date)}</span>
        </time>
        <span className={s.day} aria-hidden="true">
          {weekday(show.date)}
        </span>
      </span>
      <span className={s.city}>{show.city}</span>
      <span className={s.venue}>
        {show.venue}
        <span className="sr-only">, capacity {show.capacity}</span>
      </span>
      <span className={s.doors}>
        <span className={s.label}>doors </span>
        {show.doors}
      </span>
      <span className={s.status}>{status}</span>
      {show.note && <span className={s.note}>{show.note}</span>}
    </li>
  );
}

/**
 * Upcoming and past are split on the visitor's clock after hydration, so
 * a page built weeks ago still files last night's show under "played".
 * The first render uses the build date, which is the same list on the
 * day of the build.
 */
export default function DatesList({
  built,
  limit,
  withPast,
  animate = true,
}: {
  built: string;
  limit?: number;
  withPast?: boolean;
  animate?: boolean;
}) {
  const reveal = animate ? "rows" : undefined;
  const [today, setToday] = useState(built);
  useEffect(() => setToday(todayKey()), []);

  const sorted = [...shows].sort((a, b) => (a.date < b.date ? -1 : 1));
  const upcoming = sorted.filter((x) => x.date >= today);
  const past = sorted.filter((x) => x.date < today).reverse();
  const shown = limit ? upcoming.slice(0, limit) : upcoming;

  return (
    <div className={`${s.wrap} t-record`}>
      <div className={s.head} aria-hidden="true">
        <span>date</span>
        <span>city</span>
        <span>venue</span>
        <span>doors</span>
        <span>status</span>
      </div>
      {shown.length ? (
        <ol className={s.list} aria-label="upcoming dates" data-reveal={reveal}>
          {shown.map((x, i) => (
            <Row key={x.id} show={x} i={i} />
          ))}
        </ol>
      ) : (
        <p className={s.empty}>nothing booked. ask</p>
      )}

      {withPast && past.length > 0 && (
        <>
          <h2 className={`${s.pastHead} t-record-label ghost`} id="played">
            played
          </h2>
          <ol className={s.list} aria-labelledby="played" data-reveal={reveal}>
            {past.map((x, i) => (
              <Row key={x.id} show={x} past i={i} />
            ))}
          </ol>
        </>
      )}
    </div>
  );
}
