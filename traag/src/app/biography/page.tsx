import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import blur from "@/photos/room-02-crowd-blur.png";
import threeQuarter from "@/photos/her-05-three-quarter.png";
import s from "./biography.module.css";

export const metadata: Metadata = {
  title: "biography",
  description: "lore verbeke, 22, ledeberg. she plays slow.",
};

export default function BiographyPage() {
  return (
    <main>
      <PageHero
        title="biography"
        image={blur}
        alt="A packed floor, arms up, blurred with movement under one red light"
        position="50% 40%"
      />

      <section className={`${s.body} container glow`}>
        <div className={`${s.photo} card`}>
          <Image
            src={threeQuarter}
            alt="Lore turned three-quarters to the camera against a concrete wall, lit by direct flash"
            fill
            sizes="(min-width: 1024px) 520px, 100vw"
            className={s.img}
          />
        </div>

        <div className={`${s.text} t-body`}>
          <p>
            i&apos;m lore. i&apos;m 22. i grew up in ledeberg, which is ghent if you ask the post office and not ghent
            if you ask anyone from ghent.
          </p>
          <p>
            i started at seventeen on a friend&apos;s cdjs in his kitchen. at eighteen i got my first bookings, all
            warm-up. ten to midnight, empty room, bar staff counting the float, twelve people who came for someone
            else. so i played slow. there is no point playing fast to twelve people. a room that empty doesn&apos;t
            need pushing. it needs something to lean on.
          </p>
          <p>
            i kept doing it. old belgian pressings, ebm, italo, industrial, all pitched down, and my own tracks,
            made in my kot at that speed from the start. somewhere between 98 and 112. slow is heavier. the kick has
            time to land, and a room moving at that speed leans instead of jumping.
          </p>
          <p>
            someone told me this is new beat. i looked it up. they were right. i still don&apos;t call it that.
          </p>
          <p>
            by the time someone offered me peak time i had worked out i didn&apos;t want one. i did two years of sound
            engineering and left. i post forty-minute videos of myself rebuilding a kick drum and people watch them,
            which i don&apos;t fully understand.
          </p>
          <p>
            two eps is not a career and i&apos;m not going to pretend it is. vertraging came out in 2025, three hundred
            copies, gone. nul came out this year. i still play the warm-up when they let me.
          </p>
        </div>
      </section>
    </main>
  );
}
