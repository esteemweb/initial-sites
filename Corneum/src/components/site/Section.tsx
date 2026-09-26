import type { ReactNode } from "react";
import { Grid } from "@/components/ui/Grid";

/* Section frame used on every page: a hairline above, a mono label at
   col 1, content on the same 12 columns.
   (pattern: autopsy §1 — left = feeling, right rail from col 9 = facts)
   The hairline draws left to right as the section scrolls in
   (globals.css, .hairline-draw); without motion it is simply there. */
export function Section({
  id,
  label,
  children,
  className = "",
}: {
  id: string;
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Grid as="section" id={id} aria-labelledby={`${id}-label`} className={`hairline-draw gap-y-40 border-t border-hairline py-64 lg:py-96 ${className}`}>
      <h2 id={`${id}-label`} className="type-data col-span-12">
        {label}
      </h2>
      {children}
    </Grid>
  );
}
