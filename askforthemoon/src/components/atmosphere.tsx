import { atmosphere } from "@/lib/content";
import { Pace } from "./pace-text";

/* One screen that does nothing but speak: the room where someone has decided
   not to talk. No label, no log line — nothing else on it. */
export function Atmosphere() {
  return (
    <section className="section on-night atmosphere" data-at="0" aria-label="A room where someone has decided not to talk">
      <p className="pace say-xl">
        <Pace text={atmosphere} />
      </p>
    </section>
  );
}
