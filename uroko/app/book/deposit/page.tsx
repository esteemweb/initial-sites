import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DepositForm } from "@/components/booking/DepositForm";
import { BookingSummary } from "@/components/booking/BookingSummary";
import { BookingSteps } from "@/components/booking/BookingSteps";
import { DEPOSIT_JPY, readBooking } from "@/lib/booking/store";
import { yen } from "@/lib/format";

export const metadata: Metadata = { title: "Deposit", robots: { index: false } };


export default async function DepositPage() {
  const booking = await readBooking();
  if (!booking) redirect("/book");
  if (booking.deposit) redirect("/book/confirmed");

  return (
    <section className="stage">
      <div className="stage-inner grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <BookingSteps current={2} />
          <h1 className="mt-3 text-3xl">Hold the date.</h1>
          <p className="mt-4 text-text-muted">
            A {yen(DEPOSIT_JPY)} deposit holds your consultation and first session and comes off the final session.
          </p>
          <div className="mt-8">
            <BookingSummary booking={booking} />
          </div>
          <p className="mt-4 text-sm">
            <Link href="/book">← Change something</Link>
          </p>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <DepositForm amountLabel={yen(DEPOSIT_JPY)} />
        </div>
      </div>
    </section>
  );
}
