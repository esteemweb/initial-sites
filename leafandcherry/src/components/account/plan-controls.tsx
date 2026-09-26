"use client";

/* pattern: plan controls — design-system §7 row 6. Primary plus badge-secondary
   pairing. Pausing and cancelling go through a confirm step rather than firing
   from a raw destructive button (PHASE-1-PLAN step 6).

   This is the one place --shadow-overlay is permitted: a dashboard needs real
   layering, which the reference never had (zero box-shadow anywhere, autopsy
   §6). It must not appear on a marketing page.

   Native <dialog> + showModal(): focus trap, Escape, inert background and the
   top layer all come from the platform rather than from hand-rolled JS. */
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type Action = "pause" | "cancel";

const COPY: Record<Action, { title: string; body: string; confirm: string }> = {
  pause: {
    title: "Pause your subscription?",
    body: "Nothing ships and nothing is charged until you start it again. Your lot, grind and cadence are kept exactly as they are.",
    confirm: "Pause it",
  },
  cancel: {
    title: "Cancel your subscription?",
    body: "This ends the plan after the shipment already roasting. We will not ask you why, and nobody will call. You can start again whenever you like.",
    confirm: "Cancel the plan",
  },
};

export function PlanControls() {
  const [action, setAction] = useState<Action | null>(null);
  const [result, setResult] = useState<string>("");
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (action && !el.open) el.showModal();
    if (!action && el.open) el.close();
  }, [action]);

  const copy = action ? COPY[action] : null;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="badge" size="lg" onClick={() => setAction("pause")}>
          Pause deliveries
        </Button>
        <Button variant="ghost" size="lg" onClick={() => setAction("cancel")}>
          Cancel subscription
        </Button>

        {/* The outcome is announced, not only rendered. */}
        <p aria-live="polite" className="text-sm text-text-muted">
          {result}
        </p>
      </div>

      <dialog
        ref={ref}
        aria-labelledby="confirm-title"
        aria-describedby="confirm-body"
        onClose={() => setAction(null)}
        /* backdrop:bg-* styles the ::backdrop pseudo-element. */
        className="u-dialog w-full max-w-lg bg-surface p-0 text-text backdrop:bg-surface-roast/60"
      >
        {copy ? (
          <div className="u-rule-cap p-8 pt-8">
            <h2 id="confirm-title" className="text-xl">
              {copy.title}
            </h2>
            <p id="confirm-body" className="mt-6 u-measure-card text-sm">
              {copy.body}
            </p>

            <div className="mt-12 flex flex-wrap gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  setResult(
                    action === "pause"
                      ? "Paused. Nothing ships until you start it again."
                      : "Cancelled after the shipment already roasting.",
                  );
                  setAction(null);
                }}
              >
                {copy.confirm}
              </Button>
              <Button variant="ghost" size="lg" onClick={() => setAction(null)}>
                Keep it as it is
              </Button>
            </div>
          </div>
        ) : null}
      </dialog>
    </div>
  );
}
