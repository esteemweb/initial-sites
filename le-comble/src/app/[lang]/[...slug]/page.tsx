import { notFound } from "next/navigation";
import { LOCALES, ROUTES, isLang, resolve, type Lang, type RouteKey } from "@/lib/i18n";
import { ROOM_TYPES } from "@/lib/model";
import { pageMetadata } from "@/lib/seo";
import { MenuPage, RestaurantPage } from "@/components/pages/restaurant";
import { RoomPage, RoomsPage } from "@/components/pages/rooms";
import {
  BarPage,
  BuildingPage,
  CamillePage,
  ContactPage,
  FaqPage,
  GettingHerePage,
  HirePage,
} from "@/components/pages/story";
import { BookBuildingPage, BookRoomPage, BookTablePage } from "@/components/pages/booking";

/* Every page except home, through the localised route table (lib/i18n).
   Fully static: unknown slugs 404 (dynamicParams = false). */

export const dynamicParams = false;

export function generateStaticParams() {
  const out: { lang: Lang; slug: string[] }[] = [];
  for (const lang of LOCALES) {
    for (const key of Object.keys(ROUTES) as RouteKey[]) {
      const pattern = ROUTES[key][lang];
      if (!pattern) continue;
      if (pattern.includes(":room")) {
        for (const r of ROOM_TYPES) out.push({ lang, slug: pattern.replace(":room", r.id).split("/") });
      } else {
        out.push({ lang, slug: pattern.split("/") });
      }
    }
  }
  return out;
}

async function route(params: Promise<{ lang: string; slug: string[] }>) {
  const { lang, slug } = await params;
  if (!isLang(lang)) return null;
  const hit = resolve(lang, slug);
  return hit ? { lang, ...hit } : null;
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[...slug]">) {
  const r = await route(params);
  return r ? pageMetadata(r.lang, r.key, r.params) : {};
}

export default async function Page({ params }: PageProps<"/[lang]/[...slug]">) {
  const r = await route(params);
  if (!r) notFound();
  const { lang, key, params: p } = r;

  switch (key) {
    case "restaurant":
      return <RestaurantPage lang={lang} />;
    case "menu":
      return <MenuPage lang={lang} />;
    case "bar":
      return <BarPage lang={lang} />;
    case "rooms":
      return <RoomsPage lang={lang} />;
    case "room":
      return <RoomPage lang={lang} id={p.room ?? ""} />;
    case "building":
      return <BuildingPage lang={lang} />;
    case "privateHire":
      return <HirePage lang={lang} />;
    case "camille":
      return <CamillePage lang={lang} />;
    case "gettingHere":
      return <GettingHerePage lang={lang} />;
    case "faq":
      return <FaqPage lang={lang} />;
    case "contact":
      return <ContactPage lang={lang} />;
    case "bookTable":
      return <BookTablePage lang={lang} />;
    case "bookRoom":
      return <BookRoomPage lang={lang} />;
    case "bookBuilding":
      return <BookBuildingPage lang={lang} />;
    default:
      notFound();
  }
}
