// Resident artists. Fictional people, plausible careers.
import type { Method } from "./motifs";

export type Availability = {
  status: "open" | "waitlist" | "closed";
  note: string;
};

export type Work = {
  motif: string; // motif slug
  placement: string;
  sessions: number;
  method: Method;
  year: number;
  note?: string;
};

export type Artist = {
  slug: string;
  name: string;
  ja: string;
  seal: string;
  role: string;
  method: Method;
  since: number;
  statement: string;
  bio: string;
  focus: string[];
  motifs: string[]; // slugs this artist takes on
  languages: string[];
  instagram: string;
  availability: Availability;
  works: Work[];
  tone: "paper" | "deep" | "ink";
};

export const artists: Artist[] = [
  {
    slug: "kaito",
    name: "Kaito",
    ja: "海斗",
    seal: "海",
    role: "Founder · tebori",
    method: "tebori",
    since: 2003,
    statement: "A back piece is a year of Tuesdays. I want you to enjoy the Tuesdays.",
    bio: "Apprenticed in Yokohama for seven years before opening Uroko in 2011. Works almost entirely by hand on large-scale pieces: back pieces, full sleeves and body suits. Draws every design on the body in brush before a needle touches it, and will tell you when a motif is wrong for the place you want it.",
    focus: ["Back pieces", "Body suits", "Dragons and koi"],
    motifs: ["ryu", "koi", "nami", "kumo", "fudo", "karajishi"],
    languages: ["Japanese", "some English"],
    instagram: "@kaito.uroko.demo",
    availability: {
      status: "waitlist",
      note: "Taking consultations for large work starting next spring. Small pieces by referral only.",
    },
    works: [
      { motif: "ryu", placement: "Full back", sessions: 18, method: "tebori", year: 2025, note: "Dragon in clouds, black and grey with red accents." },
      { motif: "koi", placement: "Full sleeve", sessions: 9, method: "tebori", year: 2025 },
      { motif: "fudo", placement: "Back", sessions: 14, method: "tebori", year: 2024, note: "Fudō on rocks, flames to the shoulder blades." },
      { motif: "nami", placement: "Both legs", sessions: 12, method: "tebori", year: 2024, note: "Water background joining two older pieces." },
    ],
    tone: "ink",
  },
  {
    slug: "mio",
    name: "Mio",
    ja: "美緒",
    seal: "美",
    role: "Machine · colour",
    method: "machine",
    since: 2014,
    statement: "Colour is a decision you make for thirty years. I make it slowly.",
    bio: "Trained in Japanese painting before tattooing, which shows in how the petals are built up in layers. Known for peony and chrysanthemum work with dense, saturated colour, and for medium pieces that are finished in two or three sittings. Also the person to ask about cover-ups.",
    focus: ["Flowers", "Half sleeves", "Colour"],
    motifs: ["botan", "kiku", "sakura", "hasu", "ume", "tsuru", "hebi"],
    languages: ["Japanese", "English"],
    instagram: "@mio.uroko.demo",
    availability: {
      status: "open",
      note: "Booking about six weeks out. Consultations most Wednesday afternoons.",
    },
    works: [
      { motif: "botan", placement: "Half sleeve", sessions: 3, method: "machine", year: 2026, note: "Peonies and wind bars, red and wine." },
      { motif: "kiku", placement: "Shoulder cap", sessions: 2, method: "machine", year: 2025 },
      { motif: "hebi", placement: "Forearm", sessions: 3, method: "machine", year: 2025, note: "Snake through plum blossom." },
      { motif: "hasu", placement: "Sternum", sessions: 2, method: "machine", year: 2024 },
    ],
    tone: "paper",
  },
  {
    slug: "sho",
    name: "Sho",
    ja: "翔",
    seal: "翔",
    role: "Machine and tebori",
    method: "both",
    since: 2018,
    statement: "Lines by machine, so they stay. Shading by hand, so it breathes.",
    bio: "Joined as Kaito's apprentice in 2018 and took his own clients from 2021. Outlines by machine and shades by hand, which keeps big pieces moving between sessions without losing the softness of tebori. Guardians, masks and anything that needs wind behind it.",
    focus: ["Guardians", "Waves and wind", "Cover-ups"],
    motifs: ["hannya", "oni", "tengu", "kaze", "tora", "kitsune", "take"],
    languages: ["Japanese", "English"],
    instagram: "@sho.uroko.demo",
    availability: {
      status: "open",
      note: "Booking two to three weeks out. Happy to take first tattoos.",
    },
    works: [
      { motif: "tora", placement: "Thigh", sessions: 6, method: "both", year: 2026, note: "Tiger in bamboo, black and grey." },
      { motif: "hannya", placement: "Calf", sessions: 3, method: "both", year: 2025 },
      { motif: "tengu", placement: "Shoulder", sessions: 5, method: "both", year: 2025, note: "With wind bars into the chest." },
      { motif: "kitsune", placement: "Forearm", sessions: 2, method: "machine", year: 2024 },
    ],
    tone: "deep",
  },
];

export function getArtist(slug: string) {
  return artists.find((a) => a.slug === slug);
}

export const availabilityLabel: Record<Availability["status"], string> = {
  open: "Taking bookings",
  waitlist: "Waitlist",
  closed: "Books closed",
};
