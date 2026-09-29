import Link from "next/link";
import { nav, site } from "@/lib/content/site";
import { Emblem } from "./Emblem";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink pb-24 pt-16 text-text lg:pb-32">
      <p
        lang="ja"
        aria-hidden="true"
        className="tategaki pointer-events-none absolute right-5 top-16 font-display text-2xl leading-[1.2] text-shu sm:right-8 lg:right-12"
      >
        横浜元町　鱗
      </p>
      <div className="relative mx-auto grid max-w-wide gap-12 px-5 pr-24 sm:px-8 sm:pr-32 lg:grid-cols-12 lg:px-12 lg:pr-40">
        <div className="flex items-start gap-4 lg:col-span-4">
          <Emblem className="h-16 w-16 shrink-0 text-paper" title={site.name} />
          <div>
            <p className="text-sm">{site.name}</p>
            <p className="text-sm text-text-muted">{site.reading}</p>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-8 text-sm lg:col-span-8 lg:grid-cols-4">
          <div>
            <dt className="text-text-muted">Visit</dt>
            <dd className="mt-3 normal-case tracking-normal">
              <span lang="ja" className="font-display">{site.address.ja}</span>
              <br />
              {site.address.lines[0]}
              <br />
              {site.address.lines[1]}
              <a href={site.mapsUrl} className="mt-2 block text-text-muted no-underline hover:text-shu-bright">
                Motomachi on Google Maps
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-text-muted">Hours</dt>
            <dd className="mt-3 space-y-1 normal-case tracking-normal">
              {site.hours.map((h) => (
                <div key={h.days} className="flex flex-col whitespace-nowrap lg:flex-row lg:justify-between lg:gap-4">
                  <span>{h.days}</span>
                  <span className="text-text-muted">{h.time}</span>
                </div>
              ))}
            </dd>
          </div>
          <div>
            <dt className="text-text-muted">Contact</dt>
            <dd className="mt-3 space-y-1 normal-case tracking-normal">
              <a href={`mailto:${site.email}`} className="block no-underline hover:text-shu-bright">{site.email}</a>
              {/* Plain text on purpose: the handle is fictional and belongs to nobody */}
              <p className="text-text-muted">
                {site.instagramHandle} <span className="text-xs">(fictional account)</span>
              </p>
            </dd>
          </div>
          <div>
            <dt className="text-text-muted">Pages</dt>
            <dd className="mt-3 space-y-1">
              {nav.map((n) => (
                <Link key={n.href} href={n.href} className="block no-underline hover:text-shu-bright">{n.label}</Link>
              ))}
            </dd>
          </div>
        </dl>
      </div>
      <div className="relative mx-auto mt-24 flex max-w-wide flex-wrap justify-between gap-4 px-5 text-xs text-text-muted sm:px-8 lg:px-12">
        <p>© {new Date().getFullYear()} {site.name}. A fictional studio, built as a portfolio demo. Nothing is charged.</p>
        <p>Minimum age 20. Bring ID.</p>
      </div>
    </footer>
  );
}
