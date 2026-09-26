"use client";

/* pattern: nav — autopsy §10 "Nav" + §8 "Nav on scroll".
   Fixed, transparent at every scroll position (never gains a background or a
   blur), hides on scroll down and reveals on scroll up. Hamburger at every
   width — the reference's one genuinely responsive-proof decision.
   Fixed here: the 41x41 trigger becomes 48x48. design-system §8.

   Hover state, from the 2026-09-23 recording (autopsy §15.2): on pointer
   intent (hover, or keyboard focus inside) the header becomes an outlined
   frosted bar, the menu trigger fills into an ink square, an Account link
   that is hidden at rest appears, and the Subscribe badge turns cherry. The
   reference's cart-on-intent maps to Account here: there is no cart. The
   dashboard's solid header does not do this. */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/ui/logo";
import { NAV_ITEMS, SITE } from "@/content/site";

export function SiteHeader() {
  const [hidden, setHidden] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  /* A dashboard must not float over its own content: on /account the header
     takes the page surface, stays put, and never adapts to a dark band
     (design-system §7). Everywhere else it is transparent and hides on scroll
     down, which is the reference's behaviour (autopsy §8). */
  const pathname = usePathname();
  const solid = pathname?.startsWith("/account") ?? false;

  useEffect(() => {
    // On /account there is nothing to track: the header is solid and static.
    if (solid) return;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;

      /* Ignore jitter AND zero-delta events. A scroll can settle with a final
         event where y === lastY, which would otherwise read as "scrolling up"
         and re-show the header immediately after hiding it. */
      if (Math.abs(delta) >= 4) {
        setHidden(y > 120 && delta > 0);
        lastY.current = y;
      }

      /* Keep the header legible over dark bands without giving it a
         background — the reference stays transparent at every scroll
         position and we keep that, but its ink would be 1.32:1 on roast. */
      // elementsFromPoint, not elementFromPoint: the fixed header covers that
      // point and would always be the top hit.
      const beneath = document
        .elementsFromPoint(8, 40)
        .find((el) => el.hasAttribute("data-tone"));
      setOnDark(beneath?.getAttribute("data-tone") === "dark");
    };

    onScroll();
    /* Once more after the rest of the page's effects have run: the header's
       effect runs first, before ScrollProgress has placed the full-bleed hero
       photo (data-tone="dark") under it, so the first read sees linen. */
    const settle = window.setTimeout(onScroll, 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.clearTimeout(settle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [solid]);

  // Close the flyout on Escape, and stop the page scrolling behind it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-surface focus:px-4 focus:py-3 focus:outline-2 focus:outline-accent"
      >
        Skip to content
      </a>

      <header
        className={cn(
          "group fixed inset-x-0 top-0 z-40 h-20 u-gutter",
          "flex items-center justify-between",
          "u-transition-ui",
          // 11.28:1 on forest / 14.19:1 on roast, vs 1.32:1 if left as ink
          // Derived, not reset in an effect: when solid, the scroll states
          // simply do not apply.
          !solid && onDark ? "text-text-on-dark" : "text-text",
          solid && "bg-surface border-b border-hairline",
          !solid && hidden && !open && "u-nav-hidden",
          // The bar is linen, so engaged text is always ink — even over a
          // dark band, where the resting text is cream.
          !solid && "u-header-engage",
        )}
      >
        {!solid && <span aria-hidden="true" className="u-header-bar" />}

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap font-display text-lg u-display-plain focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <LogoMark className="size-7" />
            {SITE.name}
          </Link>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "u-touch -ml-1 flex items-center justify-center u-transition-ui focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              !solid && "u-header-trigger",
            )}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span aria-hidden="true" className="flex w-6 flex-col gap-1.5">
              <span className="h-px w-full bg-current" />
              <span className="h-px w-full bg-current" />
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {!solid && (
            <Link
              href="/account"
              className="u-header-reveal inline-flex u-touch items-center px-3 font-mono text-2xs uppercase focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Account
            </Link>
          )}
          <Button
            href="/subscribe"
            variant="badge"
            size="md"
            className={!solid ? "u-header-cta" : undefined}
          >
            Subscribe
          </Button>
        </div>
      </header>

      {/* Flyout: full-height roast panel, 56px rows, active item in amber. */}
      <div
        id="site-menu"
        hidden={!open}
        className="fixed inset-0 z-50 bg-surface-roast text-text-on-dark u-gutter"
      >
        <div className="flex h-20 items-center justify-between">
          <span className="whitespace-nowrap font-display text-lg u-display-plain">{SITE.name}</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="u-touch flex items-center justify-center font-mono text-2xs uppercase focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
          >
            Close
          </button>
        </div>

        <nav aria-label="Main">
          <ul className="mt-12 flex flex-col">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                {item.href ? (
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex h-14 items-center text-base u-transition-ui hover:text-amber focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
                  >
                    {item.label}
                  </Link>
                ) : (
                  // No page yet: plain text, muted so it doesn't read as a link.
                  <span className="flex h-14 items-center text-base text-text-muted-dark">
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <p className="mt-12 font-mono text-2xs uppercase text-text-muted-dark">
          {SITE.colombo.hours}
        </p>
      </div>
    </>
  );
}
