import { Logo } from "@/components/Logo";
import { Booking } from "@/components/Booking";

/* Fixed chrome — refs/tandjung-sari §10, matched, with one deliberate
   divergence.

   Two pieces, both `position: fixed` above the moving track:

   LEFT VERTICAL SPINE — full viewport height. The reference's rail is
   transparent and its mark floats over whatever photograph is scrolling
   behind; across eleven panels that puts the brand on eleven different
   grounds, and over the dark plates it all but vanishes. Here the rail is
   opaque lacquer (see `site-rail` in globals.css) — the only dark surface
   on the site, so it reads as a spine the pages run past. Full-bleed media
   still runs underneath it, which now frames the photography rather than
   competing with it.

   Contents, top to bottom: the logo, the hamburger between two hairline
   ticks, and the rotated contact tab. The spine carries the name only —
   see the note on Logo's `locale` prop for the measurement that decided
   it. The reference measures its rail inset at 63px,
   its mark at ~74x74, its hamburger at 32x10 and its rotated tab at 17x69.

   TOP-RIGHT BOOKING PAIR — two buttons, ~46px tall, square corners, pale
   surface fill carrying saturated red text. Note the inversion: the pale
   fill holds the accent colour rather than the usual solid-accent button.

   Labels are this project's own words. */

export function SiteChrome() {
  return (
    <>
      {/* ---- left vertical spine ---- */}
      <div className="site-rail pointer-events-none fixed inset-y-0 left-0 z-[99] flex w-rail flex-col items-center justify-between py-gutter-sm">
        {/* The logo is the one interactive thing in the rail, so it alone
            takes pointer events back and carries an accessible name; the
            drawn seal and the wordmark are both presentational to a screen
            reader, which reads the link's label instead. */}
        <a
          href="/"
          aria-label="Talay Dao — home"
          className="transition-micro pointer-events-auto opacity-100 hover:opacity-70"
        >
          <Logo />
        </a>

        <span aria-hidden="true" className="flex flex-col items-center gap-md">
          <span className="rail-tick" />
          {/* the reference's hamburger sits as a pair of hairlines */}
          <span className="hamburger-mark" />
          <span className="rail-tick" />
        </span>

        <span
          aria-hidden="true"
          className="contact-tab font-sans text-label uppercase"
        >
          Contact
        </span>
      </div>

      {/* ---- top-right booking pair ---- */}
      {/* Was two mailto: links to a reserved-TLD address that could not
          receive mail. Now a real enquiry dialog — see Booking.tsx. It is
          the only client leaf in the chrome; this component stays a Server
          Component. */}
      <Booking />
    </>
  );
}
