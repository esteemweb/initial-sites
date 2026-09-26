import type { L } from "@/lib/i18n";
import type { RoomTypeId } from "@/lib/model";
import type { PhotoKey } from "./images";

/* Rooms named for what the floors were — brief §7.
   pattern: room types as worlds, not grades — REFERENCE-AUTOPSY §15 Q3. */

export type RoomCopy = {
  id: RoomTypeId;
  name: string; // proper noun, same in both languages
  floor: L;
  line: L; // one line for lists
  body: L[]; // paragraphs for the detail page
  facts: { label: L; value: L }[];
  photos: [PhotoKey, PhotoKey]; // [window 1:2, tall 2:3] — the portrait pair
};

export const ROOMS: RoomCopy[] = [
  {
    id: "mansarde",
    name: "Mansarde",
    floor: { fr: "4e étage, sous le toit", en: "Fourth floor, under the roof" },
    line: {
      fr: "Sous les combles. Plus petite, poutres et plafond en pente. La moins chère, et celle qu'on préfère.",
      en: "Under the roof. Smaller, beamed, sloping ceilings. The cheapest, and the one we like best.",
    },
    body: [
      {
        fr: "Le dernier étage n'a jamais servi aux métiers : c'est là que dormaient les apprentis. Les plafonds descendent en pente, les poutres sont celles de 1831, et chaque chambre a une lucarne sur les toits de la Croix-Rousse.",
        en: "The top floor never held looms. It is where the apprentices slept. The ceilings slope, the beams are the 1831 ones, and every room has a dormer window over the Croix-Rousse rooftops.",
      },
      {
        fr: "Si vous mesurez plus d'un mètre quatre-vingt-dix, prenez garde côté fenêtre. Nous l'écrivons ici pour ne pas avoir à le dire à l'arrivée.",
        en: "If you are over one metre ninety, mind your head on the window side. We say it here so we don't have to say it on arrival.",
      },
    ],
    facts: [
      { label: { fr: "Chambres", en: "Rooms" }, value: { fr: "7", en: "7" } },
      { label: { fr: "Surface", en: "Size" }, value: { fr: "18 à 22 m²", en: "18 to 22 m²" } },
      { label: { fr: "Hauteur", en: "Ceiling" }, value: { fr: "1,60 à 3,10 m", en: "1.60 to 3.10 m" } },
      { label: { fr: "Lit", en: "Bed" }, value: { fr: "160 × 200", en: "160 × 200" } },
      { label: { fr: "Salle d'eau", en: "Bathroom" }, value: { fr: "Douche", en: "Shower" } },
    ],
    photos: ["roomMansardeWindow", "roomMansarde"],
  },
  {
    id: "trame",
    name: "Trame",
    floor: { fr: "2e et 3e étages", en: "Second and third floors" },
    line: {
      fr: "Les étages du milieu. Quatre mètres sous plafond, hautes fenêtres à volets, la plupart sur les toits.",
      en: "The middle floors. Four-metre ceilings, tall shuttered windows, most of them over the rooftops.",
    },
    body: [
      {
        fr: "La trame, c'est le fil qu'on passe à travers la chaîne. Ces deux étages étaient pleins de métiers Jacquard, et un Jacquard mesure près de quatre mètres. D'où les plafonds. D'où les fenêtres de presque deux mètres : il fallait voir le motif.",
        en: "The weft is the thread passed through the warp. These two floors were full of Jacquard looms, and a Jacquard stands nearly four metres tall. Hence the ceilings. Hence the windows of almost two metres: the weavers needed to see the pattern.",
      },
      {
        fr: "Six des neuf chambres donnent sur les toits et la ville en contrebas. Les trois autres donnent sur la cour : plus calmes, même hauteur.",
        en: "Six of the nine rooms look over the rooftops and the city below. The other three face the courtyard: quieter, same height.",
      },
    ],
    facts: [
      { label: { fr: "Chambres", en: "Rooms" }, value: { fr: "9", en: "9" } },
      { label: { fr: "Surface", en: "Size" }, value: { fr: "26 à 30 m²", en: "26 to 30 m²" } },
      { label: { fr: "Hauteur", en: "Ceiling" }, value: { fr: "4 m", en: "4 m" } },
      { label: { fr: "Lit", en: "Bed" }, value: { fr: "180 × 200", en: "180 × 200" } },
      { label: { fr: "Salle de bain", en: "Bathroom" }, value: { fr: "Douche à l'italienne", en: "Walk-in shower" } },
    ],
    photos: ["roomTrameWindow", "roomTrame"],
  },
  {
    id: "atelier",
    name: "Atelier",
    floor: { fr: "1er étage", en: "First floor" },
    line: {
      fr: "L'ancien plateau d'atelier. Double hauteur, toute la rangée de fenêtres d'origine, lumière du nord toute la journée.",
      en: "The old workshop floor. Double height, the full bank of original windows, north light all day.",
    },
    body: [
      {
        fr: "Deux chambres seulement, taillées dans l'atelier du premier étage. Nous n'avons pas recoupé la hauteur : il y a une mezzanine pour le lit, et en dessous un endroit pour lire, écrire ou ne rien faire face aux fenêtres.",
        en: "Only two rooms, cut from the first-floor workshop. We did not split the height: there is a mezzanine for the bed, and below it a place to read, write or do nothing facing the windows.",
      },
      {
        fr: "La lumière vient du nord, comme l'exigeaient les tisseurs. Elle ne bouge pas de la journée. Les photographes demandent ces chambres ; nous comprenons pourquoi.",
        en: "The light comes from the north, as the weavers required. It doesn't move all day. Photographers ask for these rooms, and we see why.",
      },
    ],
    facts: [
      { label: { fr: "Chambres", en: "Rooms" }, value: { fr: "2", en: "2" } },
      { label: { fr: "Surface", en: "Size" }, value: { fr: "42 m² et mezzanine", en: "42 m² plus mezzanine" } },
      { label: { fr: "Hauteur", en: "Ceiling" }, value: { fr: "5,40 m", en: "5.40 m" } },
      { label: { fr: "Lit", en: "Bed" }, value: { fr: "180 × 200, en mezzanine", en: "180 × 200, on the mezzanine" } },
      { label: { fr: "Salle de bain", en: "Bathroom" }, value: { fr: "Douche et baignoire", en: "Shower and bath" } },
    ],
    photos: ["roomAtelierWindows", "roomAtelier"],
  },
  {
    id: "grand-atelier",
    name: "Grand Atelier",
    floor: { fr: "1er étage, à l'angle", en: "First floor, on the corner" },
    line: {
      fr: "L'atelier d'angle. Deux orientations, une baignoire posée sous la fenêtre, une entrée par la traboule.",
      en: "The corner workshop. Light from two sides, a freestanding bath under the window, its own way in from the traboule.",
    },
    body: [
      {
        fr: "C'était le bureau du maître d'atelier : la seule pièce du bâtiment qui voyait à la fois la rue et la pente. Elle garde ses deux orientations, sa cheminée condamnée et un parquet que nous avons refusé de poncer.",
        en: "This was the workshop master's office, the only room in the building that saw both the street and the slope. It keeps both aspects, its blocked-up fireplace and a floor we refused to sand.",
      },
      {
        fr: "Une porte donne directement sur la traboule. Vous pouvez rentrer tard sans passer par la salle. La baignoire est sous la fenêtre ; les volets intérieurs ferment.",
        en: "A door opens straight onto the traboule. You can come home late without crossing the dining room. The bath is under the window; the inside shutters close.",
      },
    ],
    facts: [
      { label: { fr: "Chambres", en: "Rooms" }, value: { fr: "1", en: "1" } },
      { label: { fr: "Surface", en: "Size" }, value: { fr: "55 m²", en: "55 m²" } },
      { label: { fr: "Hauteur", en: "Ceiling" }, value: { fr: "4,80 m", en: "4.80 m" } },
      { label: { fr: "Lit", en: "Bed" }, value: { fr: "200 × 200", en: "200 × 200" } },
      { label: { fr: "Salle de bain", en: "Bathroom" }, value: { fr: "Baignoire îlot et douche", en: "Freestanding bath and shower" } },
    ],
    photos: ["roomGrandAtelierBath", "roomGrandAtelier"],
  },
];

