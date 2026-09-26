import {
  PRODUCTS,
  type Colourway,
  type Product,
  type Size,
} from "@/data/products";
import { sizeUnits } from "@/lib/stock";
import { normaliseCode, toPence } from "@/lib/commerce";

/**
 * The basket, as data. No React in this file, so the reducer and the storage
 * round-trip can be reasoned about — and later tested — on their own.
 *
 * A line stores only the choice: which product, which colourway, which size,
 * how many. Name, price and stock are joined from the catalogue at render, so
 * a basket left in storage for a month cannot resurrect an old price or a
 * colourway that has since been dropped.
 */

export interface BasketLine {
  productId: string;
  colourway: string;
  size: Size;
  quantity: number;
}

export interface BasketState {
  lines: BasketLine[];
  /** The applied discount code, normalised, or null. */
  code: string | null;
}

export const EMPTY_BASKET: BasketState = { lines: [], code: null };

/** Identity is the choice, not the product: L in Bone is not L in Soot. */
export function lineKey(
  line: Pick<BasketLine, "productId" | "colourway" | "size">,
): string {
  return `${line.productId}|${line.colourway}|${line.size}`;
}

/** A line joined to the catalogue. Everything a line item needs to render. */
export interface ResolvedLine {
  key: string;
  line: BasketLine;
  product: Product;
  colourway: Colourway;
  /** Pence. */
  unitPrice: number;
  /** Pence. */
  linePrice: number;
  /** Units left in this size of this colourway — the ceiling for the stepper. */
  available: number;
}

export function resolveLine(line: BasketLine): ResolvedLine | null {
  const product = PRODUCTS.find((p) => p.id === line.productId);
  if (!product) return null;

  const colourway = product.colourways.find((c) => c.slug === line.colourway);
  if (!colourway) return null;

  if (!product.sizes.includes(line.size)) return null;

  const unitPrice = toPence(product.price);

  return {
    key: lineKey(line),
    line,
    product,
    colourway,
    unitPrice,
    linePrice: unitPrice * line.quantity,
    available: sizeUnits(product, line.colourway, line.size),
  };
}

export function resolveLines(lines: BasketLine[]): ResolvedLine[] {
  return lines
    .map(resolveLine)
    .filter((resolved): resolved is ResolvedLine => resolved !== null);
}

/** Units, not lines — the badge counts garments. */
export function itemCount(lines: BasketLine[]): number {
  return lines.reduce((total, line) => total + line.quantity, 0);
}

/** Subtotal in pence, goods only. */
export function subtotalOf(lines: BasketLine[]): number {
  return resolveLines(lines).reduce((total, r) => total + r.linePrice, 0);
}

/* --------------------------------------------------------------------------
   Reducer
   -------------------------------------------------------------------------- */

export type BasketAction =
  | { type: "hydrate"; state: BasketState }
  | {
      type: "add";
      productId: string;
      colourway: string;
      size: Size;
      quantity?: number;
    }
  | { type: "setQuantity"; key: string; quantity: number }
  | { type: "remove"; key: string }
  | { type: "applyCode"; code: string }
  | { type: "removeCode" }
  | { type: "clear" };

/**
 * The stock ceiling for one choice. Everything that changes a quantity passes
 * through here, so the basket cannot oversell and a sold-out size cannot get
 * in by any route — adding, restoring from storage, or the stepper.
 */
function ceilingFor(productId: string, colourway: string, size: Size): number {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return 0;
  return sizeUnits(product, colourway, size);
}

/**
 * `null` means the stored basket has not been read yet — not that it is empty.
 * The distinction matters on first paint: the server cannot know what is in
 * storage, so the count badge has to be able to say "I do not know" rather
 * than render a confident zero that jumps to three a frame later.
 *
 * Nothing but `hydrate` can act on that state, which is safe because the read
 * happens on mount, before anything is interactive.
 */
