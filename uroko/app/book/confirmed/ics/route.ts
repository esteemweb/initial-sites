import { readBooking } from "@/lib/booking/store";
import { site } from "@/lib/content/site";

// Calendar file for the confirmed consultation (30 minutes, Japan time).
export async function GET() {
  const b = await readBooking();
  if (!b?.deposit) return new Response("No booking", { status: 404 });

  const [date, time] = b.slot.split("T");
  const start = new Date(`${date}T${time}:00+09:00`);
  const end = new Date(start.getTime() + 30 * 60 * 1000);
  const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Uroko//Consultation//EN",
    "BEGIN:VEVENT",
    `UID:${b.ref}@uroko.example`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:Uroko consultation (${b.ref})`,
    `LOCATION:${site.address.lines.join(", ")}`,
    `DESCRIPTION:Free 30-minute consultation. Bring photo ID. ${site.email}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="uroko-${b.ref}.ics"`,
      "Cache-Control": "no-store",
    },
  });
}
