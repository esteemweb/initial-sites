import type { PlatformId } from "./platforms";

/** Where the records live. Each opens its platform preview. */
export const LISTEN: { id: PlatformId; label: string }[] = [
  { id: "bandcamp", label: "bandcamp" },
  { id: "spotify", label: "spotify" },
  { id: "soundcloud", label: "soundcloud" },
  { id: "apple", label: "apple music" },
];
