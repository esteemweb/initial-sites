"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MENU, NAV, SITE, UI } from "@/content/site";
import { href, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { buttonClass } from "@/components/ui/button";
import { BookingSheet } from "@/components/booking/booking-sheet";
import { useBooking, usePage } from "@/components/booking/booking-context";
import { LanguageSwitch } from "./language-switch";

/* Nav — design-system §8: 64 / 72px, solid chaux at all times (fixes the
   reference's invisible "FR" on light heroes, autopsy §14.10), ink rule once
   scrolled. Wordmark · four links · FR/EN · Réserver (indigo). Mobile: a
   "Menu" text button opening a full-screen sheet. No shrink on scroll
   (design-system §6, diverges from autopsy §7.1). */

export function SiteHeader({ lang }: { lang: Lang }) {
  const { open, setOpen } = useBooking();
  const page = usePage(lang);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu when the page changes (render-time, no effect).
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenu(false);
  }

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  return (
    <header
      className={cn(
        "ground sticky top-0 z-40 border-b transition-colors duration-(--duration-fast)",
        scrolled ? "border-ink" : "border-transparent",
      )}
    >
      <a
        href="#main"
        className="type-small font-medium sr-only rounded-control bg-ink p-16 text-ground focus:not-sr-only focus:absolute focus:left-16 focus:top-8 focus:z-50"
      >
        {UI.skip[lang]}
      </a>
      <div className="grid-page h-64 items-center lg:h-72">
        <Link
          href={href(lang, "home")}
          className="type-md col-span-5 no-underline lg:col-span-3"
          aria-label={`${SITE.name} — ${UI.home[lang]}`}
        >
          {SITE.name}
        </Link>

        <nav aria-label={lang === "fr" ? "Principal" : "Main"} className="hidden lg:col-span-5 lg:flex lg:gap-32">
          {NAV.map((item) => {
            const active = page?.key === item.key || (item.key === "rooms" && page?.key === "room");
            return (
              <Link
                key={item.key}
                href={href(lang, item.key)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "type-small font-medium underline-offset-8",
                  active ? "underline decoration-2" : "no-underline hover:underline",
                )}
              >
                {item.label[lang]}
              </Link>
            );
          })}
        </nav>

        <div className="col-span-7 flex items-center justify-end gap-16 lg:col-span-4 lg:gap-24">
          <Suspense fallback={null}>
            <LanguageSwitch lang={lang} className="hidden lg:flex" />
          </Suspense>
          <div className="relative">
            <button
              type="button"
              aria-expanded={open}
              aria-haspopup="dialog"
              className={buttonClass("primary", "px-16 lg:px-24")}
              onClick={() => setOpen(!open)}
            >
              {UI.book[lang]}
            </button>
            <BookingSheet />
          </div>
          <button
            type="button"
            aria-expanded={menu}
            aria-controls="site-menu"
            className="type-small font-medium h-48 underline underline-offset-4 lg:hidden"
            onClick={() => setMenu(!menu)}
          >
            {menu ? UI.close[lang] : UI.menu[lang]}
          </button>
        </div>
      </div>

      {menu && (
        <div
          id="site-menu"
          className="ground fixed inset-x-0 bottom-0 top-64 z-30 overflow-y-auto lg:hidden"
        >
          <div className="grid-page py-24">
            <nav aria-label="Menu" className="col-span-12">
              <ul className="border-t border-ink">
                {MENU.map((item) => (
                  <li key={item.key} className="border-b border-ink">
                    <Link
                      href={href(lang, item.key)}
                      className="type-md flex min-h-64 items-center py-8 no-underline"
                      aria-current={page?.key === item.key ? "page" : undefined}
                    >
                      {item.label[lang]}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <Suspense fallback={null}>
              <LanguageSwitch lang={lang} className="col-span-12 mt-32" />
            </Suspense>
          </div>
        </div>
      )}
    </header>
  );
}
