import { Reveal } from "@/components/motion/Reveal";

export function SectionHeading({
  eyebrow,
  ja,
  title,
  lead,
  align = "left",
  level = "h2",
}: {
  eyebrow: string;
  ja?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  level?: "h1" | "h2";
}) {
  return (
    <div className={`max-w-prose ${align === "center" ? "mx-auto text-center" : ""}`}>
      <p className="eyebrow flex items-center gap-3">
        {ja ? (
          <span lang="ja" className="font-display text-base normal-case tracking-normal text-accent">
            {ja}
          </span>
        ) : null}
        <span>{eyebrow}</span>
      </p>
      <Reveal as={level} words={title} className="mt-3 text-3xl" />
      {lead ? <p className="mt-6 text-lg text-text-muted">{lead}</p> : null}
    </div>
  );
}
