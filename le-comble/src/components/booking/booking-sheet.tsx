"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { BOOKING_PATHS, UI, fill } from "@/content/site";
import { roomCopy } from "@/content/rooms";
import { href } from "@/lib/i18n";
import {
  HIRE_REPLY_WORKING_DAYS,
  MENU_PRICE,
  ROOM_TYPES,
  TOTAL_ROOMS,
  roomType,
} from "@/lib/model";
import { Arrow } from "@/components/ui/button";
import { useBooking } from "./booking-context";

/* pattern: one "Réserver" control splitting into three paths —
   REFERENCE-AUTOPSY §9, rebuilt per §15 Q2 / design-system §8:
   table → room → building, a fact line and a price per row, all on-site,
   context carried in, closes on Esc / outside / selection / scroll.
   Desktop: 400px sheet under the nav button. Mobile: bottom sheet. */

export function BookingSheet() {
  const { open, setOpen, lang, page } = useBooking();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const first = panel.current?.querySelector<HTMLElement>("[data-autofocus]") ??
      panel.current?.querySelector<HTMLElement>("a");
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && panel.current) {
        const items = [...panel.current.querySelectorAll<HTMLElement>("a,button")];
        const i = items.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) {
          e.preventDefault();
          items[items.length - 1]?.focus();
        } else if (!e.shiftKey && i === items.length - 1) {
          e.preventDefault();
          items[0]?.focus();
        }
      }
    };
    const startY = window.scrollY;
    const onScroll = () => {
      if (Math.abs(window.scrollY - startY) > 48) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, [open, setOpen]);

  if (!open) return null;

  const room = page?.key === "room" ? roomType(page.room ?? "") : undefined;
  const roomName = room ? roomCopy(room.id)?.name : undefined;
  const cheapest = Math.min(...ROOM_TYPES.map((r) => r.from));
  const onRestaurantPage = page?.key === "restaurant" || page?.key === "menu";

  const rows = [
    {
      id: "table",
      to: href(lang, "bookTable"),
      label: BOOKING_PATHS.table.label[lang],
      fact: fill(BOOKING_PATHS.table.fact[lang], { price: MENU_PRICE }),
      focus: onRestaurantPage,
    },
    {
      id: "room",
      to: href(lang, "bookRoom", {}, { room: room?.id }),
      label: BOOKING_PATHS.room.label[lang],
      fact: room
        ? `${roomName} · ${lang === "fr" ? "dès" : "from"} ${lang === "fr" ? `${room.from} €` : `€${room.from}`}`
        : fill(BOOKING_PATHS.room.fact[lang], { count: TOTAL_ROOMS, price: cheapest }),
      focus: Boolean(room),
    },
    {
      id: "building",
      to: href(lang, "bookBuilding"),
      label: BOOKING_PATHS.building.label[lang],
      fact: fill(BOOKING_PATHS.building.fact[lang], { days: HIRE_REPLY_WORKING_DAYS }),
      focus: page?.key === "privateHire",
    },
  ];

  return (
    <>
      <div
        aria-hidden
        className="fixed inset-0 z-40"
        onClick={() => setOpen(false)}
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={UI.book[lang]}
        className="fixed inset-x-0 bottom-0 z-50 overflow-hidden rounded-t-panel border-t border-ink ground md:absolute md:rounded-panel md:inset-x-auto md:bottom-auto md:right-0 md:top-full md:mt-8 md:w-sheet md:border"
      >
        <div className="flex items-center justify-between px-20 pt-16 md:hidden">
          <p className="type-label text-ink">{UI.book[lang]}</p>
          <button type="button" className="type-small font-medium h-48 underline underline-offset-4" onClick={() => setOpen(false)}>
            {UI.close[lang]}
          </button>
        </div>
        <ul className="px-20 pb-16 md:px-0 md:pb-0">
          {rows.map((r) => (
            <li key={r.id} className="border-b border-ink last:border-b-0">
              <Link
                href={r.to}
                data-autofocus={r.focus ? "" : undefined}
                onClick={() => setOpen(false)}
                className="group flex min-h-64 items-center justify-between gap-16 border-l-2 border-transparent py-16 no-underline transition-colors duration-(--duration-fast) hover:border-ink focus-visible:border-ink md:px-24"
              >
                <span className="flex flex-col gap-4">
                  <span className="type-md">{r.label}</span>
                  <span className="type-small text-ink">{r.fact}</span>
                </span>
                <Arrow className="transition-transform duration-(--duration-fast) group-hover:translate-x-4" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
