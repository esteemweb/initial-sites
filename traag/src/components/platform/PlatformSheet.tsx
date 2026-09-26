"use client";

import { useEffect, useRef, useState } from "react";
import { PLATFORMS, type PlatformId } from "@/data/platforms";
import PlatformContent from "./PlatformContent";
import s from "./sheet.module.css";

/**
 * One panel for every platform link on the site. Links carry
 * data-platform and a real href to /platforms/[id], so without script
 * they still go somewhere. With script, a click opens this native modal
 * dialog instead: focus is trapped, Escape closes it, and focus returns to
 * the link that opened it.
 */
export default function PlatformSheet() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [id, setId] = useState<PlatformId | null>(null);
  const [told, setTold] = useState(false);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.("a[data-platform]") as HTMLAnchorElement | null;
      if (!a) return;
      const pid = a.dataset.platform as PlatformId;
      if (!PLATFORMS[pid]) return;
      e.preventDefault();
      setId(pid);
      setTold(false);
      document.documentElement.classList.add(s.locked);
      dialog.current?.showModal();
      // jump to a specific mix if the link asked for one
      const target = a.dataset.target;
      if (target) requestAnimationFrame(() => document.getElementById(target)?.scrollIntoView({ block: "center" }));
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const onClose = () => {
      document.documentElement.classList.remove(s.locked);
      d.querySelectorAll("video").forEach((v) => v.pause());
    };
    d.addEventListener("close", onClose);
    return () => d.removeEventListener("close", onClose);
  }, []);

  // the demo shop: pressing a buy button says so, in place
  const onBuy = (e: React.MouseEvent) => {
    const b = (e.target as Element).closest("[data-demo-buy]");
    if (b) setTold(true);
  };

  const p = id ? PLATFORMS[id] : null;

  return (
    <dialog
      ref={dialog}
      className={s.sheet}
      aria-labelledby="platform-title"
      onClick={(e) => {
        if (e.target === dialog.current) dialog.current?.close(); // backdrop
        onBuy(e);
      }}
    >
      {p && (
        <div className={s.inner}>
          <header className={s.head}>
            <div>
              <p className="t-record ghost">traag on</p>
              <h2 id="platform-title" className={s.title}>
                {p.name}
              </h2>
            </div>
            <button type="button" className={`${s.close} t-record-label`} onClick={() => dialog.current?.close()} autoFocus>
              close
            </button>
          </header>
          <PlatformContent id={p.id} />
          {told && (
            <p className={`${s.told} t-record`} role="status">
              nothing is sold here. this is a demo shop. the real one opens when the account does.
            </p>
          )}
        </div>
      )}
    </dialog>
  );
}
