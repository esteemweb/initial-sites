import type { Metadata } from "next";
import { Suspense, type ReactElement } from "react";
import LoadingMark from "@/components/icons/LoadingMark";
import ShopBrowser from "@/components/shop/ShopBrowser";

export const metadata: Metadata = {
  title: "Shop — PULP",
  description:
    "Every garment we make. Heavyweight cotton, plain, in a handful of colours.",
};

/**
 * The shop.
 *
 * The heading is prerendered on the server; the browser below it reads the
 * query string, which Next 16 will not prerender, so it sits behind a
 * `Suspense` boundary. Without one the whole client tree up to the root would
 * be client-rendered instead of just the part that depends on the URL.
 *
 * The fallback is the §4 loading state rather than a blank — the rotating drum,
 * with its own static equivalent under reduced motion.
 */
export default function Shop(): ReactElement {
  return (
    <main className="shell py-40 desktop:py-48">
      <p className="type-label">Shop</p>
      <h1 className="type-xl mt-16">The whole range.</h1>

      <div className="mt-64">
        <Suspense
          fallback={
            <div className="flex min-h-96 items-center border-y-2 border-ink py-40">
              <LoadingMark label="Loading the range" />
            </div>
          }
        >
          <ShopBrowser />
        </Suspense>
      </div>
    </main>
  );
}
