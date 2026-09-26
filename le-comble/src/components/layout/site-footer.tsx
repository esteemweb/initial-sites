import Link from "next/link";
import { Suspense } from "react";
import { FOOTER_LINKS, HOURS, SITE, TAGLINE } from "@/content/site";
import { href, type Lang } from "@/lib/i18n";
import { LanguageSwitch } from "./language-switch";

/* Footer — ciel band, six links (brief §13; the reference has fifteen,
   autopsy §8). pattern: utility end of page on the second surface —
   REFERENCE-AUTOPSY §4.4. */

export function SiteFooter({ lang }: { lang: Lang }) {
  return (
    <footer className="tone-field pb-56 lg:pb-0">
      <div className="grid-page section-pad gap-y-48">
        <div className="col-span-12 flex flex-col gap-12 lg:col-span-4">
          <p className="type-md">{SITE.name}</p>
          <p className="text-ink">{TAGLINE[lang]}</p>
          <address className="mt-12 flex flex-col not-italic">
            <span>{SITE.address.street}</span>
            <span>{SITE.address.city}</span>
            <span className="text-ink">{SITE.address.quarter[lang]}</span>
            <a href={SITE.phoneHref} className="type-body font-medium tabular-nums mt-12 w-fit">
              {SITE.phone}
            </a>
          </address>
        </div>

        <nav aria-label={lang === "fr" ? "Pied de page" : "Footer"} className="col-span-12 md:col-span-6 lg:col-span-3 lg:col-start-6">
          <ul className="border-t border-ink">
            {FOOTER_LINKS.map((l) => (
              <li key={l.key} className="border-b border-ink">
                <Link href={href(lang, l.key)} className="type-small font-medium flex min-h-48 items-center no-underline hover:underline">
                  {l.label[lang]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <dl className="col-span-12 flex flex-col gap-16 md:col-span-6 lg:col-span-3 lg:col-start-10">
          {HOURS.map((h) => (
            <div key={h.label.fr}>
              <dt className="type-label text-ink">{h.label[lang]}</dt>
              <dd className="type-small mt-4">{h.value[lang]}</dd>
            </div>
          ))}
        </dl>

        <div className="col-span-12 flex flex-wrap items-center justify-between gap-16 border-t border-ink pt-24">
          <p className="type-small text-ink">© {SITE.name}, 2026</p>
          <Suspense fallback={null}>
            <LanguageSwitch lang={lang} />
          </Suspense>
        </div>
      </div>
    </footer>
  );
}