export function roomCopy(id: string): RoomCopy | undefined {
  return ROOMS.find((r) => r.id === id);
}

export const ROOMS_COMMON = {
  included: {
    fr: "Dans toutes les chambres : linge en lin, Wi-Fi, un vrai bureau, une bouilloire et du thé en vrac. Pas de minibar : le bar est au dernier étage.",
    en: "In every room: linen sheets, Wi-Fi, a real desk, a kettle and loose-leaf tea. No minibar: the bar is on the top floor.",
  },
  breakfast: {
    fr: "Petit-déjeuner 18 € par personne, servi au restaurant de 7 h 30 à 10 h 30. Personne ne le prend au lit ici ; il n'y a pas de plateaux.",
    en: "Breakfast is €18 a person, served in the restaurant from 7.30 to 10.30. Nobody has it in bed here; there are no trays.",
  },
  children: {
    fr: "Pas d'enfants de moins de 10 ans. La salle est petite et le bâtiment porte le son : un soir de pleurs s'entend sur quatre étages.",
    en: "No children under 10. The dining room is small and the building carries sound: one crying evening is heard on four floors.",
  },
  lift: {
    fr: "Il y a un ascenseur, ajouté en 1962, et il est lent. Les Mansardes sont au quatrième.",
    en: "There is a lift, added in 1962, and it is slow. The Mansardes are on the fourth floor.",
  },
} satisfies Record<string, L>;
