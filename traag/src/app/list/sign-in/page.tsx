import type { Metadata } from "next";
import Link from "next/link";
import ListForm from "@/components/list/ListForm";
import s from "@/components/list/list.module.css";

export const metadata: Metadata = { title: "sign in — the list", robots: { index: false } };

const MESSAGES: Record<string, string> = {
  link: "that link didn't work. they last fifteen minutes, work once, and only in the browser that asked for them. ask for a new one.",
  inside: "that part is for people on the list. sign in first.",
};

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ error?: string; from?: string }> }) {
  const q = await searchParams;
  const message = (q.error && MESSAGES[q.error]) || (q.from === "inside" ? MESSAGES.inside : null);
  return (
    <main className="container grid page">
      <div className="main-col">
        <h1 className="t-xl">sign in</h1>
        <p className={`${s.intro} t-body`}>the email you joined with. i&apos;ll send you a link.</p>

        {message && (
          <div className={`${s.notice} t-record`} role="alert">
            <p>{message}</p>
          </div>
        )}

        <ListForm mode="sign-in" />

        <p className={`${s.alt} t-record`}>
          not on it yet? <Link href="/list">join the list</Link>
        </p>
      </div>
    </main>
  );
}
