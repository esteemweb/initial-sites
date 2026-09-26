import type { StaticImageData } from "next/image";
import whitelabel from "@/photos/work-01-whitelabel.png";
import fader from "@/photos/work-02-fader.png";
import type { PlatformId } from "./platforms";

export type Track = { pos: string; title: string; bpm: number; length: string };

export type Link = { label: string; platform: PlatformId };

export type Release = {
  slug: string;
  title: string;
  cat: string;
  year: number;
  released: string; // YYYY-MM-DD
  format: string;
  pressing: number;
  soldOut: boolean;
  line: string;
  tracks: Track[];
  links: Link[];
  image: StaticImageData;
  alt: string;
};

/**
 * Two EPs, newest first. Links open the platform previews, since the real
 * accounts do not exist yet.
 */
export const releases: Release[] = [
  {
    slug: "nul",
    title: "nul",
    cat: "TRAAG 002",
    year: 2026,
    released: "2026-04-03",
    format: '12" vinyl, 33⅓ rpm, black',
    pressing: 500,
    soldOut: false,
    line: "nul is out. six tracks. the last one is nine minutes, sorry",
    tracks: [
      { pos: "A1", title: "nul", bpm: 100, length: "5:54" },
      { pos: "A2", title: "kick, opnieuw", bpm: 104, length: "6:20" },
      { pos: "A3", title: "twaalf mensen", bpm: 98, length: "4:58" },
      { pos: "B1", title: "45 op 33", bpm: 108, length: "6:41" },
      { pos: "B2", title: "de ring", bpm: 112, length: "5:36" },
      { pos: "B3", title: "tot het stopt", bpm: 102, length: "9:04" },
    ],
    links: [
      { label: "vinyl — bandcamp", platform: "bandcamp" },
      { label: "digital — bandcamp", platform: "bandcamp" },
      { label: "stream — spotify", platform: "spotify" },
    ],
    image: whitelabel,
    alt: "A white-label record on a turntable, the label marked by hand with an asterisk and a single line",
  },
  {
    slug: "vertraging",
    title: "vertraging",
    cat: "TRAAG 001",
    year: 2025,
    released: "2025-03-14",
    format: '12" vinyl, 33⅓ rpm, black',
    pressing: 300,
    soldOut: true,
    line: "made in my kot with one working monitor. three hundred copies. they went, which i did not expect",
    tracks: [
      { pos: "A1", title: "ledeberg", bpm: 99, length: "6:12" },
      { pos: "A2", title: "rondweg", bpm: 104, length: "5:48" },
      { pos: "B1", title: "trage val", bpm: 98, length: "7:05" },
      { pos: "B2", title: "warm-up", bpm: 106, length: "6:31" },
    ],
    links: [
      { label: "digital — bandcamp", platform: "bandcamp" },
      { label: "stream — apple music", platform: "apple" },
      { label: "second hand, if you must — discogs", platform: "discogs" },
    ],
    image: fader,
    alt: "Two hands on a turntable: one flat on a white-label record, the other on the pitch fader",
  },
];

export function totalLength(tracks: Track[]) {
  const s = tracks.reduce((acc, t) => {
    const [m, sec] = t.length.split(":").map(Number);
    return acc + m * 60 + sec;
  }, 0);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
