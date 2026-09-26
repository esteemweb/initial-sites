import type { L } from "@/lib/i18n";

/* Strings for the three booking paths — brief §10. */

export const COMMON = {
  back: { fr: "Retour", en: "Back" },
  next: { fr: "Continuer", en: "Continue" },
  step: { fr: "Étape {n} sur {total}", en: "Step {n} of {total}" },
  required: { fr: "obligatoire", en: "required" },
  name: { fr: "Nom", en: "Name" },
  email: { fr: "Courriel", en: "Email" },
  phone: { fr: "Téléphone", en: "Phone" },
  notes: { fr: "Un mot pour nous", en: "Anything we should know" },
  prevMonth: { fr: "Mois précédent", en: "Previous month" },
  nextMonth: { fr: "Mois suivant", en: "Next month" },
  reference: { fr: "Référence", en: "Reference" },
  errors: {
    name: { fr: "Il nous faut un nom.", en: "We need a name." },
    email: { fr: "Cette adresse ne ressemble pas à un courriel.", en: "That doesn't look like an email address." },
    phone: { fr: "Il nous faut un numéro pour vous joindre.", en: "We need a number to reach you on." },
  },
  otherPaths: { fr: "Autre chose à réserver ?", en: "Booking something else?" },
  /* Said once, quietly, under every confirmation: this is a demo site
     (SECURITY-AUDIT.md item 8, 26 Sep 2026). */
  demo: {
    table: { fr: "Site de démonstration : aucune table n'a été réservée, aucun message envoyé.", en: "Demo site: no table has been booked and no message sent." },
    room: { fr: "Site de démonstration : aucune chambre n'a été réservée, aucun message envoyé.", en: "Demo site: no room has been booked and no message sent." },
    hire: { fr: "Site de démonstration : aucune demande n'a été envoyée.", en: "Demo site: no enquiry has been sent." },
  },
} satisfies Record<string, L | Record<string, L>>;

