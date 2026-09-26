import type { L, RouteKey } from "@/lib/i18n";

/* Site-wide facts and strings. Voice: brief §12 — direct, unsentimental,
   a little proud. Would the chef say it out loud? (brief §14) */

export const SITE = {
  name: "Le Comble",
  address: {
    street: "14 rue Burdeau",
    city: "69001 Lyon",
    quarter: { fr: "Pentes de la Croix-Rousse", en: "Slopes of the Croix-Rousse" },
  },
  /* Never-real contact details (SECURITY-AUDIT.md A2, 26 Sep 2026): the
     phone is from the 04 block ARCEP reserves for fiction, and ".example" is
     a domain reserved so that it can never be registered. The site is a demo;
     these must not reach a real person. */
  phone: "+33 4 65 71 18 31",
  phoneHref: "tel:+33465711831",
  email: {
    table: "table@lecomble.example",
    rooms: "chambres@lecomble.example",
    hire: "privatisation@lecomble.example",
  },
} as const;

export const TAGLINE: L = {
  fr: "Restaurant avec chambres, Croix-Rousse, Lyon",
  en: "Restaurant with rooms, Croix-Rousse, Lyon",
};

/* Desktop nav: four links (design-system §7). */
export const NAV: { key: RouteKey; label: L }[] = [
  { key: "restaurant", label: { fr: "Navette", en: "Navette" } },
  { key: "rooms", label: { fr: "Chambres", en: "Rooms" } },
  { key: "bar", label: { fr: "Le Toit", en: "The Roof" } },
  { key: "building", label: { fr: "Le bâtiment", en: "The building" } },
];

/* Mobile menu sheet: everything. */
export const MENU: { key: RouteKey; label: L }[] = [
  { key: "restaurant", label: { fr: "Navette, le restaurant", en: "Navette, the restaurant" } },
  { key: "menu", label: { fr: "La carte", en: "The menu" } },
  { key: "rooms", label: { fr: "Chambres", en: "Rooms" } },
  { key: "bar", label: { fr: "Le Toit", en: "The Roof" } },
  { key: "building", label: { fr: "Le bâtiment", en: "The building" } },
  { key: "camille", label: { fr: "Camille", en: "Camille" } },
  { key: "privateHire", label: { fr: "Privatisation", en: "Private hire" } },
  { key: "gettingHere", label: { fr: "Venir", en: "Getting here" } },
  { key: "faq", label: { fr: "Questions", en: "Questions" } },
  { key: "contact", label: { fr: "Contact", en: "Contact" } },
];

/* Footer: six links. brief §13 — "Fourteen footer links. Ours has six." */
export const FOOTER_LINKS: { key: RouteKey; label: L }[] = [
  { key: "menu", label: { fr: "La carte", en: "The menu" } },
  { key: "rooms", label: { fr: "Chambres", en: "Rooms" } },
  { key: "privateHire", label: { fr: "Privatisation", en: "Private hire" } },
  { key: "gettingHere", label: { fr: "Venir", en: "Getting here" } },
  { key: "faq", label: { fr: "Questions", en: "Questions" } },
  { key: "contact", label: { fr: "Contact", en: "Contact" } },
];

export const HOURS: { label: L; value: L }[] = [
  {
    label: { fr: "Navette", en: "Navette" },
    value: {
      fr: "Dîner du mardi au samedi · déjeuner vendredi et samedi",
      en: "Dinner Tuesday to Saturday · lunch Friday and Saturday",
    },
  },
  {
    label: { fr: "Le Toit", en: "The Roof" },
    value: { fr: "Tous les soirs dès 18 h, sans réservation", en: "Every evening from 6 pm, no bookings" },
  },
  {
    label: { fr: "Chambres", en: "Rooms" },
    value: { fr: "Arrivée dès 15 h · départ avant 11 h", en: "Check-in from 3 pm · check-out by 11 am" },
  },
];

export const UI = {
  book: { fr: "Réserver", en: "Book" },
  bookTable: { fr: "Réserver une table", en: "Book a table" },
  bookRoom: { fr: "Réserver une chambre", en: "Book a room" },
  enquire: { fr: "Faire une demande", en: "Make an enquiry" },
  menu: { fr: "Menu", en: "Menu" },
  close: { fr: "Fermer", en: "Close" },
  from: { fr: "dès", en: "from" },
  perNight: { fr: "la nuit", en: "a night" },
  skip: { fr: "Aller au contenu", en: "Skip to content" },
  language: { fr: "Langue", en: "Language" },
  home: { fr: "Accueil", en: "Home" },
  seeRooms: { fr: "Les chambres", en: "The rooms" },
  seeMenu: { fr: "Voir la carte", en: "See the menu" },
  readMore: { fr: "Lire la suite", en: "Read more" },
} satisfies Record<string, L>;

/* The Réserver panel rows, in brief order: table first (brief §1, §10;
   design-system §8). Facts are computed in the component from the model. */
export const BOOKING_PATHS = {
  table: {
    label: { fr: "Une table", en: "A table" },
    fact: { fr: "Navette · mar–sam · menu {price} €", en: "Navette · Tue–Sat · menu €{price}" },
  },
  room: {
    label: { fr: "Une chambre", en: "A room" },
    fact: { fr: "{count} chambres · dès {price} €", en: "{count} rooms · from €{price}" },
  },
  building: {
    label: { fr: "Le bâtiment", en: "The building" },
    fact: {
      fr: "Privatisation · réponse sous {days} jours ouvrés",
      en: "Private hire · reply within {days} working days",
    },
  },
} satisfies Record<string, { label: L; fact: L }>;

export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(values[k] ?? ""));
}

export function euros(n: number, lang: "fr" | "en"): string {
  const s = new Intl.NumberFormat(lang === "fr" ? "fr-FR" : "en-GB", {
    maximumFractionDigits: 0,
  }).format(n);
  return lang === "fr" ? `${s} €` : `€${s}`;
}
