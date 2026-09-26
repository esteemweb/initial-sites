"use client";

import { useRouter } from "next/navigation";
import { useId, useRef, useState } from "react";
import { checkEmail, checkName, type FieldError } from "@/lib/listValidation";
import s from "./list.module.css";

type Mode = "join" | "sign-in";
type Field = "email" | "name";

/**
 * Join (email + name) or sign in (email). Validates on blur and on
 * submit, the server validates again, and whichever finds the problem,
 * focus goes to the field that has it with the message read out.
 */
export default function ListForm({ mode, compact, inline }: { mode: Mode; compact?: boolean; inline?: boolean }) {
  const router = useRouter();
  const uid = useId();
  const id = (f: string) => `${uid}-${f}`;
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<Partial<Record<Field | "form", string>>>({});
  const [busy, setBusy] = useState(false);
  const refs = { email: useRef<HTMLInputElement>(null), name: useRef<HTMLInputElement>(null) };
  const formError = useRef<HTMLParagraphElement>(null);

  const validate = () => {
    const e: Partial<Record<Field, string>> = {};
    const em = checkEmail(email);
    if (em) e.email = em;
    if (mode === "join") {
      const n = checkName(name);
      if (n) e.name = n;
    }
    return e;
  };

  const focusFirst = (e: Partial<Record<Field | "form", string>>) => {
    requestAnimationFrame(() => {
      if (e.email) refs.email.current?.focus();
      else if (e.name) refs.name.current?.focus();
      else if (e.form) formError.current?.focus();
    });
  };

  const onBlur = (f: Field) => () => {
    const v = f === "email" ? checkEmail(email) : checkName(name);
    // only show on blur once something has been typed; empty fields are
    // flagged on submit, not the moment you tab past them
    if ((f === "email" ? email : name).trim()) setErrors((x) => ({ ...x, [f]: v ?? undefined }));
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (busy) return;
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return focusFirst(e);

    setBusy(true);
    try {
      const res = await fetch(`/api/list/${mode}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(mode === "join" ? { email, name } : { email }),
      });
      const data = (await res.json().catch(() => null)) as { ok: boolean; next?: string; error?: FieldError } | null;
      if (!res.ok || !data?.ok) {
        const err = data?.error ?? { field: "form", message: "that didn't go through. try again in a moment" };
        const next = { [err.field]: err.message };
        setErrors(next);
        focusFirst(next);
        setBusy(false);
        return;
      }
      router.push(data.next ?? "/list/check");
    } catch {
      const next = { form: "no connection. try again when you're back online" };
      setErrors(next);
      focusFirst(next);
      setBusy(false);
    }
  };

  const field = (f: Field, label: string, value: string, set: (v: string) => void, extra: React.InputHTMLAttributes<HTMLInputElement>) => (
    <div className={s.field}>
      <label htmlFor={id(f)} className="t-record-label">
        {label}
      </label>
      <input
        ref={refs[f]}
        id={id(f)}
        name={f}
        value={value}
        onChange={(e) => set(e.target.value)}
        onBlur={onBlur(f)}
        aria-invalid={errors[f] ? true : undefined}
        aria-describedby={errors[f] ? id(`${f}-error`) : undefined}
        className={s.control}
        required
        {...extra}
      />
      {errors[f] && (
        <p id={id(`${f}-error`)} className={`${s.error} t-record`} role="alert">
          <span className="sr-only">error: </span>
          {errors[f]}
        </p>
      )}
    </div>
  );

  return (
    <form
      className={`${s.form} ${compact ? s.compact : ""} ${inline ? s.inline : ""}`}
      onSubmit={onSubmit}
      noValidate
      aria-busy={busy}
    >
      <div className={s.fields}>
        {field("email", "email", email, setEmail, { type: "email", autoComplete: "email", inputMode: "email", spellCheck: false })}
        {mode === "join" && field("name", "what should i call you", name, setName, { autoComplete: "nickname", maxLength: 40 })}
      </div>
      {errors.form && (
        <p ref={formError} tabIndex={-1} className={`${s.error} t-record`} role="alert">
          {errors.form}
        </p>
      )}
      <div className={s.actions}>
        <button type="submit" className={`${s.button} t-record-label`} disabled={busy}>
          {busy ? "sending" : mode === "join" ? "join the list" : "send me a link"}
        </button>
        <p className="t-record ghost">
          {mode === "join" ? "no password. you get a link, you click it, you're in." : "no password. a link, valid for fifteen minutes."}
        </p>
      </div>
    </form>
  );
}
