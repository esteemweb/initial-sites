"use client";

import { useState } from "react";
import { COMMON, HIRE_FLOW as T } from "@/content/booking";
import { fill } from "@/content/site";
import type { Lang } from "@/lib/i18n";
import { HIRE_REPLY_WORKING_DAYS, HIRE_SEATED, HIRE_STANDING, TOTAL_ROOMS } from "@/lib/model";
import { reference } from "@/lib/booking";
import { addDays, addWorkingDays, formatDate, isISODate, type ISODate } from "@/lib/dates";
import { useToday } from "./use-today";
import { Button } from "@/components/ui/button";
import { Checkbox, Choice, Field, TextArea, TextInput } from "@/components/ui/fields";
import { OtherPaths } from "./flow-shell";
import { useQuery } from "./use-query";

/* Path 3 — the building. brief §8/§10: an enquiry, not a booking. A form that
   asks the right questions and promises a reply within two working days.
   pattern: REFERENCE-AUTOPSY §15 Q2 point 8 — looks like a form, not an
   engine; on-site (the reference hands off to Backyou, §9.2). */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
type Scope = "room" | "building";

export function HireFlow({ lang }: { lang: Lang }) {
  const { get, set } = useQuery();
  const today = useToday();

  const scope: Scope = get("scope") === "room" ? "room" : "building";
  const [f, setF] = useState({
    occasion: "",
    date: "",
    flexible: false,
    guests: "",
    rooms: "",
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<{ ref: string; replyBy: ISODate; email: string } | null>(null);

  if (!today) return <p className="text-ink">…</p>;

  if (sent) {
    return (
      <div className="flex flex-col gap-24" role="status">
        <p className="type-label text-ink">
          {COMMON.reference[lang]} {sent.ref}
        </p>
        <h2 className="type-xl">{T.sentTitle[lang]}</h2>
        <p className="type-body max-w-prose">
          {fill(T.sentBody[lang], { date: formatDate(sent.replyBy, lang), email: sent.email })}
        </p>
        <p className="type-small text-ink">{COMMON.demo.hire[lang]}</p>
      </div>
    );
  }

  const guests = Number(f.guests);
  const upd = (patch: Partial<typeof f>) => setF({ ...f, ...patch });

  return (
    <div className="grid grid-cols-12 gap-x-16 gap-y-48 lg:gap-x-24">
      <form
        noValidate
        className="col-span-12 flex flex-col gap-32 lg:col-span-7"
        onSubmit={(e) => {
          e.preventDefault();
          const errs: Record<string, string> = {};
          if (!isISODate(f.date) || f.date <= today) errs.date = T.dateError[lang];
          if (!Number.isInteger(guests) || guests < 10 || guests > HIRE_STANDING) errs.guests = T.guestsError[lang];
          if (!f.name.trim()) errs.name = COMMON.errors.name[lang];
          if (!EMAIL.test(f.email)) errs.email = COMMON.errors.email[lang];
          setErrors(errs);
          if (Object.keys(errs).length) {
            document.querySelector<HTMLElement>("[aria-invalid=true]")?.focus();
            return;
          }
          setSent({
            ref: reference("PV", `${f.date}|${f.email}|${scope}`),
            replyBy: addWorkingDays(today, HIRE_REPLY_WORKING_DAYS),
            email: f.email,
          });
          window.scrollTo({ top: 0 });
        }}
      >
        <Choice<Scope>
          label={T.scope[lang]}
          value={scope}
          onChange={(v) => set({ scope: v })}
          options={(["room", "building"] as Scope[]).map((s) => ({
            value: s,
            label: T.scopes[s][lang],
            note: T.scopeNotes[s][lang],
          }))}
        />
        <Choice
          label={T.occasion[lang]}
          value={f.occasion}
          onChange={(v) => upd({ occasion: v })}
          options={T.occasions.map((o) => ({ value: o.id, label: o.label[lang] }))}
        />
        <div className="grid grid-cols-12 gap-x-16 gap-y-24">
          <div className="col-span-12 md:col-span-6">
            <Field label={T.date[lang]} error={errors.date}>
              {(p) => (
                <TextInput
                  {...p}
                  type="date"
                  min={addDays(today, 1)}
                  value={f.date}
                  onChange={(e) => upd({ date: e.target.value })}
                />
              )}
            </Field>
          </div>
          <div className="col-span-12 md:col-span-6">
            <Field
              label={T.guests[lang]}
              error={errors.guests}
              hint={guests > HIRE_SEATED && guests <= HIRE_STANDING ? T.seatedWarning[lang] : undefined}
            >
              {(p) => (
                <TextInput
                  {...p}
                  type="number"
                  inputMode="numeric"
                  min={10}
                  max={HIRE_STANDING}
                  value={f.guests}
                  onChange={(e) => upd({ guests: e.target.value })}
                />
              )}
            </Field>
          </div>
        </div>
        <Checkbox label={T.flexible[lang]} checked={f.flexible} onChange={(e) => upd({ flexible: e.target.checked })} />
        {scope === "building" && (
          <Field label={T.rooms[lang]} optional={`0–${TOTAL_ROOMS}`}>
            {(p) => (
              <TextInput
                {...p}
                type="number"
                inputMode="numeric"
                min={0}
                max={TOTAL_ROOMS}
                value={f.rooms}
                onChange={(e) => upd({ rooms: e.target.value })}
              />
            )}
          </Field>
        )}
        <div className="grid grid-cols-12 gap-x-16 gap-y-24">
          <div className="col-span-12 md:col-span-6">
            <Field label={COMMON.name[lang]} error={errors.name}>
              {(p) => <TextInput {...p} autoComplete="name" value={f.name} onChange={(e) => upd({ name: e.target.value })} />}
            </Field>
          </div>
          <div className="col-span-12 md:col-span-6">
            <Field label={T.company[lang]} optional={lang === "fr" ? "facultatif" : "optional"}>
              {(p) => <TextInput {...p} autoComplete="organization" value={f.company} onChange={(e) => upd({ company: e.target.value })} />}
            </Field>
          </div>
          <div className="col-span-12 md:col-span-6">
            <Field label={COMMON.email[lang]} error={errors.email}>
              {(p) => <TextInput {...p} type="email" autoComplete="email" value={f.email} onChange={(e) => upd({ email: e.target.value })} />}
            </Field>
          </div>
          <div className="col-span-12 md:col-span-6">
            <Field label={COMMON.phone[lang]} optional={lang === "fr" ? "facultatif" : "optional"}>
              {(p) => <TextInput {...p} type="tel" autoComplete="tel" value={f.phone} onChange={(e) => upd({ phone: e.target.value })} />}
            </Field>
          </div>
        </div>
        <Field label={T.message[lang]} optional={lang === "fr" ? "facultatif" : "optional"}>
          {(p) => (
            <TextArea
              {...p}
              rows={6}
              placeholder={T.messagePlaceholder[lang]}
              value={f.message}
              onChange={(e) => upd({ message: e.target.value })}
            />
          )}
        </Field>
        <div>
          <Button type="submit">{T.send[lang]}</Button>
        </div>
      </form>
      <aside className="col-span-12 flex flex-col gap-16 border-t border-ink pt-16 lg:sticky lg:top-96 lg:col-span-4 lg:col-start-9 lg:self-start">
        <p className="type-label text-ink">{T.scopes[scope][lang]}</p>
        <p className="type-body font-medium tabular-nums">{T.scopeNotes[scope][lang]}</p>
        <p className="text-ink">
          {lang === "fr"
            ? `Réponse sous ${HIRE_REPLY_WORKING_DAYS} jours ouvrés.`
            : `Reply within ${HIRE_REPLY_WORKING_DAYS} working days.`}
        </p>
        <OtherPaths lang={lang} current="building" />
      </aside>
    </div>
  );
}
