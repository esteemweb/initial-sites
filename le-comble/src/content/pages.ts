import type { L } from "@/lib/i18n";

/* Le Toit, the building, Camille, private hire, getting here, contact, 404. */

export const BAR = {
  eyebrow: { fr: "Le bar", en: "The bar" },
  title: { fr: "Le Toit", en: "The Roof" },
  lead: {
    fr: "Quatorze places, premier arrivé, premier assis. Pas de réservation, même pour les clients de l'hôtel.",
    en: "Fourteen seats, first come, first served. No bookings, not even for hotel guests.",
  },
  body: [
    {
      fr: "La Croix-Rousse est une colline au-dessus d'une ville. Du toit, on voit la Saône à gauche, le Rhône à droite, et la presqu'île entre les deux. C'est ce que le bâtiment possède de mieux, alors nous avons mis un bar dessus.",
      en: "The Croix-Rousse is a hill above a city. From the roof you see the Saône on the left, the Rhône on the right and the peninsula between them. It is the best thing the building owns, so we put a bar on it.",
    },
    {
      fr: "Vins du Rhône au verre, quelques cocktails, de quoi grignoter depuis la cuisine. Si les quatorze places sont prises, descendez au comptoir de Navette.",
      en: "Rhône wines by the glass, a few cocktails, something to eat from the kitchen. If the fourteen seats are taken, go down to the counter at Navette.",
    },
  ],
  facts: [
    { label: { fr: "Ouverture", en: "Opens" }, value: { fr: "tous les soirs dès 18 h", en: "every evening from 6 pm" } },
    { label: { fr: "Places", en: "Seats" }, value: { fr: "14", en: "14" } },
    { label: { fr: "Réservation", en: "Bookings" }, value: { fr: "aucune", en: "none" } },
    { label: { fr: "Accès", en: "Access" }, value: { fr: "ascenseur ou 96 marches", en: "the lift, or 96 steps" } },
  ],
  weather: {
    fr: "Par pluie ou grand vent, Le Toit ferme. Nous l'annonçons sur la porte de la rue, pas sur Instagram.",
    en: "In rain or high wind, the Roof closes. We put a note on the street door, not on Instagram.",
  },
} satisfies Record<string, unknown>;

export const BUILDING = {
  eyebrow: { fr: "Le bâtiment", en: "The building" },
  title: { fr: "Un atelier de soie, rue Burdeau, 1831", en: "A silk workshop on rue Burdeau, 1831" },
  lead: {
    fr: "Construit pour des métiers à tisser, pas pour des gens. Tout ce qui fait les chambres vient de là.",
    en: "Put up for looms, not for people. Everything about the rooms comes from that.",
  },
  chapters: [
    {
      eyebrow: { fr: "La colline", en: "The hill" },
      title: { fr: "La colline qui travaille", en: "The hill that works" },
      body: {
        fr: "Au XIXᵉ siècle, la Croix-Rousse tisse la soie de Lyon. Les canuts s'installent sur les pentes, dans des immeubles bâtis pour les métiers. En 1831, l'année où celui-ci est achevé, ils se révoltent pour être payés correctement.",
        en: "In the nineteenth century the Croix-Rousse wove Lyon's silk. The canuts, the silk weavers, settled on the slopes, in buildings made for looms. In 1831, the year this one was finished, they rose up to be paid properly.",
      },
    },
    {
      eyebrow: { fr: "Les proportions", en: "The proportions" },
      title: { fr: "Quatre mètres, deux mètres", en: "Four metres, two metres" },
      body: {
        fr: "Le métier Jacquard était énorme : près de quatre mètres de haut, et il lui fallait de la lumière. D'où les plafonds, d'où les fenêtres de presque deux mètres. Ce sont ces proportions qui font les chambres, et on ne les refait pas dans du neuf.",
        en: "The Jacquard loom was enormous: nearly four metres tall, and it needed daylight. Hence the ceilings, hence windows of almost two metres. Those proportions are what make the rooms, and they can't be faked in a new build.",
      },
    },
    {
      eyebrow: { fr: "Le rez-de-chaussée", en: "The ground floor" },
      title: { fr: "L'atelier est devenu la salle", en: "The workshop became the dining room" },
      body: {
        fr: "Le rez-de-chaussée était l'atelier. C'est aujourd'hui la salle de Navette, avec les poutres d'origine et le plancher qu'elle a toujours eu. On l'a nettoyé ; on ne l'a pas remplacé.",
        en: "The ground floor was the workshop. It's now Navette's dining room, with the original beams and the floor it always had. We cleaned it; we didn't replace it.",
      },
    },
    {
      eyebrow: { fr: "La traboule", en: "The traboule" },
      title: { fr: "Un passage entre deux rues", en: "A passage between two streets" },
      body: {
        fr: "Une traboule longe le bâtiment : un passage couvert qui traverse les immeubles d'une rue à l'autre, pour porter la soie à l'abri de la pluie. Nos clients l'empruntent pour rejoindre la cour. Ce genre de détail n'existe nulle part ailleurs.",
        en: "A traboule runs along the side of the building: a covered passage cutting through from one street to the next, built to carry silk out of the rain. Guests use it to reach the courtyard. It's the kind of detail that exists nowhere else.",
      },
    },
  ],
  name: {
    title: { fr: "Le nom", en: "The name" },
    body: {
      fr: "Le comble, c'est le dernier étage sous les poutres. C'est aussi le plus haut degré de quelque chose : le comble du luxe. Et « c'est le comble », c'est la goutte d'eau. Les trois nous vont.",
      en: "Le comble is the attic, the top floor under the roof beams. It's also the height of something: le comble du luxe. And « c'est le comble » means “that's the last straw”. All three suit us.",
    },
  },
} satisfies Record<string, unknown>;

