import type { L } from "@/lib/i18n";

/* Home — design-system §7 order: the restaurant leads, rooms follow. */

export const HOME = {
  hero: {
    eyebrow: { fr: "Restaurant avec chambres · Croix-Rousse, Lyon", en: "Restaurant with rooms · Croix-Rousse, Lyon" },
    /* display: four words, none over ten characters, French first */
    title: { fr: "On vient pour dîner.", en: "People come for dinner." },
    /* The headline's last word turns (user request, 25 Sep 2026: "motion,
       interaction and fun"). The lead is fixed; each ending is one word, so
       every full line still keeps the display rule (display.test.ts). The
       first ending is the real title — screen readers only ever get that. */
    lead: { fr: "On vient pour", en: "People come for" },
    endings: [
      { fr: "dîner.", en: "dinner." },
      { fr: "trinquer.", en: "drinks." },
      { fr: "Camille.", en: "Camille." },
      { fr: "Navette.", en: "Navette." },
    ],
    tonight: {
      today: { fr: "Ce soir, encore de la place à", en: "Tonight, still room at" },
      later: { fr: "{day} soir, encore de la place à", en: "{day} evening, still room at" },
      seats: { fr: "{n} pl.", en: "{n} left" },
      booked: { fr: "Une table vient de partir à {time}.", en: "A table just went at {time}." },
      live: { fr: "En direct", en: "Live" },
    },
    ribbon: [
      { fr: "Navette, un menu en cinq services", en: "Navette, one menu in five courses" },
      { fr: "Le Toit, quatorze places sans réservation", en: "The Roof, fourteen seats, no bookings" },
      { fr: "Dix-neuf chambres au-dessus", en: "Nineteen rooms upstairs" },
      { fr: "Un atelier de soie de 1831", en: "A silk workshop from 1831" },
      { fr: "Pentes de la Croix-Rousse", en: "The slopes of the Croix-Rousse" },
    ],
    second: { fr: "Certains restent dormir.", en: "Some stay the night." },
    fact: {
      fr: "Navette · un menu, cinq services, 68 € · du mardi au samedi",
      en: "Navette · one menu, five courses, €68 · Tuesday to Saturday",
    },
  },
  navette: {
    eyebrow: { fr: "Navette, le restaurant", en: "Navette, the restaurant" },
    title: {
      fr: "Trente-huit couverts. La plupart des soirs, c'est complet.",
      en: "Thirty-eight covers. Most nights it's full.",
    },
    body: [
      {
        fr: "Un seul menu, cinq services, 68 €. Il change toutes les trois semaines. Pas de carte, sauf au comptoir, pour ceux qui veulent une assiette et un verre.",
        en: "One menu, five courses, €68. It changes every three weeks. No à la carte, except at the counter, for anyone who wants one plate and a glass.",
      },
      {
        fr: "La plupart des gens dans la salle ne dorment pas ici. À Lyon, on suppose qu'un restaurant d'hôtel est fait pour les touristes. Celui-ci ne l'est pas. Réservez, ou mangez au comptoir.",
        en: "Most people in the room aren't staying here. In Lyon a hotel restaurant is assumed to be for tourists. This one isn't. Book ahead, or eat at the counter.",
      },
    ],
    facts: [
      { value: { fr: "68 €", en: "€68" }, label: { fr: "le menu, cinq services", en: "the menu, five courses" } },
      { value: { fr: "38", en: "38" }, label: { fr: "couverts en salle", en: "covers in the dining room" } },
      { value: { fr: "16", en: "16" }, label: { fr: "en cour, de mai à septembre", en: "in the courtyard, May to September" } },
    ],
  },
  camille: {
    eyebrow: { fr: "La cheffe", en: "The chef" },
    quote: {
      fr: "« Lyon cuisine mieux que partout en France et mange plus lourd que partout en France. Ce sont deux faits différents, et on les confond sans arrêt. »",
      en: "“Lyon cooks better than anywhere in France and eats heavier than anywhere in France. Those are two different facts and people keep treating them as one.”",
    },
    body: {
      fr: "Camille Ferrand a appris dans les bouchons à seize ans, puis a passé six ans à Copenhague. Elle est revenue en 2022. La quenelle reste une quenelle. Il y a simplement moins de crème dedans.",
      en: "Camille Ferrand learned in the bouchons at sixteen, then spent six years in Copenhagen. She came back in 2022. The quenelle is still a quenelle. There is just less cream in it.",
    },
    link: { fr: "Camille", en: "About Camille" },
  },
  rooms: {
    eyebrow: { fr: "Les chambres", en: "The rooms" },
    title: {
      fr: "Dix-neuf chambres au-dessus, nommées d'après ce qu'étaient les étages.",
      en: "Nineteen rooms upstairs, named for what the floors used to be.",
    },
    body: {
      fr: "Le bâtiment a été construit pour des métiers à tisser, pas pour des gens. C'est pour ça que les chambres sont comme elles sont.",
      en: "The building was put up for looms, not for people. That's why the rooms are the way they are.",
    },
    link: { fr: "Toutes les chambres", en: "All the rooms" },
  },
  building: {
    eyebrow: { fr: "Le bâtiment, 1831", en: "The building, 1831" },
    title: {
      fr: "Quatre mètres sous plafond, parce qu'un métier Jacquard en mesure presque autant.",
      en: "Four-metre ceilings, because a Jacquard loom is nearly that tall.",
    },
    body: {
      fr: "Un atelier de soie rue Burdeau. Des fenêtres de presque deux mètres, pour voir le motif. Une traboule sur le côté, qui mène à la cour. Rien de tout ça ne se refait dans un bâtiment neuf.",
      en: "A silk workshop on rue Burdeau. Windows almost two metres tall, so the weavers could see the pattern. A traboule along the side, leading to the courtyard. None of it can be faked in a new build.",
    },
    link: { fr: "Le bâtiment", en: "The building" },
  },
  toit: {
    eyebrow: { fr: "Le Toit, le bar", en: "The Roof, the bar" },
    title: { fr: "Quatorze places. Pas de réservation.", en: "Fourteen seats. No bookings." },
    body: {
      fr: "Ouvert dès 18 h. La Croix-Rousse domine la ville, et la vue sur les deux fleuves est ce que le bâtiment possède de mieux. Premier arrivé, premier assis.",
      en: "Open from six. The Croix-Rousse sits above the city, and the view down over the two rivers is the best thing the building owns. First come, first seated.",
    },
    link: { fr: "Le Toit", en: "The Roof" },
  },
  hire: {
    eyebrow: { fr: "Privatisation", en: "Private hire" },
    title: {
      fr: "La salle pour quarante. Le bâtiment entier pour un mariage.",
      en: "The dining room for forty. The whole building for a wedding.",
    },
    body: {
      fr: "La salle se privatise pour 40 personnes assises ou 70 debout. Le bâtiment entier, chambres comprises, se loue en général du dimanche au mardi. C'est une demande, pas une réservation : on vous répond sous deux jours ouvrés.",
      en: "The dining room takes 40 seated or 70 standing. The whole building, rooms included, usually goes Sunday to Tuesday. It's an enquiry, not a booking: we reply within two working days.",
    },
    link: { fr: "Privatiser", en: "Private hire" },
  },
  faq: {
    eyebrow: { fr: "Questions", en: "Questions" },
    title: { fr: "Ce qu'on nous demande.", en: "What people ask us." },
    link: { fr: "Toutes les questions", en: "All questions" },
  },
} satisfies Record<string, Record<string, L | L[] | unknown>>;
