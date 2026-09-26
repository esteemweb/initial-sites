/**
 * Shows that are booked but not public yet. This module is imported only
 * by server code (the private page), so none of it is ever in a public
 * bundle or a static page. Each one goes public at `publicAt`, local time
 * Brussels; the list sees it before then.
 */

export type Announcement = {
  id: string;
  date: string; // YYYY-MM-DD, the night
  doors: string;
  city: string;
  venue: string;
  capacity: number;
  publicAt: string; // ISO, when it goes on the public dates page
  note?: string;
};

export const TOUR = { id: "winter-26-27", name: "winter 26/27", presaleOpens: "2026-10-09T10:00:00+02:00" };

export const announcements: Announcement[] = [
  {
    id: "2027-02-werk9",
    date: "2027-02-13",
    doors: "00:00",
    city: "berlin",
    venue: "werk 9",
    capacity: 700,
    publicAt: "2026-10-09T10:00:00+02:00",
    note: "second time. they asked for the long set",
  },
  {
    id: "2027-02-loods6",
    date: "2027-02-27",
    doors: "23:00",
    city: "rotterdam",
    venue: "loods 6",
    capacity: 550,
    publicAt: "2026-10-09T10:00:00+02:00",
  },
  {
    id: "2027-03-halleb",
    date: "2027-03-12",
    doors: "23:00",
    city: "lille",
    venue: "la halle b",
    capacity: 400,
    publicAt: "2026-10-23T10:00:00+02:00",
  },
  {
    id: "2027-03-kelder",
    date: "2027-03-27",
    doors: "22:00",
    city: "ghent",
    venue: "kelder",
    capacity: 450,
    publicAt: "2026-11-06T10:00:00+01:00",
    note: "all night. doors at ten. i'm opening and closing",
  },
];

export function notYetPublic(now = new Date()) {
  return announcements
    .filter((a) => new Date(a.publicAt).getTime() > now.getTime())
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}
