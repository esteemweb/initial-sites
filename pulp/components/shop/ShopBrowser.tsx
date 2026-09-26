"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, type ReactElement } from "react";
import { PRODUCTS, type SpecCode, type Category, type Size } from "@/data/products";
import ProductCard from "@/components/ui/ProductCard";
import {
  EMPTY_SELECTION,
  browse,
  isEmptySelection,
  selectionCount,
  type Selection,
  type SortKey,
} from "@/lib/shop/filters";
import { parseSelection, parseSort, serialise, toggle } from "@/lib/shop/params";
import FilterPanel from "./FilterPanel";
import MobileFilterSheet from "./MobileFilterSheet";
import ResultCount from "./ResultCount";
import ShopEmpty from "./ShopEmpty";
import SortSelect from "./SortSelect";

/**
 * The shop, driven entirely by the query string.
 *
 * The URL is the state — there is no `useState` here to fall out of step with
 * it. A filtered view can be linked, bookmarked and reloaded, and the back
 * button behaves. Updates go through `replace` rather than `push`, so ticking
 * six chips does not bury the previous page under six history entries, and
 * `scroll: false` keeps the page from jumping to the top on every toggle.
 *
 * The panel is rendered twice and hidden by CSS rather than by script: as a
 * band from 1024 up, and inside the sheet below it. `display: none` takes the
 * hidden copy out of the tab order and the accessibility tree, so there are
 * never two live sets of controls.
 */
export default function ShopBrowser(): ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params = useMemo(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams],
  );
  const selection = useMemo(() => parseSelection(params), [params]);
  const sort = useMemo(() => parseSort(params), [params]);

  const apply = useCallback(
    (next: Selection, nextSort: SortKey) => {
      const query = serialise(next, nextSort);
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [router, pathname],
  );

  const results = useMemo(() => browse(selection, sort), [selection, sort]);

  const filtered = !isEmptySelection(selection);
  const activeCount = selectionCount(selection);

  const clear = useCallback(
    // Sort is not a filter, so clearing the filters leaves it alone.
    () => apply(EMPTY_SELECTION, sort),
    [apply, sort],
  );

  const panel = (
    <FilterPanel
      selection={selection}
      onToggleSize={(size: Size) =>
        apply({ ...selection, sizes: toggle(selection.sizes, size) }, sort)
      }
      onToggleColourway={(slug: string) =>
        apply(
          { ...selection, colourways: toggle(selection.colourways, slug) },
          sort,
        )
      }
      onToggleCategory={(category: Category) =>
        apply(
          { ...selection, categories: toggle(selection.categories, category) },
          sort,
        )
      }
      onToggleSpec={(code: SpecCode) =>
        apply({ ...selection, spec: toggle(selection.spec, code) }, sort)
      }
    />
  );

  return (
    <>
      {/* The band. Every chip in the open from 1024 up — nothing behind an
          interaction on the screens with room for it. */}
      <div className="hidden border-y-2 border-ink py-40 desktop:block">
        {panel}
      </div>

      <div className="mt-40 flex flex-wrap items-end justify-between gap-24">
        <div className="flex flex-wrap items-center gap-24">
          <MobileFilterSheet
            count={activeCount}
            onClear={clear}
            resultCount={results.length}
          >
            {panel}
          </MobileFilterSheet>

          <ResultCount
            shown={results.length}
            total={PRODUCTS.length}
            filtered={filtered}
          />

          {filtered && (
            <button
              type="button"
              onClick={clear}
              className="type-base underline decoration-1 underline-offset-2
                transition-colors hover:text-rose active:translate-y-[1px]"
            >
              Clear filters
              <span className="sr-only">
                , {activeCount} currently set
              </span>
            </button>
          )}
        </div>

        <SortSelect
          value={sort}
          onChange={(next) => apply(selection, next)}
          className="w-full tablet:w-auto"
        />
      </div>

      {results.length === 0 ? (
        <div className="mt-40">
          <ShopEmpty onClear={clear} />
        </div>
      ) : (
        <div className="mt-64 grid grid-cols-2 gap-8 desktop:gap-16">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}
