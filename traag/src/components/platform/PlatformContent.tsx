import Image from "next/image";
import VideoCard from "@/components/VideoCard";
import { LISTINGS, MIXES, PLATFORMS, PRICES, type PlatformId } from "@/data/platforms";
import { releases, totalLength } from "@/data/releases";
import { ddmmyyyy } from "@/lib/shows";
import her01 from "@/photos/her-01-front.png";
import laugh from "@/photos/gen-02-laugh.png";
import yard from "@/photos/room-05-smoking-yard.png";
import whitelabel from "@/photos/work-01-whitelabel.png";
import street from "@/photos/gen-04-street.png";
import closeup from "@/photos/her-04-closeup.png";
import pa from "@/photos/room-04-pa.png";
import studio from "@/photos/work-03-studio.png";
import up from "@/photos/gen-05-up.png";
import s from "./platform.module.css";

const GRID = [
  { src: her01, alt: "Lore straight on against a concrete wall, flash" },
  { src: laugh, alt: "Lore laughing against a concrete wall" },
  { src: yard, alt: "The smoking yard outside a club, silhouettes in smoke" },
  { src: whitelabel, alt: "A white-label record on a turntable" },
  { src: street, alt: "Lore on a wet cobbled street in Ghent at night" },
  { src: closeup, alt: "Lore's eyes, very close, flash on skin" },
  { src: pa, alt: "A stacked black PA in a dark room" },
  { src: studio, alt: "Her home studio at night, lamp on, records on the shelf" },
  { src: up, alt: "Lore from below with wet hair after a set" },
];

type H = "h2" | "h3";

function Tracklists({ withPrices, Heading }: { withPrices?: boolean; Heading: H }) {
  return (
    <div className={s.stack}>
      {releases.map((r) => (
        <section key={r.slug} className={`${s.release} card`} aria-labelledby={`p-${r.slug}`}>
          <div className={s.cover}>
            <Image src={r.image} alt="" fill sizes="160px" className={s.img} />
          </div>
          <div className={s.releaseBody}>
            <Heading id={`p-${r.slug}`} className={s.releaseTitle}>
              {r.title}
            </Heading>
            <p className="t-record ghost">
              {r.cat} · {r.year} · {r.tracks.length} tracks, {totalLength(r.tracks)}
            </p>
            {withPrices ? (
              <div className={s.buy}>
                {PRICES[r.slug]?.vinyl && (
                  <button type="button" className={`${s.buyButton} t-record`} data-demo-buy>
                    12&quot; vinyl · {PRICES[r.slug].vinyl}
                  </button>
                )}
                {r.soldOut && <span className={`${s.sold} t-record-label`}>vinyl sold out</span>}
                <button type="button" className={`${s.buyButton} t-record`} data-demo-buy>
                  digital · {PRICES[r.slug]?.digital}
                </button>
              </div>
            ) : (
              <ol className={`${s.tracks} t-record`}>
                {r.tracks.map((t) => (
                  <li key={t.pos}>
                    <span className="ghost">{t.pos}</span>
                    <span>{t.title}</span>
                    <span className="ghost">{t.bpm} bpm</span>
                    <span>{t.length}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}

/** What the platform would show. Used by the panel and by /platforms/[id]. */
export default function PlatformContent({ id, level = 3 }: { id: PlatformId; level?: 2 | 3 }) {
  const Heading: H = level === 2 ? "h2" : "h3";
  const p = PLATFORMS[id];
  return (
    <div className={s.content}>
      <p className={`${s.note} t-record`}>
        demo. this account isn&apos;t live yet. this is what you would find at {p.name} / {p.handle}.
      </p>
      <p className={`${s.line} t-body`}>{p.line}</p>

      {id === "bandcamp" && <Tracklists withPrices Heading={Heading} />}
      {(id === "spotify" || id === "apple") && <Tracklists Heading={Heading} />}

      {id === "soundcloud" && (
        <ol className={s.stack}>
          {MIXES.map((m) => (
            <li key={m.id} id={`mix-${m.id}`} className={`${s.mix} card`}>
              <span className="t-record ghost">{ddmmyyyy(m.date)}</span>
              <span className={s.mixTitle}>{m.title}</span>
              <span className="t-body">{m.note}</span>
              <span className="t-record">{m.length}</span>
            </li>
          ))}
        </ol>
      )}

      {id === "youtube" && (
        <div className={s.stack}>
          <VideoCard src="/traag/hero.mp4" poster="/traag/poster.jpg" title="showreel, 2026" ratio="16 / 10" />
          <VideoCard src="/traag/clips/c4-decks.mp4" poster="/traag/clips/c4-decks.jpg" title="at the decks, kelder" ratio="16 / 10" />
          <VideoCard src="/traag/clips/c6-closeup.mp4" poster="/traag/clips/c6-closeup.jpg" title="flash test, close" ratio="16 / 10" />
        </div>
      )}

      {id === "instagram" && (
        <ul className={s.grid}>
          {GRID.map((g) => (
            <li key={g.alt} className={s.cell}>
              <Image src={g.src} alt={g.alt} fill sizes="(min-width: 768px) 200px, 33vw" className={s.img} />
            </li>
          ))}
        </ul>
      )}

      {id === "discogs" && (
        <ol className={s.stack}>
          {LISTINGS.map((l) => (
            <li key={l.condition} className={`${s.listing} card t-record`}>
              <span>vertraging · TRAAG 001 · 12&quot;</span>
              <span className="ghost">
                {l.condition} · ships from {l.from}
              </span>
              <span className={s.price}>{l.price}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
