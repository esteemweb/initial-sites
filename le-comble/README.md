# Le Comble

Restaurant with rooms, Croix-Rousse, Lyon. Next 16 + Tailwind 4, fully static, French first.

```
npm install
npx next build
npx next start -p 3006     # http://localhost:3006 → /fr
npm test                   # booking model: rates, seasons, availability, sittings
```

`next start` serves the built bundle. After changing a file, rebuild and restart.

## Where things are

| | |
|---|---|
| `BRIEF.md` | the brief |
| `REFERENCE-AUTOPSY.md` | the reference site, taken apart |
| `design-system.md` | every visual decision, with its source; tokens in `src/app/globals.css` |
| `src/content/` | all copy, in FR and EN |
| `src/lib/i18n.ts` | locales and the localised route table (`/fr/chambres` ↔ `/en/rooms`) |
| `src/lib/model.ts` | the house as numbers: rooms, prices, covers, hours |
| `src/lib/booking.ts` | seasonal rates, simulated availability, sittings (tested) |
| `src/components/booking/` | the Réserver sheet and the three paths |

## The three booking paths

One Réserver control opens a table → room → building sheet. Each path has its own URL with its state in the query string, so every step can be linked to and the back button works:

- `/fr/reserver/table` — date (open days only), service, party size, live seats per sitting, 10-minute hold while you give a name.
- `/fr/reserver/chambre` — dates, guests, the four room types with availability and night-by-night seasonal rates, details, confirmation. No payment.
- `/fr/reserver/batiment` — private-hire enquiry; reply promised within two working days.

There is no back end. Availability is simulated deterministically from the date (`lib/booking.ts`) and nothing is sent anywhere. Swap those functions for real calls; the components depend only on their signatures.

## Photography

Every image in `public/images` is a final photograph (generated with Higgsfield, 24 Sep 2026). To swap one, keep the **same filename and ratio** (1:2, 2:3, 4:5, 1:1, 3:2); on the page every portrait is shown at 4:5. If you replace one while the server is running, delete `.next/cache/images` so the old optimised version isn't served.
