import type { QA } from "@/content/faq";
import type { Lang } from "@/lib/i18n";

/* Accordion — design-system §8: serif question in sentence case, 16px +/− in
   the block's mark colour (indigo on the ciel FAQ blocks — §4), weft rule, answer opens with a bold lead sentence.
   pattern: FAQ with bold first sentence — REFERENCE-AUTOPSY §11.2.
   Native <details>: keyboard and screen-reader behaviour for free. */

export function Accordion({ items, lang }: { items: QA[]; lang: Lang }) {
  return (
    <div className="border-t border-ink">
      {items.map((item) => (
        <details key={item.q.fr} className="group border-b border-ink">
          <summary className="flex min-h-64 cursor-pointer list-none items-center justify-between gap-24 py-16 [&::-webkit-details-marker]:hidden">
            <span className="type-md">{item.q[lang]}</span>
            <svg
              aria-hidden
              viewBox="0 0 16 16"
              className="size-16 shrink-0 stroke-mark"
              fill="none"
              strokeWidth="1.25"
            >
              <path d="M2 8h12" />
              <path d="M8 2v12" className="transition-opacity duration-(--duration-base) group-open:opacity-0" />
            </svg>
          </summary>
          <p className="max-w-prose pb-24 text-ink">
            <strong className="font-medium text-ink">{item.lead[lang]}</strong> {item.rest[lang]}
          </p>
        </details>
      ))}
    </div>
  );
}
