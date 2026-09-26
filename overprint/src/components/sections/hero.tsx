const services = [
  { plate: "C", label: "Identity systems" },
  { plate: "M", label: "Editorial & print" },
  { plate: "Y", label: "Packaging" },
  { plate: "K", label: "Type & web" },
];

/* pattern: hero — refs/flowers-sim §2/§7/§9, matched by user request:
   bracket index mid-left (cols 1–2), mono intro above a headline on the bottom
   edge, paper text. The image lives in <ImageZone>, which keeps it pinned
   behind the next panels. */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="flex min-h-svh flex-col justify-end pt-72 md:pt-section"
    >
      <div className="panel-fade grid-page gap-y-stack-sm pb-edge md:gap-y-stack">
        <ul aria-label="What we do" className="col-span-4 border-t border-paper/40 md:col-span-2">
          {services.map((s) => (
            <li key={s.plate} className="flex items-center justify-between border-b border-paper/40 py-1.5">
              <span className="text-micro font-semibold">({s.plate})</span>
              <span>{s.label}</span>
            </li>
          ))}
        </ul>

        <div className="col-span-4 flex flex-col gap-4 md:col-span-8">
          <p className="max-w-2xl text-lede">
            Overprint is a graphic design studio in Manchester. We make identities, print and
            type that refuse to whisper.
          </p>
          <h1 id="hero-title" className="text-head md:w-7/8">
            Identity, print and type, layered until it’s loud.
          </h1>
        </div>
      </div>
    </section>
  );
}
