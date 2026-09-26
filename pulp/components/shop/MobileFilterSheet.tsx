"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState, type ReactElement, type ReactNode } from "react";
import CloseIcon from "@/components/icons/CloseIcon";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface MobileFilterSheetProps {
  /** Active filter count, shown on the trigger so it reads when closed. */
  count: number;
  onClear: () => void;
  /** How many garments the current filters leave, for the confirm control. */
  resultCount: number;
  children: ReactNode;
}

/**
 * The filters, below 1024.
 *
 * Thirty chips laid out above the grid would push the product off a phone
 * screen entirely, so below the breakpoint they move into a sheet. Above it
 * they sit in the open as a band and this component is not rendered at all.
 *
 * The third use of `@radix-ui/react-dialog` on the site, after the basket
 * slide-over and the mobile nav. `CLAUDE.md` gates the package rather than the
 * number of overlays, and the reason for reaching for it is the same each time:
 * focus trapping and restoration are not worth hand-rolling. Every visual is
 * still from `DESIGN.md`.
 *
 * Widening past 1024 closes it, or the sheet would keep the focus trap and the
 * scroll lock while CSS had already hidden it.
 */
const TABLET_UP = "(min-width: 1024px)";

export default function MobileFilterSheet({
  count,
  onClear,
  resultCount,
  children,
}: MobileFilterSheetProps): ReactElement {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(TABLET_UP);
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="type-button inline-flex min-h-48 items-center gap-8 border-2 border-ink px-24 py-16 transition-colors hover:bg-ink hover:text-page active:translate-y-[1px] desktop:hidden">
        Filters
        {count > 0 && (
          <span aria-hidden="true">
            <Badge>{count}</Badge>
          </span>
        )}
        <span className="sr-only">
          {count === 0 ? ", none set" : `, ${count} set`}
        </span>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-40 bg-ink/40
            data-[state=open]:animate-overlay-in
            data-[state=closed]:animate-overlay-out"
        />

        <Dialog.Content
          className="fixed inset-y-0 right-0 z-50 flex w-full max-w-full flex-col
            border-l-2 border-ink bg-page
            data-[state=open]:animate-panel-in
            data-[state=closed]:animate-panel-out
            tablet:w-panel desktop:hidden"
        >
          <header className="flex shrink-0 items-center justify-between gap-16 border-b-2 border-ink px-24 py-16">
            <Dialog.Title className="type-lg">Filters</Dialog.Title>

            <Dialog.Close
              aria-label="Close filters"
              className="inline-flex size-48 shrink-0 items-center justify-center
                text-ink transition-colors hover:bg-ink hover:text-page
                active:translate-y-[1px]"
            >
              <CloseIcon className="size-24" decorative />
            </Dialog.Close>
          </header>

          <Dialog.Description className="sr-only">
            Size, colour, type and spec. Results update as you choose.
          </Dialog.Description>

          <div className="flex-1 overflow-y-auto overscroll-contain px-24 py-40">
            {children}
          </div>

          {/* The grid is behind the sheet, so the count comes to the control
              that dismisses it rather than making the reader close it to look. */}
          <div className="flex shrink-0 items-center gap-16 border-t-2 border-ink px-24 py-24">
            <Dialog.Close asChild>
              <Button fullWidth>
                {resultCount === 1
                  ? "Show 1 garment"
                  : `Show ${resultCount} garments`}
              </Button>
            </Dialog.Close>

            {count > 0 && (
              <button
                type="button"
                onClick={onClear}
                className="type-base shrink-0 underline decoration-1 underline-offset-2
                  transition-colors hover:text-rose active:translate-y-[1px]"
              >
                Clear
              </button>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
