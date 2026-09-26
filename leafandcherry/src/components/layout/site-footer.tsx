/* pattern: footer — autopsy §10 "Footer" (two columns, one background change
   on the whole page, 14px throughout) with the reference's §14 weak item
   fixed: it has no final CTA and no footer CTA anywhere. design-system §8. */
import Link from "next/link";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { SITE } from "@/content/site";

const legal = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  // No page yet: plain text, not a link (SECURITY-AUDIT.md 11).
  { label: "Wholesale", href: null },
];

export function SiteFooter() {
  return (
    <footer>
      <Section tone="raised" id="visit">
        {/* The repeated CTA the reference omits. */}
        <div className="u-rule-cap flex flex-col gap-6 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-xl u-measure">
            Coffee every two weeks, without thinking about it again.
          </p>
          <Button href="/subscribe" variant="primary" size="lg">
            Start a subscription
          </Button>
        </div>

        <div className="mt-24 grid gap-12 sm:grid-cols-2">
          <div className="text-xs">
            <p className="font-mono text-2xs uppercase text-text-muted">
              {SITE.colombo.label}
            </p>
            <p className="mt-2">{SITE.colombo.address}</p>
            <p>{SITE.colombo.hours}</p>

            <p className="mt-8 font-mono text-2xs uppercase text-text-muted">
              {SITE.ella.label}
            </p>
            <p className="mt-2">{SITE.ella.address}</p>
            <p>{SITE.ella.hours}</p>

            <p className="mt-8">
              {/* Plain text, not a tel: link — a demo number (site.ts). */}
              {SITE.phone}
            </p>
          </div>

          <div className="text-xs sm:text-right">
            <p>© {new Date().getFullYear()} Leaf &amp; Cherry</p>
            <p className="text-text-muted">Colombo &amp; Ella, Sri Lanka</p>
            <ul className="mt-6 flex gap-6 sm:justify-end">
              {legal.map((l) => (
                <li key={l.label}>
                  {l.href ? (
                    <Link
                      href={l.href}
                      data-link="prose"
                      className="inline-flex u-touch items-center"
                    >
                      {l.label}
                    </Link>
                  ) : (
                    <span className="inline-flex u-touch items-center text-text-muted">
                      {l.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* The reference's giant faded name across the footer's bottom edge
            (autopsy §15.9). The negative margin eats the section's bottom
            padding so the edge crops it. */}
        <div aria-hidden="true" className="-mb-16 mt-24 overflow-hidden lg:-mb-32">
          <p className="u-watermark font-display u-display-plain">Leaf &amp; Cherry</p>
        </div>
      </Section>
    </footer>
  );
}
