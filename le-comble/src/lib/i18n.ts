/* Locales and the localised route table.
   pattern: localised URLs, FR as x-default, switcher keeps the page —
   REFERENCE-AUTOPSY §10 (/fr/chambres ↔ /en/rooms). FR first: brief §10. */

export const LOCALES = ["fr", "en"] as const;
export type Lang = (typeof LOCALES)[number];
export const DEFAULT_LANG: Lang = "fr";

export function isLang(value: string): value is Lang {
  return (LOCALES as readonly string[]).includes(value);
}

/** A string (or anything) in both languages. */
export type L<T = string> = { fr: T; en: T };

export function t<T>(value: L<T>, lang: Lang): T {
  return value[lang];
}

/* Every page, keyed. `:room` is the only parameter. */
export const ROUTES = {
  home: { fr: "", en: "" },
  restaurant: { fr: "restaurant", en: "restaurant" },
  menu: { fr: "la-carte", en: "menu" },
  bar: { fr: "le-toit", en: "the-roof" },
  rooms: { fr: "chambres", en: "rooms" },
  room: { fr: "chambres/:room", en: "rooms/:room" },
  building: { fr: "le-batiment", en: "the-building" },
  privateHire: { fr: "privatisation", en: "private-hire" },
  camille: { fr: "camille", en: "camille" },
  gettingHere: { fr: "venir", en: "getting-here" },
  faq: { fr: "questions", en: "faq" },
  contact: { fr: "contact", en: "contact" },
  bookTable: { fr: "reserver/table", en: "book/table" },
  bookRoom: { fr: "reserver/chambre", en: "book/room" },
  bookBuilding: { fr: "reserver/batiment", en: "book/building" },
} as const satisfies Record<string, L>;

export type RouteKey = keyof typeof ROUTES;

export function href(
  lang: Lang,
  key: RouteKey,
  params: { room?: string } = {},
  query?: Record<string, string | undefined>,
): string {
  let path = ROUTES[key][lang].replace(":room", params.room ?? "");
  path = `/${lang}${path ? `/${path}` : ""}`;
  if (query) {
    const qs = new URLSearchParams(
      Object.entries(query).filter((e): e is [string, string] => Boolean(e[1])),
    ).toString();
    if (qs) path += `?${qs}`;
  }
  return path;
}

/** Resolve a path segment list (after the locale) to a route key. */
export function resolve(
  lang: Lang,
  segments: string[],
): { key: RouteKey; params: { room?: string } } | null {
  const joined = segments.join("/");
  for (const key of Object.keys(ROUTES) as RouteKey[]) {
    const pattern = ROUTES[key][lang];
    if (pattern === joined) return { key, params: {} };
    if (pattern.includes(":room")) {
      const [base] = pattern.split("/:room");
      if (segments.length === 2 && segments[0] === base) {
        return { key, params: { room: segments[1] } };
      }
    }
  }
  return null;
}

/** The same page in the other language (for the switcher and hreflang). */
export function alternates(
  key: RouteKey,
  params: { room?: string } = {},
): L {
  return { fr: href("fr", key, params), en: href("en", key, params) };
}

export const OTHER: Record<Lang, Lang> = { fr: "en", en: "fr" };
