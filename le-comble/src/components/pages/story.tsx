import { BAR, BUILDING, CAMILLE, CONTACT, GETTING_HERE, HIRE } from "@/content/pages";
import { FAQ_GROUPS, FAQ_PAGE } from "@/content/faq";
import { SITE, HOURS, UI } from "@/content/site";
import { href, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { Section } from "@/components/ui/section";
import { Cluster } from "@/components/ui/cluster";
import { ButtonLink } from "@/components/ui/button";
import { Facts } from "@/components/ui/facts";
import { Photo } from "@/components/ui/photo";
import { PairedPortraits } from "@/components/ui/paired-portraits";
import { Accordion } from "@/components/ui/accordion";
import type { PhotoKey } from "@/content/images";
import { JellyText } from "@/components/ui/jelly-text";

export function BarPage({ lang }: { lang: Lang }) {
  const b = BAR;
  return (
    <>
      {/* pattern: the page's opening as a band — REFERENCE-AUTOPSY §4.4; indigo velvet like the page (user request, 25 Sep 2026: no red band) */}
      <Section tone="field" labelledBy="page-title">
        <Cluster
          as="h1"
          size="display"
          id="page-title"
          eyebrow={b.eyebrow[lang]}
          title={b.title[lang]}
          dark
          className="col-span-12 lg:col-span-5"
        >
          <p className="type-body text-chaux">{b.lead[lang]}</p>
          {b.body.map((p) => (
            <p key={p.fr}>{p[lang]}</p>
          ))}
        </Cluster>
        <div className="col-span-12 mt-48 self-end lg:col-span-6 lg:col-start-7 lg:mt-0">
          <Photo id="toitView" lang={lang} priority sizes="(min-width: 64rem) 45vw, 100vw" />
        </div>
      </Section>

      {/* pattern: facts beside a single portrait, 4:5 over four columns — REFERENCE-AUTOPSY §2.2 (3), design-system §5 */}
      <Section>
        <div className="col-span-8 lg:col-span-4">
          <Photo id="toitBar" lang={lang} sizes="(min-width: 64rem) 30vw, 64vw" />
        </div>
        <div className="col-span-12 mt-48 flex flex-col gap-32 lg:col-span-6 lg:col-start-6 lg:mt-0">
          <Facts items={b.facts.map((f) => ({ label: f.label[lang], value: f.value[lang] }))} />
          <p className="max-w-prose text-ink">{b.weather[lang]}</p>
          <ButtonLink href={href(lang, "restaurant")} variant="secondary" className="w-fit">
            {lang === "fr" ? "Le comptoir de Navette" : "The counter at Navette"}
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}

const CHAPTER_PHOTOS: [PhotoKey, PhotoKey][] = [
  ["stair", "facade"],
  ["roomTrameWindow", "roomAtelier"],
  ["diningWindows", "diningTables"],
  ["traboule", "courtyard"],
];

export function BuildingPage({ lang }: { lang: Lang }) {
  const b = BUILDING;
  return (
    <>
      {/* pattern: page title cluster — design-system §7 */}
      <Section labelledBy="page-title">
        <Cluster
          as="h1"
          size="h1"
          id="page-title"
          eyebrow={b.eyebrow[lang]}
          title={b.title[lang]}
          className="col-span-12 lg:col-span-8"
        >
          <p className="type-body text-ink">{b.lead[lang]}</p>
        </Cluster>
      </Section>

      {b.chapters.map((c, i) => (
        /* pattern: chapters alternating text and a mirrored portrait pair — REFERENCE-AUTOPSY §5.2 adjacent version */
        <Section key={c.title.fr} labelledBy={`chapter-${i}`}>
          <PairedPortraits
            a={CHAPTER_PHOTOS[i][0]}
            b={CHAPTER_PHOTOS[i][1]}
            lang={lang}
            mirror={i % 2 === 1}
            compact
            className={cn("lg:col-span-7", i % 2 === 1 && "lg:col-start-6 lg:row-start-1")}
          />
          <Cluster
            id={`chapter-${i}`}
            eyebrow={c.eyebrow[lang]}
            title={c.title[lang]}
            size="h3"
            className={cn(
              "col-span-12 mt-48 self-end lg:col-span-4 lg:mt-0 lg:row-start-1",
              i % 2 === 0 ? "lg:col-start-9" : "lg:col-start-1",
            )}
          >
            <p>{c.body[lang]}</p>
          </Cluster>
        </Section>
      ))}

      {/* pattern: closing note on the second surface — REFERENCE-AUTOPSY §4.4 */}
      <Section tone="field" labelledBy="name-title">
        <Cluster id="name-title" title={b.name.title[lang]} size="h2" className="col-span-12 lg:col-span-7">
          <p className="type-body text-ink">{b.name.body[lang]}</p>
        </Cluster>
      </Section>
    </>
  );
}

export function CamillePage({ lang }: { lang: Lang }) {
  const c = CAMILLE;
  return (
    <>
      {/* pattern: portrait beside title and pull quote — REFERENCE-AUTOPSY §2.2 (3), brief §4 */}
      <Section labelledBy="page-title">
        <div className="col-span-12 lg:col-span-5">
          <Photo id="camillePass" lang={lang} priority sizes="(min-width: 64rem) 36vw, 100vw" />
        </div>
        <div className="col-span-12 mt-48 flex flex-col lg:col-span-6 lg:col-start-7 lg:mt-0">
          <Cluster as="h1" size="h1" id="page-title" eyebrow={c.eyebrow[lang]} title={c.title[lang]}>
            <p className="type-body text-ink">{c.lead[lang]}</p>
          </Cluster>
          <blockquote className="type-md mt-48 border-l-2 border-mark pl-24">{c.quote[lang]}</blockquote>
          <div className="mt-32 flex max-w-prose flex-col gap-16 text-ink">
            {c.body.map((p) => (
              <p key={p.fr}>{p[lang]}</p>
            ))}
          </div>
          <div className="mt-32 flex flex-wrap gap-24">
            <ButtonLink href={href(lang, "bookTable")} variant="accent">
              {UI.bookTable[lang]}
            </ButtonLink>
            <ButtonLink href={href(lang, "menu")} variant="text">
              {UI.seeMenu[lang]}
            </ButtonLink>
          </div>
        </div>
      </Section>

      {/* pattern: paired portraits — REFERENCE-AUTOPSY §5.2 adjacent version */}
      <Section flush className="pb-64 lg:pb-96">
        <PairedPortraits a="kitchenHands" b="plateTrout" lang={lang} mirror />
      </Section>
    </>
  );
}

export function HirePage({ lang }: { lang: Lang }) {
  const h = HIRE;
  return (
    <>
      {/* pattern: enquiry, not booking — brief §8; page title cluster, design-system §7 */}
      <Section labelledBy="page-title">
        <Cluster
          as="h1"
          size="h1"
          id="page-title"
          eyebrow={h.eyebrow[lang]}
          title={h.title[lang]}
          className="col-span-12 lg:col-span-7"
          action={
            <ButtonLink href={href(lang, "bookBuilding")} variant="accent">
              {UI.enquire[lang]}
            </ButtonLink>
          }
        >
          <p className="type-body text-ink">{h.lead[lang]}</p>
        </Cluster>
      </Section>

      {/* pattern: two hairline-topped options — REFERENCE-AUTOPSY §2.5 (privatisation split), §6 */}
      <Section flush className="pb-64 lg:pb-96">
        {h.options.map((o, i) => (
          <div key={o.title.fr} className={cn("col-span-12 border-t border-ink pt-24 md:col-span-6", i > 0 && "mt-48 md:mt-0")}>
            <h2 className="type-md"><JellyText text={o.title[lang]} /></h2>
            <p className="type-body font-medium tabular-nums mt-8 text-ink">{o.facts[lang]}</p>
            <p className="mt-16 max-w-prose text-ink">{o.body[lang]}</p>
          </div>
        ))}
        <p className="type-small col-span-12 mt-32 text-ink lg:col-span-6">{h.note[lang]}</p>
      </Section>

      {/* pattern: paired portraits — REFERENCE-AUTOPSY §5.2 adjacent version */}
      <Section flush className="pb-64 lg:pb-96">
        <PairedPortraits a="stair" b="privateDinner" lang={lang} />
      </Section>
    </>
  );
}

export function GettingHerePage({ lang }: { lang: Lang }) {
  const g = GETTING_HERE;
  const mapUrl = "https://www.openstreetmap.org/search?query=rue%20Burdeau%2C%20Lyon";
  return (
    <>
      {/* pattern: honest-question page, brief §12 voice; title cluster, design-system §7 */}
      <Section labelledBy="page-title">
        <Cluster
          as="h1"
          size="h1"
          id="page-title"
          eyebrow={g.eyebrow[lang]}
          title={g.title[lang]}
          className="col-span-12 lg:col-span-7"
        >
          <p className="type-body text-ink">{g.lead[lang]}</p>
        </Cluster>
        <address className="col-span-12 mt-48 flex flex-col self-end border-t border-ink pt-16 not-italic lg:col-span-4 lg:col-start-9 lg:mt-0">
          <span className="type-body font-medium tabular-nums">{SITE.name}</span>
          <span>{SITE.address.street}</span>
          <span>{SITE.address.city}</span>
          <a href={mapUrl} className="type-small font-medium mt-16 w-fit" rel="noopener">
            {lang === "fr" ? "Ouvrir le plan" : "Open the map"}
          </a>
        </address>
      </Section>

      {/* pattern: numbered weft list — REFERENCE-AUTOPSY §6 */}
      <Section flush className="pb-64 lg:pb-96">
        <ol className="col-span-12 border-t border-ink lg:col-span-8">
          {g.steps.map((s, i) => (
            <li key={s.title.fr} className="grid grid-cols-12 gap-x-16 border-b border-ink py-24">
              <span className="type-label col-span-2 pt-8 text-ink lg:col-span-1">{String(i + 1).padStart(2, "0")}</span>
              <div className="col-span-10 lg:col-span-11">
                <h2 className="type-md"><JellyText text={s.title[lang]} /></h2>
                <p className="mt-8 max-w-prose text-ink">{s.body[lang]}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="type-body font-medium tabular-nums col-span-12 mt-32 border-l-2 border-mark pl-16 lg:col-span-7">{g.luggage[lang]}</p>
      </Section>
    </>
  );
}

export function FaqPage({ lang }: { lang: Lang }) {
  return (
    <>
      {/* pattern: full FAQ page with category headings — REFERENCE-AUTOPSY §11.2 (fixes: sentence case, grouped) */}
      <Section labelledBy="page-title">
        <Cluster
          as="h1"
          size="h1"
          id="page-title"
          eyebrow={FAQ_PAGE.eyebrow[lang]}
          title={FAQ_PAGE.title[lang]}
          className="col-span-12 lg:col-span-8"
        />
      </Section>
      {FAQ_GROUPS.map((g, i) => (
        /* pattern: scoped FAQ group — REFERENCE-AUTOPSY §11.2 */
        <Section key={g.title.fr} flush labelledBy={`group-${i}`} className="pb-64 lg:pb-96">
          <h2 id={`group-${i}`} className="type-md col-span-12 mb-24 lg:col-span-4 lg:mb-0">
            <JellyText text={g.title[lang]} />
          </h2>
          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            <Accordion items={g.items} lang={lang} />
          </div>
        </Section>
      ))}
    </>
  );
}

export function ContactPage({ lang }: { lang: Lang }) {
  const c = CONTACT;
  return (
    <>
      {/* pattern: title cluster + weft-ruled contact lines — design-system §7, REFERENCE-AUTOPSY §6 */}
      <Section labelledBy="page-title">
        <Cluster
          as="h1"
          size="h1"
          id="page-title"
          eyebrow={c.eyebrow[lang]}
          title={c.title[lang]}
          className="col-span-12 lg:col-span-6"
        >
          <p className="type-body text-ink">{c.lead[lang]}</p>
        </Cluster>
        <div className="col-span-12 mt-48 lg:col-span-5 lg:col-start-8 lg:mt-0">
          <ul className="border-t border-ink">
            {c.lines.map((l) => {
              const email = SITE.email[l.key as keyof typeof SITE.email];
              return (
                <li key={l.key} className="flex flex-wrap items-baseline justify-between gap-16 border-b border-ink py-16">
                  <span className="type-label text-ink">{l.label[lang]}</span>
                  <a href={`mailto:${email}`} className="type-body font-medium tabular-nums">
                    {email}
                  </a>
                </li>
              );
            })}
            <li className="flex flex-wrap items-baseline justify-between gap-16 border-b border-ink py-16">
              <span className="type-label text-ink">{lang === "fr" ? "Téléphone" : "Phone"}</span>
              <a href={SITE.phoneHref} className="type-body font-medium tabular-nums">
                {SITE.phone}
              </a>
            </li>
          </ul>
          <address className="mt-32 flex flex-col not-italic">
            <span>{SITE.address.street}</span>
            <span>{SITE.address.city}</span>
            <span className="text-ink">{SITE.address.quarter[lang]}</span>
          </address>
          <Facts
            className="mt-32"
            items={HOURS.map((h) => ({ label: h.label[lang], value: h.value[lang] }))}
          />
        </div>
      </Section>
    </>
  );
}
