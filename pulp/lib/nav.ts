/**
 * Every navigable destination, in one place, so the header, the mobile overlay
 * and the footer cannot drift apart.
 *
 * Most of these routes do not exist yet. They are listed at their final paths
 * so the chrome is wired correctly from the start and each page slots in
 * without the links being revisited.
 */

export interface NavLink {
  href: string;
  label: string;
}

/** The header nav and the mobile overlay. No search, no account. */
export const PRIMARY_NAV: NavLink[] = [
  { href: "/shop", label: "Shop" },
  { href: "/the-label", label: "The Label" },
  { href: "/size-guide", label: "Size Guide" },
];

export interface NavGroup {
  heading: string;
  links: NavLink[];
}

/** The footer, grouped. Headings are Space Mono label, the links are text links. */
export const FOOTER_NAV: NavGroup[] = [
  {
    heading: "Buy",
    links: [
      { href: "/shop", label: "Shop" },
      { href: "/size-guide", label: "Size guide" },
    ],
  },
  {
    heading: "Read",
    links: [{ href: "/the-label", label: "The Label" }],
  },
  {
    heading: "Small print",
    links: [
      { href: "/delivery-returns", label: "Delivery and returns" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];
