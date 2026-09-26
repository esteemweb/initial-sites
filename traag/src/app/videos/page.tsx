import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import Socials from "@/components/Socials";
import VideoCard from "@/components/VideoCard";
import pa from "@/photos/room-04-pa.png";
import underpass from "@/photos/city-02-underpass.png";
import s from "./videos.module.css";

export const metadata: Metadata = {
  title: "video",
  description: "the showreel, and short clips from the decks.",
};

const VIDEOS = [
  { title: "showreel, 2026", src: "/traag/hero.mp4", poster: "/traag/poster.jpg" },
  { title: "at the decks, kelder", src: "/traag/clips/c4-decks.mp4", poster: "/traag/clips/c4-decks.jpg" },
  { title: "profile, flash test", src: "/traag/clips/c3-profile.mp4", poster: "/traag/clips/c3-profile.jpg" },
  { title: "after the set", src: "/traag/clips/c5-up.mp4", poster: "/traag/clips/c5-up.jpg" },
];

export default function VideosPage() {
  return (
    <main>
      <PageHero title="video" image={pa} alt="A stacked black PA in a dark room, chipped paint, lit by flash" position="50% 35%" />

      <div className="container">
        {VIDEOS.map((v, i) => (
          <section key={v.src} className={s.item} aria-labelledby={`video-${i}`}>
            <h2 id={`video-${i}`} className={s.title}>
              {v.title}
            </h2>
            <VideoCard src={v.src} poster={v.poster} title={v.title} ratio="3 / 2" />
          </section>
        ))}

        <section className={`${s.more} card`} aria-labelledby="more-videos">
          <Image src={underpass} alt="" fill sizes="(min-width: 1344px) 1280px, 100vw" className={s.moreImg} />
          <div className={s.moreBody}>
            <h2 id="more-videos" className={s.moreTitle}>
              more on instagram and youtube
            </h2>
            <p className="t-body">
              forty-minute videos of me rebuilding a kick drum. people watch them. i don&apos;t fully understand why.
            </p>
            <Socials />
          </div>
        </section>
      </div>
    </main>
  );
}
