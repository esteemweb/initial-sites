import { Moon, PHASES } from "./moon";

/* A chapter title with its moon behind the first letter. The glyph shares the
   title's ink, so where the letter crosses it a clipped copy of the title is
   drawn in the field colour — the letter inverts out of the moon, the same way
   everything on this site crosses a join. Needs <MoonClips> on the page. */
export function RoomTitle({
  n,
  title,
  index,
  as: Tag = "h3",
}: {
  n: string;
  title: string;
  index: number;
  as?: "h3" | "p";
}) {
  const phase = PHASES[index];
  return (
    <Tag className="room-title t-xl">
      <span className="sr-only">
        Chapter {n}, {phase.name}:{" "}
      </span>
      <span className="title-moon" aria-hidden="true">
        <Moon lit={phase.lit} waning={phase.waning} size={24} />
      </span>
      <span className="title-text">{title}</span>
      <span className="title-knock" aria-hidden="true" style={{ clipPath: `url(#moon-clip-${index})` }}>
        <span className="title-text">{title}</span>
      </span>
    </Tag>
  );
}
