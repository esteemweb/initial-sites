import type { Metadata } from "next";
import DatesList from "@/components/DatesList";
import PageHero from "@/components/PageHero";
import { todayKey } from "@/lib/shows";
import fader from "@/photos/work-02-fader.png";

export const metadata: Metadata = {
  title: "dates",
  description: "where traag is playing next, and where she has played.",
};

export default function DatesPage() {
  return (
    <main>
      <PageHero
        title="dates"
        image={fader}
        alt="Two hands on a turntable: one on a white-label record, the other on the pitch fader"
        position="50% 45%"
      />
      <div className="container glow" style={{ paddingBlock: "var(--s6)" }}>
        <p className="t-record ghost" style={{ marginBottom: "var(--s4)" }}>
          no guest list. ask anyway
        </p>
        <DatesList built={todayKey()} withPast />
        <p className="t-record ghost" style={{ marginTop: "var(--s5)", maxWidth: "var(--measure)" }}>
          doors are when doors open. i am usually on later than that. if a room wants me to open, i open.
        </p>
      </div>
    </main>
  );
}
