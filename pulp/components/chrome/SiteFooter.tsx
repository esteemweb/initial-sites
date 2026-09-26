import type { ReactElement } from "react";
import SignatureLine from "@/components/brand/SignatureLine";
import TextLink from "@/components/ui/TextLink";
import { FOOTER_NAV } from "@/lib/nav";
import Wordmark from "@/components/brand/Wordmark";
import SpecMarkGrid from "./SpecMarkGrid";
import NewsletterSignup from "./NewsletterSignup";

/**
 * The site footer (DESIGN.md §4 inventory).
 *
 * Four bands rather than a strip, separated by 2px `ink` rules and set to the
 * section rhythm of §5 — 80px, rising to 96px at desktop. The density
 * alternates the way §1 asks: a loud heading, a dense chart of symbols, a quiet
 * column of links, then one committed block of colour.
 *
 * The spec grid sits on a full-bleed `rule` band and the signature line on a
 * full-bleed `signal` one; both run edge to edge rather than floating as cards,
 * which §2 forbids. Centring the signature is allowed for exactly this reason
 * — §5 reserves centre for full-bleed `signal` blocks and the 404.
 */
export default function SiteFooter(): ReactElement {
  return (
    <footer className="border-t-2 border-ink">
      <section className="shell py-48 desktop:py-64">
        <h2 className="sr-only">Newsletter</h2>
        <NewsletterSignup />
      </section>

      <div className="wash-volt plotted-sheet border-y-2 border-ink">
        <section className="shell py-48 desktop:py-64">
          <h2 className="type-label mb-48">The spec marks in full</h2>
          <SpecMarkGrid />
        </section>
      </div>

      <section className="shell py-48 desktop:py-64">
        <h2 className="sr-only">Site links</h2>

        <div className="flex flex-col gap-48 tablet:flex-row tablet:gap-96">
          {FOOTER_NAV.map((group) => (
            <nav key={group.heading} aria-label={group.heading}>
              <h3 className="type-label mb-24">{group.heading}</h3>
              <ul className="flex flex-col gap-16">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <TextLink href={link.href}>{link.label}</TextLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <p className="type-label mt-80">
          &copy; {new Date().getFullYear()} <Wordmark />
        </p>
      </section>

      <div className="bg-rose text-page">
        <div className="shell py-80 text-center desktop:py-96">
          <SignatureLine className="type-lg" />
        </div>
      </div>
    </footer>
  );
}
