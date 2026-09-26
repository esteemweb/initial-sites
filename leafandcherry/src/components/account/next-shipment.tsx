/* pattern: next-shipment panel — design-system §7 row 3. Roast surface with an
   amber chip: --color-accent is 2.11:1 on a dark surface, so the accent never
   appears here (design-system §4 hard rules). Mono figures, radius 0, no
   shadow — the panel is a colour block, not a card. */
import { Badge } from "@/components/ui/badge";
import { EyebrowRow } from "@/components/ui/eyebrow-row";
import { CURRENT_PLAN } from "@/content/account";
import {
  CADENCE_LABEL,
  LOTS,
  SIZE_LABEL,
  formatLKR,
  quote,
} from "@/lib/pricing";

export function NextShipment() {
  const q = quote({
    lot: CURRENT_PLAN.lot,
    size: CURRENT_PLAN.size,
    cadence: CURRENT_PLAN.cadence,
    roast: "medium",
    grind: "whole",
  });

  return (
    <div className="bg-surface-roast text-text-on-dark u-gutter py-12">
      <div className="u-rule-cap-dark pt-8">
        <EyebrowRow lead="Next shipment" label={CURRENT_PLAN.nextShip} tone="onDark" />
      </div>

      <div className="mt-12 flex flex-wrap items-end justify-between gap-8">
        <div>
          <h2 className="text-xl">{LOTS[CURRENT_PLAN.lot].label}</h2>
          <p className="mt-4 font-mono text-2xs uppercase text-text-muted-dark">
            {SIZE_LABEL[CURRENT_PLAN.size]} · every{" "}
            {CADENCE_LABEL[CURRENT_PLAN.cadence]} · roasts{" "}
            {CURRENT_PLAN.roastsOn}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <Badge tone="onDark" status="active">
            {CURRENT_PLAN.status === "active" ? "Active" : "Paused"}
          </Badge>
          <p className="font-mono text-xl tabular-nums">
            {formatLKR(q.total)}
          </p>
        </div>
      </div>
    </div>
  );
}
