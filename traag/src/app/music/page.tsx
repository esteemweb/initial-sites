import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import { LISTEN } from "@/data/listen";
import { MIXES, platformHref } from "@/data/platforms";
import { releases, totalLength } from "@/data/releases";
import { ddmmyyyy } from "@/lib/shows";
import emptyClub from "@/photos/room-03-empty-club.png";
import yard from "@/photos/room-05-smoking-yard.png";
import studio from "@/photos/work-03-studio.png";
import blur from "@/photos/room-02-crowd-blur.png";
import pa from "@/photos/room-04-pa.png";
import h from "../home.module.css";
import s from "./music.module.css";

export const metadata: Metadata = {
  title: "music",
  description: "two records and some mixes. nul, 2026. vertraging, 2025.",
};

const CARD_IMAGES = [yard, studio, blur, pa];


export default function MusicPage() {
  return (
    <main>
      <PageHero title="music" image={emptyClub} alt="An empty club before doors, the booth and speaker stacks under one light" />

      <section className="container" aria-label="where to listen">
        <ul className={`${h.listen} ${s.four}`}>
          {LISTEN.map((l, i) => (
            <li key={l.id}>
              <a href={platformHref(l.id)} data-platform={l.id} className={`${h.listenCard} card`}>
                <Image src={CARD_IMAGES[i]} alt="" fill sizes="(min-width: 1024px) 320px, 50vw" className={h.listenImg} />
                <span className={h.listenText}>
                  <span className="t-record">listen on</span>
                  <span className={`${h.listenName} ${s.smallName}`}>{l.label}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className={`${s.block} container`} aria-labelledby="mixes">
        <h2 id="mixes" className={s.heading}>
          latest mixes
        </h2>
        <ul className={s.mixes}>
          {MIXES.map((m) => (
            <li key={m.id}>
              <a href={platformHref("soundcloud")} data-platform="soundcloud" data-target={`mix-${m.id}`} className={`${s.mix} card`}>
                <span className="t-record ghost">{ddmmyyyy(m.date)}</span>
                <span className={s.mixTitle}>{m.title}</span>
                <span className="t-record">{m.length} · listen →</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className={`${s.block} container glow`} aria-labelledby="releases">
        <h2 id="releases" className={s.heading}>
          latest releases
        </h2>
        <div className={s.releases}>
          {releases.map((r, i) => (
            <article key={r.slug} id={r.slug} className={`${s.release} card`} aria-labelledby={`${r.slug}-title`}>
              <div className={s.cover}>
                <Image src={r.image} alt={r.alt} fill sizes="(min-width: 1024px) 420px, 100vw" className={s.coverImg} priority={i === 0} />
              </div>
              <div className={s.info}>
                <p className="t-record ghost">
                  {r.cat} · {r.year}
                </p>
                <h3 id={`${r.slug}-title`} className={s.releaseTitle}>
                  {r.title}
                </h3>
                <p className={`${s.line} t-body`}>{r.line}</p>
                <dl className={`${s.facts} t-record`}>
                  <div>
                    <dt>format</dt>
                    <dd>{r.format}</dd>
                  </div>
                  <div>
                    <dt>released</dt>
                    <dd>{ddmmyyyy(r.released)}</dd>
                  </div>
                  <div>
                    <dt>pressing</dt>
                    <dd>
                      {r.pressing} copies{r.soldOut ? " — sold out" : ""}
                    </dd>
                  </div>
                  <div>
                    <dt>length</dt>
                    <dd>
                      {r.tracks.length} tracks, {totalLength(r.tracks)}
                    </dd>
                  </div>
                </dl>
                <table className={`${s.tracks} t-record`}>
                  <caption className="sr-only">tracklist, {r.title}</caption>
                  <thead>
                    <tr>
                      <th scope="col">side</th>
                      <th scope="col">title</th>
                      <th scope="col">bpm</th>
                      <th scope="col">length</th>
                    </tr>
                  </thead>
                  <tbody>
                    {r.tracks.map((t) => (
                      <tr key={t.pos}>
                        <td>{t.pos}</td>
                        <th scope="row">{t.title}</th>
                        <td>{t.bpm}</td>
                        <td>{t.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <ul className={s.links}>
                  {r.links.map((l) => (
                    <li key={l.label}>
                      <a href={platformHref(l.platform)} data-platform={l.platform} className={`${s.pill} t-record`}>
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
