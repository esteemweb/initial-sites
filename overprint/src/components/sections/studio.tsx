import Image from "next/image";
import { PlateText } from "@/components/plate-text";

/* Placeholder people and bios — swap for the real team. Portraits generated with
   Z Image (Higgsfield, cheapest tier) — casual, looking at camera. Without a `portrait` the card falls
   back to a CMYK ink monogram. */
const team: {
  name: string;
  role: string;
  bio: string;
  inks: [string, string];
  portrait?: { src: string; alt: string };
}[] = [
  {
    name: "Aisha Rahman",
    role: "Founder, creative director",
    bio: "Sets the idea and the type for every job. Trained as a compositor before moving to identity work, and still checks every proof by hand.",
    inks: ["bg-cyan", "bg-magenta"],
    portrait: {
      src: "/images/team/aisha-rahman-casual.jpg",
      alt: "Aisha Rahman in a grey knit jumper, sitting on a stool in the studio and smiling at the camera.",
    },
  },
  {
    name: "Tom Whitaker",
    role: "Type & motion",
    bio: "Draws the custom letterforms and makes them move. Looks after anything that has to work on a screen as hard as it does on paper.",
    inks: ["bg-magenta", "bg-yellow"],
    portrait: {
      src: "/images/team/tom-whitaker-casual.jpg",
      alt: "Tom Whitaker in a black t-shirt and open overshirt, leaning back and half-smiling at the camera.",
    },
  },
  {
    name: "Mei Lin Chow",
    role: "Print production",
    bio: "Runs separations, press checks and suppliers. If a colour has to hit the same way on a sleeve, a sign and a website, it goes through her.",
    inks: ["bg-yellow", "bg-cyan"],
    portrait: {
      src: "/images/team/mei-lin-chow-casual.jpg",
      alt: "Mei Lin Chow in a denim work shirt, leaning on a print table and smiling at the camera.",
    },
  },
];

/* pattern: team rows — refs/flowers-sim §9 item 9: headline + mono intro on col 5,
   then one row per person — portrait, name/role on col 3, bio on col 5 —
   separated by hairlines. */
export function Studio() {
  return (
    <section id="studio" aria-labelledby="studio-title" className="pt-section-sm md:pt-section">
      <div className="grid-page gap-y-6">
        {/* studio image — cols 1–4 beside the headline, the left half the reference
            leaves to imagery (refs/flowers-sim §2 split). Reused agy image. */}
        <div className="col-span-4 flex flex-col gap-4">
          <p className="text-micro text-ink-muted uppercase">(The studio)</p>
          <div className="relative aspect-video overflow-hidden bg-ink">
            <Image
              src="/images/studio/workshop-screen-print.jpg"
              alt="A screen printer mid-stroke, pulling a squeegee across a silk screen in the dim studio workshop."
              fill
              sizes="(min-width: 60rem) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className="col-span-4 flex flex-col gap-6">
          <h2 id="studio-title" className="text-head">
            <PlateText className="register-scroll">Small studio, big type</PlateText>
          </h2>
          <p className="text-lede md:w-3/4">
            Three people in Manchester, working directly with every client. No account managers
            between you and the people setting your type.
          </p>
        </div>
      </div>

      <ul className="mt-stack-sm md:mt-stack">
        {team.map((person) => (
          <li key={person.name} className="grid-page">
            <div className="col-span-4 grid grid-cols-subgrid gap-y-4 border-t border-rule py-5 md:col-span-8">
              <div className="relative isolate col-span-1 aspect-4/5 overflow-hidden border border-rule">
                {person.portrait ? (
                  <Image
                    src={person.portrait.src}
                    alt={person.portrait.alt}
                    fill
                    sizes="(min-width: 60rem) 12vw, 25vw"
                    className="object-cover"
                  />
                ) : (
                  <span aria-hidden="true" className="absolute inset-0 grid place-items-center">
                    <span className={`ink absolute top-1/6 left-1/8 aspect-square w-2/3 rounded-full ${person.inks[0]}`} />
                    <span className={`ink absolute right-1/8 bottom-1/6 aspect-square w-2/3 rounded-full ${person.inks[1]}`} />
                  </span>
                )}
              </div>

              <div className="col-span-3 flex flex-col gap-2 md:col-span-2 md:col-start-3">
                <h3 className="text-title">{person.name}</h3>
                <p className="text-micro text-ink-muted">{person.role}</p>
              </div>

              <p className="col-span-4 max-w-xl md:col-start-5">{person.bio}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