export const CAMILLE = {
  eyebrow: { fr: "La cheffe", en: "The chef" },
  title: { fr: "Camille Ferrand", en: "Camille Ferrand" },
  lead: {
    fr: "Trente-quatre ans, de Villeurbanne. Dans les bouchons lyonnais dès seize ans, puis six ans à Copenhague.",
    en: "Thirty-four, from Villeurbanne. In Lyon's bouchons from sixteen, then six years in Copenhagen.",
  },
  quote: {
    fr: "« Lyon cuisine mieux que partout en France et mange plus lourd que partout en France. Ce sont deux faits différents, et on les confond sans arrêt. »",
    en: "“Lyon cooks better than anywhere in France and eats heavier than anywhere in France. Those are two different facts and people keep treating them as one.”",
  },
  body: [
    {
      fr: "Elle est rentrée en 2022, fatiguée de cuisiner des plats sans grand-mère derrière. Ce qui l'intéressait, c'était la technique lyonnaise : la quenelle, la sauce Nantua, le gras bien travaillé. Ce qui l'agaçait, c'était le poids.",
      en: "She came back in 2022, tired of cooking food with no grandmother behind it. What interested her was Lyonnais technique: the quenelle, Nantua sauce, fat handled properly. What bothered her was the weight.",
    },
    {
      fr: "À Navette, la quenelle reste une quenelle. Il y a simplement moins de crème dedans. Le menu change toutes les trois semaines, parce que c'est à peu près le temps qu'il faut pour qu'un plat soit juste, et pas assez pour qu'il s'use.",
      en: "At Navette the quenelle is still a quenelle. There is just less cream in it. The menu changes every three weeks, because that's about how long a dish takes to get right, and not long enough for it to wear out.",
    },
  ],
} satisfies Record<string, unknown>;

export const HIRE = {
  eyebrow: { fr: "Privatisation", en: "Private hire" },
  title: { fr: "La salle, ou le bâtiment entier", en: "The dining room, or the whole building" },
  lead: {
    fr: "C'est une demande, pas une réservation. Remplissez le formulaire ; on vous répond sous deux jours ouvrés, avec une vraie réponse et un prix.",
    en: "It's an enquiry, not a booking. Fill in the form; we reply within two working days, with a real answer and a price.",
  },
  options: [
    {
      title: { fr: "La salle", en: "The dining room" },
      body: {
        fr: "40 personnes assises, 70 debout. Le menu de la saison ou un menu composé avec Camille. Les soirs de fermeture, ou en journée.",
        en: "40 seated, 70 standing. The season's menu or one planned with Camille. On closed nights, or during the day.",
      },
      facts: { fr: "40 assis · 70 debout", en: "40 seated · 70 standing" },
    },
    {
      title: { fr: "Le bâtiment entier", en: "The whole building" },
      body: {
        fr: "Les dix-neuf chambres, la salle, la cour et Le Toit. Pour un mariage sans château ou une équipe qui a besoin de deux jours ailleurs. En général du dimanche au mardi.",
        en: "All nineteen rooms, the dining room, the courtyard and the Roof. For a wedding without a château, or a team that needs two days somewhere else. Usually Sunday to Tuesday.",
      },
      facts: { fr: "19 chambres · 40 à table", en: "19 rooms · 40 at table" },
    },
  ],
  note: {
    fr: "Le restaurant est fermé le dimanche et le lundi ; c'est là que le bâtiment entier se libère le plus facilement.",
    en: "The restaurant is closed on Sunday and Monday; that's when the whole building is easiest to free up.",
  },
} satisfies Record<string, unknown>;

