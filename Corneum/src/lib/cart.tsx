"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getProduct } from "@/data/products";
import { canCheckout, cleanBag, cleanOrders, orderHasVessel, ownsVessel as ownsAny } from "./rules";

/* The bag and this browser's order history. Both persist in localStorage
   as a convenience; the site still renders when storage is unavailable.

   The business rule (BRIEF Â§12): a first order must include Vessel 01;
   refills alone are allowed only once a vessel has been bought. There are
   no accounts, so "has bought a vessel" means an order in this browser's
   history contained one. `canCheckout` is the single source of truth for
   the rule; the bag and checkout pages both read it. */

export type CartItem = { slug: string; qty: number };
export type Order = { id: string; items: CartItem[]; total: number; date: string; hasVessel: boolean };

export const MAX_QTY = 9;
const BAG_KEY = "corneum-bag";
const ORDERS_KEY = "corneum-orders";

type CartValue = {
  /** False until storage has been read after hydration. */
  ready: boolean;
  items: CartItem[];
  count: number;
  total: number;
  hasVessel: boolean;
  ownsVessel: boolean;
  canCheckout: boolean;
  orders: Order[];
  add: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  placeOrder: () => Order;
  /** Last announcement for the aria-live region. */
  message: string;
};

const CartContext = createContext<CartValue | null>(null);

const read = <T,>(key: string, fallback: T): T => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};
const write = (key: string, value: unknown) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
};

const isKnown = (slug: string) => getProduct(slug) !== undefined;
const priceOf = (slug: string) => getProduct(slug)?.price.value ?? 0;
const sum = (items: CartItem[]) => items.reduce((a, i) => a + priceOf(i.slug) * i.qty, 0);
const countOf = (items: CartItem[]) => items.reduce((a, i) => a + i.qty, 0);

const orderId = () => {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `CN-${ymd}-${String(Math.floor(1000 + Math.random() * 9000))}`;
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- hydrate from storage after mount */
    // Malformed stored data falls back to an empty bag / history (rules.ts)
    setItems(cleanBag(read<unknown>(BAG_KEY, []), isKnown, MAX_QTY));
    setOrders(cleanOrders(read<unknown>(ORDERS_KEY, []), isKnown, MAX_QTY));
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const commit = useCallback((next: CartItem[], announce: string) => {
    setItems(next);
    write(BAG_KEY, next);
    setMessage(announce);
  }, []);

  const add = useCallback(
    (slug: string) => {
      const found = items.find((i) => i.slug === slug);
      if (found && found.qty >= MAX_QTY) return setMessage(`${getProduct(slug)?.name} is at the maximum of ${MAX_QTY}.`);
      const next = found ? items.map((i) => (i.slug === slug ? { ...i, qty: i.qty + 1 } : i)) : [...items, { slug, qty: 1 }];
      const n = countOf(next);
      commit(next, `Added to bag. Bag now holds ${n} ${n === 1 ? "item" : "items"}.`);
    },
    [items, commit],
  );

  const setQty = useCallback(
    (slug: string, qty: number) => {
      const q = Math.max(1, Math.min(MAX_QTY, qty));
      commit(
        items.map((i) => (i.slug === slug ? { ...i, qty: q } : i)),
        `${getProduct(slug)?.name}: quantity ${q}.`,
      );
    },
    [items, commit],
  );

  const remove = useCallback(
    (slug: string) => commit(items.filter((i) => i.slug !== slug), `${getProduct(slug)?.name} removed from bag.`),
    [items, commit],
  );

  const placeOrder = useCallback(() => {
    const order: Order = {
      id: orderId(),
      items,
      total: sum(items),
      date: new Date().toISOString(),
      hasVessel: orderHasVessel(items),
    };
    const nextOrders = [...orders, order];
    setOrders(nextOrders);
    write(ORDERS_KEY, nextOrders);
    commit([], "Order placed.");
    return order;
  }, [items, orders, commit]);

  const value = useMemo<CartValue>(() => {
    const hasVessel = orderHasVessel(items);
    const ownsVessel = ownsAny(orders);
    return {
      ready,
      items,
      count: countOf(items),
      total: sum(items),
      hasVessel,
      ownsVessel,
      canCheckout: canCheckout(items, orders),
      orders,
      add,
      setQty,
      remove,
      placeOrder,
      message,
    };
  }, [ready, items, orders, add, setQty, remove, placeOrder, message]);

  return (
    <CartContext.Provider value={value}>
      {children}
      <p className="sr-only" aria-live="polite">
        {message}
      </p>
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
