"use client";

import Link from "next/link";
import { useState } from "react";
import { ROOMS } from "@/content/rooms";
import { UI, euros } from "@/content/site";
import { href, type Lang } from "@/lib/i18n";
import { ROOM_TYPES } from "@/lib/model";
import { cn } from "@/lib/cn";
import { Arrow } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";

/* pattern: list-driven image — REFERENCE-AUTOPSY §5.2 (3), as the adjacent
   version of the reference's room-tile triptych (§2.5, signature): a
   weft-ruled list of the four floors, one tall image slot that follows
   hover, focus or tap. Mobile: each row carries its own thumbnail and the
   big slot is hidden (design-system §9). */

export function RoomIndex({ lang, headingLevel = "h3" }: { lang: Lang; headingLevel?: "h2" | "h3" }) {
  const [active, setActive] = useState(0);
  const Heading = headingLevel;

  return (
    <div className="col-span-12 grid grid-cols-12 gap-x-16 lg:gap-x-24">
      <div className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-96 grid">
          {ROOMS.map((room, i) => (
            <div
              key={room.id}
              aria-hidden={i !== active}
              className={cn(
                "col-start-1 row-start-1 transition-opacity duration-(--duration-base) ease-standard",
                i === active ? "opacity-100" : "opacity-0",
              )}
            >
              <Photo id={room.photos[1]} lang={lang} interactive={false} sizes="(min-width: 64rem) 36vw, 1px" />
            </div>
          ))}
        </div>
      </div>

      <ul className="col-span-12 border-t border-ink lg:col-span-6 lg:col-start-7">
        {ROOMS.map((room, i) => {
          const model = ROOM_TYPES.find((r) => r.id === room.id)!;
          return (
            <li key={room.id} className="border-b border-ink">
              <Link
                href={href(lang, "room", { room: room.id })}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="group grid grid-cols-12 gap-x-16 py-24 no-underline"
              >
                <div className="col-span-4 lg:hidden">
                  <Photo id={room.photos[1]} lang={lang} interactive={false} sizes="30vw" />
                </div>
                <div className="col-span-8 flex flex-col gap-8 lg:col-span-12">
                  <p className="type-label text-ink">
                    {room.floor[lang]} · {model.count}
                  </p>
                  <div className="flex items-baseline justify-between gap-16">
                    <Heading data-jelly="word" className="type-md decoration-ink decoration-1 underline-offset-8 group-hover:underline">
                      {room.name}
                    </Heading>
                    <Arrow className="hidden transition-transform duration-(--duration-fast) group-hover:translate-x-4 lg:block" />
                  </div>
                  <p className="text-ink">{room.line[lang]}</p>
                  <p className="type-md tabular-nums">
                    {UI.from[lang]} {euros(model.from, lang)} <span className="type-small">{UI.perNight[lang]}</span>
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
