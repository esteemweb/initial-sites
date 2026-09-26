"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { COMMON, TABLE_FLOW as T } from "@/content/booking";
import { fill } from "@/content/site";
import { href, type Lang } from "@/lib/i18n";
import { MAX_PARTY, TABLE_HOLD_MINUTES, type Service } from "@/lib/model";
import { noise, reference, servicesOn, sittingIsFuture, sittings } from "@/lib/booking";
import { addDays, formatDate, formatTime, isISODate, type ISODate } from "@/lib/dates";
import { useToday } from "./use-today";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Choice, Field, Stepper, TextArea, TextInput } from "@/components/ui/fields";
import { Calendar } from "./calendar";
import { OtherPaths, Steps } from "./flow-shell";
import { useQuery } from "./use-query";

/* Path 1 — a table. brief §10: date, service, party size, live availability
   by sitting, held for the guest's name. Availability is simulated
   (lib/booking); "live" means other bookings keep arriving while you look.
   pattern: REFERENCE-AUTOPSY §15 Q2 — the table path stays on-site and in
   the same visual language (the reference hands off to Zenchef, §9.2). */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BOOK_AHEAD_DAYS = 60;

export function TableFlow({ lang }: { lang: Lang }) {
  const { get, set } = useQuery();
  const today = useToday();
  const [now, setNow] = useState(() => new Date());

  const date = isISODate(get("date")) ? get("date")! : undefined;
  const party = Math.min(MAX_PARTY, Math.max(1, Number(get("party") ?? 2) || 2));
  const open = date ? servicesOn(date) : [];
  const service: Service | undefined = open.includes(get("service") as Service)
    ? (get("service") as Service)
    : open.includes("dinner")
      ? "dinner"
      : open[0];
  const time = get("time");
  const step = Math.min(3, Math.max(1, Number(get("step") ?? 1) || 1));

  /* Live: seats taken by other people since the page opened. */
  const [taken, setTaken] = useState<Record<string, number>>({});
  const [lastUpdate, setLastUpdate] = useState(() => Date.now());
  const [flash, setFlash] = useState<string | null>(null);
  const [hold, setHold] = useState<{ time: string; until: number } | null>(null);
  const [details, setDetails] = useState({ name: "", phone: "", email: "", diet: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState<{ ref: string; name: string } | null>(null);

  const base = today && date && service ? sittings(date, service, today) : [];
  const live = base.map((s) => {
    const k = `${date}|${service}|${s.time}`;
    return { ...s, left: Math.max(0, s.left - (taken[k] ?? 0)) };
  });

  // Other guests booking while you look: every 8–15 s one sitting loses a table of two.
  const liveRef = useRef(live);
  useEffect(() => {
    liveRef.current = live;
  });
  useEffect(() => {
    if (step !== 2 || !date || !service) return;
    let timer: ReturnType<typeof setTimeout>;
    const tick = (n: number) => {
      timer = setTimeout(() => {
        const candidates = liveRef.current.filter((s) => s.left >= 2);
        if (candidates.length) {
          const pick = candidates[Math.floor(noise(`${date}${service}${n}${Date.now()}`) * candidates.length)];
          const k = `${date}|${service}|${pick.time}`;
          setTaken((t) => ({ ...t, [k]: (t[k] ?? 0) + 2 }));
          setFlash(pick.time);
          setLastUpdate(Date.now());
        }
        tick(n + 1);
      }, 8000 + noise(`${n}${date}`) * 7000);
    };
    tick(0);
    return () => clearTimeout(timer);
  }, [step, date, service]);

  // One clock for "updated n s ago" and the hold countdown.
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // A hold that has run out is simply no longer a hold.
  const holdExpired = Boolean(hold && now.getTime() > hold.until && !confirmed);
  const activeHold = holdExpired ? null : hold;

  if (!today) return <p className="text-ink">…</p>;

  const effectiveStep = step >= 2 && (!date || !service) ? 1 : step === 3 && (!activeHold || activeHold.time !== time) ? 2 : step;
  const fmtDate = (d: ISODate) => formatDate(d, lang);
  const seatsLabel = (n: number) => fill((n === 1 ? T.seatLeft : T.seatsLeft)[lang], { n });

  if (confirmed && date && time) {
    return (
      <div className="flex flex-col gap-24" role="status">
        <p className="type-label text-ink">
          {COMMON.reference[lang]} {confirmed.ref}
        </p>
        <h2 className="type-xl">{T.confirmedTitle[lang]}</h2>
        <p className="type-body max-w-prose">
          {fill(T.confirmedBody[lang], { party, date: fmtDate(date), time: formatTime(time, lang), name: confirmed.name })}
        </p>
        <p className="border-l-2 border-mark pl-16 text-ink">{T.lateNote[lang]}</p>
        <p className="type-small text-ink">{COMMON.demo.table[lang]}</p>
      </div>
    );
  }

  const holdLeft = activeHold ? Math.max(0, activeHold.until - now.getTime()) : 0;
  const mmss = `${Math.floor(holdLeft / 60000)}:${String(Math.floor((holdLeft % 60000) / 1000)).padStart(2, "0")}`;
  const bookable = live.filter((s) => s.left >= party && sittingIsFuture(date!, s.time, today, now));

  return (
    <div className="grid grid-cols-12 gap-x-16 gap-y-48 lg:gap-x-24">
      <div className="col-span-12 flex flex-col gap-32 lg:col-span-7">
        <Steps steps={T.steps} current={effectiveStep - 1} lang={lang} />

        {effectiveStep === 1 && (
          <div className="flex flex-col gap-32">
            <div className="flex flex-col gap-16">
              <p className="type-small font-medium">{T.date[lang]}</p>
              <Calendar
                lang={lang}
                start={date ?? today}
                from={date}
                minMonth={today}
                maxMonth={addDays(today, BOOK_AHEAD_DAYS)}
                isDisabled={(d) => d < today || d > addDays(today, BOOK_AHEAD_DAYS) || servicesOn(d).length === 0}
                onSelect={(d) => set({ date: d, service: undefined, time: undefined })}
              />
              <p className="type-small text-ink">{T.closed[lang]}</p>
            </div>
            {date && (
              <Choice<Service>
                label={T.service[lang]}
                value={service}
                onChange={(v) => set({ service: v, time: undefined })}
                options={(["lunch", "dinner"] as Service[]).map((s) => ({
                  value: s,
                  label: T.services[s][lang],
                  disabled: !open.includes(s),
                  note: !open.includes(s) && s === "lunch" ? T.lunchOnlyFriSat[lang] : undefined,
                }))}
              />
            )}
            <div className="flex flex-col gap-8">
              <Stepper label={T.party[lang]} value={party} min={1} max={MAX_PARTY} onChange={(n) => set({ party: n, time: undefined })} />
              <p className="type-small text-ink">
                {T.partyNote[lang]}{" "}
                <Link href={href(lang, "bookBuilding", {}, { scope: "room" })}>{T.partyLink[lang]}</Link>
              </p>
            </div>
            <div>
              <Button disabled={!date || !service} onClick={() => set({ step: 2, service }, "push")}>
                {T.seeTimes[lang]}
              </Button>
            </div>
          </div>
        )}

        {effectiveStep === 2 && date && service && (
          <div className="flex flex-col gap-24">
            <div className="flex flex-wrap items-baseline justify-between gap-16">
              <h2 className="type-md first-letter:uppercase">
                {fmtDate(date)} · {T.services[service][lang].toLowerCase()}
              </h2>
              <p className="type-small flex items-center gap-8 text-ink">
                <span aria-hidden className="size-8 rounded-full bg-ink" />
                {T.live[lang]} · {fill(T.updated[lang], { s: Math.max(0, Math.round((now.getTime() - lastUpdate) / 1000)) })}
              </p>
            </div>
            {holdExpired && <p className="type-small text-ink">{T.holdExpired[lang]}</p>}
            <p aria-live="polite" className="type-small min-h-24 font-medium text-ink">
              {flash ? fill(T.justTaken[lang], { time: formatTime(flash, lang) }) : ""}
            </p>
            <ul className="grid grid-cols-2 gap-8 md:grid-cols-3">
              {live.map((s) => {
                const future = sittingIsFuture(date, s.time, today, now);
                const ok = future && s.left >= party;
                return (
                  <li key={s.time}>
                    <button
                      type="button"
                      disabled={!ok}
                      onClick={() => {
                        setHold({ time: s.time, until: Date.now() + TABLE_HOLD_MINUTES * 60_000 });
                        set({ time: s.time, step: 3 }, "push");
                      }}
                      className={cn(
                        "flex min-h-64 w-full flex-col items-start justify-center rounded-control border px-16 py-8 text-left transition-colors duration-(--duration-fast)",
                        ok ? "border-ink hover:bg-ink hover:text-ground" : "cursor-not-allowed border-dashed border-ink",
                        flash === s.time && "border-2",
                      )}
                    >
                      <span className="type-md">{formatTime(s.time, lang)}</span>
                      <span className="type-small">
                        {s.left === 0 ? T.full[lang] : s.left < party ? fill(T.tooSmall[lang], { n: party }) : seatsLabel(s.left)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            {bookable.length === 0 && (
              <p className="border-l-2 border-mark pl-16 text-ink">{fill(T.noneLeft[lang], { n: party })}</p>
            )}
            <div>
              <Button variant="secondary" onClick={() => set({ step: 1 }, "push")}>
                {COMMON.back[lang]}
              </Button>
            </div>
          </div>
        )}

        {effectiveStep === 3 && date && time && activeHold && (
          <form
            noValidate
            className="flex flex-col gap-24"
            onSubmit={(e) => {
              e.preventDefault();
              const errs: Record<string, string> = {};
              if (!details.name.trim()) errs.name = COMMON.errors.name[lang];
              if (details.phone.replace(/\D/g, "").length < 8) errs.phone = COMMON.errors.phone[lang];
              if (details.email && !EMAIL.test(details.email)) errs.email = COMMON.errors.email[lang];
              setErrors(errs);
              if (Object.keys(errs).length) return;
              setConfirmed({ ref: reference("NV", `${date}|${time}|${details.name}|${details.phone}`), name: details.name });
              window.scrollTo({ top: 0 });
            }}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-16 border-t border-ink pt-16">
              <p className="type-md">
                {T.hold[lang]} · {formatTime(time, lang)}
              </p>
              <p className="type-body font-medium tabular-nums text-ink" aria-live="off">
                {fill(T.holdTimer[lang], { time: mmss })}
              </p>
            </div>
            <Field label={COMMON.name[lang]} error={errors.name}>
              {(p) => <TextInput {...p} autoComplete="name" value={details.name} onChange={(e) => setDetails({ ...details, name: e.target.value })} />}
            </Field>
            <Field label={COMMON.phone[lang]} error={errors.phone}>
              {(p) => <TextInput {...p} type="tel" autoComplete="tel" value={details.phone} onChange={(e) => setDetails({ ...details, phone: e.target.value })} />}
            </Field>
            <Field label={COMMON.email[lang]} optional={lang === "fr" ? "facultatif" : "optional"} error={errors.email}>
              {(p) => <TextInput {...p} type="email" autoComplete="email" value={details.email} onChange={(e) => setDetails({ ...details, email: e.target.value })} />}
            </Field>
            <Field label={T.diet[lang]} optional={lang === "fr" ? "facultatif" : "optional"}>
              {(p) => <TextArea {...p} value={details.diet} onChange={(e) => setDetails({ ...details, diet: e.target.value })} />}
            </Field>
            <div className="flex flex-wrap gap-24">
              <Button
                variant="secondary"
                onClick={() => {
                  setHold(null);
                  set({ step: 2, time: undefined }, "push");
                }}
              >
                {COMMON.back[lang]}
              </Button>
              <Button type="submit">{T.confirm[lang]}</Button>
            </div>
          </form>
        )}
      </div>

      <aside className="col-span-12 flex flex-col gap-16 border-t border-ink pt-16 lg:sticky lg:top-96 lg:col-span-4 lg:col-start-9 lg:self-start">
        <p className="type-label text-ink">Navette</p>
        {date ? <p className="type-body font-medium tabular-nums first-letter:uppercase">{fmtDate(date)}</p> : <p className="text-ink">{T.date[lang]}…</p>}
        {service && <p className="text-ink">{T.services[service][lang]}{time ? ` · ${formatTime(time, lang)}` : ""}</p>}
        <p className="text-ink">
          {party} {lang === "fr" ? (party === 1 ? "couvert" : "couverts") : party === 1 ? "person" : "people"}
        </p>
        <OtherPaths lang={lang} current="table" />
      </aside>
    </div>
  );
}
