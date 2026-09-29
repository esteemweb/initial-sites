"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Side panel for a motif opened from the library (intercepting route).
 * A native <dialog> gives us focus trapping, Escape and the backdrop for
 * free; closing navigates back so the URL returns to the library state.
 */
export function MotifPanel({ children, title }: { children: React.ReactNode; title: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
  }, []);

  const close = () => router.back();

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onClose={close}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      className="panel m-0 ml-auto h-dvh max-h-none w-full max-w-[35rem] bg-surface-raised text-text shadow-panel backdrop:bg-ink/60"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-line px-5 py-3 sm:px-8">
          <p className="text-sm text-text-muted">Motif</p>
          <button
            type="button"
            onClick={close}
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-2xl leading-none"
          >
            <span className="sr-only">Close</span>
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-8 sm:px-8">{children}</div>
      </div>
    </dialog>
  );
}
