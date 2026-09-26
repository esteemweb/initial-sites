/* pattern: final CTA — this section has NO precedent on the reference, which
   is the point. Autopsy §14 lists "no final CTA, no footer CTA, no secondary
   conversion path" as a weak item: one badge and a phone number across a
   12-viewport page. A subscription product cannot inherit that.
   Forest surface, so the CTA is amber (8.61:1) rather than cherry (2.11:1). */
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { EyebrowRow } from "@/components/ui/eyebrow-row";

export function SubscriptionTeaser() {
  return (
    <Section tone="forest" id="subscribe">
      <Reveal>
        <div className="u-rule-cap-dark pt-8">
          <EyebrowRow lead="Subscription" label="From LKR 4,800" tone="onDark" />
        </div>

        <h2 className="mt-16 text-2xl u-measure">
          Pick a roast once. We will handle the other fifty-one weeks.
        </h2>

        <p className="mt-12 u-measure text-base text-text-muted-dark">
          Choose the lot, the grind and how often. Change any of it, skip a
          delivery, or stop entirely — all of it from your account, none of it
          by email.
        </p>

        <div className="mt-16 flex flex-wrap gap-4">
          <Button href="/subscribe" variant="onDark" size="lg">
            Build a subscription
          </Button>
          {/* No wholesale page yet: plain text, not a link (audit item 11). */}
          <p className="self-center text-base text-text-muted-dark">
            Wholesale instead
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
