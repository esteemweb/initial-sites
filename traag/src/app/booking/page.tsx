import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import korenmarkt from "@/photos/city-01-korenmarkt.png";
import BookingForm from "./BookingForm";
import s from "./bookingpage.module.css";

export const metadata: Metadata = {
  title: "booking",
  description: "book traag. 98 to 112 bpm, warm-up to close.",
};

const CONTACTS = [
  { area: "benelux", email: "book@traag.example" },
  { area: "rest of europe", email: "europe@traag.example" },
  { area: "press and promos", email: "press@traag.example" },
  { area: "everything else", email: "hallo@traag.example" },
];

export default function BookingPage() {
  return (
    <main>
      <PageHero
        title="booking"
        image={korenmarkt}
        alt="Korenmarkt tram stop in Ghent at night, rain on the platform and tram rails"
        position="50% 60%"
      />

      <div className={`${s.wrap} container glow`}>
        <p className={`${s.stance} t-body`}>
          warm-up, closing, all night: yes. peak time at 130: no. a mainstage at three in the afternoon: also no.
        </p>

        <ul className={s.contacts}>
          {CONTACTS.map((c) => (
            <li key={c.area} className={`${s.contact} card`}>
              <span className="t-record-label ghost">{c.area}</span>
              <a href={`mailto:${c.email}`} className={s.email}>
                {c.email}
              </a>
            </li>
          ))}
        </ul>

        <section className={`${s.formCard} card`} aria-labelledby="form-title">
          <h2 id="form-title" className={s.formTitle}>
            or send the details
          </h2>
          <BookingForm />
        </section>
      </div>
    </main>
  );
}
