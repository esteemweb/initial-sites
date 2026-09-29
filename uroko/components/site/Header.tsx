"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav, site } from "@/lib/content/site";
import { Emblem } from "./Emblem";
import { SoundToggle } from "@/components/sound/SoundToggle";
import { NextSlot } from "./NextSlot";

/**
 * One row: the mark and wordmark, the pages in a line, then sound, the next
 * open consultation and Book. It scrolls away with the page, so nothing sits
 * on top of the content. Phones get the sound toggle, a menu button and a
 * full-screen dialog.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <>
      <header className="pointer-events-none absolute inset-x-0 top-0 z-40">
        <div className="mx-auto flex max-w-wide items-center justify-between gap-8 px-5 py-5 sm:px-8 lg:px-12 lg:py-7">
          <Link href="/" className="pointer-events-auto flex items-center gap-3 no-underline" aria-label={`${site.name} home`}>
            <span className="relative block h-11 w-11 text-paper lg:h-12 lg:w-12">
              <Emblem className="absolute inset-0 h-full w-full" title={site.name} />
            </span>
            <span className="hidden items-baseline gap-2 text-lg text-paper sm:flex">
              {site.name}
              <span lang="ja" className="font-display text-base text-text-muted">
                {site.kanji}
              </span>
            </span>
          </Link>

          <nav aria-label="Primary" className="pointer-events-auto hidden text-sm lg:block">
            <ul className="flex items-center gap-8">
              {nav
                .filter((item) => item.href !== "/book")
                .map((item) => {
                  const active = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <li key={item.href}>
                      <Link href={item.href} aria-current={active ? "page" : undefined} className={`underline-offset-4 hover:underline ${active ? "underline" : "no-underline"}`}>
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </nav>

          {/* Sound, the next open slot and Book, in the header rather than fixed over the page */}
          <div className="pointer-events-auto hidden items-center gap-6 text-sm lg:flex">
            <SoundToggle className="h-auto! px-0! text-sm!" />
            <NextSlot className="hidden text-text-muted xl:block" />
            <Link
              href="/book"
              aria-current={pathname.startsWith("/book") ? "page" : undefined}
              className="border border-shu-bright px-4 py-2 text-shu-bright no-underline transition-colors duration-150 hover:bg-shu hover:text-shu-fg"
            >
              Book
            </Link>
          </div>

          <div className="pointer-events-auto flex items-center gap-1 lg:hidden">
            <SoundToggle />
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center"
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen(true)}
            >
              <span className="sr-only">Open menu</span>
              <span aria-hidden="true" className="flex w-6 flex-col gap-[6px]">
                <span className="block h-px w-full bg-current" />
                <span className="block h-px w-full bg-current" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <dialog
        id="site-menu"
        ref={dialogRef}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-shu text-ink backdrop:bg-ink/60"
        data-theme="shu"
      >
        <div className="flex h-full flex-col px-5 py-5 sm:px-8">
          <div className="flex items-center justify-between">
            <Emblem className="h-10 w-10 text-ink" />
            <button type="button" className="inline-flex h-11 w-11 items-center justify-center text-3xl leading-none" onClick={() => setOpen(false)}>
              <span className="sr-only">Close menu</span>
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <nav aria-label="Mobile" className="mt-16 flex flex-col">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="py-1 text-4xl leading-none no-underline">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto space-y-6 pb-[env(safe-area-inset-bottom)] text-sm">
            <div>
              <p className="text-ink/60">E-mail</p>
              <a href={`mailto:${site.email}`} className="no-underline">
                {site.email}
              </a>
            </div>
            <SoundToggle className="-ml-2" />
          </div>
        </div>
      </dialog>
    </>
  );
}
