import Link from "next/link";
import { NAV } from "./Header";

export function Footer() {
  return (
    <footer className="grid-page gap-y-40 border-t border-hairline py-64">
      <p className="type-h4 col-span-12 lg:col-span-8">Would a clinic do this?</p>
      <nav aria-label="Footer" className="col-span-12 lg:col-span-4 lg:col-start-9">
        <ul className="grid">
          {[...NAV, { href: "/faq", label: "Questions" }].map((n) => (
            <li key={n.href}>
              <Link href={n.href} className="type-data inline-flex min-h-48 items-center">
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <p className="type-data col-span-12 text-ink-muted lg:col-span-8">Corneum · Boston, Massachusetts · Founded 2021</p>
      <p className="type-data col-span-12 text-ink-muted lg:col-span-4 lg:col-start-9">No payment is taken on this site.</p>
    </footer>
  );
}
