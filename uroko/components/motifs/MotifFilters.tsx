"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { categories, methods, type Method, type MotifCategory } from "@/lib/content/motifs";
import { motifQueryString, parseMotifQuery } from "@/lib/motifs/filter";

/**
 * Filter state lives in the URL (?q=&c=&m=) so results are shareable, the
 * back button works, and the server renders the filtered grid. Without
 * JavaScript the form still submits as a plain GET.
 */
export function MotifFilters({ count }: { count: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const query = parseMotifQuery(Object.fromEntries(sp.entries()));
  const [pending, startTransition] = useTransition();
  const [q, setQ] = useState(query.q ?? "");
  const [syncedQ, setSyncedQ] = useState(query.q);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep the input in sync when the URL changes from outside (back button):
  // adjust state during render rather than in an effect.
  if (syncedQ !== query.q) {
    setSyncedQ(query.q);
    setQ(query.q ?? "");
  }

  const push = (next: typeof query) => {
    startTransition(() => {
      router.replace(`${pathname}${motifQueryString(next)}`, { scroll: false });
    });
  };

  const onSearch = (value: string) => {
    setQ(value);
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => push({ ...query, q: value.trim() || undefined }), 250);
  };

  const setCategory = (c?: MotifCategory) => push({ ...query, c: query.c === c ? undefined : c });
  const setMethod = (m?: Method) => push({ ...query, m: query.m === m ? undefined : m });
  const active = Boolean(query.q || query.c || query.m);

  return (
    <form
      role="search"
      action={pathname}
      method="get"
      onSubmit={(e) => {
        e.preventDefault();
        if (debounce.current) clearTimeout(debounce.current);
        push({ ...query, q: q.trim() || undefined });
      }}
      className="border-y border-line py-6"
      data-pending={pending || undefined}
    >
      <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-4">
          <label htmlFor="motif-search" className="eyebrow">
            Search
          </label>
          <div className="mt-2 flex h-12 items-center border-b border-line bg-surface-raised focus-within:border-shu">
            <input
              id="motif-search"
              name="q"
              type="search"
              value={q}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="koi, peony, back piece…"
              autoComplete="off"
              className="h-full w-full bg-transparent px-3 text-base outline-none placeholder:text-text-muted/70"
            />
          </div>
        </div>

        <fieldset className="min-w-0 lg:col-span-5">
          <legend className="eyebrow">Category</legend>
          <div className="-mx-5 mt-2 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
            <Chip selected={!query.c} onClick={() => setCategory(undefined)}>
              All
            </Chip>
            {categories.map((c) => (
              <Chip key={c.id} selected={query.c === c.id} onClick={() => setCategory(c.id)} ja={c.ja}>
                {c.label}
              </Chip>
            ))}
          </div>
        </fieldset>

        <fieldset className="min-w-0 lg:col-span-3">
          <legend className="eyebrow">Method</legend>
          <div className="-mx-5 mt-2 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
            {methods.map((m) => (
              <Chip key={m.id} selected={query.m === m.id} onClick={() => setMethod(m.id)} ja={m.ja}>
                {m.label}
              </Chip>
            ))}
          </div>
        </fieldset>
      </div>

      {/* Hidden mirrors so a no-JS GET submit keeps the chip state */}
      {query.c ? <input type="hidden" name="c" value={query.c} /> : null}
      {query.m ? <input type="hidden" name="m" value={query.m} /> : null}

      <div className="mt-6 flex items-center justify-between gap-4 text-sm text-text-muted">
        <p aria-live="polite" aria-atomic="true">
          {count} {count === 1 ? "motif" : "motifs"}
          {pending ? "…" : ""}
        </p>
        {active ? (
          <button
            type="button"
            onClick={() => {
              setQ("");
              push({});
            }}
            className="h-11 px-2 underline-offset-4 hover:underline"
          >
            Clear
          </button>
        ) : null}
      </div>
    </form>
  );
}

function Chip({
  selected,
  onClick,
  ja,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  ja?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-sm border px-3.5 text-sm transition-colors duration-150 ease-standard ${
        selected
          ? "border-text bg-text text-surface"
          : "border-line bg-transparent text-text hover:border-text"
      }`}
    >
      {ja ? (
        <span lang="ja" className="font-display" aria-hidden="true">
          {ja}
        </span>
      ) : null}
      {children}
    </button>
  );
}
