import type { L } from "@/lib/i18n";

/* Navette — brief §5. Named after the weaver's shuttle. */

export const RESTAURANT = {
  eyebrow: { fr: "Le restaurant", en: "The restaurant" },
  title: { fr: "Navette", en: "Navette" },
  lead: {
    fr: "Nommé d'après la navette du tisserand, qui passe d'un côté à l'autre toute la journée. La cuisine fait la même chose entre Lyon et le reste.",
    en: "Named after the weaver's shuttle, which crosses back and forth all day. The kitchen does the same between Lyon and everywhere else.",
  },
  facts: [
    { label: { fr: "Dîner", en: "Dinner" }, value: { fr: "mardi au samedi, 19 h – 21 h 30", en: "Tuesday to Saturday, 7 – 9.30 pm" } },
    { label: { fr: "Déjeuner", en: "Lunch" }, value: { fr: "vendredi et samedi, 12 h – 13 h 30", en: "Friday and Saturday, 12 – 1.30 pm" } },
    { label: { fr: "Menu", en: "Menu" }, value: { fr: "cinq services, 68 €", en: "five courses, €68" } },
    { label: { fr: "Couverts", en: "Covers" }, value: { fr: "38 en salle · 16 en cour de mai à septembre", en: "38 inside · 16 in the courtyard, May to September" } },
  ],
  sections: [
    {
      eyebrow: { fr: "Le menu", en: "The menu" },
      title: { fr: "Un menu. Il change toutes les trois semaines.", en: "One menu. It changes every three weeks." },
      body: {
        fr: "Cinq services, 68 €, pas de carte. Nous prévenons des allergies à la réservation, pas à table : dites-le-nous en réservant et la cuisine s'organise.",
        en: "Five courses, €68, no à la carte. Tell us about allergies when you book, not at the table, and the kitchen will plan for it.",
      },
    },
    {
      eyebrow: { fr: "Le comptoir", en: "The counter" },
      title: { fr: "Une assiette et un verre.", en: "One plate and a glass." },
      body: {
        fr: "Six places au comptoir, sans réservation, avec une courte carte. Pour ceux qui passent, et pour ceux qui n'ont pas eu de table.",
        en: "Six seats at the counter, no bookings, with a short carte. For people passing by, and for people who didn't get a table.",
      },
    },
    {
      eyebrow: { fr: "Le vin", en: "The wine" },
      title: { fr: "Surtout le Rhône. Beaucoup au verre.", en: "Mostly the Rhône. A lot by the glass." },
      body: {
        fr: "La liste penche vers le Rhône, du nord surtout : c'est à une heure. Une vingtaine de vins au verre, qui tournent avec le menu.",
        en: "The list leans towards the Rhône, the northern end mostly: it's an hour away. Around twenty wines by the glass, which turn over with the menu.",
      },
    },
  ],
  residents: {
    fr: "Vous dormez ici ? Votre table n'est pas réservée d'office. Réservez-la en même temps que la chambre, ou demandez-nous.",
    en: "Staying with us? Your table isn't held automatically. Book it with the room, or ask us.",
  },
} satisfies Record<string, unknown>;

/* The current menu. Cycle dates are shown so the page is honest about when
   it changes (brief §5: every three weeks). */
export const MENU = {
  eyebrow: { fr: "La carte", en: "The menu" },
  title: { fr: "Ce qu'on sert en ce moment", en: "What we're serving now" },
  cycle: { fr: "Du 22 septembre au 11 octobre 2026", en: "22 September to 11 October 2026" },
  price: { fr: "Cinq services · 68 € par personne", en: "Five courses · €68 per person" },
  courses: [
    {
      dish: { fr: "Cervelle de canut", en: "Cervelle de canut" },
      note: {
        fr: "fromage blanc battu, ciboulette, radis noir, pain de seigle grillé",
        en: "whipped fromage blanc, chives, black radish, toasted rye",
      },
    },
    {
      dish: { fr: "Œuf mollet, lentilles vertes", en: "Soft egg, green lentils" },
      note: {
        fr: "vinaigrette à l'échalote, lard fumé en copeaux",
        en: "shallot vinaigrette, shaved smoked lardo",
      },
    },
    {
      dish: { fr: "Quenelle de brochet", en: "Pike quenelle" },
      note: {
        fr: "sauce Nantua au bouillon d'écrevisses, moins de crème que vous ne pensez",
        en: "crayfish-stock Nantua sauce, less cream than you'd think",
      },
    },
    {
      dish: { fr: "Volaille de Bresse", en: "Bresse chicken" },
      note: {
        fr: "céleri rôti au foin, jus au vin jaune",
        en: "hay-roasted celeriac, vin jaune jus",
      },
    },
    {
      dish: { fr: "Tarte aux pralines roses", en: "Pink praline tart" },
      note: { fr: "crème crue, un peu de sel", en: "raw cream, a little salt" },
    },
  ],
  supplement: {
    fr: "Saint-Marcellin affiné, en plus : 9 €",
    en: "Aged Saint-Marcellin, as an extra course: €9",
  },
  counter: {
    title: { fr: "Au comptoir", en: "At the counter" },
    items: [
      { dish: { fr: "Cervelle de canut, pain grillé", en: "Cervelle de canut, toast" }, price: 9 },
      { dish: { fr: "Salade lyonnaise", en: "Salade lyonnaise" }, price: 14 },
      { dish: { fr: "Saucisson brioché, salade", en: "Saucisson brioché, leaves" }, price: 16 },
      { dish: { fr: "Tablier de sapeur, sauce gribiche", en: "Tablier de sapeur, gribiche" }, price: 18 },
      { dish: { fr: "Une quenelle, seule", en: "One quenelle, on its own" }, price: 19 },
    ],
  },
  wine: {
    title: { fr: "Au verre, cette semaine", en: "By the glass this week" },
    items: [
      { dish: { fr: "Saint-Péray, blanc", en: "Saint-Péray, white" }, price: 9 },
      { dish: { fr: "Saint-Joseph, blanc", en: "Saint-Joseph, white" }, price: 11 },
      { dish: { fr: "Condrieu", en: "Condrieu" }, price: 18 },
      { dish: { fr: "Morgon", en: "Morgon" }, price: 8 },
      { dish: { fr: "Crozes-Hermitage, rouge", en: "Crozes-Hermitage, red" }, price: 10 },
      { dish: { fr: "Cornas", en: "Cornas" }, price: 16 },
      { dish: { fr: "Côte-Rôtie", en: "Côte-Rôtie" }, price: 22 },
    ],
  },
  allergies: {
    fr: "Allergies et régimes : dites-le en réservant. Une version végétarienne du menu existe, prévenez-nous la veille.",
    en: "Allergies and diets: tell us when you book. There is a vegetarian version of the menu; let us know the day before.",
  },
} satisfies Record<string, unknown>;

export type Dish = { dish: L; note?: L; price?: number };
