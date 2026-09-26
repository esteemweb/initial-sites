import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Grid } from "@/components/ui/Grid";

export const metadata: Metadata = { title: "Not found — Corneum", robots: { index: false, follow: false } };

export default function NotFound() {
  return (
    <main id="content" tabIndex={-1} className="outline-none">
      <Grid as="section" aria-labelledby="nf-title" className="min-h-svh content-start gap-y-24 pt-40 pb-64 lg:pb-96">
        <p className="type-data col-span-12 text-green">404</p>
        <h1 id="nf-title" className="type-display title-rise col-span-12">
          Not found.
        </h1>
        <p className="type-h4 col-span-12 max-w-measure lg:col-span-6">
          There is nothing at this address. We won&apos;t guess what you meant.
        </p>
        <div className="col-span-12 flex flex-wrap gap-16 lg:col-span-4 lg:col-start-9">
          <Button variant="secondary" href="/range">
            The range
          </Button>
          <Button variant="secondary" href="/conditions">
            Scalp conditions
          </Button>
          <Button variant="secondary" href="/">
            Home
          </Button>
        </div>
      </Grid>
    </main>
  );
}
