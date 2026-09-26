"use client";

import { cloneElement, isValidElement, useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";

/* Booking — the two chrome buttons and the dialog they open.

   WHAT WAS HERE BEFORE: two `<a href="mailto:...@talaydao.example">`. The
   .example TLD is reserved by RFC 2606 precisely so that it can never
   resolve, so those addresses could not receive mail under any
   circumstance — and on a desktop with no mail client registered, a
   mailto: click produces no feedback at all. The site's only two
   conversion actions were dead links that looked alive.

   WHY NATIVE <dialog> AND showModal(): the rail track moves panels with a
   transform, and a transformed ancestor becomes the containing block for
   its fixed descendants — a hand-rolled overlay would be dragged sideways
   with the panels. showModal() puts the element in the TOP LAYER, outside
   the document's normal paint order, so it cannot be. It also brings the
   focus trap, Esc-to-close, inertness of the page behind it, and return of
   focus to the invoking button, each of which is correct rather than
   reimplemented and subtly wrong.

   Client leaf. SiteChrome stays a Server Component. */

export type Intent = "room" | "table";

const INTENTS: { id: Intent; button: string; tab: string; heading: string }[] = [
  { id: "room", button: "Book Room", tab: "A villa", heading: "Enquire about a villa" },
  { id: "table", button: "Book Table", tab: "A table", heading: "Enquire about a table" },
];

/* Twelve villas sleeping two to four, and a kitchen that runs one dinner
   service — so neither list is a generic 1-20. */
const GUESTS = [1, 2, 3, 4];
const PARTY = [1, 2, 3, 4, 5, 6, 7, 8];
const SITTINGS = ["18:30", "19:00", "19:30", "20:00", "20:30"];

type Errors = Partial<Record<string, string>>;

const today = () => new Date().toISOString().slice(0, 10);

export function Booking() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [intent, setIntent] = useState<Intent>("room");
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const uid = useId();
  const f = (name: string) => `${uid}-${name}`;

  /* React state is the source of truth; the native dialog is driven from
     it, and the native `close` event (Esc, backdrop, the close button)
     drives it back. Without that second direction the two desynchronise
     the first time someone presses Escape. */
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (isOpen && !d.open) {
      d.showModal();
      /* showModal focuses the first focusable descendant, which is the
         close button. Put it on the first real field instead. */
      d.querySelector<HTMLElement>("[data-first]")?.focus();
    } else if (!isOpen && d.open) {
      d.close();
    }
  }, [isOpen, intent, sent]);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const onClose = () => setIsOpen(false);
    d.addEventListener("close", onClose);
    return () => d.removeEventListener("close", onClose);
  }, []);

  const open = (next: Intent) => {
    setIntent(next);
    setErrors({});
    setSent(null);
    setCopied(false);
    setIsOpen(true);
  };

  /* A backdrop click is reported as a click on the dialog itself, so the
     test is whether the point fell outside its own box — not whether the
     target was a child. */
  const onDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target !== e.currentTarget) return;
    const b = e.currentTarget.getBoundingClientRect();
    const inside =
      e.clientX >= b.left && e.clientX <= b.right &&
      e.clientY >= b.top && e.clientY <= b.bottom;
    if (!inside) setIsOpen(false);
  };

  const validate = (data: FormData): Errors => {
    const next: Errors = {};
    const get = (k: string) => String(data.get(k) ?? "").trim();

    if (!get("name")) next.name = "Please give a name.";

    const email = get("email");
    if (!email) next.email = "Please give an email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
      next.email = "That does not look like an email address.";

    if (intent === "room") {
      const arrive = get("arrive");
      const depart = get("depart");
      if (!arrive) next.arrive = "Pick an arrival date.";
      if (!depart) next.depart = "Pick a departure date.";
      else if (arrive && depart <= arrive)
        next.depart = "Departure must be after arrival.";
    } else if (!get("date")) {
      next.date = "Pick a date.";
    }
    return next;
  };

  const summarise = (data: FormData) => {
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const lines =
      intent === "room"
        ? [
            "Enquiry: villa",
            `Arrival: ${get("arrive")}`,
            `Departure: ${get("depart")}`,
            `Guests: ${get("guests")}`,
          ]
        : [
            "Enquiry: table",
            `Date: ${get("date")}`,
            `Sitting: ${get("time")}`,
            `Party: ${get("party")}`,
          ];
    lines.push(`Name: ${get("name")}`, `Email: ${get("email")}`);
    if (get("notes")) lines.push(`Notes: ${get("notes")}`);
    return lines.join("\n");
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      /* Send focus to the first control that failed, rather than
         rendering an error the keyboard user then has to hunt for. */
      const first = Object.keys(found)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setSent(summarise(data));
  };

  const copy = async () => {
    if (!sent) return;
    try {
      await navigator.clipboard.writeText(sent);
      setCopied(true);
    } catch {
      /* Clipboard access is permission-gated and throws outright in some
         contexts. The details are on screen either way, so a failure here
         stays quiet rather than raising an error over a convenience. */
      setCopied(false);
    }
  };

  const current = INTENTS.find((i) => i.id === intent) ?? INTENTS[0];

  return (
    <>
      <nav
        aria-label="Booking"
        style={{ viewTransitionName: "booking-bar" }}
        className="fixed right-gutter-sm top-gutter-sm z-[99] flex gap-xs md:right-gutter md:top-gutter"
      >
        {INTENTS.map(({ id, button }) => (
          <button
            key={id}
            type="button"
            onClick={() => open(id)}
            className="transition-micro h-booking-bar flex touch-manipulation items-center justify-center bg-surface px-sm font-sans text-label uppercase text-accent hover:bg-surface-sunk md:px-md"
          >
            {button}
          </button>
        ))}
      </nav>

      <dialog
        ref={dialogRef}
        className="booking-dialog"
        aria-labelledby={f("title")}
        onClick={onDialogClick}
      >
        {/* Header and footer are pinned; only the fields scroll. The
            `min-h-0` on the scroller is load-bearing — a flex child's
            default `min-height: auto` refuses to shrink below its content,
            so without it the panel grows past the dialog's max height and
            the footer is pushed out of view rather than the list
            scrolling. */}
        <header className="flex items-start justify-between gap-md p-lg pb-md">
          <div>
            <p className="font-sans text-label uppercase text-ink-soft">
              Talay Dao
            </p>
            <h2 id={f("title")} className="mt-2xs font-display text-heading">
              {sent ? "Enquiry noted" : current.heading}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close"
            className="transition-micro flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center border border-hairline-strong text-ink hover:bg-surface-sunk"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </header>

        {sent ? (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto px-lg">
              <p>
                Twelve villas and one kitchen, so every enquiry is answered by
                a person rather than by a system. Expect a reply within a day.
              </p>

              <pre className="mt-md whitespace-pre-wrap border border-hairline bg-canvas p-md font-sans text-body">
                {sent}
              </pre>

              {/* Said plainly rather than faked. This build has no server to
                  post to, and a confirmation implying otherwise is worse
                  than no confirmation at all. */}
              <p className="mt-md font-sans text-label uppercase text-ink-soft">
                Demo build · no booking backend wired · nothing was sent
              </p>
            </div>

            <div className="flex gap-xs border-t border-hairline p-lg pt-md">
              <button type="button" onClick={copy} className="submit-action">
                {copied ? "Copied" : "Copy details"}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="intent-tab"
              >
                Close
              </button>
            </div>
          </>
        ) : (
          <form
            ref={formRef}
            onSubmit={onSubmit}
            noValidate
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="min-h-0 flex-1 overflow-y-auto px-lg pb-md">
              {/* Both chrome buttons open this one dialog, so the switch has
                  to be visible and operable — otherwise anyone who hit the
                  wrong one has to close it and start again. */}
              <div role="tablist" aria-label="What to book" className="flex gap-xs">
                {INTENTS.map(({ id, tab }) => (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={intent === id}
                    onClick={() => {
                      setIntent(id);
                      setErrors({});
                    }}
                    className="intent-tab"
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="mt-md grid gap-sm sm:grid-cols-2">
                {intent === "room" ? (
                  <>
                    <Field id={f("arrive")} label="Arrival" error={errors.arrive}>
                      <input data-first name="arrive" type="date" min={today()} className="field" />
                    </Field>
                    <Field id={f("depart")} label="Departure" error={errors.depart}>
                      <input name="depart" type="date" min={today()} className="field" />
                    </Field>
                    <Field id={f("guests")} label="Guests">
                      <select name="guests" defaultValue="2" className="field">
                        {GUESTS.map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </Field>
                  </>
                ) : (
                  <>
                    <Field id={f("date")} label="Date" error={errors.date}>
                      <input data-first name="date" type="date" min={today()} className="field" />
                    </Field>
                    <Field id={f("time")} label="Sitting">
                      <select name="time" defaultValue="19:30" className="field">
                        {SITTINGS.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </Field>
                    <Field id={f("party")} label="Party">
                      <select name="party" defaultValue="2" className="field">
                        {PARTY.map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </Field>
                  </>
                )}

                <Field id={f("name")} label="Name" error={errors.name} span>
                  <input name="name" type="text" autoComplete="name" className="field" />
                </Field>

                <Field id={f("email")} label="Email" error={errors.email} span>
                  <input name="email" type="email" autoComplete="email" inputMode="email" className="field" />
                </Field>

                <Field id={f("notes")} label="Anything we should know" span>
                  <textarea name="notes" rows={2} className="field" />
                </Field>
              </div>
            </div>

            <div className="border-t border-hairline p-lg pt-md">
              <button type="submit" className="submit-action">
                Send enquiry
              </button>
            </div>
          </form>
        )}
      </dialog>
    </>
  );
}

/* One wrapper for every control, so none can ship without a label and the
   error is WIRED to the input with aria-describedby rather than merely
   sitting next to it. The id and the aria attributes are cloned onto the
   child, which is the only way to guarantee the label's htmlFor and the
   control's id cannot drift apart at a call site. */
function Field({
  id,
  label,
  error,
  span = false,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  /** Full width inside the two-column grid */
  span?: boolean;
  children: React.ReactNode;
}) {
  const errorId = `${id}-error`;

  return (
    <div className={span ? "sm:col-span-2" : ""}>
      <label
        htmlFor={id}
        className="mb-2xs block font-sans text-label uppercase text-ink-soft"
      >
        {label}
      </label>

      {isValidElement(children)
        ? cloneElement(children as React.ReactElement<Record<string, unknown>>, {
            id,
            "aria-invalid": error ? "true" : undefined,
            "aria-describedby": error ? errorId : undefined,
          })
        : children}

      {error ? (
        <p id={errorId} className="mt-2xs font-sans text-label text-accent">
          {error}
        </p>
      ) : null}
    </div>
  );
}
