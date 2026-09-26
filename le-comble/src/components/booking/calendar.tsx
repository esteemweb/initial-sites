"use client";

import { useState } from "react";
import { COMMON } from "@/content/booking";
import type { Lang } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { formatDate, formatMonth, monthGrid, parseISO, type ISODate } from "@/lib/dates";

/* Month calendar, one month at a time (the reference shows two, autopsy
   §9.5; one fits a 390px screen). Days are 48px buttons. Single date or
   range. `note` puts a small line under a day (e.g. "full"). */

const WEEKDAYS: Record<Lang, string[]> = {
  fr: ["L", "M", "M", "J", "V", "S", "D"],
  en: ["M", "T", "W", "T", "F", "S", "S"],
};

export function Calendar({
  lang,
  start,
  from,
  to,
  onSelect,
  isDisabled,
  minMonth,
  maxMonth,
}: {
  lang: Lang;
  start: ISODate; // month shown first
  from?: ISODate;
  to?: ISODate;
  onSelect: (iso: ISODate) => void;
  isDisabled: (iso: ISODate) => boolean;
  minMonth: ISODate;
  maxMonth: ISODate;
}) {
  const s = parseISO(start);
  const [ym, setYm] = useState({ y: s.getUTCFullYear(), m: s.getUTCMonth() + 1 });
  const key = (y: number, m: number) => y * 12 + m;
  const min = parseISO(minMonth);
  const max = parseISO(maxMonth);
  const canPrev = key(ym.y, ym.m) > key(min.getUTCFullYear(), min.getUTCMonth() + 1);
  const canNext = key(ym.y, ym.m) < key(max.getUTCFullYear(), max.getUTCMonth() + 1);
  const shift = (n: number) =>
    setYm(({ y, m }) => {
      const t = y * 12 + (m - 1) + n;
      return { y: Math.floor(t / 12), m: (t % 12) + 1 };
    });

  const cells = monthGrid(ym.y, ym.m);
  const inRange = (d: ISODate) => from && to && d > from && d < to;

  return (
    <div className="w-full max-w-sheet">
      <div className="flex items-center justify-between border-b border-ink pb-8">
        <button
          type="button"
          className="type-small font-medium flex size-48 items-center justify-center rounded-control hover:bg-ink hover:text-ground disabled:cursor-not-allowed disabled:line-through"
          onClick={() => shift(-1)}
          disabled={!canPrev}
          aria-label={COMMON.prevMonth[lang]}
        >
          ←
        </button>
        <p className="type-md capitalize" aria-live="polite">
          {formatMonth(ym.y, ym.m, lang)}
        </p>
        <button
          type="button"
          className="type-small font-medium flex size-48 items-center justify-center rounded-control hover:bg-ink hover:text-ground disabled:cursor-not-allowed disabled:line-through"
          onClick={() => shift(1)}
          disabled={!canNext}
          aria-label={COMMON.nextMonth[lang]}
        >
          →
        </button>
      </div>
      <div role="grid" className="grid grid-cols-7">
        <div role="row" className="contents">
          {WEEKDAYS[lang].map((w, i) => (
            <span role="columnheader" key={i} className="type-label flex h-48 items-center justify-center text-ink">
              {w}
            </span>
          ))}
        </div>
        {cells.map((d, i) =>
          d ? (
            <button
              key={d}
              type="button"
              role="gridcell"
              disabled={isDisabled(d)}
              aria-selected={d === from || d === to}
              aria-label={formatDate(d, lang, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              onClick={() => onSelect(d)}
              className={cn(
                "type-body font-medium tabular-nums flex h-48 items-center justify-center rounded-control transition-colors duration-(--duration-fast)",
                "disabled:cursor-not-allowed disabled:line-through",
                "enabled:hover:bg-ink enabled:hover:text-ground",
                (d === from || d === to) && "bg-ink text-ground",
                inRange(d) && "inset-ring inset-ring-ink",
              )}
            >
              {Number(d.slice(8))}
            </button>
          ) : (
            <span key={`e${i}`} aria-hidden />
          ),
        )}
      </div>
    </div>
  );
}
