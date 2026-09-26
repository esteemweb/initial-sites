import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import { preload } from "react-dom";
import Link from "next/link";
import Hero from "@/components/Hero";
import NextUp from "@/components/NextUp";
import VideoCard from "@/components/VideoCard";
import { todayKey } from "@/lib/shows";
import decks from "@/photos/gen-01-decks.png";
import outside from "@/photos/her-06-outside.png";
import emptyClub from "@/photos/room-03-empty-club.png";
import yard from "@/photos/room-05-smoking-yard.png";
import studio from "@/photos/work-03-studio.png";
import blur from "@/photos/room-02-crowd-blur.png";
import { LISTEN } from "@/data/listen";
import { platformHref } from "@/data/platforms";
import s from "./home.module.css";

// Build for the video, ship with the stills: when public/traag/hero.mp4
// exists at build time the hero plays it.
const hasVideo = existsSync(path.join(process.cwd(), "public", "traag", "hero.mp4"));

const CARD_IMAGES = [yard, studio, blur];

export default function Home() {
  // the showreel poster is the first thing painted; let the browser find it early
  if (hasVideo) preload("/traag/poster.jpg", { as: "image", fetchPriority: "high" });
  return (
    <main>
      <Hero hasVideo={hasVideo} />

      {/* ------------------------------------------------ next up */}
      <section id="after-hero" className={`${s.next} container glow`} aria-labelledby="next-title">
        <div className={`${s.nextPhoto} card`}>
          <Image
            src={decks}
            alt="Lore at the decks in a dark club, head down over the mixer, one hand on a record, lit by the flash"
            fill
            sizes="(min-width: 440px) 400px, 100vw"
            quality={60}
            className={s.photo}
          />
        </div>
        <div className={s.nextBody}>
          <h2 id="next-title" className={s.sectionTitle}>
            next up
          </h2>
          <NextUp built={todayKey()} />
          <Link href="/dates" className="u-link t-record-label">
            all dates
          </Link>
          <p className={`${s.contact} t-record ghost`}>
            booking — <a href="mailto:book@traag.example">book@traag.example</a>
          </p>
        </div>
      </section>

      {/* ------------------------------------------------ about */}
      <section className={`${s.about} container glow glow-left`} aria-labelledby="about-title">
        <div className={s.aboutText}>
          <h2 id="about-title" className="title-xl">
            about
          </h2>
          <p className="t-body">
            lore verbeke, 22, from ledeberg. she plays between 98 and 112 bpm: old belgian pressings, ebm, italo and
            industrial, all pitched down, next to her own tracks made at that speed. slow is heavier. she worked
            that out playing warm-ups to empty rooms.
          </p>
          <Link href="/biography" className="u-link t-record-label">
            the whole story
          </Link>
        </div>
        <div className={`${s.aboutPhoto} card`}>
          <Image
            src={outside}
            alt="Lore outside a venue at night against a brick wall, cigarette in hand, looking away from the camera"
            fill
            sizes="(min-width: 600px) 560px, 100vw"
            quality={60}
            className={s.photo}
          />
        </div>
      </section>

      {/* ------------------------------------------------ the room */}
      <div className="container">
        <div className={`${s.band} card`}>
          <Image
            src={emptyClub}
            alt="An empty club before doors: bar stools, a mirror ball, the booth and the speaker stacks, one light on"
            fill
            sizes="(min-width: 1344px) 1280px, calc(100vw - 40px)"
            quality={60}
            className={s.photo}
          />
          <p className={`${s.bandCaption} t-record`}>22:00. this is who you play to</p>
        </div>
      </div>

      {/* ------------------------------------------------ music */}
      <section className={`${s.music} container glow`} aria-labelledby="music-title">
        <h2 id="music-title" className="title-xl">
          music
        </h2>
        <ul className={s.listen}>
          {LISTEN.slice(0, 3).map((l, i) => (
            <li key={l.id}>
              <a href={platformHref(l.id)} data-platform={l.id} className={`${s.listenCard} card`}>
                <Image src={CARD_IMAGES[i]} alt="" fill sizes="(min-width: 1024px) 420px, 100vw" className={s.listenImg} />
                <span className={s.listenText}>
                  <span className="t-record">listen on</span>
                  <span className={s.listenName}>{l.label}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
        <div className={s.right}>
          <Link href="/music" className="u-link t-record-label">
            all music
          </Link>
        </div>
      </section>

      {/* ------------------------------------------------ videos */}
      <section className={`${s.videos} container glow glow-left`} aria-labelledby="videos-title">
        <h2 id="videos-title" className="title-xl">
          videos
        </h2>
        <div className={s.videoRow}>
          <VideoCard src="/traag/hero.mp4" poster="/traag/poster.jpg" title="showreel, 2026" ratio="16 / 10" />
          <VideoCard src="/traag/clips/c4-decks.mp4" poster="/traag/clips/c4-decks.jpg" title="at the decks, kelder" ratio="16 / 10" />
          <VideoCard src="/traag/clips/c2-laugh.mp4" poster="/traag/clips/c2-laugh.jpg" title="after the set" ratio="16 / 10" />
        </div>
        <div className={s.right}>
          <Link href="/videos" className="u-link t-record-label">
            all videos
          </Link>
        </div>
      </section>
    </main>
  );
}
