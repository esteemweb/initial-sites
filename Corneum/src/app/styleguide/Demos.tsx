"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { SpecModal } from "@/components/ui/SpecModal";
import { TextField } from "@/components/ui/TextField";
import { getProduct } from "@/data/products";

const cleanse = getProduct("cleanse")!;
const sections = [
  { label: "Full INCI", value: cleanse.inci!.value },
  { label: "Contraindications", value: cleanse.contraindications.value.join(" ") },
  { label: "Clinical study summary", value: `${cleanse.study!.value.design} ${cleanse.study!.value.outcome}` },
];
const rows = [
  ...cleanse.actives.value.map((a) => ({ label: a.name, value: a.pct, measured: true })),
  ...cleanse.specs.map((s) => ({ label: s.label, value: s.value, measured: s.measured })),
];

/* Motion: answers a user action. Out with ease-enter at 720ms, back with
   ease-exit at 360ms. Under reduced motion it jumps straight to the end. */
export function MotionDemo() {
  const [out, setOut] = useState(false);
  return (
    <div className="grid gap-24">
      <div className="border-b border-hairline pb-16">
        <span
          aria-hidden
          className={`block size-48 rounded-pill bg-ink transition-transform ${
            out ? "translate-x-160 duration-720 ease-enter" : "translate-x-0 duration-360 ease-exit"
          }`}
        />
      </div>
      <div>
        <Button variant="secondary" aria-pressed={out} onClick={() => setOut((v) => !v)}>
          {out ? "Return (exit, 360ms)" : "Move (enter, 720ms)"}
        </Button>
      </div>
    </div>
  );
}

/* The spec modal in each of its four states. */
export function ModalDemos() {
  return (
    <div className="grid justify-items-start gap-8">
      <SpecModal
        triggerLabel="Technical sheet — default"
        title="Technical sheet"
        sections={sections}
        rows={rows}
        printable
      />
      <SpecModal triggerLabel="Technical sheet — loading" title="Technical sheet" state="loading" />
      <SpecModal triggerLabel="Technical sheet — error" title="Technical sheet" state="error" onRetry={() => {}} />
      <SpecModal triggerLabel="Technical sheet — empty" title="Technical sheet" state="empty" />
    </div>
  );
}

/* Quantity stepper: live, at each limit, and loading. */
export function StepperDemo() {
  const [q, setQ] = useState(2);
  return (
    <div className="flex flex-wrap items-start gap-40">
      {[
        { label: "Default", node: <QuantityStepper label="Cleanse" value={q} max={9} onChange={setQ} /> },
        { label: "At minimum", node: <QuantityStepper label="Barrier" value={1} max={9} onChange={() => {}} /> },
        { label: "At maximum", node: <QuantityStepper label="Density" value={9} max={9} onChange={() => {}} /> },
        { label: "Loading", node: <QuantityStepper label="Reset" value={1} max={9} onChange={() => {}} loading /> },
      ].map((d) => (
        <div key={d.label} className="grid gap-8">
          <span className="type-data text-ink-muted">{d.label}</span>
          {d.node}
        </div>
      ))}
    </div>
  );
}

/* Text field in each state. */
export function FieldDemo() {
  const [v, setV] = useState("");
  return (
    <div className="grid gap-24 md:grid-cols-2 md:gap-x-20">
      <TextField label="Default" value={v} onChange={(e) => setV(e.target.value)} autoComplete="off" />
      <TextField label="Filled" defaultValue="Commonwealth Avenue" optional autoComplete="off" />
      <TextField label="With hint" hint="Two letters, e.g. MA" optional autoComplete="off" />
      <TextField label="Disabled" defaultValue="United States" disabled optional />
      <TextField label="Error" defaultValue="0211" error="Enter a five-digit ZIP code." optional autoComplete="off" />
    </div>
  );
}
