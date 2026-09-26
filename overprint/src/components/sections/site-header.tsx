import { ProjectDialog } from "@/components/project-dialog";

const navItems = [
  { href: "#work", label: "Work" },
  { href: "#process", label: "Process" },
  { href: "#studio", label: "Studio" },
  { href: "#contact", label: "Contact" },
];

/* pattern: header — refs/flowers-sim §9 (logo · stacked nav on col 5 · tile top-right).
   Overlays the full-bleed hero image at all widths (paper text, paper focus ring);
   not fixed (no overlay at 200% zoom), 44px targets. The top-right tile opens the
   project-enquiry dialog (components/project-dialog.tsx). */
export function SiteHeader() {
  return (
    <header className="on-ink grid-page absolute inset-x-0 top-0 z-10 items-start pt-edge text-paper">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-edge focus:left-edge focus:bg-ink focus:px-4 focus:py-3 focus:text-paper on-ink"
      >
        Skip to content
      </a>

      {/* logo — "Overprint" in Tangerine outlines, three misregistered plates
          (cyan → magenta → yellow), the three brand colours only */}
      <a href="/" className="col-span-2 flex min-h-target items-center self-start">
        {/* eslint-disable-next-line @next/next/no-img-element -- static vector logo */}
        <img src="/logo/overprint-logo.svg" alt="Overprint" className="h-14 w-auto md:h-16" />
      </a>

      <nav aria-label="Primary" className="col-span-2 md:col-start-5">
        <ul>
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="flex min-h-target items-center underline-offset-4 hover:underline focus-visible:underline"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <ProjectDialog />
    </header>
  );
}
