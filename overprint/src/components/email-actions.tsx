"use client";

import { useEffect, useId, useRef, useState } from "react";
import { openEnquiry, studioEmail } from "@/lib/site";

/* The footer email address as a working control. A bare mailto link does nothing
   for visitors without a mail app, so the address opens three options: copy it,
   hand it to the mail app, or send through the site's own enquiry form. */
export function EmailActions() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const panelId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(studioEmail);
    } catch {
      // clipboard blocked (non-secure context) — fall back to a hidden textarea
      const t = document.createElement("textarea");
      t.value = studioEmail;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  }

  const action =
    "flex min-h-target w-full items-center justify-between gap-4 border-b border-paper/40 px-4 text-left hover:bg-paper hover:text-ink focus-visible:bg-paper focus-visible:text-ink";

  return (
    <div ref={wrapRef} className="relative inline-block">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-target items-center text-lede underline decoration-magenta decoration-2 underline-offset-4 hover:decoration-paper"
      >
        {studioEmail}
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute bottom-full left-0 z-20 mb-2 w-80 max-w-screen border border-paper/40 bg-ink text-paper"
      >
        <button type="button" onClick={copy} className={action}>
          <span>{copied ? "Copied to clipboard" : "Copy address"}</span>
          <span aria-hidden="true">{copied ? "✓" : "⧉"}</span>
        </button>
        <a href={`mailto:${studioEmail}`} className={action}>
          <span>Open in your email app</span>
          <span aria-hidden="true">↗</span>
        </a>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            openEnquiry();
          }}
          className={`${action} border-b-0`}
        >
          <span>Send through our form</span>
          <span aria-hidden="true">→</span>
        </button>
        <p role="status" className="sr-only">
          {copied ? `${studioEmail} copied to clipboard` : ""}
        </p>
      </div>
    </div>
  );
}

/* A plain button that opens the enquiry dialog — for server components. */
export function EnquiryButton({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <button type="button" onClick={openEnquiry} aria-haspopup="dialog" className={className}>
      {children}
    </button>
  );
}
