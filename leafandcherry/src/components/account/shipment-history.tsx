/* pattern: shipment history — design-system §7 row 5. No precedent on the
   reference ("not present on captured pages", autopsy §10), so it is built
   from the system: hairline rules rather than fills or shadows, radius 0,
   mono tabular figures, and a status that is a dot AND a word — never colour
   alone, which autopsy §13 flags as a leave-behind. */
import { SHIPMENTS, STATUS_DOT, STATUS_LABEL } from "@/content/account";
import { formatLKR } from "@/lib/pricing";

export function ShipmentHistory() {
  return (
    /* Scrollable region with a name and a tab stop, so a keyboard user can
       reach the overflow if the table ever outgrows a narrow viewport. */
    <div
      role="region"
      aria-labelledby="shipments-heading"
      tabIndex={0}
      className="mt-12 min-w-0 overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">
          Your last six shipments, most recent first
        </caption>
        <thead>
          <tr className="border-b border-hairline">
            {["Date", "Coffee", "Size", "Amount", "Status"].map((h) => (
              <th
                key={h}
                scope="col"
                className="py-3 pr-6 font-mono text-2xs font-medium uppercase text-text-muted last:pr-0"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SHIPMENTS.map((s) => (
            <tr key={s.id} className="border-b border-hairline">
              <th
                scope="row"
                className="py-4 pr-6 font-mono text-sm font-normal tabular-nums whitespace-nowrap"
              >
                {s.date}
              </th>
              <td className="py-4 pr-6 text-sm">{s.lot}</td>
              <td className="py-4 pr-6 font-mono text-sm tabular-nums whitespace-nowrap">
                {s.size}
              </td>
              <td className="py-4 pr-6 font-mono text-sm tabular-nums whitespace-nowrap">
                {formatLKR(s.amount)}
              </td>
              <td className="py-4 text-sm whitespace-nowrap">
                <span className="inline-flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={`size-2 shrink-0 rounded-full ${STATUS_DOT[s.status]}`}
                  />
                  {STATUS_LABEL[s.status]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
