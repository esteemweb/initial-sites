"use client";

/* pattern: the subscription widget — design-system §8. This component has NO
   precedent on the reference, which is the point: autopsy §14 lists "no final
   CTA, no secondary conversion path" as a weak item, and a subscription
   product cannot inherit that. It is assembled from the reference's parts —
   the 2px rule as the only separator, radius 0, the number <-> LABEL eyebrow
   row, mono figures, a single accent — rather than from a new visual idea.

   Layout is the 30/70 split applied at component scale (autopsy §2). */
import { useId, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { EyebrowRow } from "@/components/ui/eyebrow-row";
import { SegmentedControl } from "@/components/ui/segmented-control";
import {
  CADENCES,
  CADENCE_LABEL,
  DEFAULT_SELECTION,
  GRINDS,
  GRIND_LABEL,
  LOTS,
  ROASTS,
  ROAST_LABEL,
  SHIPMENTS_PER_YEAR,
  SIZES,
  SIZE_LABEL,
  cadenceUnavailableReason,
  formatLKR,
  quote,
  type Cadence,
  type Grind,
  type LotId,
  type Roast,
  type Selection,
  type Size,
} from "@/lib/pricing";

/** Next shipment date, shown in the eyebrow row. */
function nextShipDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 11);
  return `${String(d.getDate()).padStart(2, "0")} ${d
    .toLocaleString("en-GB", { month: "short" })
    .toUpperCase()}`;
}

type Props = {
  /** "new" is the signup flow; "edit" is the same controls inside /account. */
  mode?: "new" | "edit";
  initial?: Selection;
  eyebrowLead?: string;
  eyebrowLabel?: string;
};

