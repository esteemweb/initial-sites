import type { L } from "@/lib/i18n";

/* pattern: FAQ that answers the awkward question honestly, bold first
   sentence — REFERENCE-AUTOPSY §11.2; brief §13. `home` marks the six shown
   on the home page. */

export type QA = { q: L; lead: L; rest: L; home?: boolean };

export const FAQ_GROUPS: { title: L; items: QA[] }[] = [
  {
    title: { fr: "Le restaurant", en: "The restaurant" },
    items: [
      {
        home: true,
        q: { fr: "Faut-il dormir ici pour dîner ici ?", en: "Do I need to stay here to eat here?" },
        lead: { fr: "Non.", en: "No." },
        rest: {
          fr: "La plupart des gens dans la salle ne dorment pas ici. Navette est un restaurant ouvert sur la ville, du mardi au samedi.",
          en: "Most of the people in the room aren't staying. Navette is a restaurant open to the city, Tuesday to Saturday.",
        },
      },
      {
        home: true,
        q: { fr: "Et si c'est complet ?", en: "What if it's full?" },
        lead: { fr: "Mangez au comptoir.", en: "Eat at the counter." },
        rest: {
          fr: "Six places, sans réservation, avec une courte carte. Ou montez au Toit, qui ne se réserve pas non plus.",
          en: "Six seats, no bookings, with a short carte. Or go up to the Roof, which doesn't take bookings either.",
        },
      },
      {
        q: { fr: "Y a-t-il une carte ?", en: "Is there an à la carte menu?" },
        lead: { fr: "Seulement au comptoir.", en: "Only at the counter." },
        rest: {
          fr: "En salle, un menu en cinq services à 68 €, qui change toutes les trois semaines.",
          en: "In the dining room it's one five-course menu at €68, changing every three weeks.",
        },
      },
      {
        q: { fr: "Les allergies ?", en: "Allergies?" },
        lead: { fr: "Dites-le en réservant, pas à table.", en: "Tell us when you book, not at the table." },
        rest: {
          fr: "La cuisine s'organise à l'avance. Il existe une version végétarienne du menu ; prévenez-nous la veille.",
          en: "The kitchen plans ahead. There is a vegetarian version of the menu; let us know the day before.",
        },
      },
    ],
  },
  {
    title: { fr: "Les chambres", en: "The rooms" },
    items: [
      {
        home: true,
        q: { fr: "Les enfants sont-ils acceptés ?", en: "Do you take children?" },
        lead: { fr: "Pas avant 10 ans.", en: "Not under 10." },
        rest: {
          fr: "La salle est petite et le bâtiment porte le son. Ce n'est pas contre les enfants ; c'est le bâtiment.",
          en: "The dining room is small and the building carries sound. It's nothing against children; it's the building.",
        },
      },
      {
        home: true,
        q: { fr: "Y a-t-il un spa, une piscine ?", en: "Is there a spa or a pool?" },
        lead: { fr: "Non.", en: "No." },
        rest: {
          fr: "Pas de spa, pas de salle de sport, pas de piscine. Il y a un restaurant, et c'est la raison de venir.",
          en: "There is no spa, no gym and no pool. There is a restaurant, and it is the reason to come.",
        },
      },
      {
        q: { fr: "Le petit-déjeuner ?", en: "Breakfast?" },
        lead: { fr: "18 € par personne, au restaurant.", en: "€18 a person, in the restaurant." },
        rest: {
          fr: "De 7 h 30 à 10 h 30. Personne ne le prend au lit ; il n'y a pas de plateaux.",
          en: "From 7.30 to 10.30. Nobody has it in bed; there are no trays.",
        },
      },
      {
        q: { fr: "Quelle chambre choisir ?", en: "Which room should I choose?" },
        lead: { fr: "La Mansarde, si vous nous demandez.", en: "The Mansarde, if you ask us." },
        rest: {
          fr: "La moins chère et la plus attachante. Les Trame pour la hauteur, les Ateliers pour la lumière, le Grand Atelier pour la baignoire.",
          en: "The cheapest and the most atmospheric. Trame for the height, the Ateliers for the light, the Grand Atelier for the bath.",
        },
      },
    ],
  },
  {
    title: { fr: "Venir", en: "Getting here" },
    items: [
      {
        home: true,
        q: { fr: "La colline est-elle raide ?", en: "Is the hill steep?" },
        lead: { fr: "Oui.", en: "Yes." },
        rest: {
          fr: "Prenez la ligne C du métro jusqu'à Croix-Paquet : c'est l'ancien funiculaire, et il fait la montée pour vous. Ensuite cinq minutes à pied.",
          en: "Take metro line C to Croix-Paquet: it's the old funicular, and it does the climb for you. Then five minutes on foot.",
        },
      },
      {
        home: true,
        q: { fr: "Peut-on venir en voiture ?", en: "Can I drive?" },
        lead: { fr: "Vous pouvez, mais évitez.", en: "You can, but don't." },
        rest: {
          fr: "Pas de parking, rue étroite. Le parking public des Terreaux est au pied de la colline. La plupart des clients arrivent en train.",
          en: "No parking, narrow street. The public car park at Terreaux is at the foot of the hill. Most guests arrive by train.",
        },
      },
    ],
  },
  {
    title: { fr: "Privatiser", en: "Private hire" },
    items: [
      {
        q: { fr: "Peut-on privatiser le bâtiment entier ?", en: "Can we hire the whole building?" },
        lead: { fr: "Oui, en général du dimanche au mardi.", en: "Yes, usually Sunday to Tuesday." },
        rest: {
          fr: "Dix-neuf chambres, la salle, la cour et Le Toit. Faites une demande ; on répond sous deux jours ouvrés.",
          en: "Nineteen rooms, the dining room, the courtyard and the Roof. Send an enquiry; we reply within two working days.",
        },
      },
    ],
  },
];

export const FAQ_PAGE = {
  eyebrow: { fr: "Questions", en: "Questions" },
  title: { fr: "Ce qu'on nous demande, et ce qu'on répond.", en: "What people ask, and what we say." },
} satisfies Record<string, L>;

export const HOME_FAQ = FAQ_GROUPS.flatMap((g) => g.items).filter((i) => i.home);
