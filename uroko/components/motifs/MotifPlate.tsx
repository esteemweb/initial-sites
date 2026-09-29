import Image from "next/image";
import { categoryOf, type Motif } from "@/lib/content/motifs";

const tones = {
  paper: "bg-paper-raised text-ink",
  deep: "bg-paper-deep text-ink",
  ink: "bg-ink text-paper",
} as const;

/**
 * The motif's visual. Until artwork exists this is a typographic plate: the
 * kanji in the Mincho face on a paper card, an ink-brush ring behind it, the
 * category kanji as a small seal, and the reading set vertically.
 */
export function MotifPlate({
  motif,
  size = "card",
  priority = false,
  className = "",
}: {
  motif: Motif;
  size?: "card" | "hero" | "panel" | "thumb";
  priority?: boolean;
  className?: string;
}) {
  const cat = categoryOf(motif.category);
  const tone = tones[motif.tone];
  const kanjiSize =
    size === "hero" ? "text-5xl" : size === "thumb" ? "text-2xl" : "text-4xl";
  const aspect = size === "panel" ? "aspect-[3/2]" : "aspect-[4/5]";
  const thumb = size === "thumb";

  if (motif.image) {
    return (
      <div
        className={`relative ${aspect} overflow-hidden ${tone} ${className}`}
      >
        <Image
          src={motif.image}
          alt={`${motif.name} (${motif.ja}) tattoo design`}
          fill
          sizes={
            size === "hero"
              ? "(min-width: 1024px) 50vw, 100vw"
              : "(min-width: 1024px) 25vw, 50vw"
          }
          priority={priority}
          className="object-cover"
        />
        {thumb ? null : (
          <span
            lang="ja"
            aria-hidden="true"
            className="absolute left-3 top-3 inline-flex h-7 w-7 items-center justify-center bg-shu font-display text-sm text-shu-fg"
          >
            {cat.ja.slice(0, 1)}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative flex ${aspect} items-center justify-center overflow-hidden ${tone} ${className}`}
      aria-hidden="true"
    >
      {/* ink ring: two offset circles read as a brush stroke */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full opacity-[0.12]"
        fill="none"
      >
        <circle
          cx="50"
          cy="52"
          r="36"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeDasharray="200 26"
          strokeLinecap="round"
        />
        <circle
          cx="49"
          cy="51"
          r="34"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="180 40"
        />
      </svg>
      <span
        lang="ja"
        className={`font-display font-bold leading-none ${kanjiSize}`}
      >
        {motif.kanji}
      </span>
      {thumb ? null : (
        <>
          <span
            lang="ja"
            className="absolute left-3 top-3 inline-flex h-7 w-7 items-center justify-center bg-shu font-display text-sm text-shu-fg"
          >
            {cat.ja.slice(0, 1)}
          </span>
          <span className="tategaki absolute right-3 top-3 text-[0.6875rem] opacity-70">
            {motif.reading}
          </span>
          <span className="absolute bottom-3 left-3 font-mono text-[0.6875rem] opacity-70">
            {motif.sessions[0]}–{motif.sessions[1]}
          </span>
        </>
      )}
    </div>
  );
}
