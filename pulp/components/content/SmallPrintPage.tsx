import type { ReactElement } from "react";
import Prose from "./Prose";
import type { SmallPrintPage as SmallPrintContent } from "@/lib/content/smallPrint";

interface SmallPrintPageProps {
  content: SmallPrintContent;
}

/**
 * The shared layout for delivery and returns, privacy and terms.
 *
 * One component for all three because the brief calls them stubs with real text
 * and no design effort — three separate near-identical layouts would be effort
 * spent in exactly the place it was asked not to be. The type roles do the work.
 */
export default function SmallPrintPage({
  content,
}: SmallPrintPageProps): ReactElement {
  return (
    <main className="shell py-40 desktop:py-48">
      <p className="type-label">Small print</p>
      <h1 className="type-lg mt-16">{content.title}</h1>
      <p className="type-base measure mt-24">{content.intro}</p>

      <div className="mt-64 flex flex-col gap-64">
        {content.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="type-md">{section.heading}</h2>
            <Prose paragraphs={section.paragraphs} className="mt-24" />
          </section>
        ))}
      </div>
    </main>
  );
}