export const ROOM_FLOW = {
  eyebrow: { fr: "Réserver", en: "Book" },
  title: { fr: "Une chambre", en: "A room" },
  steps: [
    { fr: "Séjour", en: "Your stay" },
    { fr: "Chambre", en: "Room" },
    { fr: "Coordonnées", en: "Your details" },
  ],
  arrival: { fr: "Arrivée", en: "Arrival" },
  departure: { fr: "Départ", en: "Departure" },
  pickArrival: { fr: "Choisissez le jour d'arrivée.", en: "Choose your arrival day." },
  pickDeparture: { fr: "Choisissez le jour de départ.", en: "Now choose your departure day." },
  guests: { fr: "Personnes", en: "Guests" },
  guestsNote: {
    fr: "Deux personnes au plus par chambre. Pas d'enfants de moins de 10 ans. Pour plusieurs chambres, écrivez-nous.",
    en: "Two people at most per room. No children under 10. For several rooms, write to us.",
  },
  nights: { fr: "{n} nuit", en: "{n} night" },
  nightsPlural: { fr: "{n} nuits", en: "{n} nights" },
  seeRooms: { fr: "Voir les chambres", en: "See the rooms" },
  stayErrors: {
    past: { fr: "Cette date est passée.", en: "That date has passed." },
    order: { fr: "Le départ doit suivre l'arrivée.", en: "Departure must come after arrival." },
    "too-long": { fr: "Quatorze nuits au plus en ligne. Au-delà, écrivez-nous.", en: "Fourteen nights at most online. Beyond that, write to us." },
    "too-many-guests": { fr: "Deux personnes au plus par chambre.", en: "Two people at most per room." },
  },
  chooseRoom: { fr: "Choisissez une chambre", en: "Choose a room" },
  left: { fr: "Plus que {n} libre", en: "Only {n} left" },
  leftPlural: { fr: "{n} libres", en: "{n} free" },
  full: { fr: "Complet pour ces dates", en: "Full for these dates" },
  total: { fr: "Total", en: "Total" },
  perNightBreakdown: { fr: "Détail par nuit", en: "Night by night" },
  weekend: { fr: "week-end", en: "weekend" },
  seasons: {
    low: { fr: "basse saison", en: "low season" },
    mid: { fr: "moyenne saison", en: "mid season" },
    high: { fr: "haute saison", en: "high season" },
    lumieres: { fr: "Fête des Lumières", en: "Fête des Lumières" },
  },
  select: { fr: "Choisir", en: "Choose" },
  selected: { fr: "Choisie", en: "Chosen" },
  breakfast: { fr: "Petit-déjeuner, 18 € par personne et par nuit", en: "Breakfast, €18 a person a night" },
  tax: { fr: "Taxe de séjour en sus, réglée sur place.", en: "City tax extra, paid on arrival." },
  arrivalTime: { fr: "Heure d'arrivée prévue", en: "Expected arrival time" },
  arrivalTimes: [
    { fr: "Je ne sais pas encore", en: "Not sure yet" },
    { fr: "Avant 15 h (bagages seulement)", en: "Before 3 pm (luggage only)" },
    { fr: "15 h – 18 h", en: "3 – 6 pm" },
    { fr: "18 h – 21 h", en: "6 – 9 pm" },
    { fr: "Après 21 h", en: "After 9 pm" },
  ],
  alsoTable: { fr: "Je veux aussi une table à Navette pendant le séjour", en: "I'd also like a table at Navette during the stay" },
  conditions: {
    fr: "J'ai lu les conditions : annulation sans frais jusqu'à 48 h avant l'arrivée ; ensuite, la première nuit est due.",
    en: "I've read the terms: free cancellation up to 48 hours before arrival; after that, the first night is due.",
  },
  conditionsError: { fr: "Merci de cocher les conditions.", en: "Please tick the terms." },
  noPayment: {
    fr: "Aucun paiement maintenant. Nous vous demandons une carte à l'arrivée.",
    en: "No payment now. We'll ask for a card when you arrive.",
  },
  confirm: { fr: "Confirmer la réservation", en: "Confirm the booking" },
  confirmedTitle: { fr: "C'est réservé.", en: "It's booked." },
  confirmedBody: {
    fr: "{room}, du {from} au {to}, pour {guests}. La confirmation part à {email}.",
    en: "{room}, {from} to {to}, for {guests}. The confirmation is on its way to {email}.",
  },
  guestsCount: { fr: "{n} personne", en: "{n} guest" },
  guestsCountPlural: { fr: "{n} personnes", en: "{n} guests" },
  bookTableNow: { fr: "Réserver la table maintenant", en: "Book the table now" },
  summary: { fr: "Votre séjour", en: "Your stay" },
} satisfies Record<string, unknown>;

