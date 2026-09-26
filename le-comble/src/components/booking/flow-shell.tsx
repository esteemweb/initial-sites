import Link from "next/link";
import { COMMON } from "@/content/booking";
import { BOOKING_PATHS, fill } from "@/content/site";
import { href, type L, type Lang, type RouteKey } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { Arrow } from "@/components/ui/button";

/* Frame shared by the three booking paths: title cluster, step indicator,
   and links to the other two paths so a wrong turn is one tap to fix.
   pattern: numbered stepper — REFERENCE-AUTOPSY §9.5 (Mews's five steps),
   cut to three per brief §10. */

export function Steps({ steps, current, lang }: { steps: L[]; current: number; lang: Lang }) {
  return (
    <ol className="flex border-t border-ink" aria-label={fill(COMMON.step[lang], { n: current + 1, total: steps.length })}>
      {steps.map((s, i) => (
        <li
          key={s.fr}
          aria-current={i === current ? "step" : undefined}
          className={cn(
            "type-small font-medium flex-1 border-t-2 pt-12",
            i === current ? "border-ink font-medium" : i < current ? "border-ink" : "border-transparent",
          )}
        >
          <span className="type-label mr-8 text-ink">{String(i + 1).padStart(2, "0")}</span>
          <span className="hidden md:inline">{s[lang]}</span>
          <span className="md:hidden">{i === current ? s[lang] : ""}</span>
        </li>
      ))}
    </ol>
  );
}

export function OtherPaths({ lang, current }: { lang: Lang; current: "table" | "room" | "building" }) {
  const all: { id: "table" | "room" | "building"; key: RouteKey }[] = [
    { id: "table", key: "bookTable" },
    { id: "room", key: "bookRoom" },
    { id: "building", key: "bookBuilding" },
  ];
  return (
    <nav aria-label={COMMON.otherPaths[lang]} className="border-t border-ink pt-16">
      <p className="type-label mb-8 text-ink">{COMMON.otherPaths[lang]}</p>
      <ul>
        {all
          .filter((p) => p.id !== current)
          .map((p) => (
            <li key={p.id}>
              <Link href={href(lang, p.key)} className="type-small font-medium group flex min-h-48 items-center gap-8 no-underline hover:underline">
                {BOOKING_PATHS[p.id].label[lang]}
                <Arrow className="transition-transform duration-(--duration-fast) group-hover:translate-x-4" />
              </Link>
            </li>
          ))}
      </ul>
    </nav>
  );
}
