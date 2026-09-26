import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/section";
import { EyebrowRow } from "@/components/ui/eyebrow-row";
import { Rule } from "@/components/ui/rule";
import { SubscriptionWidget } from "@/components/subscription/subscription-widget";
import { NextShipment } from "@/components/account/next-shipment";
import { ShipmentHistory } from "@/components/account/shipment-history";
import { PlanControls } from "@/components/account/plan-controls";
import { ACCOUNT_NAV, CURRENT_PLAN } from "@/content/account";

export const metadata: Metadata = {
  title: "Your account — Leaf & Cherry",
  description: "Your plan, your shipments, and everything you can change.",
  robots: { index: false, follow: false },
};

/* pattern: dashboard — design-system §7 "Subscription dashboard".
   The header goes solid on this route (a dashboard must not float over its own
   content); the rail uses the 30/70 split with a leading rule and number <->
   LABEL rows as nav items, which is the reference's §10 eyebrow component
   doing a job it never did on the reference. */
export default function AccountPage() {
  return (
    <Section tone="linen" bleed flush className="u-nav-offset">
      <div className="u-gutter pt-16">
        <div className="flex items-center">
          <h1 className="text-hero">Your account</h1>
          <Rule variant="trailing" />
        </div>
      </div>

      <div className="u-split mt-16">
        {/* Rail */}
        <div className="u-gutter lg:pr-12">
          <nav aria-label="Account sections" className="u-rule-lead">
            <ul className="grid gap-6">
              {ACCOUNT_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex min-h-11 items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    <EyebrowRow
                      lead={item.lead}
                      label={item.label}
                      className="w-full"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <p className="mt-16 u-measure-card text-sm text-text-muted">
            Everything on this page takes effect from the next roast. Anything
            already in the drum is on its way.
          </p>
        </div>

        {/* Main column. min-w-0 matters: a grid item defaults to
            min-width:auto, so it refuses to shrink below its widest child and
            the table's overflow-x-auto never engages — the whole page scrolls
            sideways instead of the table. */}
        <div className="grid min-w-0 gap-32">
          <section id="plan" aria-labelledby="plan-heading">
            <div className="u-gutter lg:pl-0">
              <h2 id="plan-heading" className="sr-only">
                Your plan
              </h2>
            </div>

            <NextShipment />

            <div className="u-gutter mt-24 lg:pl-0">
              <SubscriptionWidget
                mode="edit"
                initial={{
                  lot: CURRENT_PLAN.lot,
                  size: CURRENT_PLAN.size,
                  cadence: CURRENT_PLAN.cadence,
                  roast: "medium",
                  grind: "whole",
                }}
                eyebrowLead="Change your plan"
                eyebrowLabel={`Applies from ${CURRENT_PLAN.nextShip}`}
              />
            </div>
          </section>

          <section
            id="shipments"
            aria-labelledby="shipments-heading"
            className="u-gutter min-w-0 lg:pl-0"
          >
            <div className="flex items-center">
              <h2 id="shipments-heading" className="text-xl">
                Shipments
              </h2>
              <Rule variant="trailing" />
            </div>
            <ShipmentHistory />
          </section>

          <section
            id="delivery"
            aria-labelledby="controls-heading"
            className="u-gutter lg:pl-0"
          >
            <div className="u-rule-cap pt-8">
              <EyebrowRow lead="Plan controls" label="No lock-in" />
            </div>
            <h2 id="controls-heading" className="mt-12 text-xl">
              Pause it, or stop it
            </h2>
            <p className="mt-6 u-measure text-sm text-text-muted">
              Both take one click and a confirmation. Neither needs an email, a
              phone call, or a reason.
            </p>
            <div className="mt-12">
              <PlanControls />
            </div>
          </section>
        </div>
      </div>
    </Section>
  );
}
