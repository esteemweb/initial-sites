"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { isLang, resolve, type Lang, type RouteKey } from "@/lib/i18n";

/* One Réserver control, opened from the nav button or the mobile bar.
   The current page is its context — design-system §8. */

type Ctx = {
  open: boolean;
  setOpen: (v: boolean) => void;
  lang: Lang;
  page: { key: RouteKey; room?: string } | null;
};

const BookingCtx = createContext<Ctx | null>(null);

export function usePage(lang: Lang) {
  const pathname = usePathname() ?? "/";
  return useMemo(() => {
    const [, maybeLang, ...rest] = pathname.split("/");
    if (!isLang(maybeLang)) return null;
    const hit = resolve(lang, rest.filter(Boolean));
    return hit ? { key: hit.key, room: hit.params.room } : null;
  }, [pathname, lang]);
}

export function BookingProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const page = usePage(lang);
  return (
    <BookingCtx.Provider value={{ open, setOpen, lang, page }}>{children}</BookingCtx.Provider>
  );
}

export function useBooking(): Ctx {
  const ctx = useContext(BookingCtx);
  if (!ctx) throw new Error("useBooking outside BookingProvider");
  return ctx;
}