export const GETTING_HERE = {
  eyebrow: { fr: "Venir", en: "Getting here" },
  title: { fr: "Nous sommes sur une colline. Elle est raide.", en: "We are on a hill. It is steep." },
  lead: {
    fr: "Il y a un funiculaire, et nous allons vous dire lequel. La plupart des gens arrivent en train ; le site part de là.",
    en: "There is a funicular and we will tell you which one. Most people arrive by train, so we start there.",
  },
  steps: [
    {
      title: { fr: "Le train", en: "By train" },
      body: {
        fr: "Paris Gare de Lyon – Lyon Part-Dieu : environ deux heures. Marseille – Lyon : à peu près autant. Certains trains s'arrêtent à Perrache, plus proche de nous par le métro.",
        en: "Paris Gare de Lyon to Lyon Part-Dieu: about two hours. Marseille to Lyon: about the same. Some trains stop at Perrache, which is closer to us by metro.",
      },
    },
    {
      title: { fr: "Le « funiculaire »", en: "The “funicular”" },
      body: {
        fr: "C'est la ligne C du métro. Elle suit le tracé de l'ancienne ficelle de Croix-Paquet et monte la pente à crémaillère. Depuis Perrache : ligne A jusqu'à Hôtel de Ville, puis ligne C, un arrêt, Croix-Paquet. Ensuite cinq minutes à pied, en montée.",
        en: "It's metro line C. It follows the route of the old Croix-Paquet funicular and climbs the slope on a rack. From Perrache: line A to Hôtel de Ville, then line C for one stop to Croix-Paquet. Then five minutes on foot, uphill.",
      },
    },
    {
      title: { fr: "Le taxi", en: "By taxi" },
      body: {
        fr: "Depuis Part-Dieu, un quart d'heure. Demandez la rue Burdeau ; le chauffeur saura où se garer une minute, pas plus.",
        en: "From Part-Dieu, a quarter of an hour. Ask for rue Burdeau; the driver will know where to stop for a minute, no longer.",
      },
    },
    {
      title: { fr: "L'avion", en: "By air" },
      body: {
        fr: "Depuis Saint-Exupéry, le tram Rhônexpress rejoint Part-Dieu en une demi-heure environ.",
        en: "From Saint-Exupéry, the Rhônexpress tram reaches Part-Dieu in about half an hour.",
      },
    },
    {
      title: { fr: "La voiture", en: "By car" },
      body: {
        fr: "Nous n'avons pas de parking et la rue est étroite. Garez-vous au parking public des Terreaux, au pied de la colline, et montez à pied. Nous le disons franchement : ne venez pas en voiture si vous pouvez l'éviter.",
        en: "We have no parking and the street is narrow. Use the public car park at Terreaux, at the foot of the hill, and walk up. We'll be plain about it: don't drive if you can avoid it.",
      },
    },
  ],
  luggage: {
    fr: "Des bagages lourds ? Prévenez-nous de votre heure d'arrivée : quelqu'un descend vous aider depuis Croix-Paquet.",
    en: "Heavy luggage? Tell us when you're arriving and someone will come down to meet you at Croix-Paquet.",
  },
} satisfies Record<string, unknown>;

export const CONTACT = {
  eyebrow: { fr: "Contact", en: "Contact" },
  title: { fr: "Écrivez, appelez, ou passez.", en: "Write, call, or come by." },
  lead: {
    fr: "Le téléphone répond de 10 h à 22 h, du mardi au samedi. Les courriels, tous les jours.",
    en: "The phone is answered from 10 am to 10 pm, Tuesday to Saturday. Emails, every day.",
  },
  lines: [
    { label: { fr: "Une table", en: "A table" }, key: "table" },
    { label: { fr: "Une chambre", en: "A room" }, key: "rooms" },
    { label: { fr: "Privatisation", en: "Private hire" }, key: "hire" },
  ],
} satisfies Record<string, unknown>;

export const NOT_FOUND = {
  title: { fr: "Cette page n'existe pas.", en: "This page doesn't exist." },
  body: {
    fr: "C'est le comble. Le restaurant, lui, existe toujours.",
    en: "That's the last straw. The restaurant, at least, is still here.",
  },
} satisfies Record<string, L>;
