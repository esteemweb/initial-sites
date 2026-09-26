import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import FocusOnArrival from "@/components/list/FocusOnArrival";
import InsideActions from "@/components/list/InsideActions";
import { COOKIE, presaleCode, readSession } from "@/server/listAuth";
import { TOUR, notYetPublic } from "@/server/announcements";
import { ddmmyyyy, longDate } from "@/lib/shows";
import s from "@/components/list/list.module.css";

export const metadata: Metadata = { title: "inside — the list", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/** 09.10 10:00, Brussels time, in the same dotted form as every date on the site. */
function brussels(iso: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Brussels",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(iso));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("day")}.${get("month")} ${get("hour")}:${get("minute")}`;
}

/**
 * The private area. Rendered on the server for each request, after the
 * session is checked here as well as in the proxy. Without a valid
 * session nothing below is rendered or sent.
 */
export default async function InsidePage() {
  const session = await readSession((await cookies()).get(COOKIE.session)?.value);
  if (!session) redirect("/list/sign-in?from=inside");

  const items = notYetPublic();
  const code = await presaleCode(session.email, TOUR.id);
  const opens = brussels(TOUR.presaleOpens);

  return (
    <main className="container grid page">
      <div className="main-col">
        <p className="t-record ghost">the list</p>
        <FocusOnArrival className="t-xl">hi {session.name}</FocusOnArrival>
        <p className={`${s.intro} t-body`}>
          these aren&apos;t public yet. you&apos;re seeing them first. please don&apos;t post them before the date on the
          right, the venues get funny about it.
        </p>

        <section aria-labelledby="soon" style={{ marginBottom: "var(--s7)" }}>
          <div className="section-head">
            <h2 id="soon" className="t-lg">
              not public yet
            </h2>
            <p className="t-record ghost">{items.length ? `${items.length} shows` : "nothing right now"}</p>
          </div>
          {items.length ? (
            <ol className={`${s.rows} t-record`}>
              {items.map((a) => (
                <li key={a.id} className={s.row}>
                  <span className={s.rDate}>
                    <time dateTime={a.date}>
                      <span className="sr-only">{longDate(a.date)}</span>
                      <span aria-hidden="true">{ddmmyyyy(a.date)}</span>
                    </time>
                  </span>
                  <span className={s.rCity}>{a.city}</span>
                  <span className={s.rVenue}>{a.venue}</span>
                  <span className={s.rDoors}>
                    <span className="ghost">doors </span>
                    {a.doors}
                  </span>
                  <span className={s.rPublic}>
                    public{" "}
                    <time dateTime={a.publicAt}>
                      {brussels(a.publicAt)}
                    </time>
                  </span>
                  {a.note && <span className={s.rNote}>{a.note}</span>}
                </li>
              ))}
            </ol>
          ) : (
            <p className="t-body">nothing waiting. when there is, it&apos;s here first.</p>
          )}
        </section>

        <section aria-labelledby="presale" style={{ marginBottom: "var(--s7)" }}>
          <h2 id="presale" className="t-lg" style={{ marginBottom: "var(--s3)" }}>
            presale
          </h2>
          <div className={`${s.presale} paper`}>
            <p className="t-record-label">{TOUR.name}</p>
            <p className={s.code} aria-label={`your code: ${code.split("").join(" ")}`}>
              {code}
            </p>
            <p className="t-record">opens {opens}, brussels time. one code, up to two tickets a show.</p>
            <p className="t-body" style={{ fontWeight: 400 }}>
              the code is yours. it&apos;s tied to your email, so if it turns up on a forum i&apos;ll know. i won&apos;t
              do anything. i&apos;ll just know.
            </p>
          </div>
        </section>

        <InsideActions email={session.email} />
      </div>
    </main>
  );
}
