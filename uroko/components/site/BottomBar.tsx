"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { bottomBar } from "@/lib/content/site";

/** Fixed action bar for phones: the four things an Instagram visitor wants. */
export function BottomBar() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface-raised pb-safe lg:hidden"
    >
      <ul className="grid h-[var(--bottombar-h)] grid-cols-4">
        {bottomBar.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const isBook = item.href === "/book";
          return (
            <li key={item.href} className="flex">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-1 flex-col items-center justify-center gap-0.5 no-underline ${
                  isBook ? "bg-shu text-shu-fg" : active ? "text-text" : "text-text-muted"
                }`}
              >
                <span lang="ja" aria-hidden="true" className="font-display text-base leading-none">
                  {item.ja}
                </span>
                <span className="text-[0.6875rem] font-medium">
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
