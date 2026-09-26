import { test } from "node:test";
import assert from "node:assert/strict";
import {
  isOpen,
  nightlyRate,
  quote,
  reference,
  roomsLeft,
  season,
  servicesOn,
  sittingIsFuture,
  sittings,
  validateStay,
} from "./booking.ts";
import { addDays, addWorkingDays, formatTime, isISODate, monthGrid, nightsOf } from "./dates.ts";
import { ROOM_TYPES, TOTAL_ROOMS } from "./model.ts";

test("the house has nineteen rooms", () => {
  assert.equal(TOTAL_ROOMS, 19);
});

test("seasons follow the calendar, and the Fête des Lumières overrides December", () => {
  assert.equal(season("2027-01-14"), "low");
  assert.equal(season("2027-08-10"), "low");
  assert.equal(season("2026-10-01"), "high");
  assert.equal(season("2026-12-04"), "mid");
  assert.equal(season("2026-12-05"), "lumieres");
  assert.equal(season("2026-12-08"), "lumieres");
  assert.equal(season("2026-12-09"), "mid");
});

test("the published 'from' price is the low-season weeknight rate", () => {
  // 2027-01-12 is a Tuesday in low season
  for (const room of ROOM_TYPES) {
    assert.equal(nightlyRate(room.id, "2027-01-12"), room.from);
  }
});

test("Friday and Saturday nights carry the weekend supplement", () => {
  assert.equal(nightlyRate("mansarde", "2027-01-15"), 190 + 20); // Friday
  assert.equal(nightlyRate("mansarde", "2027-01-16"), 190 + 20); // Saturday
  assert.equal(nightlyRate("mansarde", "2027-01-17"), 190); // Sunday
});

test("high season rounds to five euros", () => {
  // 260 × 1.2 = 312 → 310
  assert.equal(nightlyRate("trame", "2026-10-06"), 310);
});

test("rooms left never exceeds stock or drops below zero", () => {
  for (const room of ROOM_TYPES) {
    for (let i = 0; i < 400; i++) {
      const n = roomsLeft(room.id, addDays("2026-09-24", i));
      assert.ok(n >= 0 && n <= room.count, `${room.id} ${n}`);
    }
  }
});

test("availability is deterministic", () => {
  assert.equal(roomsLeft("trame", "2026-11-03"), roomsLeft("trame", "2026-11-03"));
});

test("a quote sums nights and breakfast", () => {
  const q = quote("mansarde", "2027-01-12", "2027-01-14", 2, true, 18);
  assert.equal(q.nights.length, 2);
  assert.equal(q.rooms, 380);
  assert.equal(q.breakfast, 2 * 2 * 18);
  assert.equal(q.total, 380 + 72);
  const without = quote("mansarde", "2027-01-12", "2027-01-14", 2, false, 18);
  assert.equal(without.total, 380);
});

test("stay validation", () => {
  assert.equal(validateStay("2026-09-20", "2026-09-22", 2, "2026-09-24"), "past");
  assert.equal(validateStay("2026-10-02", "2026-10-02", 2, "2026-09-24"), "order");
  assert.equal(validateStay("2026-10-02", "2026-10-30", 2, "2026-09-24"), "too-long");
  assert.equal(validateStay("2026-10-02", "2026-10-04", 3, "2026-09-24"), "too-many-guests");
  assert.equal(validateStay("2026-10-02", "2026-10-04", 2, "2026-09-24"), null);
});

test("Navette: dinner Tuesday to Saturday, lunch Friday and Saturday", () => {
  assert.deepEqual(servicesOn("2026-09-27"), []); // Sunday
  assert.deepEqual(servicesOn("2026-09-28"), []); // Monday
  assert.deepEqual(servicesOn("2026-09-29"), ["dinner"]); // Tuesday
  assert.deepEqual(servicesOn("2026-10-02"), ["lunch", "dinner"]); // Friday
  assert.equal(isOpen("2026-09-27"), false);
});

test("sittings only exist on open services and stay within capacity", () => {
  assert.deepEqual(sittings("2026-09-28", "dinner", "2026-09-24"), []);
  const s = sittings("2026-10-02", "dinner", "2026-09-24");
  assert.equal(s.length, 6);
  for (const x of s) assert.ok(x.left >= 0 && x.left <= x.capacity);
  // courtyard seats only May to September
  assert.equal(sittings("2026-09-29", "dinner", "2026-09-24")[0].capacity, 20);
  assert.equal(sittings("2026-10-06", "dinner", "2026-09-24")[0].capacity, 14);
});

test("same-day sittings need an hour's notice", () => {
  const now = new Date(2026, 8, 24, 19, 10);
  assert.equal(sittingIsFuture("2026-09-24", "20:00", "2026-09-24", now), false);
  assert.equal(sittingIsFuture("2026-09-24", "20:30", "2026-09-24", now), true);
  assert.equal(sittingIsFuture("2026-09-25", "19:00", "2026-09-24", now), true);
});

test("dates", () => {
  assert.deepEqual(nightsOf("2026-10-05", "2026-10-07"), ["2026-10-05", "2026-10-06"]);
  assert.equal(addWorkingDays("2026-09-25", 2), "2026-09-29"); // Fri → Tue
  assert.equal(isISODate("2026-02-30"), false);
  assert.equal(isISODate("2026-02-28"), true);
  const grid = monthGrid(2026, 10); // October 2026 starts on a Thursday
  assert.equal(grid.indexOf("2026-10-01"), 3);
});

test("references are stable and formatted", () => {
  assert.equal(reference("LC", "x"), reference("LC", "x"));
  assert.match(reference("LC", "x"), /^LC-[0-9A-Z]{5}$/);
});

test("French times read the French way", () => {
  assert.equal(formatTime("19:00", "fr"), "19 h");
  assert.equal(formatTime("20:30", "fr"), "20 h 30");
  assert.equal(formatTime("20:30", "en"), "20:30");
});
