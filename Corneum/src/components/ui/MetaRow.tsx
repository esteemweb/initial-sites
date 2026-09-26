import type { ReactNode } from "react";
import { keepCase } from "@/lib/keepCase";

/* design-system §Components/MetaRow, from autopsy §7 "metadata row":
   a full-width hairline, then dot + label at col 1 and value at col 9
   (col 7 below 1024, where four columns are too narrow for a value).
   Lab-label typography, all mono. Green is reserved for measured values
   (data and active percentages), so it only appears when `measured`.
   Render rows inside <MetaList>, which supplies the <dl> and the grid. */

export type MetaRowState = "default" | "loading" | "error" | "empty";

type Props = {
  label: ReactNode;
  value?: ReactNode;
  /** The value is a measured figure (a %, a pH, an n). Sets it in green. */
  measured?: boolean;
  state?: MetaRowState;
};

const fallback: Record<Exclude<MetaRowState, "default">, string> = {
  loading: "—",
  error: "Unavailable",
  empty: "Not declared",
};

export function MetaRow({ label, value, measured = false, state = "default" }: Props) {
  const shown = state === "default" ? value : fallback[state];
  const green = state === "default" && measured;

  return (
    <div className="col-span-12 grid grid-cols-subgrid border-t border-hairline py-16" aria-busy={state === "loading" || undefined}>
      <dt className="type-data col-span-6 flex items-center gap-8 lg:col-span-8">
        <span aria-hidden className="size-8 shrink-0 rounded-pill bg-ink" />
        {keepCase(label)}
      </dt>
      <dd className={`type-data col-span-6 col-start-7 lg:col-span-4 lg:col-start-9 ${green ? "text-green" : ""} ${state === "default" ? "" : "text-ink-muted"}`}>
        {keepCase(shown)}
      </dd>
    </div>
  );
}

export function MetaList({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <dl className={`col-span-12 grid grid-cols-subgrid border-b border-hairline ${className}`}>{children}</dl>;
}
