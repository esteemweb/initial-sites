import { Suspense } from "react";
import { HIRE_FLOW, ROOM_FLOW, TABLE_FLOW } from "@/content/booking";
import type { Lang } from "@/lib/i18n";
import { Section } from "@/components/ui/section";
import { Cluster } from "@/components/ui/cluster";
import { RoomFlow } from "@/components/booking/room-flow";
import { TableFlow } from "@/components/booking/table-flow";
import { HireFlow } from "@/components/booking/hire-flow";

/* The three booking pages. Each is its own URL so a path can be linked to
   and the back button works (design-system §8, amended: routes rather than
   an overlay). */

function Frame({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      {/* pattern: booking path on its own page, same visual language as the site — REFERENCE-AUTOPSY §15 Q2 (fixes the three-vendor split, §9.2) */}
      <Section labelledBy="page-title" className="pb-32 lg:pb-48">
        <Cluster as="h1" size="h1" id="page-title" eyebrow={eyebrow} title={title} warp={false} className="col-span-12" />
      </Section>
      {/* pattern: form column 7 + sticky summary 4 — REFERENCE-AUTOPSY §2.5 (room detail sticky column) */}
      <Section flush className="pb-64 lg:pb-96">
        <div className="col-span-12">
          <Suspense fallback={<p className="text-ink">…</p>}>{children}</Suspense>
        </div>
      </Section>
    </>
  );
}

export function BookTablePage({ lang }: { lang: Lang }) {
  return (
    <Frame eyebrow={TABLE_FLOW.eyebrow[lang]} title={TABLE_FLOW.title[lang]}>
      <TableFlow lang={lang} />
    </Frame>
  );
}

export function BookRoomPage({ lang }: { lang: Lang }) {
  return (
    <Frame eyebrow={ROOM_FLOW.eyebrow[lang]} title={ROOM_FLOW.title[lang]}>
      <RoomFlow lang={lang} />
    </Frame>
  );
}

export function BookBuildingPage({ lang }: { lang: Lang }) {
  return (
    <Frame eyebrow={HIRE_FLOW.eyebrow[lang]} title={HIRE_FLOW.title[lang]}>
      <HireFlow lang={lang} />
    </Frame>
  );
}
