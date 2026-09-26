import { cn } from "@/lib/cn";

/* Standard section anatomy — design-system §7:
   section (section-pad) → grid-page → content.
   Tone: the ground by default (indigo crushed velvet); `field` for FAQ, footer and
   lists (the same velvet, crushed differently); the red `band` at most once per page (§4). Every <Section> use carries a `pattern:` comment. */

type Tone = "ground" | "field" | "band";

export function Section({
  tone = "ground",
  chapter = false,
  flush = false,
  id,
  labelledBy,
  className,
  children,
}: {
  tone?: Tone;
  chapter?: boolean;
  /** No vertical padding (for heroes that manage their own). */
  flush?: boolean;
  id?: string;
  labelledBy?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        !flush && (chapter ? "section-pad-chapter" : "section-pad"),
        tone === "field" && "tone-field",
        tone === "band" && "band",
        className,
      )}
    >
      <div className="grid-page">{children}</div>
    </section>
  );
}
