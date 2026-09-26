"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { UI, euros } from "@/content/site";
import { roomCopy } from "@/content/rooms";
import { href } from "@/lib/i18n";
import { roomType } from "@/lib/model";
import { buttonClass } from "@/components/ui/button";
import { useBooking } from "./booking-context";

/* Mobile sticky booking bar — design-system §8: after the first screen,
   56px, chaux with a top rule, one full-width primary button. On a room
   page it goes straight to that room. Fixes autopsy §9.6 (no persistent
   mobile booking action on the reference). Hidden ≥1024 and on the
   booking pages themselves. */

const BOOKING_KEYS = new Set(["bookTable", "bookRoom", "bookBuilding"]);

export function MobileBookBar() {
  const { lang, page, setOpen, open } = useBooking();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (page && BOOKING_KEYS.has(page.key)) return null;
  if (!shown || open) return null;

  const room = page?.key === "room" ? roomType(page.room ?? "") : undefined;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex h-56 items-center border-t border-ink ground px-20 lg:hidden">
      {room ? (
        <Link
          href={href(lang, "bookRoom", {}, { room: room.id })}
          className={buttonClass("primary", "h-48 w-full")}
        >
          {UI.book[lang]} · {roomCopy(room.id)?.name} · {UI.from[lang]} {euros(room.from, lang)}
        </Link>
      ) : (
        <button
          type="button"
          className={buttonClass("primary", "w-full")}
          onClick={() => {
            window.scrollTo({ top: window.scrollY });
            setOpen(true);
          }}
        >
          {UI.book[lang]}
        </button>
      )}
    </div>
  );
}
