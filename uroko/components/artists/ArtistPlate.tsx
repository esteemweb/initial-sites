import type { Artist } from "@/lib/content/artists";

const tones = {
  paper: "bg-paper-raised text-ink",
  deep: "bg-paper-deep text-ink",
  ink: "bg-ink text-paper",
} as const;

/** Typographic portrait stand-in: the artist's seal kanji, large, on their tone. */
export function ArtistPlate({ artist, className = "" }: { artist: Artist; className?: string }) {
  return (
    <div
      className={`relative flex aspect-[4/5] items-center justify-center overflow-hidden ${tones[artist.tone]} ${className}`}
      aria-hidden="true"
    >
      <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current opacity-10" />
      <span className="flex h-[52%] w-[42%] items-center justify-center bg-shu">
        <span lang="ja" className="font-display text-5xl font-bold leading-none text-shu-fg">
          {artist.seal}
        </span>
      </span>
      <span lang="ja" className="tategaki absolute right-4 top-4 font-display text-lg opacity-70">
        {artist.ja}
      </span>
      <span className="absolute bottom-4 left-4 font-mono text-[0.6875rem] opacity-70">
        since {artist.since}
      </span>
    </div>
  );
}
