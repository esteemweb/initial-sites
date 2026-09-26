/** Main navigation, shared by the header (client) and the footer (server). */
export const NAV = [
  { href: "/", label: "home" },
  { href: "/biography", label: "bio" },
  { href: "/music", label: "music" },
  { href: "/videos", label: "video" },
  { href: "/booking", label: "booking" },
] as const;

/** Extra routes that sit outside the main five. */
export const EXTRA = [
  { href: "/dates", label: "dates" },
  { href: "/list", label: "the list" },
] as const;
