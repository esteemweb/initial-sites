import Link from "next/link";
import type { Motif } from "@/lib/content/motifs";
import { GlowCard } from "@/components/ui/spotlight-card";
import { MotifTurn } from "./MotifTurn";

export function MotifCard({
  motif,
  priority = false,
}: {
  motif: Motif;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/motifs/${motif.slug}`}
      className="group block h-full no-underline"
    >
      {/* Tighter padding than the artist cards: two columns on a phone */}
      <GlowCard
        glowColor="red"
        autoGlow
        customSize
        className="h-full min-w-0 grid-cols-1 grid-rows-none! content-start gap-3! p-2! sm:p-3!"
      >
        <MotifTurn motif={motif} priority={priority} />
        <div className="px-1 pb-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
            <p className="text-lg font-medium leading-tight group-hover:underline group-hover:underline-offset-4">
              {motif.name}
              <span
                lang="ja"
                className="ml-2 font-display text-base font-normal text-text-muted"
              >
                {motif.ja}
              </span>
            </p>
            <p className="shrink-0 text-sm text-text-muted">
              {motif.sessions[0]}–{motif.sessions[1]}
            </p>
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-text-muted">
            {motif.meaning}
          </p>
        </div>
      </GlowCard>
    </Link>
  );
}
