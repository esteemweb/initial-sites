"use client";

import { usePathname } from "next/navigation";
import type { ReactElement } from "react";
import Link from "next/link";
import Wordmark from "@/components/brand/Wordmark";
import IconShell from "@/components/icons/IconShell";
import { REGISTRATION_GLYPH } from "@/components/icons/glyph-paths";
import NavLink from "./NavLink";
import { PRIMARY_NAV } from "@/lib/nav";
import BasketButton from "./BasketButton";
import MobileNav from "./MobileNav";

/**
 * The site header (DESIGN.md §4 inventory, §8).
 *
 * Sticky, and fixed in its geometry: §7 rules out scroll-driven behaviour, so
 * it does not shrink, hide, gain a shadow or fade. A 2px `ink` rule separates
 * it from the page, which is how separation is done here (§6).
 *
 * Three things move on their own, and they are the stated exception to §9's
 * "nothing loops": the press is running. Behind everything, a ten-second
 * film — a conveyor of folded garments gliding across the same graph paper
 * the site is drawn on, its last frame pinned to its first. A short `rose`
 * print head travels the bottom rule end to end and back; a registration
 * mark beside the wordmark turns once every twelve seconds. All static under
 * reduced motion — the film and the head give way to the poster and nothing,
 * the mark simply stops.
 *
 * The film is 21:9 and the header is nearer 19:1, so `object-cover` shows
 * only the frame's centre band. The film was composed for exactly that: all
 * its action runs along the vertical centre and the margins stay empty.
 *
 * Navigation over a moving picture has to stay legible without relying on
 * the picture, so the wordmark, the nav and the basket each sit on a small
 * `paper` sheet — the same sheet-on-the-table idea as every panel on the
 * site — and their contrast is measured against paper, not the film.
 *
 * What else moves answers the user (§9): nav labels roll over under hover and
 * focus, and the wordmark leans harder under the pointer.
 *
 * Below 768 the links leave the header for the bottom-reachable overlay menu
 * (§8). The wordmark and the basket stay put at every size — the basket has to
 * be reachable from any screen.
 *
 * No search control and no account control, anywhere (§4).
 */
export default function SiteHeader(): ReactElement {
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-30 overflow-hidden border-b-2 border-ink bg-paper">
        {/* The header film. Three states, no JavaScript, as on the hero:
            playing; buffering on its own poster; and under reduced motion a
            plain img of that poster, which is the empty sheet the loop starts
            and ends on. */}
        <video
          className="absolute inset-0 size-full object-cover motion-reduce:hidden"
          src="/hero/header-loop.mp4"
          poster="/hero/header-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
        />
        {/* eslint-disable-next-line @next/next/no-img-element -- a fixed
            full-bleed frame behind chrome; see the hero for the reasoning. */}
        <img
          className="absolute inset-0 hidden size-full object-cover motion-reduce:block"
          src="/hero/header-poster.jpg"
          alt=""
          aria-hidden="true"
        />

        <div className="shell relative flex h-80 items-center justify-between gap-24">
          <Link
            href="/"
            aria-label="Pulp, home"
            className="group type-button inline-flex items-center bg-paper px-16 py-8 transition-colors hover:text-rose"
          >
            <Wordmark className="press-roll group-hover:wordmark-push group-focus-visible:wordmark-push motion-reduce:group-hover:transform-none" />
            {/* The registration mark, turning. Decorative: the link is
                already named. */}
            <IconShell
              paths={REGISTRATION_GLYPH}
              defaultLabel="Registration mark"
              decorative
              className="ml-8 size-16 animate-register text-rose motion-reduce:animate-none"
            />
          </Link>

          {/* Text links, underlined at rest, so they are identifiable without
              hover (§7). The current route carries it in `signal` as well as
              in `aria-current`, so the state is not colour-only. */}
          <nav aria-label="Main" className="hidden tablet:block">
            <ul className="flex items-center gap-40 bg-paper px-16 py-8">
              {PRIMARY_NAV.map((link) => {
                const current = pathname === link.href;

                return (
                  <li key={link.href}>
                    <NavLink href={link.href} current={current}>
                      {link.label}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <BasketButton />
        </div>

        {/* The print head. The track is a full-width container pinned to the
            header's padding edge; the head is a zero-height box whose 2px
            bottom border is the bar (there is no 2px step on the spacing
            ramp, but there is on the border scale). The track sits on the
            header's padding edge and the head is top-anchored inside it, so
            its bar lies exactly over the ink rule with no shift - the old
            route rule needed one because it hung from its own bottom edge.
            It runs the track's own width and back, forever, at the speed of
            a real print head. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-0 @container motion-reduce:hidden"
        >
          <span className="block h-0 w-96 border-b-2 border-rose animate-press-head" />
        </span>
      </header>

      <MobileNav />
    </>
  );
}
