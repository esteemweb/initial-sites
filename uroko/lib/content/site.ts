// Studio facts used across the site. Uroko is a fictional studio built as a
// portfolio demo; every name, address and number here is invented.

export const site = {
  name: "Uroko",
  kanji: "鱗",
  reading: "uroko, meaning scales",
  tagline: "Traditional Japanese tattooing in Motomachi, Yokohama",
  description:
    "Uroko is a Japanese tattoo studio in Motomachi, Yokohama, working in traditional irezumi by hand (tebori) and by machine. Motif library, resident artists, consultation booking and aftercare.",
  // Share previews, the sitemap and search data need the real deployed address.
  // Vercel sets VERCEL_PROJECT_PRODUCTION_URL (host only) on every build; locally
  // it falls back to the reserved, never-real uroko.example.
  url: process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://uroko.example",
  founded: 2011,
  address: {
    // Fictional on purpose: Motomachi only runs to 5-chōme, so 9-99 can never be a real door.
    lines: ["2F, 9-99 Motomachi", "Naka-ku, Yokohama 231-0861"],
    ja: "横浜市中区元町9-99 2F",
    mapsLabel: "Motomachi shopping street, five minutes from Motomachi-Chūkagai station",
  },
  hours: [
    { days: "Tue – Sat", time: "12:00 – 20:00" },
    { days: "Sun", time: "12:00 – 18:00" },
    { days: "Mon", time: "Closed" },
  ],
  // The same hours as data (0 = Sunday), in Japan time, for the live "open now" line.
  openingHours: {
    0: ["12:00", "18:00"],
    2: ["12:00", "20:00"],
    3: ["12:00", "20:00"],
    4: ["12:00", "20:00"],
    5: ["12:00", "20:00"],
    6: ["12:00", "20:00"],
  } as Record<number, [string, string]>,
  phone: "+81 45 000 0000",
  email: "hello@uroko.example",
  // The area, not the (fictional) address
  mapsUrl: "https://maps.google.com/?q=Motomachi+Yokohama",
  instagramHandle: "@uroko.demo",
  audio: {
    // Ambient loop added in phase 5. Sound is always off until toggled.
    src: "/audio/studio-ambience.mp3",
    label: "Studio ambience",
  },
} as const;

export const nav = [
  { href: "/motifs", label: "Motifs", ja: "図柄" },
  { href: "/artists", label: "Artists", ja: "彫師" },
  { href: "/studio", label: "Studio", ja: "工房" },
  { href: "/aftercare", label: "Aftercare", ja: "養生" },
  { href: "/pieces", label: "Tracker", ja: "経過" },
  { href: "/book", label: "Book", ja: "予約" },
] as const;

export const bottomBar = [
  { href: "/book", label: "Book", ja: "予約" },
  { href: "/motifs", label: "Motifs", ja: "図柄" },
  { href: "/artists", label: "Artists", ja: "彫師" },
  { href: "/aftercare", label: "Aftercare", ja: "養生" },
] as const;
