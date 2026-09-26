import type { Metadata } from "next";
import { ROOMS } from "@/content/rooms";
import { alternates, type L, type Lang, type RouteKey } from "./i18n";

/* Titles and hreflang — REFERENCE-AUTOPSY §10: every page lists both
   languages and x-default → FR. */

const TITLES: Record<RouteKey, L> = {
  home: { fr: "Le Comble — restaurant avec chambres, Croix-Rousse, Lyon", en: "Le Comble — restaurant with rooms, Croix-Rousse, Lyon" },
  restaurant: { fr: "Navette, le restaurant", en: "Navette, the restaurant" },
  menu: { fr: "La carte", en: "The menu" },
  bar: { fr: "Le Toit, le bar", en: "The Roof, the bar" },
  rooms: { fr: "Les chambres", en: "The rooms" },
  room: { fr: "Chambre", en: "Room" },
  building: { fr: "Le bâtiment", en: "The building" },
  privateHire: { fr: "Privatisation", en: "Private hire" },
  camille: { fr: "Camille Ferrand, cheffe", en: "Camille Ferrand, chef" },
  gettingHere: { fr: "Venir", en: "Getting here" },
  faq: { fr: "Questions", en: "Questions" },
  contact: { fr: "Contact", en: "Contact" },
  bookTable: { fr: "Réserver une table", en: "Book a table" },
  bookRoom: { fr: "Réserver une chambre", en: "Book a room" },
  bookBuilding: { fr: "Privatiser le bâtiment", en: "Hire the building" },
};

const DESCRIPTION: L = {
  fr: "Un restaurant qui a dix-neuf chambres au-dessus. Un atelier de soie de 1831, rue Burdeau, sur les pentes de la Croix-Rousse. Menu en cinq services, 68 €.",
  en: "A restaurant with nineteen rooms above it. An 1831 silk workshop on rue Burdeau, on the slopes of the Croix-Rousse. Five-course menu, €68.",
};

export function pageMetadata(lang: Lang, key: RouteKey, params: { room?: string } = {}): Metadata {
  const alt = alternates(key, params);
  let title = TITLES[key][lang];
  if (key === "room") {
    const r = ROOMS.find((x) => x.id === params.room);
    if (r) title = `${r.name} — ${lang === "fr" ? "chambre" : "room"}`;
  }
  return {
    title: key === "home" ? { absolute: title } : title,
    description: DESCRIPTION[lang],
    alternates: {
      canonical: alt[lang],
      languages: { fr: alt.fr, en: alt.en, "x-default": alt.fr },
    },
  };
}
