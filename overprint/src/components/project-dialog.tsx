"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { budgets, projectTypes, timelines, validateEnquiry, type FieldErrors } from "@/lib/enquiry";
import { OPEN_ENQUIRY_EVENT } from "@/lib/site";

type Status = "idle" | "sent";

/* pattern: header tile — refs/flowers-sim §9 (the "Catalog" media tile top-right),
   made functional: the tile opens a native <dialog> project form. <dialog> gives
   focus containment, Esc to close and focus return to the tile for free.
   DEMO: the form validates exactly like a real one but sends and stores nothing —
   a valid submit just shows the confirmation with a "Demo site" note. */
export function ProjectDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});

  function open() {
    if (status === "sent") {
      setStatus("idle");
      setErrors({});
    }
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
  }

  // any component can open the dialog via openEnquiry() (lib/site.ts)
  useEffect(() => {
    const onOpen = () => {
      setStatus((s) => (s === "sent" ? "idle" : s));
      setErrors({});
      dialogRef.current?.showModal();
    };
    window.addEventListener(OPEN_ENQUIRY_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_ENQUIRY_EVENT, onOpen);
  }, []);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      company: fd.get("company"),
      types: fd.getAll("types"),
      budget: fd.get("budget"),
      timeline: fd.get("timeline"),
      message: fd.get("message"),
      website: fd.get("website"),
    };

    const { errors: found } = validateEnquiry(payload);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      form.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
      return;
    }

    // demo site: nothing is sent or stored anywhere
    form.reset();
    setStatus("sent");
    requestAnimationFrame(() => doneRef.current?.focus());
  }

  const err = (k: keyof FieldErrors) =>
    errors[k] ? (
      <p id={`err-${k}`} className="mt-2 text-micro text-yellow">
        Error: {errors[k]}
      </p>
    ) : null;

  const field =
    "mt-2 block min-h-target w-full border-b border-paper/40 bg-transparent py-2 text-paper placeholder:text-paper/50 focus:border-paper";

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        className="group relative isolate col-span-2 col-start-3 mt-2 flex aspect-video flex-col justify-between overflow-hidden bg-ink p-3 text-left text-paper transition-transform duration-200 ease-press hover:scale-95 md:col-start-7 md:mt-0"
      >
        <Image
          src="/images/process/separate-photo.jpg"
          alt=""
          fill
          sizes="(min-width: 60rem) 25vw, 50vw"
          className="-z-10 object-cover transition-transform duration-500 ease-press group-hover:scale-105"
        />
        <span aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-ink/90 via-ink/50 to-ink/20" />
        <span className="flex gap-1" aria-hidden="true">
          <span className="size-3 rounded-full bg-cyan" />
          <span className="size-3 rounded-full bg-magenta" />
          <span className="size-3 rounded-full bg-yellow" />
        </span>
        <span className="font-display text-title font-bold">Start a project →</span>
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="enquiry-title"
        className="on-ink m-0 ml-auto h-dvh max-h-dvh w-full max-w-none overflow-y-auto bg-ink p-0 text-paper backdrop:bg-ink/70 md:w-1/2"
      >
        <div className="flex min-h-full flex-col gap-8 p-6 md:p-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-micro text-paper/70 uppercase">(Start a project)</p>
              <h2 id="enquiry-title" className="text-title">
                Tell us what needs to be louder
              </h2>
            </div>
            <button
              type="button"
              onClick={close}
              className="min-h-target shrink-0 px-3 underline underline-offset-4"
            >
              Close
            </button>
          </div>

          {status === "sent" ? (
            <div className="flex flex-col items-start gap-6">
              <h3 ref={doneRef} tabIndex={-1} className="text-title">
                Thanks — it’s with us.
              </h3>
              <p className="max-w-md text-lede">
                We’ve got your brief and we’ll reply to the email you gave us.
              </p>
              <p className="text-micro text-paper/70">Demo site: no enquiry was sent.</p>
              <button
                type="button"
                onClick={close}
                className="min-h-target bg-paper px-6 font-semibold text-ink transition-transform duration-200 ease-press hover:scale-95"
              >
                Back to the site
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={submit} noValidate className="flex flex-col gap-7">
              <div className="grid gap-7 md:grid-cols-2">
                <label className="block">
                  <span className="text-micro text-paper/70 uppercase">Name (required)</span>
                  <input
                    name="name"
                    data-field="name"
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "err-name" : undefined}
                    className={field}
                  />
                  {err("name")}
                </label>
                <label className="block">
                  <span className="text-micro text-paper/70 uppercase">Email (required)</span>
                  <input
                    name="email"
                    type="email"
                    data-field="email"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "err-email" : undefined}
                    className={field}
                  />
                  {err("email")}
                </label>
              </div>

              <label className="block">
                <span className="text-micro text-paper/70 uppercase">Company or project name</span>
                <input name="company" autoComplete="organization" className={field} />
              </label>

              <fieldset aria-describedby={errors.types ? "err-types" : undefined}>
                <legend className="text-micro text-paper/70 uppercase">What do you need? (required)</legend>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {projectTypes.map((t, i) => (
                    <label
                      key={t.value}
                      className="flex min-h-target cursor-pointer items-center gap-3 border border-paper/40 px-3 has-checked:border-paper has-checked:bg-paper has-checked:text-ink"
                    >
                      <input
                        type="checkbox"
                        name="types"
                        value={t.value}
                        data-field={i === 0 ? "types" : undefined}
                        className="size-4 accent-magenta"
                      />
                      <span className="text-micro font-semibold">({t.plate})</span>
                      <span>{t.label}</span>
                    </label>
                  ))}
                </div>
                {err("types")}
              </fieldset>

              <div className="grid gap-7 md:grid-cols-2">
                <label className="block">
                  <span className="text-micro text-paper/70 uppercase">Budget</span>
                  <select name="budget" defaultValue="" className={field}>
                    <option value="">Choose…</option>
                    {budgets.map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-micro text-paper/70 uppercase">Timeline</span>
                  <select name="timeline" defaultValue="" className={field}>
                    <option value="">Choose…</option>
                    {timelines.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="text-micro text-paper/70 uppercase">About the project (required)</span>
                <textarea
                  name="message"
                  data-field="message"
                  rows={5}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "err-message" : undefined}
                  placeholder="What is it, who is it for, and what’s not working yet?"
                  className={`${field} resize-y`}
                />
                {err("message")}
              </label>

              {/* honeypot — hidden from people and assistive tech */}
              <div aria-hidden="true" className="absolute -left-full h-0 w-0 overflow-hidden">
                <label>
                  Website
                  <input name="website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              <button
                type="submit"
                className="min-h-target self-start bg-paper px-8 font-semibold text-ink transition-transform duration-200 ease-press hover:scale-95"
              >
                Send brief →
              </button>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}