export function basketReducer(
  state: BasketState | null,
  action: BasketAction,
): BasketState | null {
  if (action.type === "hydrate") return action.state;
  if (state === null) return null;

  switch (action.type) {
    case "add": {
      const { productId, colourway, size } = action;
      const ceiling = ceilingFor(productId, colourway, size);
      if (ceiling === 0) return state;

      const wanted = action.quantity ?? 1;
      const key = lineKey({ productId, colourway, size });
      const existing = state.lines.find((line) => lineKey(line) === key);

      const quantity = Math.min(ceiling, (existing?.quantity ?? 0) + wanted);

      return {
        ...state,
        lines: existing
          ? state.lines.map((line) =>
              lineKey(line) === key ? { ...line, quantity } : line,
            )
          : [...state.lines, { productId, colourway, size, quantity }],
      };
    }

    case "setQuantity": {
      // Stepping below one removes the line rather than leaving a row that
      // renders a line item for nothing.
      if (action.quantity < 1) {
        return basketReducer(state, { type: "remove", key: action.key });
      }

      return {
        ...state,
        lines: state.lines.map((line) => {
          if (lineKey(line) !== action.key) return line;
          const ceiling = ceilingFor(line.productId, line.colourway, line.size);
          return { ...line, quantity: Math.min(action.quantity, ceiling) };
        }),
      };
    }

    case "remove": {
      const lines = state.lines.filter((line) => lineKey(line) !== action.key);
      // An emptied basket drops its code too, so the next basket does not
      // silently inherit a discount that was never re-entered.
      return lines.length === 0 ? EMPTY_BASKET : { ...state, lines };
    }

    case "applyCode":
      return { ...state, code: normaliseCode(action.code) };

    case "removeCode":
      return { ...state, code: null };

    // Used when an order is placed. Drops the code along with the lines, so
    // the next basket does not inherit a discount nobody re-entered.
    case "clear":
      return EMPTY_BASKET;
  }
}

/* --------------------------------------------------------------------------
   Persistence
   -------------------------------------------------------------------------- */

export const STORAGE_KEY = "pulp-basket-v1";

/**
 * Anything read back from storage is treated as untrusted: it was written by
 * an older build, and the catalogue has moved on since. Lines whose product,
 * colourway or size no longer exists are dropped, and quantities are clamped to
 * current stock rather than restored at the number that was saved.
 */
export function sanitise(input: unknown): BasketState {
  if (typeof input !== "object" || input === null) return EMPTY_BASKET;

  const raw = input as Partial<BasketState>;
  if (!Array.isArray(raw.lines)) return EMPTY_BASKET;

  const lines: BasketLine[] = [];

  for (const candidate of raw.lines) {
    if (typeof candidate !== "object" || candidate === null) continue;

    const { productId, colourway, size, quantity } = candidate as BasketLine;
    if (
      typeof productId !== "string" ||
      typeof colourway !== "string" ||
      typeof size !== "string" ||
      typeof quantity !== "number" ||
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      continue;
    }

    const resolved = resolveLine({ productId, colourway, size, quantity: 1 });
    if (!resolved || resolved.available === 0) continue;

    // Merge duplicates rather than letting two rows for one choice survive.
    const key = lineKey({ productId, colourway, size });
    const existing = lines.find((line) => lineKey(line) === key);
    const combined = (existing?.quantity ?? 0) + quantity;
    const clamped = Math.min(combined, resolved.available);

    if (existing) existing.quantity = clamped;
    else lines.push({ productId, colourway, size, quantity: clamped });
  }

  const code =
    typeof raw.code === "string" && raw.code.length > 0
      ? normaliseCode(raw.code)
      : null;

  return { lines, code: lines.length > 0 ? code : null };
}

export function readStoredBasket(): BasketState {
  // Storage throws in private modes and where the user has blocked it. A basket
  // that cannot be restored is an empty basket, not a broken page.
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_BASKET;
    return sanitise(JSON.parse(raw));
  } catch {
    return EMPTY_BASKET;
  }
}

export function writeStoredBasket(state: BasketState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Nothing to do, and nothing worth telling the customer: the basket still
    // works for this session, it just will not outlive it.
  }
}
