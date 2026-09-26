"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactElement } from "react";
import { PRIMARY_NAV } from "@/lib/nav";

/**
 * The mobile navigation (DESIGN.md §8): a full-screen overlay menu opened from
 * a bottom-reachable control.
 *
 * The control is a fixed bar at the foot of the viewport rather than a button
 * in the header, because §8 asks for it within thumb reach on a phone. It
 * toggles in place — the same bar in the same position reads MENU, then CLOSE
 * — so the way out is exactly where the way in was. Escape closes it too.
 *
 * The panel is opaque and covers the viewport, so it carries no dimmed overlay
 * of its own; there is nothing behind it to see. Radix supplies the focus trap,
 * focus restoration and scroll lock.
 *
 * Hidden from 768 up, where the links sit in the header instead.
 */

const BAR =
  "type-button fixed inset-x-0 bottom-0 z-50 flex h-64 items-center " +
  "justify-center bg-ink text-page transition-colors hover:bg-rose " +
  "active:translate-y-[1px] tablet:hidden";

/** The one place 768 is named in TypeScript; the styles get it from `tablet:`. */
const TABLET = "(min-width: 768px)";

export default function MobileNav(): ReactElement {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Widening past 768 hides this menu in CSS, which on its own would leave an
  // invisible dialog still holding the focus trap and the scroll lock. So the
  // breakpoint closes it properly rather than just hiding it.
  useEffect(() => {
    const query = window.matchMedia(TABLET);
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };

    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className={BAR}>Menu</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Content
          className="fixed inset-0 z-50 flex flex-col bg-page
            data-[state=open]:animate-overlay-in
            data-[state=closed]:animate-overlay-out
            tablet:hidden"
        >
          <Dialog.Title className="type-label px-24 pb-40 pt-24">
            Menu
          </Dialog.Title>

          <Dialog.Description className="sr-only">
            Site navigation. The basket stays in the header.
          </Dialog.Description>

          {/* The dominant element on this screen (§5). Archivo Black at `lg`
              rather than the §4 text link, which is sized for running copy. */}
          <nav aria-label="Main" className="flex-1 px-24">
            <ul className="flex flex-col gap-24">
              {PRIMARY_NAV.map((link) => {
                const current = pathname === link.href;

                return (
                  <li key={link.href}>
                    <Dialog.Close asChild>
                      <Link
                        href={link.href}
                        aria-current={current ? "page" : undefined}
                        className={`type-lg block transition-colors hover:text-rose ${
                          current ? "text-rose" : ""
                        }`}
                      >
                        {link.label}
                      </Link>
                    </Dialog.Close>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Same bar, same place, opposite job. Sits in the flow at the foot of
              the panel rather than fixed, so it cannot cover the last link. */}
          <Dialog.Close className="type-button flex h-64 shrink-0 items-center justify-center bg-ink text-page transition-colors hover:bg-rose active:translate-y-[1px]">
            Close
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
