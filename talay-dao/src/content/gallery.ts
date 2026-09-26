import type { GalleryItem } from "@/components/RadialCarousel";

/* The gallery set, shared by the homepage carousel and /gallery.

   Extracted here the moment it was needed in two places — a list with two
   homes drifts, and the carousel's `layoutId` keys are derived from these
   ids, so a mismatch between pages would silently break the morph. */

export const GALLERY: GalleryItem[] = [
  { id: "doorway", url: "/images/gallery/carved-doorway.jpg", title: "Carved doorway" },
  { id: "basin", url: "/images/gallery/stone-basin.jpg", title: "Stone basin" },
  { id: "breakfast", url: "/images/gallery/breakfast-table.jpg", title: "Breakfast, late" },
  { id: "path", url: "/images/gallery/planting-path.jpg", title: "Path to the water" },
  { id: "lantern", url: "/images/gallery/hanging-lantern.jpg", title: "Lantern at dusk" },
  { id: "daybed", url: "/images/gallery/daybed-linen.jpg", title: "Daybed" },
  { id: "longtail", url: "/images/gallery/longtail-hull.jpg", title: "Longtail hull" },
  { id: "rain", url: "/images/gallery/rain-terrace.jpg", title: "Rain on the terrace" },
  { id: "shower", url: "/images/gallery/outdoor-shower.jpg", title: "Outdoor shower" },
  { id: "stars", url: "/images/gallery/night-sky-deck.jpg", title: "Night sky" },
];
