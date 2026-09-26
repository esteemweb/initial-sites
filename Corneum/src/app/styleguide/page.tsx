import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Button, type ButtonState } from "@/components/ui/Button";
import { Grid } from "@/components/ui/Grid";
import { GridOverlay } from "@/components/ui/GridOverlay";
import { Hairline } from "@/components/ui/Hairline";
import { MetaList, MetaRow } from "@/components/ui/MetaRow";
import { BuyBar } from "@/components/site/BuyBar";
import { Card } from "@/components/ui/Card";
import { SpecTable, type SpecColumn } from "@/components/ui/SpecTable";
import type { Product } from "@/data/products";
import { getProduct, products } from "@/data/products";
import { FieldDemo, ModalDemos, MotionDemo, StepperDemo } from "./Demos";
import { keepCase } from "@/lib/keepCase";

export const metadata: Metadata = {
  title: "Styleguide — Corneum",
  robots: { index: false, follow: false },
};

/* Every section: label at col 1, specimens below on the same 12 columns.
   Facts and specs sit in the right rail from col 9. */
function Section({ id, label, note, children }: { id: string; label: string; note?: string; children: ReactNode }) {
  return (
    <Grid as="section" aria-labelledby={id} className="gap-y-40 border-t border-hairline py-64 lg:py-96">
      <h2 id={id} className="type-data col-span-12 lg:col-span-8">
        {label}
      </h2>
      {note && <p className="type-body col-span-12 max-w-measure text-ink-muted lg:col-span-4 lg:col-start-9">{note}</p>}
      {children}
    </Grid>
  );
}

const colours = [
  { name: "paper", value: "#FFFFFF", role: "The ground, everywhere", contrast: "Ink on paper 21:1", swatch: "bg-paper border border-hairline" },
  { name: "ink", value: "#000000", role: "All type, rules, structure", contrast: "21:1 on paper", swatch: "bg-ink" },
  { name: "green", value: "#00524A", role: "Data and active percentages only. Never a fill, never a link.", contrast: "9.11:1 on paper", swatch: "bg-green" },
  { name: "ink-muted", value: "ink @ 0.6", role: "Secondary text and labels", contrast: "5.74:1 on paper — passes AA", swatch: "bg-ink-muted" },
  { name: "hairline", value: "ink @ 0.12", role: "The only separator. Never a component boundary.", contrast: "1.32:1 — separators only", swatch: "bg-hairline" },
];

const typeRoles = [
  { cls: "type-display", name: "display", spec: "44 / 1.0 / −0.04em · ≥1024: 140", sample: "Corneum" },
  { cls: "type-h3", name: "h3", spec: "34 / 1.1 / −0.02em · ≥1024: 56 / 1.0", sample: "One dominant element per screen" },
  { cls: "type-h4", name: "h4", spec: "20 / 1.2 / −0.02em · ≥1024: 32 / 1.0", sample: "Everything else steps down sharply" },
  { cls: "type-subtitle", name: "subtitle", spec: "20 / 1.2 / 0 · all widths", sample: "Technical sheet" },
  {
    cls: "type-body",
    name: "body",
    spec: "16 / 1.4 / 0 · ≥1024: 14",
    sample: "Body copy is capped at fifty-five characters a line, and is larger on a phone than on a desktop, never smaller.",
  },
  { cls: "type-data", name: "data", spec: "Mono 14 / 1.4 / 0 · uppercase", sample: "Salicylic acid 4.0% · pH 4.2" },
];

const spacing = [
  { cls: "w-8", px: 8 },
  { cls: "w-16", px: 16 },
  { cls: "w-20", px: 20 },
  { cls: "w-24", px: 24 },
  { cls: "w-40", px: 40 },
  { cls: "w-48", px: 48 },
  { cls: "w-64", px: 64 },
  { cls: "w-96", px: 96 },
  { cls: "w-160", px: 160 },
];

const buttonStates: { label: string; state?: ButtonState; preview?: "hover" | "active" | "focus" }[] = [
  { label: "Default" },
  { label: "Hover", preview: "hover" },
  { label: "Active", preview: "active" },
  { label: "Focus", preview: "focus" },
  { label: "Disabled", state: "disabled" },
  { label: "Loading", state: "loading" },
  { label: "Error", state: "error" },
];

const cleanse = getProduct("cleanse")!;

