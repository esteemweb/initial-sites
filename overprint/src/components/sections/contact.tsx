import { PlateText } from "@/components/plate-text";
import { EmailActions, EnquiryButton } from "@/components/email-actions";

const index = [
  { plate: "C", href: "#work", label: "Selected work" },
  { plate: "M", href: "#process", label: "How a job runs" },
  { plate: "Y", href: "#studio", label: "The studio" },
  { plate: "K", href: null, label: "Send a brief" },
];

/* pattern: closing section — refs/flowers-sim §9 item 10 (100vh on black, bracket
   index cols 1–2, contact block, edge-to-edge uppercase wordmark on the bottom
   edge). Matched by user request. On ink the CMYK plates switch to `screen`. */
const indexLink =
  "flex min-h-target w-full items-center justify-between underline-offset-4 hover:underline focus-visible:underline";

export function Contact() {
  return (
    <footer
      id="contact"
      aria-labelledby="contact-title"
      className="on-ink flex min-h-svh flex-col justify-between gap-stack-sm overflow-x-clip bg-ink pt-section-sm text-paper md:pt-section"
    >
      <div className="grid-page gap-y-stack-sm">
        <nav aria-label="Footer" className="col-span-4 md:col-span-2">
          <p className="mb-4 text-micro text-paper/70 uppercase">(Index)</p>
          <ul className="border-t border-paper/40">
            {index.map((item) => (
              <li key={item.plate} className="border-b border-paper/40">
                {item.href ? (
                  <a href={item.href} className={indexLink}>
                    <span className="text-micro font-semibold">({item.plate})</span>
                    <span>{item.label}</span>
                  </a>
                ) : (
                  <EnquiryButton className={indexLink}>
                    <span className="text-micro font-semibold">({item.plate})</span>
                    <span>{item.label}</span>
                  </EnquiryButton>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-4 flex flex-col gap-6 md:col-start-5">
          <p className="text-micro text-paper/70 uppercase">(Start a project)</p>
          <h2 id="contact-title" className="text-head">
            Got something that needs to be louder?
          </h2>
          <p className="text-lede">
            Tell us what it is, when you need it and roughly what you have to spend. We read
            everything.
          </p>
          <div>
            <EmailActions />
          </div>
        </div>
      </div>

      <div>
        <div aria-hidden="true" className="@container px-edge">
          <p className="wordmark-fit font-display font-bold">
            <PlateText decorative className="register-scroll">
              Overprint
            </PlateText>
          </p>
        </div>

        <div className="grid-page mt-4 gap-y-2 border-t border-paper/40 py-4 text-micro text-paper/70">
          <p className="col-span-2">© 2026 Overprint</p>
          <p className="col-span-2">Manchester, UK</p>
          <p className="col-span-4 md:col-span-2 md:col-start-7">
            <a href="#main" className="inline-flex min-h-target items-center underline underline-offset-4">
              Back to top ↑
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
