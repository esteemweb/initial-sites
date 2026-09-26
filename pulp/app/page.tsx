import type { ReactElement } from "react";
import HomeHero from "@/components/home/HomeHero";
import PitchBlocks from "@/components/home/PitchBlocks";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import WeightStrip from "@/components/home/WeightStrip";
import SpecLegend from "@/components/home/SpecLegend";
import CampaignBlock from "@/components/home/CampaignBlock";

/**
 * The homepage.
 *
 * Density alternates the way §1 asks — loud, quiet, quiet, loud, quiet, loud:
 * the hero and the weight strip and the campaign block carry the noise, and the
 * pitch, the product row and the spec key are the empty stretches between them.
 *
 * Sections carry `py-40 desktop:py-48` each, so section to section lands on
 * 80/96 — tightened from the 80/160 PULP started with, following the
 * forsure.co autopsy §5, where sections carry zero padding and all the rhythm
 * comes from inside components. Literal zero collapses text sections that have
 * no component to provide it, so this is the adjacent value rather than a
 * transcription.
 */
export default function Home(): ReactElement {
  return (
    <main>
      <HomeHero />
      <PitchBlocks />
      <FeaturedProducts />
      <WeightStrip />
      <SpecLegend />
      <CampaignBlock />
    </main>
  );
}
