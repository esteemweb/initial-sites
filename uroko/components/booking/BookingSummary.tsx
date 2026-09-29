import Link from "next/link";
import type { Booking } from "@/lib/booking/store";
import { formatSlot } from "@/lib/booking/slots";
import { sizes } from "@/lib/booking/validate";
import { getArtist } from "@/lib/content/artists";
import { getMotif } from "@/lib/content/motifs";
import { site } from "@/lib/content/site";

export function BookingSummary({ booking }: { booking: Booking }) {
  const artist = booking.artist ? getArtist(booking.artist) : undefined;
  const motif = booking.motif ? getMotif(booking.motif) : undefined;
  const size = sizes.find((s) => s.id === booking.size);
  const method = { any: "Either", tebori: "Tebori", machine: "Machine" }[booking.method];

  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-y border-line py-6 text-sm">
      <div className="col-span-2">
        <dt className="eyebrow">Consultation</dt>
        <dd className="mt-1 text-xl">{formatSlot(booking.slot)}</dd>
        <dd className="text-text-muted">Uroko, {site.address.lines[0]}. Japan time.</dd>
      </div>
      <div>
        <dt className="eyebrow">Reference</dt>
        <dd className="mt-1 font-mono text-lg">{booking.ref}</dd>
      </div>
      <div>
        <dt className="eyebrow">Name</dt>
        <dd className="mt-1 text-lg">{booking.name}</dd>
      </div>
      <div>
        <dt className="eyebrow">Artist</dt>
        <dd className="mt-1 text-lg">{artist ? <Link href={`/artists/${artist.slug}`}>{artist.name}</Link> : "Any"}</dd>
      </div>
      <div>
        <dt className="eyebrow">Motif</dt>
        <dd className="mt-1 text-lg">
          {motif ? (
            <Link href={`/motifs/${motif.slug}`}>
              {motif.name}{" "}
              <span lang="ja" className="font-display text-text-muted">
                {motif.ja}
              </span>
            </Link>
          ) : (
            "Not decided"
          )}
        </dd>
      </div>
      <div>
        <dt className="eyebrow">Placement · size</dt>
        <dd className="mt-1 text-lg">
          {booking.placement} · {size?.label}
        </dd>
      </div>
      <div>
        <dt className="eyebrow">Method</dt>
        <dd className="mt-1 text-lg">{method}</dd>
      </div>
      {booking.message ? (
        <div className="col-span-2">
          <dt className="eyebrow">Notes</dt>
          <dd className="mt-1 max-w-prose text-text-muted">{booking.message}</dd>
        </div>
      ) : null}
    </dl>
  );
}
