import type { L } from "@/lib/i18n";

/* Every photograph on the site. The files in public/images are the final
   photographs (generated with Higgsfield, 24 Sep 2026); to swap one, keep the
   SAME filename and ratio and nothing else changes. Ratios are the files' own;
   on the page every portrait is shown at 4:5 (design-system §5, 25 Sep 2026). */

export type Aspect = "window" | "tall" | "portrait" | "square" | "landscape";

export type Photo = {
  src: string;
  width: number;
  height: number;
  aspect: Aspect;
  alt: L;
};

const SIZE: Record<Aspect, [number, number]> = {
  window: [800, 1600],
  tall: [1000, 1500],
  portrait: [1200, 1500],
  square: [1200, 1200],
  landscape: [1800, 1200],
};

function photo(file: string, aspect: Aspect, fr: string, en: string): Photo {
  const [width, height] = SIZE[aspect];
  return { src: `/images/${file}.webp`, width, height, aspect, alt: { fr, en } };
}

export const PHOTOS = {
  diningWindows: photo(
    "dining-room-windows",
    "window",
    "La salle à manger : une fenêtre de deux mètres, la lumière du matin sur le plancher d'origine.",
    "The dining room: a two-metre window, morning light on the original floor.",
  ),
  diningTables: photo(
    "dining-room-tables",
    "tall",
    "Les tables de la salle, sous les poutres de l'ancien atelier.",
    "The tables in the dining room, under the old workshop beams.",
  ),
  kitchenHands: photo(
    "kitchen-hands",
    "portrait",
    "Des mains qui façonnent des quenelles sur l'inox de la cuisine.",
    "Hands shaping quenelles on the steel counter of the kitchen.",
  ),
  camillePass: photo(
    "camille-pass",
    "portrait",
    "Camille Ferrand au passe, dos à la fenêtre.",
    "Camille Ferrand at the pass, her back to the window.",
  ),
  plateQuenelle: photo(
    "plate-quenelle",
    "square",
    "Vue de dessus : une quenelle de brochet, sauce Nantua, sur une assiette blanche.",
    "From above: a pike quenelle with Nantua sauce on a plain white plate.",
  ),
  plateTrout: photo(
    "plate-trout",
    "square",
    "Vue de dessus : truite du Bugey, beurre noisette, assiette blanche.",
    "From above: Bugey trout, brown butter, plain white plate.",
  ),
  plateTart: photo(
    "plate-tart",
    "square",
    "Vue de dessus : une part de tarte aux pralines roses.",
    "From above: a slice of pink praline tart.",
  ),
  roomMansarde: photo(
    "room-mansarde",
    "tall",
    "Une chambre Mansarde : plafond en pente, poutres apparentes.",
    "A Mansarde room: sloping ceiling, exposed beams.",
  ),
  roomMansardeWindow: photo(
    "room-mansarde-window",
    "window",
    "La lucarne d'une Mansarde, les toits de la Croix-Rousse derrière.",
    "The dormer window of a Mansarde, Croix-Rousse rooftops beyond.",
  ),
  roomTrame: photo(
    "room-trame",
    "tall",
    "Une chambre Trame : quatre mètres sous plafond, volets intérieurs.",
    "A Trame room: four-metre ceilings, inside shutters.",
  ),
  roomTrameWindow: photo(
    "room-trame-window",
    "window",
    "La fenêtre haute d'une Trame, volets ouverts sur les toits.",
    "The tall window of a Trame room, shutters open on the rooftops.",
  ),
  roomAtelier: photo(
    "room-atelier",
    "tall",
    "Un Atelier : double hauteur, la rangée de fenêtres d'origine.",
    "An Atelier: double height, the original bank of windows.",
  ),
  roomAtelierWindows: photo(
    "room-atelier-windows",
    "window",
    "La lumière du nord dans un Atelier, en fin d'après-midi.",
    "North light in an Atelier, late afternoon.",
  ),
  roomGrandAtelier: photo(
    "room-grand-atelier",
    "tall",
    "Le Grand Atelier : l'angle du bâtiment, deux orientations.",
    "The Grand Atelier: the corner of the building, light from two sides.",
  ),
  roomGrandAtelierBath: photo(
    "room-grand-atelier-bath",
    "window",
    "La baignoire du Grand Atelier, posée sous la fenêtre.",
    "The Grand Atelier's bath, set under the window.",
  ),
  traboule: photo(
    "traboule",
    "window",
    "La traboule voûtée qui longe le bâtiment jusqu'à la cour.",
    "The vaulted traboule running beside the building to the courtyard.",
  ),
  facade: photo(
    "facade-burdeau",
    "tall",
    "La façade sur la rue Burdeau : quatre niveaux de hautes fenêtres.",
    "The façade on rue Burdeau: four storeys of tall windows.",
  ),
  stair: photo(
    "stair",
    "window",
    "L'escalier de pierre, éclairé par une fenêtre haute.",
    "The stone staircase, lit by a tall window.",
  ),
  toitView: photo(
    "toit-view",
    "landscape",
    "Depuis Le Toit : Lyon en contrebas, la Saône et le Rhône.",
    "From the Roof: Lyon below, the Saône and the Rhône.",
  ),
  toitBar: photo(
    "toit-bar",
    "tall",
    "Le comptoir du Toit à la tombée du jour.",
    "The counter at the Roof at dusk.",
  ),
  courtyard: photo(
    "courtyard",
    "tall",
    "La cour, seize couverts de mai à septembre.",
    "The courtyard, sixteen covers from May to September.",
  ),
  privateDinner: photo(
    "private-dinner",
    "tall",
    "La salle dressée en une seule longue table pour une privatisation.",
    "The dining room laid as one long table for a private hire.",
  ),
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof PHOTOS;
