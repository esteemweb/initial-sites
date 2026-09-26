import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SPEC_LABELS, PRODUCTS, type SpecCode } from "@/data/products";
import SpecMark from "@/components/icons/SpecMark";
import CartIcon from "@/components/icons/CartIcon";
import CloseIcon from "@/components/icons/CloseIcon";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import ProductCard from "@/components/ui/ProductCard";
import TextLink from "@/components/ui/TextLink";
import {
  AddToBasketDemo,
  SizeSelectorDemo,
  QuantityStepperDemo,
} from "./ComponentDemos";

export const metadata: Metadata = {
  title: "Foundation — PULP",
  description: "Every token and every symbol on one page.",
  // Internal design reference, not a customer-facing page: keep it out of
  // search results and tell crawlers not to follow on from it
  // (SECURITY-AUDIT.md #11a).
  robots: { index: false, follow: false },
};

const COLOURS = [
  { token: "paper", hex: "#F4F1E8", role: "The ground the site sits on", swatch: "bg-paper border-2 border-ink" },
  { token: "page", hex: "#FFFFFF", role: "A sheet on that ground: panel, dialog, product shot", swatch: "bg-page border-2 border-ink" },
  { token: "ink", hex: "#111111", role: "Body text, marks, borders", swatch: "bg-ink" },
  { token: "rose", hex: "#B8566A", role: "Spot one. Page text on it.", swatch: "bg-rose" },
  { token: "ultra", hex: "#1B4DFF", role: "Spot two. Page text on it.", swatch: "bg-ultra" },
  { token: "volt", hex: "#D9FF00", role: "Spot three. Ink text on it, never white.", swatch: "bg-volt" },
  { token: "rule", hex: "#E6E6E6", role: "Hairlines, dividers, disabled surfaces", swatch: "bg-rule" },
];

const TYPE_ROLES = [
  // §3: `display` is the one role that switches at 1174 rather than 1024.
  { token: "display", desktop: "200px", mobile: "64px", face: "Bricolage Grotesque", cls: "type-display", sample: "Small Run", switchesAt: 1174 },
  { token: "xl", desktop: "96px", mobile: "48px", face: "Bricolage Grotesque", cls: "type-xl", sample: "One Pass" },
  { token: "lg", desktop: "48px", mobile: "32px", face: "Bricolage Grotesque", cls: "type-lg", sample: "Loud colours, small runs" },
  { token: "md", desktop: "24px", mobile: "20px", face: "Inter", cls: "type-md", sample: "Mid-weight cotton, cut boxy, screen printed." },
  { token: "base", desktop: "16px", mobile: "16px", face: "Inter", cls: "type-base", sample: "A mid-weight tee at 240gsm, cut boxy through the body with a ribbed collar that holds its shape." },
  { token: "button", desktop: "16px", mobile: "16px", face: "Bricolage Grotesque", cls: "type-button", sample: "Add to basket" },
  { token: "label", desktop: "13px", mobile: "13px", face: "Space Mono", cls: "type-label", sample: "240 GSM" },
];

const SPACING = [8, 16, 24, 40, 48, 64, 80, 96, 160];

const SPACING_WIDTH: Record<number, string> = {
  8: "w-8",
  16: "w-16",
  24: "w-24",
  40: "w-40",
  48: "w-48",
  64: "w-64",
  80: "w-80",
  96: "w-96",
  160: "w-160",
};

const BREAKPOINTS = [
  { name: "base", width: "360px", cols: "4 columns", gutter: "24px" },
  { name: "tablet", width: "768px", cols: "8 columns", gutter: "24px" },
  { name: "desktop", width: "1024px", cols: "12 columns", gutter: "64px" },
  { name: "wide", width: "1440px", cols: "12 columns, content box caps", gutter: "64px" },
];

const SPEC_CODES = Object.keys(SPEC_LABELS) as SpecCode[];

const CARD_SLUGS = [
  "riso-tee",
  "studio-hoodie",
  "utility-cargo",
  "press-crew",
  "six-panel-cap",
  "flat-tote",
];