export function SubscriptionWidget({
  mode = "new",
  initial = DEFAULT_SELECTION,
  eyebrowLead = "Your plan",
  eyebrowLabel,
}: Props = {}) {
  const [sel, setSel] = useState<Selection>(initial);
  /* The last saved plan. Saving moves the baseline, so "Save changes" goes
     back to disabled and the confirmation clears the moment you edit again. */
  const [baseline, setBaseline] = useState<Selection>(initial);
  const [saved, setSaved] = useState(false);
  const priceId = useId();

  const q = useMemo(() => quote(sel), [sel]);
  const dirty = useMemo(
    () =>
      (Object.keys(baseline) as (keyof Selection)[]).some(
        (k) => baseline[k] !== sel[k],
      ),
    [baseline, sel],
  );

  /** Every control goes through this, so editing always clears a stale "Saved". */
  const update = (patch: Partial<Selection>) => {
    setSaved(false);
    setSel((s) => ({ ...s, ...patch }));
  };
  const cadenceHelper = cadenceUnavailableReason(sel.size, sel.cadence);

  /* Changing size can strand the current cadence. Move off it rather than
     leaving the widget in a state it refuses to price. */
  const setSize = (size: Size) => {
    setSaved(false);
    setSel((s) => {
      const stranded = cadenceUnavailableReason(size, s.cadence);
      return { ...s, size, cadence: stranded ? "4wk" : s.cadence };
    });
  };

  const lot = LOTS[sel.lot];

  return (
    <div className="u-rule-cap pt-8">
      <EyebrowRow
        lead={eyebrowLead}
        label={eyebrowLabel ?? `Next ship ${nextShipDate()}`}
      />

      <div className="u-split-inner mt-8 gap-12 md:gap-16">
        {/* Left rail — what you are buying */}
        <div>
          {/* In edit mode the NextShipment panel above already heads the page
              with the coffee's name, so restating it here as an <h2> puts a
              duplicate in the outline. It stays a heading only in the signup
              flow, where nothing else names the lot. */}
          {mode === "edit" ? (
            <p className="text-xl font-display">{lot.label}</p>
          ) : (
            <h2 className="text-xl">{lot.label}</h2>
          )}
          <p className="mt-4 font-mono text-2xs uppercase text-text-muted">
            {lot.origin}
          </p>
          <p className="mt-6 u-measure-card text-sm text-text-muted">
            {mode === "edit"
              ? "Changes apply from the next shipment onwards. Anything already roasting is on its way and will not change."
              : "Change anything below and the price updates. Nothing is locked in until you start, and you can skip or stop any shipment afterwards."}
          </p>
        </div>

        {/* Right — the controls */}
        <div className="grid gap-8">
          <div className="min-w-0">
            <label
              htmlFor="lot"
              className="font-mono text-2xs uppercase text-text-muted"
            >
              Coffee
            </label>
            <select
              id="lot"
              value={sel.lot}
              onChange={(e) =>
                update({ lot: e.target.value as LotId })
              }
              className="mt-3 h-12 w-full rounded-none border border-hairline bg-transparent px-4 text-sm text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {(Object.keys(LOTS) as LotId[]).map((id) => (
                <option key={id} value={id}>
                  {LOTS[id].label} — {LOTS[id].origin}
                </option>
              ))}
            </select>
          </div>

          <SegmentedControl
            legend="Roast"
            name="roast"
            value={sel.roast}
            onChange={(roast: Roast) => update({ roast })}
            options={ROASTS.map((r) => ({ value: r, label: ROAST_LABEL[r] }))}
          />

          <SegmentedControl
            legend="Grind"
            name="grind"
            value={sel.grind}
            onChange={(grind: Grind) => update({ grind })}
            options={GRINDS.map((g) => ({ value: g, label: GRIND_LABEL[g] }))}
          />

          <SegmentedControl
            legend="Size"
            name="size"
            value={sel.size}
            onChange={setSize}
            options={SIZES.map((s) => ({ value: s, label: SIZE_LABEL[s] }))}
          />

          <SegmentedControl
            legend="Every"
            name="cadence"
            value={sel.cadence}
            onChange={(cadence: Cadence) => update({ cadence })}
            helper={
              cadenceUnavailableReason(sel.size, "2wk") ??
              `${SHIPMENTS_PER_YEAR[sel.cadence]} shipments a year.`
            }
            options={CADENCES.map((c) => ({
              value: c,
              label: CADENCE_LABEL[c],
              unavailableReason: cadenceUnavailableReason(sel.size, c),
            }))}
          />
        </div>
      </div>

      {/* Price. Hairline, not a rule — this separates within a component
          rather than between blocks (design-system §5). */}
      <div className="mt-16 border-t border-hairline pt-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-2xs uppercase text-text-muted">
              Per shipment
            </p>

            {/* The <p> is the live region and must persist — keying it would
                destroy and recreate the node, and a screen reader can miss an
                announcement from a live region that was just inserted. Only
                the inner span is keyed, so the animation replays. */}
            <p
              id={priceId}
              aria-live="polite"
              aria-atomic="true"
              className="mt-3 font-mono text-xl tabular-nums text-text"
            >
              <span key={q.total} className="u-price-in inline-block">
                {formatLKR(q.total)}
              </span>
            </p>

            <p className="mt-3 text-xs text-text-muted">
              {formatLKR(q.perShipment)} for {SIZE_LABEL[sel.size]}
              {q.freeDelivery
                ? " · free Colombo delivery"
                : ` · ${formatLKR(q.delivery)} delivery`}
            </p>

            {/* --color-leaf is 4.67:1 and the system restricts it to >=16px,
                so this line is text-sm, not text-xs. */}
            <p className="mt-2 text-sm text-leaf">
              Saves {formatLKR(q.saved)} against the shelf price
            </p>
          </div>

          <p className="text-xs text-text-muted">
            <span className="font-mono tabular-nums">
              {formatLKR(q.perYear)}
            </span>{" "}
            a year at this cadence
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button
            variant="primary"
            size="lg"
            aria-describedby={priceId}
            disabled={Boolean(cadenceHelper) || (mode === "edit" && !dirty)}
            onClick={() => {
              if (mode !== "edit") return;
              setBaseline(sel);
              setSaved(true);
            }}
          >
            {mode === "edit" ? "Save changes" : "Start subscription"}
          </Button>
          <Button variant="ghost" size="lg">
            {mode === "edit" ? "Skip next shipment" : "Skip the first one"}
          </Button>

          {/* Announced, not just shown. The region persists so the message is
              read when it appears. */}
          <p aria-live="polite" className="text-sm text-leaf">
            {mode === "edit" && saved ? "Saved. Applies from the next shipment." : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
