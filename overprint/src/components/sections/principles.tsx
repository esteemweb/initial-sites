const rules = [
  {
    title: "Type first",
    body: "The letterforms carry the idea. Colour, grid and image are there to make the type louder.",
  },
  {
    title: "No stock, ever",
    body: "Every mark in our work is drawn, set or printed by us. If we can’t make it, we don’t use it.",
  },
  {
    title: "Ink is information",
    body: "We layer colour to say something: overlaps, knockouts and misregistration are part of the message.",
  },
  {
    title: "Loud, not hard to read",
    body: "Big type still has to pass contrast, work with a keyboard and read aloud properly.",
  },
];

/* pattern: numbered manifesto rows 01–04 on col 5 with hairlines, over the
   still-running hero image — refs/flowers-sim §9 item 3, §10 numbered row */
export function Principles() {
  return (
    <section aria-labelledby="principles-title" className="relative isolate flex min-h-panel flex-col justify-center py-section-sm">
      {/* local shade behind the text column — keeps small copy ≥ 4.5:1 over the busy street without dimming the whole image */}
      <div aria-hidden="true" className="absolute inset-y-0 right-0 -z-10 w-3/4 bg-radial from-ink/75 to-transparent to-95%" />
      <div>
        {/* heading and each rule fade on their own — the whole list is taller than a
            screen at Tangerine sizes, so one panel-level fade would dim rows mid-read */}
        <div className="panel-fade grid-page gap-y-4">
          <p className="col-span-4 text-micro uppercase md:col-span-2">(01—04)</p>
          <h2 id="principles-title" className="col-span-4 text-head md:col-start-5">
            Four rules we don’t break
          </h2>
        </div>

        <ol className="mt-stack-sm">
          {rules.map((rule, i) => (
            <li key={rule.title} className="panel-fade grid-page">
              <div className="col-span-4 grid grid-cols-subgrid gap-y-3 border-t border-paper/40 py-5 md:col-start-5">
                <span aria-hidden="true" className="col-span-1 font-display text-title font-bold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="col-span-3 text-title">{rule.title}</h3>
                <p className="col-span-3 col-start-2">{rule.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
