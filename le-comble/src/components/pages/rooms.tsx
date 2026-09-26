import Link from "next/link";
import { notFound } from "next/navigation";
import { ROOMS, ROOMS_COMMON, roomCopy } from "@/content/rooms";
import { ROOM_FLOW } from "@/content/booking";
import { UI, euros } from "@/content/site";
import { href, type Lang } from "@/lib/i18n";
import { WEEKEND_SUPPLEMENT, nightlyRate, type SeasonId } from "@/lib/booking";
import { roomType } from "@/lib/model";
import { Section } from "@/components/ui/section";
import { Cluster } from "@/components/ui/cluster";
import { Arrow, ButtonLink } from "@/components/ui/button";
import { Facts } from "@/components/ui/facts";
import { Photo } from "@/components/ui/photo";
import { RoomIndex } from "@/components/sections/room-index";
import { JellyText } from "@/components/ui/jelly-text";

const PAGE = {
  eyebrow: { fr: "Les chambres", en: "The rooms" },
  title: { fr: "Dix-neuf chambres, quatre étages, quatre façons d'y dormir.", en: "Nineteen rooms, four floors, four ways to sleep there." },
  lead: {
    fr: "Nommées d'après ce qu'étaient les étages. Choisissez la hauteur, la lumière ou le prix ; les trois vont ensemble.",
    en: "Named for what the floors used to be. Choose by height, light or price; the three go together.",
  },
  good: { fr: "À savoir", en: "Good to know" },
  rates: { fr: "Les tarifs, sans détour", en: "The rates, plainly" },
  ratesNote: {
    fr: "Prix par nuit en semaine, pour la chambre. Vendredi et samedi : +{w} €. Petit-déjeuner 18 € par personne.",
    en: "Per night on a weeknight, for the room. Friday and Saturday: +€{w}. Breakfast €18 a person.",
  },
  others: { fr: "Les autres chambres", en: "The other rooms" },
  bookThis: { fr: "Réserver cette chambre", en: "Book this room" },
};

/* A representative weeknight in each season, for the rates table. */
const SEASON_SAMPLES: { id: SeasonId; night: string }[] = [
  { id: "low", night: "2027-01-12" },
  { id: "mid", night: "2027-03-09" },
  { id: "high", night: "2027-05-11" },
  { id: "lumieres", night: "2026-12-07" },
];

