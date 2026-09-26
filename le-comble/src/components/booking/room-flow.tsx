"use client";

import { useState } from "react";
import { COMMON, ROOM_FLOW as T } from "@/content/booking";
import { ROOMS, roomCopy } from "@/content/rooms";
import { euros, fill } from "@/content/site";
import { href, type Lang } from "@/lib/i18n";
import { BREAKFAST_PER_GUEST, MAX_NIGHTS, roomType } from "@/lib/model";
import { isOpen as isOpenForTable, quote, reference, season, isWeekendNight, validateStay } from "@/lib/booking";
import { addDays, diffDays, formatDate, isISODate, type ISODate } from "@/lib/dates";
import { useToday } from "./use-today";
import { cn } from "@/lib/cn";
import { Button, ButtonLink } from "@/components/ui/button";
import { Checkbox, Field, Select, Stepper, TextArea, TextInput } from "@/components/ui/fields";
import { Calendar } from "./calendar";
import { OtherPaths, Steps } from "./flow-shell";
import { useQuery } from "./use-query";

/* Path 2 — a room. brief §10: dates, guests, room type, availability,
   seasonal rates, three-step confirmation with no payment.
   pattern: REFERENCE-AUTOPSY §9.5 (Mews flow) cut from five steps to three,
   room preselected from the page you came from (fixes §9.3). */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Confirmed = { ref: string; name: string; email: string; alsoTable: boolean };

