"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import type { Size } from "@/data/products";
import { calculateTotals, isValidCode, type Totals } from "@/lib/commerce";
import {
  EMPTY_BASKET,
  basketReducer,
  itemCount,
  readStoredBasket,
  resolveLines,
  subtotalOf,
  writeStoredBasket,
  type BasketState,
  type ResolvedLine,
} from "@/lib/basket/state";

interface BasketContextValue {
  lines: ResolvedLine[];
  count: number;
  totals: Totals;
  code: string | null;
  /**
   * False until the stored basket has been read. Surfaces that would otherwise
   * render a confident zero wait on this.
   */
  hydrated: boolean;

  add: (
    productId: string,
    colourway: string,
    size: Size,
    quantity?: number,
  ) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  /** Returns false when the code is not recognised; the field renders the error. */
  applyCode: (code: string) => boolean;
  removeCode: () => void;
  /** Empties the basket. Used when an order is placed. */
  clear: () => void;

  isOpen: boolean;
  open: () => void;
  close: () => void;
  setOpen: (open: boolean) => void;
}

const BasketContext = createContext<BasketContextValue | null>(null);

/**
 * The basket store, and the open state of the slide-over that displays it.
 *
 * The two live together because every surface that adds to the basket may also
 * want to show it, and a separate context for one boolean would mean two
 * providers wrapping the same tree.
 *
 * Persistence is deliberately one-directional on first paint: the server has no
 * localStorage, so the first client render must match the server and show an
 * empty basket. The stored basket is read in an effect immediately after, and
 * `hydrated` lets the count badge hold its tongue until it knows the answer,
 * rather than rendering a zero that jumps to three.
 */
export function BasketProvider({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  // `null` until the stored basket has been read, which is what keeps the
  // server render and the first client render in agreement.
  const [stored, dispatch] = useReducer(basketReducer, null);
  const [isOpen, setIsOpen] = useState(false);

  const hydrated = stored !== null;
  const state = stored ?? EMPTY_BASKET;

  useEffect(() => {
    dispatch({ type: "hydrate", state: readStoredBasket() });
  }, []);

  // Writing before the read has happened would persist the empty initial state
  // over a real basket, so the write is gated on the same null. The first write
  // after hydration is not wasted: it puts the sanitised basket back, pruning
  // lines whose product or size has since gone.
  useEffect(() => {
    if (stored === null) return;
    writeStoredBasket(stored);
  }, [stored]);

  const add = useCallback(
    (productId: string, colourway: string, size: Size, quantity = 1) => {
      dispatch({ type: "add", productId, colourway, size, quantity });
    },
    [],
  );

  const setQuantity = useCallback((key: string, quantity: number) => {
    dispatch({ type: "setQuantity", key, quantity });
  }, []);

  const remove = useCallback((key: string) => {
    dispatch({ type: "remove", key });
  }, []);

  const applyCode = useCallback((code: string) => {
    if (!isValidCode(code)) return false;
    dispatch({ type: "applyCode", code });
    return true;
  }, []);

  const removeCode = useCallback(() => {
    dispatch({ type: "removeCode" });
  }, []);

  const clear = useCallback(() => {
    dispatch({ type: "clear" });
  }, []);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo<BasketContextValue>(() => {
    const subtotal = subtotalOf(state.lines);

    return {
      lines: resolveLines(state.lines),
      count: itemCount(state.lines),
      totals: calculateTotals(subtotal, state.code !== null),
      code: state.code,
      hydrated,
      add,
      setQuantity,
      remove,
      applyCode,
      removeCode,
      clear,
      isOpen,
      open,
      close,
      setOpen: setIsOpen,
    };
  }, [
    state,
    hydrated,
    isOpen,
    add,
    setQuantity,
    remove,
    applyCode,
    removeCode,
    clear,
    open,
    close,
  ]);

  return (
    <BasketContext.Provider value={value}>{children}</BasketContext.Provider>
  );
}

export function useBasket(): BasketContextValue {
  const context = useContext(BasketContext);
  if (!context) {
    throw new Error("useBasket must be used inside a BasketProvider.");
  }
  return context;
}

export type { BasketState };