export const TABLE_FLOW = {
  eyebrow: { fr: "Réserver", en: "Book" },
  title: { fr: "Une table à Navette", en: "A table at Navette" },
  steps: [
    { fr: "Jour", en: "Day" },
    { fr: "Heure", en: "Time" },
    { fr: "Nom", en: "Name" },
  ],
  date: { fr: "Jour", en: "Day" },
  closed: { fr: "Fermé le dimanche et le lundi.", en: "Closed on Sunday and Monday." },
  service: { fr: "Service", en: "Service" },
  services: { lunch: { fr: "Déjeuner", en: "Lunch" }, dinner: { fr: "Dîner", en: "Dinner" } },
  lunchOnlyFriSat: { fr: "Le déjeuner, c'est vendredi et samedi.", en: "Lunch is Friday and Saturday only." },
  party: { fr: "Couverts", en: "Party size" },
  partyNote: {
    fr: "Neuf ou plus ? C'est une privatisation de la salle.",
    en: "Nine or more? That's a private hire of the dining room.",
  },
  partyLink: { fr: "Faire une demande", en: "Make an enquiry" },
  seeTimes: { fr: "Voir les heures", en: "See times" },
  live: { fr: "En direct", en: "Live" },
  updated: { fr: "mis à jour il y a {s} s", en: "updated {s}s ago" },
  justTaken: { fr: "Une table vient de partir à {time}.", en: "A table just went at {time}." },
  seatsLeft: { fr: "{n} places", en: "{n} seats" },
  seatLeft: { fr: "{n} place", en: "{n} seat" },
  full: { fr: "Complet", en: "Full" },
  tooSmall: { fr: "Pas pour {n}", en: "Not for {n}" },
  noneLeft: {
    fr: "Plus rien pour {n} ce jour-là. Essayez un autre jour, ou venez au comptoir : six places sans réservation.",
    en: "Nothing left for {n} that day. Try another day, or come to the counter: six seats, no bookings.",
  },
  hold: { fr: "On vous garde cette table", en: "We're holding this table for you" },
  holdTimer: { fr: "encore {time}", en: "{time} left" },
  holdExpired: {
    fr: "Le délai est passé et la table a été relâchée. Choisissez à nouveau une heure.",
    en: "Time ran out and the table has been released. Choose a time again.",
  },
  diet: { fr: "Allergies, régimes", en: "Allergies, diets" },
  confirm: { fr: "Confirmer la table", en: "Confirm the table" },
  confirmedTitle: { fr: "Votre table est réservée.", en: "Your table is booked." },
  confirmedBody: {
    fr: "{party} couverts, {date} à {time}, pour {name}.",
    en: "Table for {party}, {date}, {time}, in the name of {name}.",
  },
  lateNote: {
    fr: "Au-delà d'un quart d'heure de retard sans nouvelles, nous donnons la table. Appelez-nous si le métro traîne.",
    en: "If you're more than a quarter of an hour late without a word, we give the table away. Call us if the metro is slow.",
  },
} satisfies Record<string, unknown>;

export const HIRE_FLOW = {
  eyebrow: { fr: "Demande", en: "Enquiry" },
  title: { fr: "Le bâtiment", en: "The building" },
  scope: { fr: "Ce que vous voulez", en: "What you'd like" },
  scopes: {
    room: { fr: "La salle", en: "The dining room" },
    building: { fr: "Le bâtiment entier", en: "The whole building" },
  },
  scopeNotes: {
    room: { fr: "40 assis · 70 debout", en: "40 seated · 70 standing" },
    building: { fr: "19 chambres, la salle, la cour, Le Toit", en: "19 rooms, dining room, courtyard, the Roof" },
  },
  occasion: { fr: "L'occasion", en: "The occasion" },
  occasions: [
    { id: "wedding", label: { fr: "Un mariage", en: "A wedding" } },
    { id: "company", label: { fr: "Une entreprise", en: "A company" } },
    { id: "dinner", label: { fr: "Un dîner privé", en: "A private dinner" } },
    { id: "other", label: { fr: "Autre chose", en: "Something else" } },
  ],
  date: { fr: "Date souhaitée", en: "Preferred date" },
  flexible: { fr: "Nos dates sont souples", en: "Our dates are flexible" },
  guests: { fr: "Nombre de personnes", en: "Number of people" },
  guestsError: {
    fr: "Entre 10 et 70 personnes. Au-delà, le bâtiment ne suit pas.",
    en: "Between 10 and 70 people. Beyond that, the building can't cope.",
  },
  seatedWarning: {
    fr: "Au-delà de 40, ce sera debout : la salle ne tient pas plus de 40 à table.",
    en: "Over 40 means standing: the room seats no more than 40.",
  },
  rooms: { fr: "Chambres nécessaires", en: "Rooms needed" },
  company: { fr: "Entreprise ou famille", en: "Company or family" },
  message: { fr: "Racontez-nous", en: "Tell us about it" },
  messagePlaceholder: {
    fr: "Le déroulé, les horaires, ce qui compte pour vous.",
    en: "The running order, timings, what matters to you.",
  },
  dateError: { fr: "Choisissez une date à venir.", en: "Choose a future date." },
  send: { fr: "Envoyer la demande", en: "Send the enquiry" },
  sentTitle: { fr: "Demande reçue.", en: "Enquiry received." },
  sentBody: {
    fr: "On vous répond au plus tard le {date}, à {email}, avec une réponse et un prix.",
    en: "We'll reply by {date} at the latest, to {email}, with an answer and a price.",
  },
} satisfies Record<string, unknown>;
