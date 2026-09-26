import Link from "next/link";
import { HideOnScroll } from "./hide-on-scroll";
import { LogLine } from "./log-line";
import { log } from "@/lib/content";

/* Inverts with the section beneath it — see HideOnScroll. */
export function SiteHeader({ initialAt = 100 }: { initialAt?: number }) {
  return (
    <HideOnScroll initialAt={initialAt}>
      <Link href="/" className="label">
        Ask for the Moon
      </Link>
      <nav aria-label="Main" className="label">
        <Link href="/read">
          Read<span className="max-md:sr-only">&nbsp;chapter one</span>
        </Link>
        <Link href="/#buy">Buy</Link>
      </nav>
    </HideOnScroll>
  );
}

export function SiteFooter() {
  return (
    <footer className="on-night bleed rule-t relative pt-24 pb-12" data-at="0">
      <LogLine entry={log.footer} onRule />
      <div className="grid-12 gap-y-8">
        <p className="label quiet col-span-12 lg:col-span-3">Colophon</p>
        <p className="t-body quiet measure col-span-12 lg:col-span-6">
          <em>Ask for the Moon</em> by Thea Brandt. First published in 2026 by Bramber Press. The
          cover is a page from a negotiation log with the moon blacked out of it. The only thing
          left unredacted is a crescent — which is what a moon actually is.
        </p>
        <p className="label quiet col-span-12 lg:col-span-3 lg:text-right">
          Press and rights: Bramber Press
          <br />© 2026 Thea Brandt
        </p>
      </div>
    </footer>
  );
}
