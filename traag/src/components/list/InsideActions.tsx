"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import s from "./list.module.css";

/** Sign out, or leave the list for good. Leaving asks once, in place. */
export default function InsideActions({ email }: { email: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const confirmRef = useRef<HTMLParagraphElement>(null);
  const leaveRef = useRef<HTMLButtonElement>(null);
  const wasConfirming = useRef(false);

  useEffect(() => {
    if (confirming) confirmRef.current?.focus();
    else if (wasConfirming.current) leaveRef.current?.focus();
    wasConfirming.current = confirming;
  }, [confirming]);

  const post = async (path: string) => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(path, { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error();
      router.replace(data.next);
      router.refresh();
    } catch {
      setError("that didn't go through. try again");
      setBusy(false);
    }
  };

  return (
    <section aria-labelledby="you" className={s.leave}>
      <h2 id="you" className="t-md">
        you
      </h2>
      <p className="t-record ghost">signed in as {email}</p>

      {!confirming ? (
        <div className={s.leaveButtons}>
          <button type="button" className={`${s.button} ${s.secondary} t-record-label`} onClick={() => post("/api/list/sign-out")} disabled={busy}>
            sign out
          </button>
          <button ref={leaveRef} type="button" className={`${s.textButton} t-record`} onClick={() => setConfirming(true)} disabled={busy}>
            leave the list
          </button>
        </div>
      ) : (
        <div
          className={s.leave}
          role="group"
          aria-labelledby="confirm-leave"
          onKeyDown={(e) => {
            if (e.key === "Escape" && !busy) setConfirming(false);
          }}
        >
          <p id="confirm-leave" ref={confirmRef} tabIndex={-1} className="t-body" style={{ outline: "none" }}>
            take you off? no more early shows, no presale codes. you can join again whenever.
          </p>
          <div className={s.leaveButtons}>
            <button type="button" className={`${s.button} t-record-label`} onClick={() => post("/api/list/leave")} disabled={busy}>
              {busy ? "one second" : "yes, take me off"}
            </button>
            <button type="button" className={`${s.button} ${s.secondary} t-record-label`} onClick={() => setConfirming(false)} disabled={busy}>
              no, stay
            </button>
          </div>
        </div>
      )}
      {error && (
        <p className={`${s.error} t-record`} role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
