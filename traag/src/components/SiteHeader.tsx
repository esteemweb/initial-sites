"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Socials from "./Socials";
import { EXTRA, NAV } from "@/data/nav";
import s from "./siteheader.module.css";


const current = (path: string, href: string) => (href === "/" ? path === "/" : path === href || path.startsWith(href + "/"));

/**
 * Fixed top bar: links left, wordmark centred, socials right. Transparent
 * over the photo headers, solid once the page scrolls. Below 1024 the
 * links fold into a menu button that opens a native modal dialog.
 */
export default function SiteHeader() {
  const path = usePathname() ?? "/";
  const dialog = useRef<HTMLDialogElement>(null);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    dialog.current?.close();
  }, [path]);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const onClose = () => document.documentElement.classList.remove(s.locked);
    d.addEventListener("close", onClose);
    return () => d.removeEventListener("close", onClose);
  }, []);

  const open = () => {
    document.documentElement.classList.add(s.locked);
    dialog.current?.showModal();
  };

  return (
    <header className={`${s.header} ${solid ? s.solid : ""}`}>
      <nav className={s.links} aria-label="main">
        <ul>
          {NAV.map((n) => (
            <li key={n.href}>
              <Link href={n.href} className="t-record-label" aria-current={current(path, n.href) ? "page" : undefined}>
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <Link href="/" className={s.mark} aria-label="traag, home">
        traag
      </Link>

      <Socials className={s.socials} />

      <button type="button" className={`${s.menu} t-record-label`} onClick={open} aria-haspopup="dialog">
        menu
      </button>

      <dialog ref={dialog} className={s.sheet} aria-label="menu">
        <div className={s.sheetTop}>
          <span className={s.mark} aria-hidden="true">
            traag
          </span>
          <button type="button" className={`${s.menu} ${s.close} t-record-label`} onClick={() => dialog.current?.close()} autoFocus>
            close
          </button>
        </div>
        <nav aria-label="main">
          <ul className={s.sheetList}>
            {[...NAV, ...EXTRA].map((n) => (
              <li key={n.href}>
                <Link href={n.href} aria-current={current(path, n.href) ? "page" : undefined}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Socials />
      </dialog>
    </header>
  );
}