const tableCols: SpecColumn<Product>[] = [
  { key: "name", header: "Product", place: "col-span-4 col-start-1", cell: (p) => <span className="type-body">{p.name}</span> },
  {
    key: "active",
    header: "Active",
    place: "col-span-4 col-start-5",
    cell: (p) => (
      <span className="type-data">
        {p.actives.value[0]?.name} <span className="text-green">{p.actives.value[0]?.pct}</span>
      </span>
    ),
  },
  { key: "ph", header: "pH", place: "col-span-2 col-start-9", cell: (p) => <span className="type-data text-green">{p.ph?.value}</span> },
  { key: "price", header: "Price", place: "col-span-2 col-start-11", cell: (p) => <span className="type-data">${p.price.value}</span> },
];
const tableRows = products.filter((p) => p.kind === "refill").slice(0, 2);
const barrier = getProduct("barrier")!;

export default function Styleguide() {
  return (
    <main id="content" tabIndex={-1} className="pb-96 outline-none lg:pb-0">
      <Grid as="header" className="gap-y-24 pt-24 pb-64 lg:pb-96">
        <p className="type-data col-span-6 self-center lg:col-span-8">Corneum — foundation</p>
        <div className="col-span-6 col-start-7 justify-self-end lg:col-span-4 lg:col-start-9 lg:justify-self-start">
          <GridOverlay />
        </div>
        <h1 className="type-display title-rise col-span-12">Styleguide</h1>
        <p className="type-body col-span-12 max-w-measure text-ink-muted md:col-span-6 lg:col-span-3 lg:col-start-9">
          Every token, type step and component in the system. Product data is Cleanse, from the range data.
        </p>
      </Grid>

      <Section id="colour" label="01 — Colour" note="Three colours and two opacity steps of ink. No fourth colour, no gradients, no tints.">
        {colours.map((c) => (
          <div key={c.name} className="col-span-6 grid content-start gap-8 md:col-span-4 lg:col-span-2">
            <div className={`h-96 ${c.swatch}`} />
            <p className="type-data">{c.name}</p>
            <p className="type-data text-ink-muted">{c.value}</p>
            <p className="type-body">{c.role}</p>
            <p className="type-data text-ink-muted">{c.contrast}</p>
          </div>
        ))}
      </Section>

      <Section id="type" label="02 — Type" note="Geist Sans 300 for display and headings, 400 for body. Geist Mono 400 uppercase for data. Stepped at 1024, never fluid.">
        {typeRoles.map((t) => (
          <div key={t.name} className="col-span-12 grid grid-cols-subgrid gap-y-16 border-t border-hairline pt-24">
            <p className={`${t.cls} col-span-12 max-w-measure lg:col-span-8 ${t.name === "display" ? "lg:max-w-none" : ""}`}>
              {keepCase(t.sample)}
            </p>
            <p className="type-data col-span-12 text-ink-muted lg:col-span-4 lg:col-start-9">
              {t.name} · {t.spec}
            </p>
          </div>
        ))}
      </Section>

      <Section id="spacing" label="03 — Spacing" note="The only spacing values. Gutter and outer margin are both 20.">
        <div className="col-span-12 grid gap-16">
          {spacing.map((s) => (
            <div key={s.px} className="flex items-center gap-24">
              <span className="type-data w-48 text-ink-muted">{s.px}</span>
              <span className={`h-8 bg-ink ${s.cls}`} />
            </div>
          ))}
        </div>
      </Section>

      <Section id="radius" label="04 — Radius" note="Three radii and nothing else.">
        <div className="col-span-6 grid content-start gap-8 lg:col-span-3">
          <div className="size-96 rounded-none bg-ink" />
          <p className="type-data">0 — imagery</p>
        </div>
        <div className="col-span-6 grid content-start gap-8 lg:col-span-3">
          <div className="size-96 rounded-panel border border-ink" />
          <p className="type-data">20 — panels, modals</p>
        </div>
        <div className="col-span-12 grid content-start gap-8 lg:col-span-3">
          <div className="h-48 w-160 rounded-pill border border-ink" />
          <p className="type-data">999 — anything tappable</p>
        </div>
      </Section>

      <Section id="grid" label="05 — Grid" note="12 columns, 20 gutter, 20 margin, no max-width. Staggered lines snap to column starts, so the grid breaks diagonally, never randomly. Press G to overlay the columns.">
        <p className="type-h3 col-span-12 lg:col-span-8">Col 1 start</p>
        <p className="type-h3 col-span-10 col-start-3 lg:col-span-8">Col 3 start</p>
        <p className="type-data col-span-12 text-ink-muted lg:col-span-3 lg:col-start-9">Right rail — col 9, three columns, facts at 14</p>
      </Section>

      <Section id="motion" label="06 — Motion" note="Enter cubic-bezier(0.16, 1, 0.3, 1), 520–920ms. Exit cubic-bezier(0.55, 0, 0.85, 0.36). Link hover opacity 0.72 at 160ms. Reduced motion shows the end state.">
        <div className="col-span-12 lg:col-span-8">
          <MotionDemo />
        </div>
      </Section>

      <Section id="buttons" label="07 — Buttons" note="Two variants. Opacity is the only hover treatment. Empty state: not applicable to a button.">
        {(["primary", "secondary"] as const).map((variant) => (
          <div key={variant} className="col-span-12 grid gap-24">
            <p className="type-data text-ink-muted">{variant}</p>
            <div className="flex flex-wrap items-start gap-24">
              {buttonStates.map((b) => (
                <div key={b.label} className="grid justify-items-start gap-8">
                  <span className="type-data text-ink-muted">{b.label}</span>
                  <Button
                    variant={variant}
                    state={b.state}
                    preview={b.preview}
                    loadingLabel="Adding…"
                    errorMessage="Not added to bag"
                  >
                    Add to bag
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Section>

      <Section id="hairline" label="08 — Hairline" note="1px, ink at 0.12. The only separator.">
        <Hairline />
      </Section>

      <Section id="metarow" label="09 — Metadata row" note="Dot and label at col 1, value at col 9, under a full-width hairline. Green only for measured values. Rows are static: hover, active and focus do not apply.">
        <MetaList>
          {cleanse.actives.value.map((a) => (
            <MetaRow key={a.name} label={a.name} value={a.pct} measured />
          ))}
          {cleanse.specs.slice(0, 3).map((s) => (
            <MetaRow key={s.label} label={s.label} value={s.value} measured={s.measured} />
          ))}
          <MetaRow label="State — loading" state="loading" />
          <MetaRow label="State — error" state="error" />
          <MetaRow label="State — empty" state="empty" />
        </MetaList>
      </Section>

      <Section id="modal" label="10 — Spec modal" note="454px panel, 20 radius, label at 0.6 above value, two-column definition list, PDF download. Esc, backdrop or close to dismiss; focus returns to the trigger.">
        <div className="col-span-12 lg:col-span-4 lg:col-start-9">
          <ModalDemos />
        </div>
      </Section>

      <Section id="card" label="11 — Card" note="The one card design. The whole card is one link: hover is opacity 0.72, focus is the ink ring. Percentages in green.">
        <div className="col-span-6 lg:col-span-3">
          <Card product={cleanse} />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <Card product={barrier} />
        </div>
      </Section>

      <Section id="spectable" label="12 — Spec table" note="Comparisons only. Columns sit on the page grid. Hairline rows, mono headers at 0.6, no fills. Below 1024 pages show the same data as stacked metadata rows instead.">
        <SpecTable caption="Spec table, default" columns={tableCols} rows={tableRows} rowKey={(p) => p.slug} />
        <SpecTable caption="Spec table, loading" columns={tableCols} rows={[]} rowKey={(p) => p.slug} state="loading" />
        <SpecTable caption="Spec table, error" columns={tableCols} rows={[]} rowKey={(p) => p.slug} state="error" />
        <SpecTable caption="Spec table, empty" columns={tableCols} rows={[]} rowKey={(p) => p.slug} state="empty" />
      </Section>

      <Section id="stepper" label="13 — Quantity stepper" note="48px pill buttons with a 1px ink border. Disabled at the limits (1 and 9).">
        <div className="col-span-12">
          <StepperDemo />
        </div>
      </Section>

      <Section id="field" label="14 — Text field" note="Label above at 0.6. 48px pill, 1px ink border (the hairline fails 3:1 for a control). Errors are words with an ERROR — prefix, not colour.">
        <div className="col-span-12 lg:col-span-8">
          <FieldDemo />
        </div>
      </Section>

      <Section id="buybar" label="15 — Buy bar" note="Below 1024 the buy path stays on screen: fixed to the bottom edge, 48px targets, hairline above. Shown here at the bottom of the viewport on small screens.">
        <p className="type-body col-span-12 max-w-measure text-ink-muted lg:col-span-8">
          Narrow the window below 1024px to see it. Pages that use it add 96px of bottom padding so it never covers
          content.
        </p>
        <BuyBar slug={cleanse.slug} name={cleanse.name} price={cleanse.price.value} note={cleanse.priceNote} />
      </Section>
    </main>
  );
}
