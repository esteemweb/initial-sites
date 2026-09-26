"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Button } from "./Button";
import { keepCase } from "@/lib/keepCase";

/* design-system §Components/SpecModal, from autopsy §7 "Modal / dialog":
   454px panel, 20px radius, hairline rows, label at 0.6 above value, then a
   two-column definition list and a PDF download.
   Native <dialog> + showModal() gives the focus trap, Esc, an inert page
   and focus return to the trigger for free.
   Motion: enter 720ms ease-enter, exit 360ms ease-exit. Under reduced
   motion the panel appears and disappears in its end state. */

export type SpecSection = { label: string; value: ReactNode };
export type SpecRow = { label: string; value: ReactNode; measured?: boolean };
export type SpecState = "default" | "loading" | "error" | "empty";

type Props = {
  triggerLabel: string;
  title: string;
  sections?: SpecSection[];
  rows?: SpecRow[];
  /** PDF of the full sheet. `null` = declared but not yet available (disabled). */
  pdfHref?: string | null;
  /** Offer "Print spec sheet": prints just the sheet (save as PDF from the dialog). */
  printable?: boolean;
  state?: SpecState;
  onRetry?: () => void;
};

const EXIT_MS = 360;

export function SpecModal({ triggerLabel, title, sections = [], rows = [], pdfHref, printable = false, state = "default", onRetry }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [shown, setShown] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);

  const open = () => {
    const d = dialogRef.current;
    if (!d || d.open) return;
    window.clearTimeout(closeTimer.current);
    d.showModal();
    // Next frame, so the closed styles paint first and the entrance transitions.
    requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
  };

  const close = useCallback(() => {
    const d = dialogRef.current;
    if (!d || !d.open) return;
    setShown(false);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    closeTimer.current = window.setTimeout(() => d.close(), reduce ? 0 : EXIT_MS);
  }, []);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const titleId = `${useId()}-title`;

  return (
    <>
      <button type="button" className="link type-body inline-flex min-h-48 cursor-pointer items-center text-left" aria-haspopup="dialog" onClick={open}>
        {triggerLabel}
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        aria-busy={state === "loading" || undefined}
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        className="fixed inset-0 m-0 hidden h-full max-h-none w-full max-w-none items-center justify-center bg-transparent p-20 open:flex backdrop:bg-transparent"
      >
        {/* Backdrop: ink at the 0.6 step. Clicking it closes. */}
        <div
          aria-hidden
          onClick={close}
          className={`absolute inset-0 bg-ink/60 transition-opacity ${
            shown ? "opacity-100 duration-720 ease-enter" : "opacity-0 duration-360 ease-exit"
          }`}
        />

        <div
          data-print-sheet
          className={`relative flex max-h-full w-full max-w-modal flex-col overflow-hidden rounded-panel bg-paper text-ink transition ${
            shown ? "translate-y-0 opacity-100 duration-720 ease-enter" : "translate-y-24 opacity-0 duration-360 ease-exit"
          } motion-reduce:translate-y-0`}
        >
          <header className="flex items-center justify-between gap-16 py-8 pr-8 pl-20">
            <h2 id={titleId} className="type-subtitle">
              {title}
            </h2>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              data-print-hide
              className="link grid size-48 shrink-0 cursor-pointer place-items-center rounded-pill"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.25" />
              </svg>
            </button>
          </header>

          <div className="overflow-y-auto px-20 pb-20">{body()}</div>
        </div>
      </dialog>
    </>
  );

  function body() {
    if (state === "loading") {
      return (
        <div className="grid gap-24 pt-8" aria-live="polite">
          <p className="type-data text-ink-muted">Loading specification…</p>
          {[0, 1, 2].map((i) => (
            <div key={i} className="grid gap-8 border-b border-hairline pb-24">
              <span className="h-16 w-1/3 bg-hairline" />
              <span className="h-16 w-full bg-hairline" />
            </div>
          ))}
        </div>
      );
    }

    if (state === "error") {
      return (
        <div className="grid justify-items-start gap-24 pt-8">
          <p className="type-body" role="alert">
            <span className="type-data">Error — </span>
            The specification could not be loaded. Nothing on this sheet has changed.
          </p>
          <Button variant="secondary" onClick={onRetry}>
            Try again
          </Button>
        </div>
      );
    }

    if (state === "empty" || (sections.length === 0 && rows.length === 0)) {
      return (
        <p className="type-body pt-8 text-ink-muted">
          No specification has been declared for this product yet.
        </p>
      );
    }

    return (
      <>
        {sections.map((s) => (
          <section key={s.label} className="grid max-w-measure gap-8 border-b border-hairline py-24 first:pt-8">
            <h3 className="type-data text-ink-muted">{s.label}</h3>
            <div className="type-body">{s.value}</div>
          </section>
        ))}

        {rows.length > 0 && (
          <dl className="grid grid-cols-2 gap-x-20">
            {rows.map((r) => (
              <div key={r.label} className="col-span-2 grid grid-cols-subgrid border-b border-hairline py-16">
                <dt className="type-data text-ink-muted">{keepCase(r.label)}</dt>
                <dd className={`type-data ${r.measured ? "text-green" : ""}`}>{r.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {printable && (
          <div className="pt-24" data-print-hide>
            <Button variant="secondary" onClick={() => window.print()}>
              Print spec sheet
            </Button>
          </div>
        )}

        {pdfHref !== undefined && (
          <div className="pt-24">
            <Button variant="secondary" href={pdfHref ?? "#"} state={pdfHref ? "default" : "disabled"} download>
              Download PDF
            </Button>
          </div>
        )}
      </>
    );
  }
}
