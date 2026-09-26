import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import FocusOnArrival from "@/components/list/FocusOnArrival";
import { COOKIE, readPending, signLink } from "@/server/listAuth";
import s from "@/components/list/list.module.css";

export const metadata: Metadata = { title: "check your inbox — the list", robots: { index: false } };
export const dynamic = "force-dynamic";

/**
 * The inbox, simulated. Nothing is sent: this page shows the email that
 * would have arrived, with the real, working, single-use link in it.
 */
export default async function CheckPage() {
  const pending = await readPending((await cookies()).get(COOKIE.pending)?.value);

  if (!pending) {
    return (
      <main className="container grid page">
        <div className="main-col">
          <FocusOnArrival className="t-xl">no link waiting</FocusOnArrival>
          <p className={`${s.intro} t-body`}>
            links last fifteen minutes and work once. this one has gone, or was never asked for.
          </p>
          <p className="t-record" style={{ display: "flex", gap: "var(--s4)", flexWrap: "wrap" }}>
            <Link href="/list/sign-in" className="more">
              sign in →
            </Link>
            <Link href="/list" className="more">
              join →
            </Link>
          </p>
        </div>
      </main>
    );
  }

  const token = await signLink({ nonce: pending.nonce, exp: pending.exp });
  const href = `/list/verify?t=${encodeURIComponent(token)}`;
  const joining = pending.purpose === "join";
  const expires = new Date(pending.exp * 1000).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Brussels",
  });

  return (
    <main className="container grid page">
      <div className="main-col">
        <FocusOnArrival className="t-xl">check your inbox</FocusOnArrival>
        <p className={`${s.intro} t-body`}>
          this is a demo, so there is no inbox. below is the email you would have got. the link in it is real.
        </p>

        <article className={`${s.mail} paper`} aria-label="the email">
          <dl className={`${s.mailHead} t-record`}>
            <dt>from</dt>
            <dd>traag &lt;list@traag.example&gt;</dd>
            <dt>to</dt>
            <dd>{pending.email}</dd>
            <dt>subject</dt>
            <dd>{joining ? "the list" : "your link"}</dd>
          </dl>
          <div className="t-body">
            <p>{pending.name},</p>
            <p style={{ marginTop: "var(--s2)" }}>
              {joining
                ? "click this and you're on the list. shows land here 48 hours before they go public, and there's a presale code for each tour. that's all i'll send."
                : "here's your link. click it and you're in."}
            </p>
            <p style={{ marginTop: "var(--s2)" }}>it works once, until {expires}.</p>
            <p style={{ marginTop: "var(--s2)" }}>lore</p>
          </div>
          <a href={href} className={`${s.mailButton} t-record-label`}>
            {joining ? "yes, put me on the list" : "sign me in"}
          </a>
        </article>

        <p className={`${s.demoNote} t-record ghost`}>
          wrong email? <Link href={joining ? "/list" : "/list/sign-in"}>start again</Link>
        </p>
      </div>
    </main>
  );
}