export function RoomFlow({ lang }: { lang: Lang }) {
  const { get, set } = useQuery();
  const today = useToday();

  const from = isISODate(get("from")) ? get("from")! : undefined;
  const to = isISODate(get("to")) ? get("to")! : undefined;
  const guests = Math.min(2, Math.max(1, Number(get("guests") ?? 2) || 2));
  const roomId = roomType(get("room") ?? "")?.id;
  const breakfast = get("breakfast") === "1";
  const step = Math.min(3, Math.max(1, Number(get("step") ?? 1) || 1));

  const [details, setDetails] = useState({ name: "", email: "", phone: "", arrival: "0", notes: "", alsoTable: false, terms: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState<Confirmed | null>(null);

  const stayError = today && from && to ? validateStay(from, to, guests, today) : null;
  const nights = from && to ? diffDays(from, to) : 0;
  const quotes =
    from && to && !stayError
      ? ROOMS.map((r) => quote(r.id, from, to, guests, breakfast, BREAKFAST_PER_GUEST))
      : [];
  const chosen = quotes.find((q) => q.type === roomId);

  // Guard: a step can't be reached without what it needs (deep links, back button).
  const effectiveStep = step >= 2 && (!from || !to || stayError) ? 1 : step === 3 && (!chosen || chosen.left === 0) ? 2 : step;

  if (!today) return <p className="text-ink">…</p>;

  const nightsLabel = (n: number) => fill((n === 1 ? T.nights : T.nightsPlural)[lang], { n });
  const guestsLabel = (n: number) => fill((n === 1 ? T.guestsCount : T.guestsCountPlural)[lang], { n });
  const fmt = (d: ISODate) => formatDate(d, lang, { weekday: "short", day: "numeric", month: "short" });

  if (confirmed && from && to && chosen) {
    const name = roomCopy(chosen.type)!.name;
    let tableDate = from;
    for (let i = 0; i < 7 && !isOpenForTable(tableDate); i++) tableDate = addDays(tableDate, 1);
    return (
      <div className="flex flex-col gap-24" role="status">
        <p className="type-label text-ink">
          {COMMON.reference[lang]} {confirmed.ref}
        </p>
        <h2 className="type-xl">{T.confirmedTitle[lang]}</h2>
        <p className="type-body max-w-prose">
          {fill(T.confirmedBody[lang], {
            room: name,
            from: formatDate(from, lang),
            to: formatDate(to, lang),
            guests: guestsLabel(guests),
            email: confirmed.email,
          })}
        </p>
        <p className="type-body font-medium tabular-nums border-t border-ink pt-16">
          {T.total[lang]} {euros(chosen.total, lang)} · {nightsLabel(nights)}
        </p>
        <p className="border-l-2 border-mark pl-16 text-ink">{T.noPayment[lang]} {T.tax[lang]}</p>
        {confirmed.alsoTable && (
          <ButtonLink href={href(lang, "bookTable", {}, { date: tableDate, party: String(guests) })} className="w-fit">
            {T.bookTableNow[lang]}
          </ButtonLink>
        )}
        <p className="type-small text-ink">{COMMON.demo.room[lang]}</p>
      </div>
    );
  }

  const summary = (
    <aside className="flex flex-col gap-16 border-t border-ink pt-16 lg:sticky lg:top-96">
      <p className="type-label text-ink">{T.summary[lang]}</p>
      {from && to && !stayError ? (
        <>
          <p className="type-body font-medium tabular-nums">
            {fmt(from)} → {fmt(to)}
          </p>
          <p className="text-ink">
            {nightsLabel(nights)} · {guestsLabel(guests)}
          </p>
        </>
      ) : (
        <p className="text-ink">{T.pickArrival[lang]}</p>
      )}
      {chosen && (
        <>
          <p className="type-md">{roomCopy(chosen.type)!.name}</p>
          <p className="type-body font-medium tabular-nums border-t border-ink pt-16">
            {T.total[lang]} {euros(chosen.total, lang)}
          </p>
          <p className="type-small text-ink">{T.tax[lang]}</p>
        </>
      )}
      <OtherPaths lang={lang} current="room" />
    </aside>
  );

  return (
    <div className="grid grid-cols-12 gap-x-16 gap-y-48 lg:gap-x-24">
      <div className="col-span-12 flex flex-col gap-32 lg:col-span-7">
        <Steps steps={T.steps} current={effectiveStep - 1} lang={lang} />

        {effectiveStep === 1 && (
          <div className="flex flex-col gap-32">
            <div className="flex flex-col gap-16">
              <p className="type-small font-medium" aria-live="polite">
                {!from || (from && to) ? T.pickArrival[lang] : T.pickDeparture[lang]}
              </p>
              <Calendar
                lang={lang}
                start={from ?? today}
                from={from}
                to={to}
                minMonth={today}
                maxMonth={addDays(today, 365)}
                isDisabled={(d) => d < today || d > addDays(today, 365) || (!!from && !to && d > from && diffDays(from, d) > MAX_NIGHTS)}
                onSelect={(d) => {
                  if (!from || to || d <= from) set({ from: d, to: undefined });
                  else set({ to: d });
                }}
              />
              {stayError && <p className="type-small text-ink">{T.stayErrors[stayError][lang]}</p>}
            </div>
            <Stepper
              label={T.guests[lang]}
              value={guests}
              min={1}
              max={2}
              onChange={(n) => set({ guests: n })}
            />
            <p className="type-small max-w-prose text-ink">{T.guestsNote[lang]}</p>
            <div>
              <Button disabled={!from || !to || Boolean(stayError)} onClick={() => set({ step: 2 }, "push")}>
                {T.seeRooms[lang]}
              </Button>
            </div>
          </div>
        )}

        {effectiveStep === 2 && (
          <div className="flex flex-col gap-32">
            <h2 className="type-md">{T.chooseRoom[lang]}</h2>
            <ul className="border-t border-ink">
              {quotes.map((q) => {
                const copy = roomCopy(q.type)!;
                const selected = q.type === roomId;
                const full = q.left === 0;
                return (
                  <li key={q.type} className={"border-b border-ink py-24"}>
                    <div className="flex flex-wrap items-start justify-between gap-16">
                      <div className="flex flex-col gap-4">
                        <p className="type-label text-ink">{copy.floor[lang]}</p>
                        <p className="type-md">{copy.name}</p>
                        <p className={cn("type-small", full && "font-medium line-through")}>
                          {full
                            ? T.full[lang]
                            : fill((q.left === 1 ? T.left : T.leftPlural)[lang], { n: q.left })}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-8">
                        <p className="type-md tabular-nums">{euros(q.total, lang)}</p>
                        <p className="type-small text-ink">{nightsLabel(q.nights.length)}</p>
                        <Button
                          variant={selected ? "primary" : "secondary"}
                          disabled={full}
                          aria-pressed={selected}
                          onClick={() => set({ room: q.type })}
                        >
                          {selected ? T.selected[lang] : T.select[lang]}
                        </Button>
                      </div>
                    </div>
                    <details className="mt-16">
                      <summary className="type-small font-medium cursor-pointer">{T.perNightBreakdown[lang]}</summary>
                      <ul className="mt-8">
                        {q.nights.map((n) => (
                          <li key={n.date} className="type-small flex justify-between gap-16 border-b border-ink py-8 text-ink">
                            <span>
                              {fmt(n.date)} · {T.seasons[season(n.date)][lang]}
                              {isWeekendNight(n.date) ? ` · ${T.weekend[lang]}` : ""}
                            </span>
                            <span className="type-body font-medium tabular-nums text-ink">{euros(n.rate, lang)}</span>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </li>
                );
              })}
            </ul>
            <Checkbox
              label={`${T.breakfast[lang]} (+${euros(nights * guests * BREAKFAST_PER_GUEST, lang)})`}
              checked={breakfast}
              onChange={(e) => set({ breakfast: e.target.checked ? "1" : undefined })}
            />
            <div className="flex flex-wrap gap-24">
              <Button variant="secondary" onClick={() => set({ step: 1 }, "push")}>
                {COMMON.back[lang]}
              </Button>
              <Button disabled={!chosen || chosen.left === 0} onClick={() => set({ step: 3 }, "push")}>
                {COMMON.next[lang]}
              </Button>
            </div>
          </div>
        )}

        {effectiveStep === 3 && chosen && (
          <form
            noValidate
            className="flex flex-col gap-24"
            onSubmit={(e) => {
              e.preventDefault();
              const errs: Record<string, string> = {};
              if (!details.name.trim()) errs.name = COMMON.errors.name[lang];
              if (!EMAIL.test(details.email)) errs.email = COMMON.errors.email[lang];
              if (!details.terms) errs.terms = T.conditionsError[lang];
              setErrors(errs);
              if (Object.keys(errs).length) return;
              setConfirmed({
                ref: reference("LC", `${from}|${to}|${chosen.type}|${details.email}`),
                name: details.name,
                email: details.email,
                alsoTable: details.alsoTable,
              });
              window.scrollTo({ top: 0 });
            }}
          >
            <Field label={COMMON.name[lang]} error={errors.name}>
              {(p) => <TextInput {...p} autoComplete="name" value={details.name} onChange={(e) => setDetails({ ...details, name: e.target.value })} />}
            </Field>
            <Field label={COMMON.email[lang]} error={errors.email}>
              {(p) => <TextInput {...p} type="email" autoComplete="email" value={details.email} onChange={(e) => setDetails({ ...details, email: e.target.value })} />}
            </Field>
            <Field label={COMMON.phone[lang]} optional={lang === "fr" ? "facultatif" : "optional"}>
              {(p) => <TextInput {...p} type="tel" autoComplete="tel" value={details.phone} onChange={(e) => setDetails({ ...details, phone: e.target.value })} />}
            </Field>
            <Field label={T.arrivalTime[lang]}>
              {(p) => (
                <Select {...p} value={details.arrival} onChange={(e) => setDetails({ ...details, arrival: e.target.value })}>
                  {T.arrivalTimes.map((a, i) => (
                    <option key={a.fr} value={String(i)}>
                      {a[lang]}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
            <Field label={COMMON.notes[lang]} optional={lang === "fr" ? "facultatif" : "optional"}>
              {(p) => <TextArea {...p} value={details.notes} onChange={(e) => setDetails({ ...details, notes: e.target.value })} />}
            </Field>
            <Checkbox
              label={T.alsoTable[lang]}
              checked={details.alsoTable}
              onChange={(e) => setDetails({ ...details, alsoTable: e.target.checked })}
            />
            <Checkbox
              label={T.conditions[lang]}
              checked={details.terms}
              error={errors.terms}
              onChange={(e) => setDetails({ ...details, terms: e.target.checked })}
            />
            <p className="border-l-2 border-mark pl-16 text-ink">{T.noPayment[lang]}</p>
            <div className="flex flex-wrap gap-24">
              <Button variant="secondary" onClick={() => set({ step: 2 }, "push")}>
                {COMMON.back[lang]}
              </Button>
              <Button type="submit">{T.confirm[lang]}</Button>
            </div>
          </form>
        )}
      </div>
      <div className="col-span-12 lg:col-span-4 lg:col-start-9">{summary}</div>
    </div>
  );
}
