"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

/* A navigation link that knows where you are: the current section (the
   page itself or anything under it, so Range stays marked on
   /range/barrier) gets aria-current and a 1px ink underline. */
export function isCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLink({ href, className = "", ...rest }: ComponentProps<typeof Link> & { href: string }) {
  const current = isCurrent(usePathname() ?? "", href);
  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className={`${className} ${current ? "underline decoration-1 underline-offset-4" : ""}`}
      {...rest}
    />
  );
}
