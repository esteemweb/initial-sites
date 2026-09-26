import Link from "next/link";
import ListForm from "./list/ListForm";
import Socials from "./Socials";
import { EXTRA, NAV } from "@/data/nav";
import { platformHref } from "@/data/platforms";
import s from "./sitefooter.module.css";

/** The footer carries the list signup, then nav, socials and the small print. */
export default function SiteFooter() {
  return (
    <footer className={`${s.footer} glow glow-left`}>
      <div className="container">
        <h2 className={s.title}>get on the list</h2>
        <p className={`${s.lede} t-body`}>
          shows 48 hours before they go public, and one presale code a tour. nothing else.
        </p>
        <ListForm mode="join" inline />

        <div className={s.bottom}>
          <nav aria-label="footer">
            <ul className={s.nav}>
              {[...NAV, ...EXTRA].map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="t-record-label">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Socials />
        </div>

        <div className={`${s.small} t-record`}>
          <span>© 2026 traag — ledeberg, ghent</span>
          <a href={platformHref("instagram")} data-platform="instagram" className="ghost u-link">
            instagram is bad on purpose
          </a>
        </div>
      </div>
    </footer>
  );
}
