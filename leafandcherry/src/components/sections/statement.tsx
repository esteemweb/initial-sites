/* pattern: statement section — autopsy §9 (text only, 258px of air above it,
   the page's largest type). Left-aligned like everything else on the
   reference: nothing there is ever centred. */
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { STATEMENT } from "@/content/home";

export function Statement() {
  return (
    <Section tone="linen">
      <Reveal>
        <h2 className="text-statement u-measure">{STATEMENT.heading}</h2>
        <div className="mt-16 grid gap-8 u-measure text-base">
          {STATEMENT.body.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
