import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { SubscriptionWidget } from "@/components/subscription/subscription-widget";
import { Rule } from "@/components/ui/rule";
import { EyebrowRow } from "@/components/ui/eyebrow-row";

export const metadata: Metadata = {
  title: "Subscription — Leaf & Cherry",
  description:
    "Pick a lot, a roast and a cadence. Change or skip any shipment from your account.",
};

/* pattern: page head + widget. Heading with a trailing rule is the reference's
   §6 divider in its second job; the widget itself is design-system §8. */
export default function SubscribePage() {
  return (
    <>
      <Section tone="linen" className="u-nav-offset">
        <div className="flex items-center">
          <h1 className="text-hero">Coffee, on a schedule you set</h1>
          <Rule variant="trailing" />
        </div>

        <p className="mt-12 u-measure text-base">
          Everything is roasted to order on a Tuesday and posted the same week.
          Change the lot, the grind, the size or the cadence whenever you like —
          skipping a shipment takes one click and no email.
        </p>

        <div className="mt-24">
          <SubscriptionWidget />
        </div>
      </Section>

      <Section tone="roast">
        <div className="u-rule-cap-dark pt-8">
          <EyebrowRow
            lead="The small print"
            label="No lock-in"
            tone="onDark"
          />
        </div>

        <ul className="mt-16 grid gap-8 text-base md:grid-cols-3 md:gap-16">
          <li>
            Cancel from your account at any time. We will not ask you why, and
            nobody will call.
          </li>
          <li>
            Skip a shipment up to 48 hours before it roasts. Skipped shipments
            are not charged.
          </li>
          <li>
            Prices move when green coffee prices move. We tell you a shipment
            in advance, never after.
          </li>
        </ul>
      </Section>
    </>
  );
}
