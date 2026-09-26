/* Copy lives here so it can be edited without touching layout.
   Voice, per autopsy §9: short declarative claims with an operational fact
   attached, one dry aside per section, 6-20 word sentences, second person,
   headings are claims and never questions. Operational detail (hours,
   addresses, altitudes) is body copy, never fine print. */

export const SITE = {
  name: "Leaf & Cherry",
  tagline: "Sri Lanka's second-best-kept secret.",
  colombo: {
    label: "Colombo",
    address: "42 Drum Lane, Colombo 03",
    hours: "Tue–Sun, 7am–5pm",
    note: "Roaster behind glass. Watch it or ignore it.",
  },
  ella: {
    label: "Ella",
    address: "Passara Road, Ella 90090",
    hours: "Daily, 7am–4pm",
    note: "Hill country quiet. No music, no rush.",
  },
  /* Demo contact details (SECURITY-AUDIT.md item 14): invented, so they cannot
     reach a real person. Sri Lanka has no range reserved for fiction, so the
     number is shown as plain text, never as a tel: link — and a Colombo
     subscriber number never starts with 0, so it is not dialable anyway.
     Drum Lane is an invented street. */
  phone: "+94 11 059 4400",
} as const;

export const NAV_ITEMS = [
  { label: "Origins", href: "/#origins" },
  { label: "Colombo", href: "/#houses" },
  { label: "Ella", href: "/#houses" },
  { label: "Subscription", href: "/subscribe" },
  // No page yet: shown as plain text, not a link (SECURITY-AUDIT.md 11).
  { label: "Wholesale", href: null },
  { label: "Visit", href: "/#visit" },
] as const;
