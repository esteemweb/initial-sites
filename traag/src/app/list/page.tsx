import type { Metadata } from "next";
import Link from "next/link";
import ListForm from "@/components/list/ListForm";
import ListStatus from "@/components/list/ListStatus";
import s from "@/components/list/list.module.css";

export const metadata: Metadata = {
  title: "the list",
  description: "shows 48 hours before they go public, and a presale code for each tour. nothing else.",
};

export default function ListPage() {
  return (
    <main className="container grid page">
      <div className="main-col">
        <h1 className="t-xl">the list</h1>
        <div className={`${s.intro} t-body`}>
          <p>
            you get two things. shows, 48 hours before they go public. a presale code for each tour. that&apos;s
            all. no newsletter, no merch, no birthday email.
          </p>
        </div>

        <ListStatus />

        <h2 className="t-md" style={{ marginBottom: "var(--s3)" }}>
          join
        </h2>
        <ListForm mode="join" />

        <p className={`${s.alt} t-record`}>
          already on it? <Link href="/list/sign-in">sign in</Link>
        </p>
      </div>
    </main>
  );
}
