/**
 * The platforms TRAAG would be on. None of these accounts exist: every
 * link opens a preview of what would be there, in the site's own design,
 * labelled as a demo. Handles are the ones she would register.
 */
export type PlatformId = "bandcamp" | "spotify" | "apple" | "soundcloud" | "youtube" | "instagram" | "discogs";

export type Platform = {
  id: PlatformId;
  name: string;
  handle: string;
  /** one line on what is there, in her voice */
  line: string;
};

export const PLATFORMS: Record<PlatformId, Platform> = {
  bandcamp: {
    id: "bandcamp",
    name: "bandcamp",
    handle: "traag.bandcamp",
    line: "both records. vinyl while it lasts, digital forever. most of the money gets to me here.",
  },
  spotify: {
    id: "spotify",
    name: "spotify",
    handle: "traag",
    line: "ten tracks across two eps. the long one is at the end, as it should be.",
  },
  apple: {
    id: "apple",
    name: "apple music",
    handle: "traag",
    line: "same ten tracks. same order.",
  },
  soundcloud: {
    id: "soundcloud",
    name: "soundcloud",
    handle: "traag-gent",
    line: "full sets, recorded off the desk. the warm-ups are the good ones.",
  },
  youtube: {
    id: "youtube",
    name: "youtube",
    handle: "@traag",
    line: "the showreel, clips from the booth, and the forty-minute kick drum videos.",
  },
  instagram: {
    id: "instagram",
    name: "instagram",
    handle: "@traag.gent",
    line: "deliberately bad. flash on, no filter, posted late.",
  },
  discogs: {
    id: "discogs",
    name: "discogs",
    handle: "traag",
    line: "vertraging sold out. these are other people's copies. i don't see a cent, which is fine.",
  },
};

export const platformHref = (id: PlatformId) => `/platforms/${id}`;

/** Prices for the bandcamp preview. */
export const PRICES: Record<string, { vinyl?: string; digital: string }> = {
  nul: { vinyl: "€24", digital: "€8" },
  vertraging: { digital: "€7" },
};

/** Mixes for the soundcloud preview and the music page. */
export const MIXES = [
  { id: "kelder-warm-up", title: "warm-up, kelder", date: "2026-04-04", length: "2:10:00", note: "ten to midnight. twelve people, then four hundred." },
  { id: "werk9-closing", title: "werk 9, closing", date: "2026-05-22", length: "3:02:00", note: "the last hour is 98 bpm. nobody left." },
  { id: "kitchen-07", title: "kitchen tape 07", date: "2026-08-14", length: "58:40", note: "recorded where it started. same kitchen, better speakers." },
];

/** Second-hand listings for the discogs preview. */
export const LISTINGS = [
  { condition: "near mint, sleeve very good", from: "ghent, be", price: "€38" },
  { condition: "very good plus, small seam split", from: "rotterdam, nl", price: "€32" },
  { condition: "mint, still sealed", from: "berlin, de", price: "€55" },
];
