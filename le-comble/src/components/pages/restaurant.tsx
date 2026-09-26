import { MENU, RESTAURANT } from "@/content/restaurant";
import { FAQ_GROUPS } from "@/content/faq";
import { UI, euros } from "@/content/site";
import { href, type Lang } from "@/lib/i18n";
import { Section } from "@/components/ui/section";
import { Cluster } from "@/components/ui/cluster";
import { ButtonLink } from "@/components/ui/button";
import { Facts } from "@/components/ui/facts";
import { Photo } from "@/components/ui/photo";
import { PairedPortraits } from "@/components/ui/paired-portraits";
import { Accordion } from "@/components/ui/accordion";
import { JellyText } from "@/components/ui/jelly-text";

export function RestaurantPage({ lang }: { lang: Lang }) {
  const r = RESTAURANT;
  return (
    <>
      {/* pattern: page title cluster + facts, 6 + 5 split — REFERENCE-AUTOPSY §2.5 (room detail text column), design-system §7 */}
      <Section labelledBy="page-title">
        <Cluster
          as="h1"
          size="display"
          id="page-title"
          eyebrow={r.eyebrow[lang]}
          title={r.title[lang]}
          className="col-span-12 lg:col-span-6"
          action={
            <>
              <ButtonLink href={href(lang, "bookTable")} variant="accent">
                {UI.bookTable[lang]}
              </ButtonLink>
              <ButtonLink href={href(lang, "menu")} variant="text">
                {UI.seeMenu[lang]}
              </ButtonLink>
            </>
          }
        >
          <p className="type-body text-ink">{r.lead[lang]}</p>
        </Cluster>
        <Facts
          className="col-span-12 mt-48 self-end lg:col-span-5 lg:col-start-8 lg:mt-0"
          items={r.facts.map((f) => ({ label: f.label[lang], value: f.value[lang] }))}
        />
      </Section>

      {/* pattern: paired portraits — REFERENCE-AUTOPSY §5.2 adjacent version */}
      <Section flush className="pb-64 lg:pb-96">
        <PairedPortraits a="diningWindows" b="kitchenHands" lang={lang} />
      </Section>

      {/* pattern: three hairline-topped columns — REFERENCE-AUTOPSY §6 (hairlines, no cards) */}
      <Section>
        {r.sections.map((s, i) => (
          <div
            key={s.title.fr}
            className={`col-span-12 border-t border-ink pt-24 md:col-span-4 ${i > 0 ? "mt-48 md:mt-0" : ""}`}
          >
            <p className="type-label mb-12 text-ink">{s.eyebrow[lang]}</p>
            <h2 className="type-md"><JellyText text={s.title[lang]} /></h2>
            <p className="mt-16 text-ink">{s.body[lang]}</p>
          </div>
        ))}
        <p className="type-body font-medium tabular-nums col-span-12 mt-64 border-l-2 border-mark pl-16 lg:col-span-7">
          {r.residents[lang]}
        </p>
      </Section>

      {/* pattern: food from above on plain plates, three squares — brief §11 */}
      <Section flush className="pb-64 lg:pb-96">
        {(["plateQuenelle", "plateTrout", "plateTart"] as const).map((id) => (
          <div key={id} className="col-span-4">
            <Photo id={id} lang={lang} sizes="(min-width: 64rem) 30vw, 33vw" />
          </div>
        ))}
      </Section>

      {/* pattern: scoped FAQ on ciel — REFERENCE-AUTOPSY §11.2 */}
      <Section tone="field" labelledBy="faq-title">
        <Cluster
          id="faq-title"
          eyebrow="Questions"
          title={FAQ_GROUPS[0].title[lang]}
          className="col-span-12 mb-48 lg:col-span-4 lg:mb-0"
        />
        <div className="col-span-12 lg:col-span-7 lg:col-start-6">
          <Accordion items={FAQ_GROUPS[0].items} lang={lang} />
        </div>
      </Section>
    </>
  );
}

export function MenuPage({ lang }: { lang: Lang }) {
  const m = MENU;
  return (
    <>
      {/* pattern: printed menu — numbered hairline list, serif dish, sans note; prices in tabular figures (design-system §3 type-body font-medium tabular-nums) */}
      <Section labelledBy="page-title">
        <Cluster
          as="h1"
          size="h1"
          id="page-title"
          eyebrow={m.eyebrow[lang]}
          title={m.title[lang]}
          className="col-span-12 lg:col-span-5"
          action={
            <ButtonLink href={href(lang, "bookTable")} variant="accent">
              {UI.bookTable[lang]}
            </ButtonLink>
          }
        >
          <p className="type-body font-medium tabular-nums text-ink">{m.price[lang]}</p>
          <p>{m.cycle[lang]}</p>
          <p className="type-small">{m.allergies[lang]}</p>
        </Cluster>
        <ol className="col-span-12 mt-48 border-t border-ink lg:col-span-6 lg:col-start-7 lg:mt-0">
          {m.courses.map((c, i) => (
            <li key={c.dish.fr} className="grid grid-cols-12 gap-x-16 border-b border-ink py-24">
              <span className="type-label col-span-2 pt-8 text-ink">{String(i + 1).padStart(2, "0")}</span>
              <div className="col-span-10">
                <p className="type-md italic">{c.dish[lang]}</p>
                <p className="mt-4 text-ink">{c.note[lang]}</p>
              </div>
            </li>
          ))}
          <li className="py-16 text-ink">{m.supplement[lang]}</li>
        </ol>
      </Section>

      {/* pattern: two short price lists on hairlines — REFERENCE-AUTOPSY §6 */}
      <Section tone="field">
        {[m.counter, m.wine].map((list, i) => (
          <div key={list.title.fr} className={`col-span-12 lg:col-span-5 ${i === 1 ? "mt-48 lg:col-start-8 lg:mt-0" : ""}`}>
            <h2 className="type-md mb-24"><JellyText text={list.title[lang]} /></h2>
            <ul className="border-t border-ink">
              {list.items.map((it) => (
                <li key={it.dish.fr} className="flex items-baseline justify-between gap-24 border-b border-ink py-16">
                  <span className="type-md">{it.dish[lang]}</span>
                  <span className="type-md tabular-nums">{euros(it.price, lang)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Section>
    </>
  );
}
