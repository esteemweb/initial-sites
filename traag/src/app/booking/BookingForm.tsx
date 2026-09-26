"use client";

import { useRef, useState } from "react";
import { todayKey } from "@/lib/shows";
import s from "./booking.module.css";

type Values = {
  name: string;
  email: string;
  event: string;
  date: string;
  city: string;
  venue: string;
  capacity: string;
  budget: string;
  message: string;
};
type Field = keyof Values;
type Errors = Partial<Record<Field, string>>;

const EMPTY: Values = { name: "", email: "", event: "", date: "", city: "", venue: "", capacity: "", budget: "", message: "" };

const BUDGETS = ["under €1,000", "€1,000 – €2,000", "€2,000 – €3,500", "€3,500 and up", "not sure yet, let's talk"];

const LABELS: Record<Field, string> = {
  name: "your name",
  email: "email",
  event: "event or promoter",
  date: "date",
  city: "city",
  venue: "venue",
  capacity: "capacity",
  budget: "budget",
  message: "anything else",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "a name, please. first name is fine";
  if (!v.email.trim()) e.email = "an email, so i can answer";
  else if (!EMAIL.test(v.email.trim())) e.email = "that email doesn't look right. check for a typo";
  if (!v.event.trim()) e.event = "the event or promoter name";
  if (!v.date) e.date = "a date, even a rough one";
  else if (v.date < todayKey()) e.date = "that date has already happened";
  if (!v.city.trim()) e.city = "which city";
  if (!v.venue.trim()) e.venue = "which venue. 'not sure yet' is an answer";
  if (!v.capacity.trim()) e.capacity = "roughly how many people";
  else if (!/^\d+$/.test(v.capacity.trim())) e.capacity = "a number, no words";
  else {
    const n = Number(v.capacity);
    if (n < 50) e.capacity = "under 50 is a party. still, write me in the message";
    else if (n > 20000) e.capacity = "that is a stadium. i am not the booking for a stadium";
  }
  if (!v.budget) e.budget = "pick one. 'not sure yet' counts";
  if (v.message.length > 2000) e.message = `keep it under 2000 characters. you're at ${v.message.length}`;
  return e;
}

function reference() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(5);
  crypto.getRandomValues(bytes);
  const code = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
  const d = todayKey().slice(2).replace(/-/g, "");
  return `TRG-${d}-${code}`;
}

