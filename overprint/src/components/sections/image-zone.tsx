import Image from "next/image";

/* pattern: long image run — refs/flowers-sim §9 items 2–3 (the hero photo keeps
   running behind the 01–04 list). Built as a sticky 100svh backdrop inside a zone
   whose height is set by the text panels, so the image holds for ~3–4 screens
   while the copy scrolls and fades over it. */
export function ImageZone({ children }: { children: React.ReactNode }) {
  return (
    <div className="on-image on-ink relative isolate bg-ink text-paper">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="sticky top-0 h-svh overflow-hidden">
          <Image
            src="/images/hero-street-motion.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="backdrop-zoom object-cover object-center"
          />
          <div className="absolute inset-0 bg-ink/40" />
          <div className="absolute inset-x-0 top-0 h-1/3 bg-linear-to-b from-ink/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-ink/80 to-transparent" />
        </div>
      </div>
      {children}
    </div>
  );
}