export function RoomsPage({ lang }: { lang: Lang }) {
  return (
    <>
      {/* pattern: page title cluster — design-system §7 */}
      <Section labelledBy="page-title">
        <Cluster
          as="h1"
          size="h1"
          id="page-title"
          eyebrow={PAGE.eyebrow[lang]}
          title={PAGE.title[lang]}
          className="col-span-12 mb-48 lg:col-span-8 lg:mb-64"
        >
          <p className="type-body text-ink">{PAGE.lead[lang]}</p>
        </Cluster>
        <RoomIndex lang={lang} headingLevel="h2" />
      </Section>

      {/* pattern: honest rates table — REFERENCE-AUTOPSY §15 Q3 (print the price), tabular figures */}
      <Section tone="field" labelledBy="rates-title">
        <Cluster id="rates-title" title={PAGE.rates[lang]} size="h3" className="col-span-12 mb-32 lg:col-span-4 lg:mb-0">
          <p>{PAGE.ratesNote[lang].replace("{w}", String(WEEKEND_SUPPLEMENT))}</p>
        </Cluster>
        <div className="col-span-12 overflow-x-auto lg:col-span-7 lg:col-start-6">
          <table className="w-full border-t border-ink text-left">
            <thead>
              <tr className="border-b border-ink">
                <th scope="col" className="type-label py-16 pr-16 font-medium text-ink">
                  <span className="sr-only">{lang === "fr" ? "Chambre" : "Room"}</span>
                </th>
                {SEASON_SAMPLES.map((s) => (
                  <th key={s.id} scope="col" className="type-label py-16 pr-16 text-right font-medium text-ink">
                    {ROOM_FLOW.seasons[s.id][lang]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROOMS.map((r) => (
                <tr key={r.id} className="border-b border-ink">
                  <th scope="row" className="type-md py-16 pr-16 font-regular">
                    {r.name}
                  </th>
                  {SEASON_SAMPLES.map((s) => (
                    <td key={s.id} className="type-body font-medium tabular-nums py-16 pr-16 text-right">
                      {euros(nightlyRate(r.id, s.night), lang)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* pattern: weft-ruled facts list — REFERENCE-AUTOPSY §6 */}
      <Section labelledBy="good-title">
        <h2 id="good-title" className="type-md col-span-12 mb-32 lg:col-span-4 lg:mb-0">
          <JellyText text={PAGE.good[lang]} />
        </h2>
        <ul className="col-span-12 border-t border-ink lg:col-span-7 lg:col-start-6">
          {Object.values(ROOMS_COMMON).map((t) => (
            <li key={t.fr} className="border-b border-ink py-16 text-ink">
              {t[lang]}
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}

export function RoomPage({ lang, id }: { lang: Lang; id: string }) {
  const room = roomCopy(id);
  const model = roomType(id);
  if (!room || !model) notFound();
  const others = ROOMS.filter((r) => r.id !== id);

  return (
    <>
      {/* pattern: room detail — images one side, text and a full-width booking button the other; REFERENCE-AUTOPSY §2.5, with the room carried into booking (fixes §9.3) */}
      <Section labelledBy="page-title">
        {/* the pair: two equal 4:5 portraits over columns 1–4 and 5–8 (design-system §5, 25 Sep 2026) */}
        <div className="col-span-6 lg:col-span-4">
          <Photo id={room.photos[0]} lang={lang} priority sizes="(min-width: 64rem) 30vw, 48vw" />
        </div>
        <div className="col-span-6 lg:col-span-4">
          <Photo id={room.photos[1]} lang={lang} priority sizes="(min-width: 64rem) 30vw, 48vw" />
        </div>
        <div className="col-span-12 mt-48 flex flex-col lg:col-span-4 lg:col-start-9 lg:mt-0">
          <Cluster as="h1" size="h1" id="page-title" eyebrow={room.floor[lang]} title={room.name}>
            {room.body.map((p) => (
              <p key={p.fr}>{p[lang]}</p>
            ))}
          </Cluster>
          <div className="mt-32 border-t border-ink pt-16">
            <p className="type-lg tabular-nums">
              {UI.from[lang]} {euros(model.from, lang)} <span className="type-body">{UI.perNight[lang]}</span>
            </p>
            <ButtonLink
              href={href(lang, "bookRoom", {}, { room: room.id })}
              variant="accent"
              className="mt-16 w-full"
            >
              {PAGE.bookThis[lang]}
            </ButtonLink>
          </div>
          <Facts
            className="mt-32"
            items={room.facts.map((f) => ({ label: f.label[lang], value: f.value[lang] }))}
          />
        </div>
      </Section>

      {/* pattern: weft-ruled cross-links — REFERENCE-AUTOPSY §2.5 (recommended rooms), as a list not tiles */}
      <Section tone="field" labelledBy="others-title">
        <h2 id="others-title" className="type-md col-span-12 mb-32 lg:col-span-4 lg:mb-0">
          <JellyText text={PAGE.others[lang]} />
        </h2>
        <ul className="col-span-12 border-t border-ink lg:col-span-7 lg:col-start-6">
          {others.map((o) => {
            const m = roomType(o.id)!;
            return (
              <li key={o.id} className="border-b border-ink">
                <Link
                  href={href(lang, "room", { room: o.id })}
                  className="group flex min-h-64 items-center justify-between gap-16 py-16 no-underline"
                >
                  <span className="type-md group-hover:underline">{o.name}</span>
                  <span className="type-body font-medium tabular-nums flex items-center gap-16">
                    {UI.from[lang]} {euros(m.from, lang)}
                    <Arrow />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>
    </>
  );
}
