import { InkChip } from "@/components/plate-text";

/* pattern: statement headline with inline image chips + mono paragraphs on col 5
   — refs/flowers-sim §3 (inline chips), §9 item 4. Chips are ink, not photos.
   Last panel over the pinned hero image; the image releases after this. */
export function Statement() {
  return (
    <section aria-labelledby="statement-title" className="relative isolate flex min-h-panel flex-col justify-center py-section-sm">
      {/* local shade behind the text column — keeps small copy ≥ 4.5:1 over the busy street without dimming the whole image */}
      <div aria-hidden="true" className="absolute inset-y-0 right-0 -z-10 w-3/4 bg-radial from-ink/75 to-transparent to-95%" />
      <div className="panel-fade grid-page gap-y-stack-sm md:gap-y-stack">
        <h2 id="statement-title" className="col-span-4 text-head md:col-span-8">
          We make brands that <InkChip inks="cm" /> print hard, <InkChip inks="my" /> hold up on
          screen and <InkChip inks="yc" /> still read from the back of the room.
        </h2>

        <div className="col-span-4 flex flex-col gap-5 md:col-span-3 md:col-start-5">
          <p>
            We design with the press in mind. Colours are built as separate plates that overlap,
            and the overlaps are part of the design.
          </p>
          <p>
            The same idea works on screen. Our sites layer live ink with CSS blend modes, so
            there are no flattened images to download.
          </p>
          <p>
            Clients come to us when a quiet brand isn’t getting noticed.
          </p>
        </div>
      </div>
    </section>
  );
}
