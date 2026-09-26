/* pattern: one-screen text page for /privacy and /terms (SECURITY-AUDIT.md
   item 11). Built from the site's own parts only: the display heading with a
   trailing rule (autopsy §6, second job), the number <-> LABEL eyebrow row, a
   leading rule on the body, prose at --measure. Left-aligned like everything
   else. Each page states plainly that this is a demo site. */
import { Section } from "@/components/ui/section";
import { Rule } from "@/components/ui/rule";
import { EyebrowRow } from "@/components/ui/eyebrow-row";

type Props = {
  title: string;
  label: string;
  paragraphs: readonly string[];
};

export function LegalPage({ title, label, paragraphs }: Props) {
  return (
    <Section tone="linen" className="u-nav-offset flex min-h-svh flex-col justify-center">
      <div className="flex items-center">
        <h1 className="text-hero">{title}</h1>
        <Rule variant="trailing" />
      </div>

      <div className="mt-16 u-rule-lead u-measure">
        <EyebrowRow lead="Demo site" label={label} />
        <div className="mt-8 grid gap-6 text-base">
          {paragraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
      </div>
    </Section>
  );
}
