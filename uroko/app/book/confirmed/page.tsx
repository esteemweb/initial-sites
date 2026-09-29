import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { BookingSummary } from "@/components/booking/BookingSummary";
import { BookingSteps } from "@/components/booking/BookingSteps";
import { readBooking } from "@/lib/booking/store";
import { site } from "@/lib/content/site";
import { yen } from "@/lib/format";

export const metadata: Metadata = { title: "Booked", robots: { index: false } };


export default async function ConfirmedPage() {
  const booking = await readBooking();
  if (!booking) redirect("/book");
  if (!booking.deposit) redirect("/book/deposit");

  return (
    <section className="stage">
      <div className="stage-inner grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <BookingSteps current={3} />
          <p lang="ja" className="mt-6 font-display text-5xl leading-none text-accent">
            予約
          </p>
          <h1 className="mt-6 text-3xl">See you at the studio, {booking.name.split(" ")[0]}.</h1>
          <p className="mt-4 max-w-prose text-text-muted">
            Your consultation is held. A confirmation would go to {booking.email} on a real site; here, the summary below is
            your record. Deposit of {yen(booking.deposit.amount)} recorded against card ending {booking.deposit.last4}, nothing
            charged.
          </p>
          <div className="mt-8">
            <BookingSummary booking={booking} />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/book/confirmed/ics"
              className="inline-flex h-12 items-center border border-line px-6 text-sm no-underline hover:border-text"
            >
              Add to calendar
            </a>
            <ButtonLink href="/pieces" variant="secondary">
              See how the tracker works
            </ButtonLink>
          </div>
        </div>

        <aside className="lg:col-span-4 lg:col-start-9">
          <div className="border border-line p-6">
            <p className="eyebrow">Before you come</p>
            <ul className="mt-4 space-y-3 text-sm text-text-muted">
              <li>Bring photo ID. Minimum age 20.</li>
              <li>Eat something first. Wear clothes that give access to the placement.</li>
              <li>Bring reference images if you have them; skip finished designs from other artists.</li>
              <li>Questions: {site.email}</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
