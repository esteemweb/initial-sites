"use client";

import { NavLink } from "./NavLink";
import { useEffect, useId, useState } from "react";

/* Below 1024 the navigation folds into a disclosure under the header. */
export function MobileMenu({ items }: { items: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="link type-data inline-flex min-h-48 cursor-pointer items-center"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Close" : "Menu"}
      </button>
      <nav
        id={id}
        aria-label="Primary"
        hidden={!open}
        className="absolute inset-x-0 top-full z-30 border-b border-hairline bg-paper px-20 pb-24"
      >
        <ul>
          {items.map((n) => (
            <li key={n.href} className="border-b border-hairline">
              <NavLink href={n.href} className="type-h3 flex min-h-48 items-center py-16" onClick={() => setOpen(false)}>
                {n.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
