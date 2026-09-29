import Link from "next/link";
import { availabilityLabel, type Artist } from "@/lib/content/artists";
import { GlowCard } from "@/components/ui/spotlight-card";
import { ArtistPlate } from "./ArtistPlate";

const dot = {
  open: "bg-ok",
  waitlist: "bg-warn",
  closed: "bg-err",
} as const;

export function ArtistCard({ artist }: { artist: Artist }) {
  return (
    <Link
      href={`/artists/${artist.slug}`}
      className="group block h-full no-underline"
    >
      <GlowCard glowColor="red" autoGlow customSize className="h-full">
        <ArtistPlate
          artist={artist}
          className="transition-[filter] duration-300 ease-standard [filter:brightness(0.96)] group-hover:[filter:brightness(1)]"
        />
        <div className="px-1 pb-1">
          <p className="text-2xl leading-tight group-hover:underline group-hover:underline-offset-4">
            {artist.name}{" "}
            <span
              lang="ja"
              className="font-display text-lg font-normal text-text-muted"
            >
              {artist.ja}
            </span>
          </p>
          <p className="mt-1 text-sm text-text-muted">{artist.role}</p>
          <p className="mt-3 text-text-muted">{artist.focus.join(" · ")}</p>
          <p className="mt-3 flex items-center gap-2 text-sm">
            <span
              className={`inline-block h-2 w-2 rounded-full ${dot[artist.availability.status]}`}
              aria-hidden="true"
            />
            {availabilityLabel[artist.availability.status]}
          </p>
        </div>
      </GlowCard>
    </Link>
  );
}