const CARD_PRODUCTS = CARD_SLUGS.map(
  (slug) => PRODUCTS.find((p) => p.slug === slug)!,
);

function Section({
  marker,
  title,
  children,
}: {
  marker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t-2 border-ink pt-40">
      <p className="type-label text-rose">{marker}</p>
      <h2 className="type-lg mt-8">{title}</h2>
      <div className="mt-40">{children}</div>
    </section>
  );
}

function Shell({ children }: { children: ReactNode }) {
  return <div className="shell">{children}</div>;
}

function Specimen({ note, children }: { note: string; children: ReactNode }) {
  return (
    <div>
      <p className="type-label mb-16 text-rose">{note}</p>
      {children}
    </div>
  );
}

export default function Styleguide() {
  return (
    <main>
      {/* Full-bleed signal block. Colour arrives in committed blocks. */}
      <div className="bg-rose py-64 text-page desktop:py-96">
        <Shell>
          <p className="type-label">Foundation</p>
          <h1 className="type-xl mt-16">Every token, one page</h1>
          <p className="type-base measure mt-24">
            Tokens are read straight from the theme, not retyped. If a value on
            this page is wrong, the theme is wrong.
          </p>
        </Shell>
      </div>

      <Shell>
        <div className="flex flex-col gap-80 py-80 desktop:gap-160 desktop:py-160">
          {/* --- Colour ---------------------------------------------------- */}
          <Section marker="§2" title="Colour">
            <ul className="flex flex-col gap-24">
              {COLOURS.map((c) => (
                <li key={c.token} className="flex items-center gap-24">
                  <div className={`size-80 shrink-0 ${c.swatch}`} />
                  <div>
                    <p className="type-label">{c.token}</p>
                    <p className="type-label mt-8 text-rose">{c.hex}</p>
                    <p className="type-base mt-8">{c.role}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Section>

          {/* --- Typography ------------------------------------------------ */}
          <Section marker="§3" title="Type scale">
            <ul className="flex flex-col gap-64">
              {TYPE_ROLES.map((t) => (
                <li key={t.token}>
                  <div className="flex flex-wrap items-baseline gap-x-24 gap-y-8 border-b border-rule pb-16">
                    <p className="type-label">{t.token}</p>
                    <p className="type-label text-rose">
                      {t.mobile} → {t.desktop} at {t.switchesAt ?? 1024}
                    </p>
                    <p className="type-label">{t.face}</p>
                  </div>
                  <p className={`${t.cls} measure mt-24`}>{t.sample}</p>
                </li>
              ))}
            </ul>
            <p className="type-base measure mt-64">
              Tracking of -0.02em applies at 48px and above only, which is why
              lg carries it on desktop and drops it at 32px. Body copy is never
              set below 16px and line length is capped at 70 characters.
            </p>
          </Section>

          {/* --- Spacing --------------------------------------------------- */}
          <Section marker="§5" title="Spacing ramp">
            <ul className="flex flex-col gap-16">
              {SPACING.map((s) => (
                <li key={s} className="flex items-center gap-24">
                  <p className="type-label w-64 shrink-0">{s}px</p>
                  <div className={`h-24 bg-rose ${SPACING_WIDTH[s]}`} />
                </li>
              ))}
            </ul>
            <p className="type-base measure mt-40">
              These nine values are the whole ramp. The default scale is cleared
              from the theme, so an off-ramp value is not reachable as a
              utility. Tokens are named for their pixel value: gap-16 is 16px.
            </p>
          </Section>

          {/* --- Grid and breakpoints -------------------------------------- */}
          <Section marker="§8" title="Breakpoints and grid">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b-2 border-ink">
                  <th className="type-label py-16 pr-24">Name</th>
                  <th className="type-label py-16 pr-24">Width</th>
                  <th className="type-label py-16 pr-24">Columns</th>
                  <th className="type-label py-16">Gutter</th>
                </tr>
              </thead>
              <tbody>
                {BREAKPOINTS.map((b) => (
                  <tr key={b.name} className="border-b border-rule">
                    <td className="type-base py-16 pr-24">{b.name}</td>
                    <td className="type-base py-16 pr-24">{b.width}</td>
                    <td className="type-base py-16 pr-24">{b.cols}</td>
                    <td className="type-base py-16">{b.gutter}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="type-label mt-40">12 / 8 / 4 columns, live</p>
            <div className="mt-16 grid grid-cols-4 gap-24 tablet:grid-cols-8 desktop:grid-cols-12 desktop:gap-64">
              {Array.from({ length: 12 }, (_, i) => (
                <div
                  key={i}
                  className={`h-80 bg-rule/40 ${i >= 4 ? "hidden tablet:block" : ""} ${i >= 8 ? "tablet:hidden desktop:block" : ""}`}
                />
              ))}
            </div>
          </Section>

          {/* --- Spec marks ------------------------------------------------ */}
          <Section marker="§4" title="Spec marks">
            <p className="type-base measure">
              One glyph for every spec code in the catalogue. Filled paths on a
              48-unit grid, minimum limb 3 units, which holds at 16px. Wash and
              iron temperature use dots, not numerals.
            </p>

            <p className="type-label mt-64">64px, section marker size</p>
            <ul className="mt-24 grid grid-cols-2 gap-40 tablet:grid-cols-3 desktop:grid-cols-4">
              {SPEC_CODES.map((code) => (
                <li key={code} className="flex flex-col gap-16">
                  <SpecMark code={code} className="size-64" decorative />
                  <div>
                    <p className="type-label">{code}</p>
                    <p className="type-base mt-8">{SPEC_LABELS[code]}</p>
                  </div>
                </li>
              ))}
            </ul>

            <p className="type-label mt-80">16px, UI size, with hidden labels</p>
            <div className="mt-24 flex flex-wrap items-center gap-24 border-2 border-ink p-24">
              {SPEC_CODES.map((code) => (
                <SpecMark key={code} code={code} className="size-16" />
              ))}
            </div>

            <p className="type-label mt-80">16px on a signal block</p>
            <div className="mt-24 flex flex-wrap items-center gap-24 bg-rose p-24 text-page">
              {SPEC_CODES.map((code) => (
                <SpecMark key={code} code={code} className="size-16" />
              ))}
            </div>

            <p className="type-label mt-80">With visible text equivalent</p>
            <ul className="mt-24 flex flex-col gap-16">
              {SPEC_CODES.slice(0, 4).map((code) => (
                <li key={code}>
                  <SpecMark code={code} className="size-24" showLabel />
                </li>
              ))}
            </ul>

            <p className="type-label mt-80">160px, page graphic</p>
            <div className="mt-24">
              <SpecMark code="fit-boxy" className="size-160" decorative />
            </div>
          </Section>

          {/* --- UI icons --------------------------------------------------- */}
          <Section marker="§4" title="UI icons">
            <p className="type-base measure">
              Two, drawn to match the spec set. There is no search on this site
              and no account icon, because there are no accounts.
            </p>
            <ul className="mt-40 flex flex-wrap gap-64">
              <li className="flex flex-col gap-16">
                <CartIcon className="size-64" decorative />
                <p className="type-label">Basket</p>
              </li>
              <li className="flex flex-col gap-16">
                <CloseIcon className="size-64" decorative />
                <p className="type-label">Close</p>
              </li>
              <li className="flex flex-col gap-16">
                <div className="flex items-center gap-16">
                  <CartIcon className="size-16" />
                  <CloseIcon className="size-16" />
                </div>
                <p className="type-label">16px, labelled</p>
              </li>
            </ul>
          </Section>

          {/* --- Guarantees -------------------------------------------------- */}
          <Section marker="§4 §6" title="Corners, depth, motion">
            <ul className="type-base flex flex-col gap-16">
              <li>
                Border radius is 0 everywhere. The radius scale is cleared from
                the theme and zeroed in base, so there is no rounded utility.
              </li>
              <li>
                Shadow, inset shadow, drop shadow and blur scales are cleared.
                There is no UI depth to reach for.
              </li>
              <li>
                Focus is a 2px signal outline at 2px offset, set globally and
                always visible.
              </li>
              <li>
                Motion durations are tokens: 400ms tumble, 200ms unfold, 150ms
                cross-fade. Reduced motion is handled at the base layer and
                again per component, never as a bare removal.
              </li>
            </ul>
            <div className="mt-40 flex flex-wrap gap-24">
              <span className="type-label border-2 border-ink px-24 py-16">
                Square
              </span>
              <span className="type-label bg-rule/40 px-24 py-16">No shadow</span>
              <button
                type="button"
                className="type-label border-2 border-ink px-24 py-16"
              >
                Tab to me
              </button>
            </div>
          </Section>

          {/* --- Buttons ---------------------------------------------------- */}
          <Section marker="§4" title="Buttons">
            <p className="type-base measure">
              Two types on the button type role, 24px vertical and 40px
              horizontal padding. Hover, active and focus are live: primary
              inverts to ink, secondary fills ink with white text, both shift
              down 1px on press, and focus is the global 2px signal outline at
              2px offset. Tab through them to see it.
            </p>

            <div className="mt-64 flex flex-col gap-64">
              <Specimen note="Primary — default, disabled, loading">
                <div className="flex flex-wrap items-start gap-24">
                  <Button>Add to basket</Button>
                  <Button disabled>Add to basket</Button>
                  <Button loading>Add to basket</Button>
                </div>
              </Specimen>

              <Specimen note="Secondary — default, disabled, loading">
                <div className="flex flex-wrap items-start gap-24">
                  <Button variant="secondary">Keep shopping</Button>
                  <Button variant="secondary" disabled>
                    Keep shopping
                  </Button>
                  <Button variant="secondary" loading>
                    Keep shopping
                  </Button>
                </div>
              </Specimen>

              <Specimen note="Full width, as it sits in the basket and checkout">
                <Button fullWidth>Go to checkout</Button>
              </Specimen>

              <Specimen note="On a signal block, where secondary has to hold up">
                <div className="flex flex-wrap gap-24 bg-rose p-40">
                  <Button variant="secondary" className="border-page text-page hover:bg-page hover:text-rose">
                    Read the size guide
                  </Button>
                </div>
              </Specimen>
            </div>
          </Section>

          {/* --- Text link --------------------------------------------------- */}
          <Section marker="§4" title="Text link">
            <p className="type-base measure">
              Not a button. Inter, sentence case, base, no padding, 1px
              underline at 2px offset, turning signal on hover. The underline is
              always present, so the link is identifiable without hovering.
            </p>
            <div className="mt-40 flex flex-col gap-24">
              <p className="type-base measure">
                Every garment is cut boxy and printed one colour at a time. If
                you are unsure how a piece is meant to sit, check the{" "}
                <TextLink href="/size-guide">size guide</TextLink> or read{" "}
                <TextLink href="/the-label">the label</TextLink> before you
                order.
              </p>
              <div>
                <TextLink href="/shop">Back to shop</TextLink>
              </div>
            </div>
          </Section>

          {/* --- Form field --------------------------------------------------- */}
          <Section marker="§4" title="Form field">
            <p className="type-base measure">
              Square, 2px ink border, 16px padding, Inter at base, with the
              label above in Space Mono uppercase — everywhere on the site,
              checkout included. On error the border stays ink: there is no
              fourth interface colour, so the message below carries the meaning
              and says how to fix it.
            </p>

            <div className="mt-64 grid gap-40 tablet:grid-cols-2">
              <Specimen note="Default">
                <FormField id="sg-default" label="Full name" placeholder="Ada Okonjo" />
              </Specimen>

              <Specimen note="Filled">
                <FormField id="sg-filled" label="Postcode" defaultValue="E8 3DL" />
              </Specimen>

              <Specimen note="With hint">
                <FormField
                  id="sg-hint"
                  label="Delivery instructions"
                  placeholder="Leave with a neighbour"
                  hint="Optional. Couriers see this at the door."
                />
              </Specimen>

              <Specimen note="Error — what is wrong and how to fix it">
                <FormField
                  id="sg-error"
                  label="Email address"
                  defaultValue="ada@"
                  error="This email address is missing everything after the @. Add the part after it, like ada@example.com."
                />
              </Specimen>

              <Specimen note="Disabled">
                <FormField
                  id="sg-disabled"
                  label="Country"
                  defaultValue="United Kingdom"
                  disabled
                />
              </Specimen>

              <Specimen note="Focus — click or tab into any field above">
                <FormField id="sg-focus" label="Discount code" placeholder="WASHDAY" />
              </Specimen>
            </div>
          </Section>

          {/* --- Badge --------------------------------------------------------- */}
          <Section marker="§4" title="Badge">
            <p className="type-base measure">
              A conditional overlay, not a structural variant. Signal fill,
              white text, Space Mono label, flush to the top-left corner of the
              image it sits on. It fires on last-few and sold-out states.
            </p>
            <div className="mt-40 flex flex-wrap items-start gap-24">
              <Badge>Last few left</Badge>
              <Badge>Sold out</Badge>
            </div>
            <div className="mt-40 aspect-[4/5] w-160 relative bg-rule/40">
              <Badge className="absolute left-0 top-0">Sold out</Badge>
            </div>
          </Section>

          {/* --- Colourway swatch and size selector ---------------------------- */}
          <Section marker="§4" title="Size selector">
            <p className="type-base measure">
              Sold-out sizes render disabled rather than hidden, so the customer
              sees the whole range. Where a product carries the single size ONE,
              the control&apos;s slot holds a static label instead: the structure
              holds and the control disappears. Built on native radios, so arrow
              keys work without re-implementing them.
            </p>
            <div className="mt-64">
              <SizeSelectorDemo />
            </div>
          </Section>

          <Section marker="§4" title="Quantity stepper">
            <p className="type-base measure">
              48px controls either side of the count, capped at the units left
              in the chosen size so the basket cannot oversell. The minus and
              plus are drawn to the spec set&apos;s rules rather than set as
              type.
            </p>
            <div className="mt-64">
              <QuantityStepperDemo />
            </div>
          </Section>

          {/* --- Product card -------------------------------------------------- */}
          <Section marker="§4" title="Product card">
            <p className="type-base measure">
              Six slots in fixed order: image at 4:5, name, fabric weight, price,
              colourway swatches, spec row. Real catalogue data throughout.
              Photography is not generated yet, so the image slot is a flat wash
              box at the right ratio with the colourway name standing in.
            </p>
            <p className="type-base measure mt-24">
              Swatches are 24px squares at a 48px pitch. Selecting one changes
              the image — on hover with a pointer, on tap without one — and
              tapping the image navigates. Try the Warm Iron Beanie in Oxblood
              and the Static Cap in Bone: both fire a badge.
            </p>
            <p className="type-base measure mt-24">
              The Warm Iron Beanie has no GSM, so its third slot carries a
              composition summary instead. The spec row shows three marks by
              fixed priority — wash, bleach, dry, iron, dry-clean — never the
              first three of the array.
            </p>

            <div className="mt-80 grid grid-cols-2 gap-8 desktop:gap-16">
              {CARD_PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </Section>

          {/* --- Add to basket ------------------------------------------------- */}
          <Section marker="§4 / §12" title="Add to basket">
            <p className="type-base measure">
              The card has no add control, because §4 fixes its six slots and a
              card carries no size choice. So the card stays as specified and
              the controls sit beside it: colour, size, then the button. The
              real add flow, with the 400ms tumble from §9, belongs with the
              product detail page.
            </p>
            <p className="type-base measure mt-24">
              Adding opens the slide-over. Soot is sold out in M and Bluing in
              XL, so neither can be added; Bluing XXL has one left, and the
              stepper in the basket will not go past it. Try WASHDAY in the
              discount field, and reload the page to see the basket come back.
            </p>

            <div className="mt-80">
              <AddToBasketDemo />
            </div>
          </Section>
        </div>
      </Shell>
    </main>
  );
}