export default function BookingForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [sent, setSent] = useState<{ ref: string; values: Values } | null>(null);
  const summary = useRef<HTMLDivElement>(null);
  const done = useRef<HTMLHeadingElement>(null);

  const errors = validate(values);
  const shown = (f: Field) => (submitted || touched[f]) && errors[f];
  const errorList = (Object.keys(errors) as Field[]).filter((f) => errors[f]);

  const set = (f: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [f]: e.target.value }));
  const blur = (f: Field) => () => setTouched((t) => ({ ...t, [f]: true }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (errorList.length) {
      requestAnimationFrame(() => summary.current?.focus());
      return;
    }
    setSent({ ref: reference(), values });
    requestAnimationFrame(() => done.current?.focus());
  };

  const reset = () => {
    setValues(EMPTY);
    setTouched({});
    setSubmitted(false);
    setSent(null);
  };

  if (sent) {
    return (
      <div className={s.done} role="status">
        <h2 ref={done} tabIndex={-1} className="t-lg">
          got it
        </h2>
        <p className="t-record">
          reference <span className={s.ref}>{sent.ref}</span>
        </p>
        <p className="t-body">
          i answer every booking myself within five working days. usually sooner. if it&apos;s a yes you&apos;ll hear
          it from me, not from an agent. there is no agent.
        </p>
        <dl className={`${s.recap} t-record`}>
          {(Object.keys(LABELS) as Field[])
            .filter((f) => sent.values[f])
            .map((f) => (
              <div key={f}>
                <dt>{LABELS[f]}</dt>
                <dd>{sent.values[f]}</dd>
              </div>
            ))}
        </dl>
        <p className="t-record ghost">this is a demo. nothing was sent anywhere.</p>
        <button type="button" onClick={reset} className={`${s.button} ${s.secondary} t-record-label`}>
          send another
        </button>
      </div>
    );
  }

  const input = (f: Field, props: React.InputHTMLAttributes<HTMLInputElement> = {}, hint?: string) => {
    const err = shown(f);
    const describedBy = [hint ? `${f}-hint` : "", err ? `${f}-error` : ""].filter(Boolean).join(" ") || undefined;
    return (
      <div className={s.field}>
        <label htmlFor={f} className="t-record-label">
          {LABELS[f]}
        </label>
        <input
          id={f}
          name={f}
          value={values[f]}
          onChange={set(f)}
          onBlur={blur(f)}
          aria-invalid={err ? true : undefined}
          aria-describedby={describedBy}
          className={s.control}
          {...props}
        />
        {hint && (
          <p id={`${f}-hint`} className={`${s.hint} t-record`}>
            {hint}
          </p>
        )}
        {err && (
          <p id={`${f}-error`} className={`${s.error} t-record`}>
            <span className="sr-only">error: </span>
            {err}
          </p>
        )}
      </div>
    );
  };

  return (
    <form className={s.form} onSubmit={onSubmit} noValidate>
      {submitted && errorList.length > 0 && (
        <div ref={summary} tabIndex={-1} className={s.summary} role="alert" aria-labelledby="summary-title">
          <h2 id="summary-title" className="t-record-label">
            {errorList.length === 1 ? "one thing to fix" : `${errorList.length} things to fix`}
          </h2>
          <ul className="t-record">
            {errorList.map((f) => (
              <li key={f}>
                <a href={`#${f}`}>
                  {LABELS[f]}: {errors[f]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <fieldset className={s.group}>
        <legend className="t-record-label ghost">you</legend>
        {input("name", { autoComplete: "name", required: true })}
        {input("email", { type: "email", autoComplete: "email", inputMode: "email", required: true })}
      </fieldset>

      <fieldset className={s.group}>
        <legend className="t-record-label ghost">the night</legend>
        {input("event", { autoComplete: "organization", required: true })}
        {input("date", { type: "date", min: todayKey(), required: true })}
        {input("city", { autoComplete: "address-level2", required: true })}
        {input("venue", { required: true })}
        {input("capacity", { inputMode: "numeric", pattern: "[0-9]*", required: true }, "rooms of 400 to 900 feel right. others can work")}

        <div className={s.field}>
          <label htmlFor="budget" className="t-record-label">
            {LABELS.budget}
          </label>
          <select
            id="budget"
            name="budget"
            value={values.budget}
            onChange={set("budget")}
            onBlur={blur("budget")}
            aria-invalid={shown("budget") ? true : undefined}
            aria-describedby={shown("budget") ? "budget-error" : undefined}
            className={s.control}
            required
          >
            <option value="" disabled>
              choose
            </option>
            {BUDGETS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          {shown("budget") && (
            <p id="budget-error" className={`${s.error} t-record`}>
              <span className="sr-only">error: </span>
              {errors.budget}
            </p>
          )}
        </div>
      </fieldset>

      <fieldset className={s.group}>
        <legend className="t-record-label ghost">the rest</legend>
        <div className={`${s.field} ${s.wide}`}>
          <label htmlFor="message" className="t-record-label">
            {LABELS.message} <span className="ghost">(optional)</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            value={values.message}
            onChange={set("message")}
            onBlur={blur("message")}
            aria-invalid={shown("message") ? true : undefined}
            aria-describedby={`message-count${shown("message") ? " message-error" : ""}`}
            className={s.control}
          />
          <p id="message-count" className={`${s.hint} t-record`}>
            {values.message.length} / 2000
          </p>
          {shown("message") && (
            <p id="message-error" className={`${s.error} t-record`}>
              <span className="sr-only">error: </span>
              {errors.message}
            </p>
          )}
        </div>
      </fieldset>

      <div className={s.submitRow}>
        <button type="submit" className={`${s.button} t-record-label`}>
          send
        </button>
        <p className="t-record ghost">i answer within five working days.</p>
      </div>
    </form>
  );
}
