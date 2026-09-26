/* Homepage. Section order from design-system §7 "Page architecture",
   which adapts the reference's nine-section inventory (autopsy §9) down to
   seven: the 01-09 numbered spine collapses into one capped Origins section,
   and a final CTA is added where the reference has none.
   The Statement follows the hero directly, as the reference's manifesto
   does: it is what the hero's rising media edge uncovers (autopsy §15.4). */
import { Hero } from "@/components/sections/hero";
import { AudienceBand } from "@/components/sections/audience-band";
import { Statement } from "@/components/sections/statement";
import { Origins } from "@/components/sections/origins";
import { TwoHouses } from "@/components/sections/two-houses";
import { SubscriptionTeaser } from "@/components/sections/subscription-teaser";

export default function Home() {
  return (
    <>
      <Hero />
      <Statement />
      <AudienceBand />
      <Origins />
      <TwoHouses />
      <SubscriptionTeaser />
    </>
  );
}
