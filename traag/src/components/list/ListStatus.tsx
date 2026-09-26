"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import s from "./list.module.css";

type State = { signedIn: boolean; member: boolean; name: string | null };

/**
 * The public list page is static, so what it says about you is fetched
 * after it loads: signed in, on the list but signed out, or just left.
 */
export default function ListStatus() {
  const [state, setState] = useState<State | null>(null);
  const [flash, setFlash] = useState<"left" | "out" | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get("left")) setFlash("left");
    else if (q.get("out")) setFlash("out");
    fetch("/api/list/session", { cache: "no-store" })
      .then((r) => r.json())
      .then(setState)
      .catch(() => setState(null));
  }, []);

  useEffect(() => {
    if (flash) ref.current?.focus();
  }, [flash]);

  if (flash === "left") {
    return (
      <div ref={ref} tabIndex={-1} className={`${s.notice} t-record`} role="status">
        <p>you&apos;re off the list. nothing else will come from me. if you change your mind, it&apos;s below.</p>
      </div>
    );
  }
  if (state?.signedIn) {
    return (
      <div className={`${s.notice} t-record`} role="status">
        <p>you&apos;re on the list and signed in{state.name ? ` as ${state.name}` : ""}.</p>
        <Link href="/list/inside">go inside →</Link>
      </div>
    );
  }
  if (flash === "out" || state?.member) {
    return (
      <div ref={ref} tabIndex={-1} className={`${s.notice} t-record`} role="status">
        <p>{flash === "out" ? "signed out. you're still on the list." : `you're on the list${state?.name ? `, ${state.name}` : ""}.`}</p>
        <Link href="/list/sign-in">sign in →</Link>
      </div>
    );
  }
  return null;
}
