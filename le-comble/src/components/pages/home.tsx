import { HOME } from "@/content/home";
import { HOME_FAQ } from "@/content/faq";
import { UI } from "@/content/site";
import { href, type Lang } from "@/lib/i18n";
import { Section } from "@/components/ui/section";
import { Cluster } from "@/components/ui/cluster";
import { ButtonLink } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";
import { PairedPortraits } from "@/components/ui/paired-portraits";
import { Accordion } from "@/components/ui/accordion";
import { RoomIndex } from "@/components/sections/room-index";
import { HeroVideo } from "@/components/sections/hero-video";
import { HeroStage } from "@/components/sections/hero-stage";

/* Home — design-system §7 order. Restaurant first, rooms second (brief §1). */

export function HomePage({ lang }: { lang: Lang }) {
  const h = HOME;
  return (
    <>
      {/* pattern: full-screen looping hero — user request (24 Sep 2026), overriding brief §13 "leave the full-screen video"; built lean per REFERENCE-AUTOPSY §5.3 (poster first, 1.6 / 0.5 MB, pause, reduced motion). Text sits on a solid chaux panel: no scrim, because a scrim would be a tint (§4). First booking prompt inside the first screen — §11.1 */}
      <section aria-labelledby="hero-title" className="hero-screen relative flex overflow-hidden">
        <HeroVideo lang={lang} />
        {/* motion, pointer light, the turning word and tonight's sittings — user request 25 Sep 2026 */}
        <HeroStage
          lang={lang}
          ribbon={
            /* the ribbon: two copies of the list sliding by, decorative (all of it is said elsewhere on the page) */
            <div aria-hidden className="ground absolute inset-x-0 bottom-0 overflow-hidden border-t border-ink">
              <div className="marquee flex w-max">
                {[0, 1].map((copy) => (
                  <div key={copy} className="flex shrink-0 items-center">
                    {h.hero.ribbon.map((r) => (
                      <span key={r.fr} className="flex items-center">
                        <span className="type-md whitespace-nowrap px-24 py-12 italic">{r[lang]}</span>
                        <svg viewBox="0 0 16 16" className="size-16 shrink-0 fill-mark">
                          <path d="M8 0l1.8 6.2L16 8l-6.2 1.8L8 16l-1.8-6.2L0 8l6.2-1.8z" />
                        </svg>
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          }
        />
      </section>

      {/* pattern: asymmetric 6 + 5 split with facts, hairline rows — REFERENCE-AUTOPSY §2.2 (3), §6 */}
      <Section labelledBy="navette-title">
        <Cluster
          id="navette-title"
          eyebrow={h.navette.eyebrow[lang]}
          title={h.navette.title[lang]}
          className="col-span-12 lg:col-span-6"
          action={
            <>
              <ButtonLink href={href(lang, "bookTable")}>{UI.bookTable[lang]}</ButtonLink>
              <ButtonLink href={href(lang, "menu")} variant="text">
                {UI.seeMenu[lang]}
              </ButtonLink>
            </>
          }
        >
          {h.navette.body.map((p) => (
            <p key={p.fr}>{p[lang]}</p>
          ))}
        </Cluster>
        <dl className="col-span-12 mt-48 self-end border-t border-ink lg:col-span-5 lg:col-start-8 lg:mt-0">
          {h.navette.facts.map((f) => (
            <div key={f.label.fr} className="flex items-baseline gap-24 border-b border-ink py-16">
              <dt className="sr-only">{f.label[lang]}</dt>
              <dd className="type-lg w-1/3 shrink-0">{f.value[lang]}</dd>
              <dd className="text-ink">{f.label[lang]}</dd>
            </div>
          ))}
        </dl>
        <PairedPortraits a="diningWindows" b="diningTables" lang={lang} className="mt-64 lg:mt-96" />
      </Section>

      {/* pattern: quote beside a single portrait, 6 + 4 — REFERENCE-AUTOPSY §2.2 (3), brief §4; single portrait = 4:5 over columns 9–12 (design-system §5) */}
      <Section labelledBy="camille-title">
        <div className="col-span-12 flex flex-col lg:col-span-6">
          <span aria-hidden className="warp-rule mb-24" />
          <p id="camille-title" className="type-label mb-12 text-ink">
            {h.camille.eyebrow[lang]}
          </p>
          <blockquote className="type-lg">{h.camille.quote[lang]}</blockquote>
          <p className="mt-24 max-w-prose text-ink">{h.camille.body[lang]}</p>
          <ButtonLink href={href(lang, "camille")} variant="text" className="mt-32 w-fit">
            {h.camille.link[lang]}
          </ButtonLink>
        </div>
        <div className="col-span-8 col-start-5 mt-48 lg:col-span-4 lg:col-start-9 lg:mt-0">
          <Photo id="camillePass" lang={lang} sizes="(min-width: 64rem) 30vw, 64vw" />
        </div>
      </Section>

      {/* pattern: rooms named as worlds, list-driven image — REFERENCE-AUTOPSY §5.2, §15 Q3 */}
      <Section labelledBy="rooms-title" chapter>
        <Cluster
          id="rooms-title"
          eyebrow={h.rooms.eyebrow[lang]}
          title={h.rooms.title[lang]}
          className="col-span-12 mb-48 lg:col-span-7 lg:mb-64"
        >
          <p>{h.rooms.body[lang]}</p>
        </Cluster>
        <RoomIndex lang={lang} />
        <div className="col-span-12 mt-48 lg:col-span-6 lg:col-start-7">
          <ButtonLink href={href(lang, "rooms")} variant="secondary">
            {h.rooms.link[lang]}
          </ButtonLink>
        </div>
      </Section>

      {/* pattern: paired portraits, mirrored — REFERENCE-AUTOPSY §5.2 adjacent version, brief §11 */}
      <Section labelledBy="building-title">
        <PairedPortraits a="traboule" b="facade" lang={lang} mirror compact className="lg:col-span-7" />
        <Cluster
          id="building-title"
          eyebrow={h.building.eyebrow[lang]}
          title={h.building.title[lang]}
          size="h3"
          className="col-span-12 mt-48 self-end lg:col-span-4 lg:col-start-9 lg:mt-0"
          action={
            <ButtonLink href={href(lang, "building")} variant="text">
              {h.building.link[lang]}
            </ButtonLink>
          }
        >
          <p>{h.building.body[lang]}</p>
        </Cluster>
      </Section>

      {/* pattern: CTA band — REFERENCE-AUTOPSY §4.4; indigo velvet like the page (user request, 25 Sep 2026: no red band on home) */}
      <Section tone="field" labelledBy="toit-title">
        <Cluster
          id="toit-title"
          eyebrow={h.toit.eyebrow[lang]}
          title={h.toit.title[lang]}
          dark
          className="col-span-12 lg:col-span-5"
          action={
            <ButtonLink href={href(lang, "bar")} variant="on-dark">
              {h.toit.link[lang]}
            </ButtonLink>
          }
        >
          <p>{h.toit.body[lang]}</p>
        </Cluster>
        <div className="col-span-12 mt-48 self-end lg:col-span-6 lg:col-start-7 lg:mt-0">
          <Photo id="toitView" lang={lang} sizes="(min-width: 64rem) 45vw, 100vw" />
        </div>
      </Section>

      {/* pattern: secondary audience after the product — REFERENCE-AUTOPSY §11.1 (privatisation after CTA) */}
      <Section labelledBy="hire-title">
        <Cluster
          id="hire-title"
          eyebrow={h.hire.eyebrow[lang]}
          title={h.hire.title[lang]}
          className="col-span-12 lg:col-span-7"
          action={
            <ButtonLink href={href(lang, "privateHire")} variant="secondary">
              {h.hire.link[lang]}
            </ButtonLink>
          }
        >
          <p>{h.hire.body[lang]}</p>
        </Cluster>
        <div className="col-span-8 col-start-5 mt-48 lg:col-span-4 lg:col-start-9 lg:mt-0">
          <Photo id="privateDinner" lang={lang} sizes="(min-width: 64rem) 30vw, 64vw" />
        </div>
      </Section>

      {/* pattern: scoped FAQ on ciel, bold lead sentence — REFERENCE-AUTOPSY §11.2, §4.4 */}
      <Section tone="field" labelledBy="faq-title">
        <Cluster
          id="faq-title"
          eyebrow={h.faq.eyebrow[lang]}
          title={h.faq.title[lang]}
          className="col-span-12 mb-48 lg:col-span-4 lg:mb-0"
          action={
            <ButtonLink href={href(lang, "faq")} variant="text">
              {h.faq.link[lang]}
            </ButtonLink>
          }
        />
        <div className="col-span-12 lg:col-span-7 lg:col-start-6">
          <Accordion items={HOME_FAQ} lang={lang} />
        </div>
      </Section>
    </>
  );
}
