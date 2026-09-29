/** Where the visitor is in the three booking steps; shared by /book, /book/deposit and /book/confirmed. */
const steps = ["Details", "Deposit", "Confirmed"] as const;

export function BookingSteps({ current }: { current: 1 | 2 | 3 }) {
  return (
    <ol aria-label="Booking steps" className="grid grid-cols-3 gap-3 text-sm sm:gap-6">
      {steps.map((label, i) => {
        const n = i + 1;
        const state = n < current ? "done" : n === current ? "now" : "next";
        return (
          <li key={label} aria-current={state === "now" ? "step" : undefined} className="grid gap-3">
            <span className={`h-px w-full ${state === "next" ? "bg-line" : "bg-shu-bright"}`} aria-hidden="true" />
            <span className="flex items-baseline gap-2">
              <span className={`tabular-nums ${state === "next" ? "text-text-muted" : "text-shu-bright"}`}>
                {String(n).padStart(2, "0")}
              </span>
              <span className={state === "now" ? "text-paper" : "text-text-muted"}>{label}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
