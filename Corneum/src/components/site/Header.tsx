import Link from "next/link";
import { BagLink } from "./BagLink";
import { MobileMenu } from "./MobileMenu";
import { NavLink } from "./NavLink";

export const NAV = [
  { href: "/range", label: "Range" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/science", label: "Science" },
  { href: "/conditions", label: "Conditions" },
  { href: "/founder", label: "Founder" },
];

/* Wordmark at col 1, navigation from col 5 (col 3 at 1024, where five
   items don't fit four columns), the bag in the right rail at
   col 9 (commerce lives with the facts). Not sticky: on mobile the buy
   path is carried by the persistent BuyBar instead. */
export function Header() {
  return (
    <header className="grid-page relative items-center border-b border-hairline">
      <Link href="/" className="type-data col-span-6 inline-flex min-h-48 items-center lg:col-span-2 xl:col-span-4">
        Corneum
      </Link>
      <nav aria-label="Primary" className="hidden lg:col-span-6 lg:col-start-3 lg:flex lg:gap-16 xl:col-span-4 xl:col-start-5">
        {NAV.map((n) => (
          <NavLink key={n.href} href={n.href} className="type-data inline-flex min-h-48 items-center">
            {n.label}
          </NavLink>
        ))}
      </nav>
      <div className="col-span-6 col-start-7 flex items-center justify-end gap-24 lg:col-span-4 lg:col-start-9 lg:justify-start">
        <MobileMenu items={NAV} />
        <BagLink />
      </div>
    </header>
  );
}
