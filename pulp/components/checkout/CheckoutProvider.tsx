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
import {
  DEFAULT_DELIVERY_METHOD,
  isDeliveryMethodKey,
  type DeliveryMethodKey,
} from "@/lib/commerce";
import {
  EMPTY_DETAILS,
  type DeliveryDetails,
  type DetailErrors,
} from "@/lib/checkout/validation";

export const STEPS = [
  { key: "details", label: "Delivery details" },
  { key: "method", label: "Delivery method" },
  { key: "review", label: "Review order" },
] as const;

export type StepKey = (typeof STEPS)[number]["key"];

const LAST_STEP = STEPS.length - 1;
const DRAFT_KEY = "pulp-checkout-draft-v1";

/* --------------------------------------------------------------------------
   State
   -------------------------------------------------------------------------- */

interface DraftState {
  /** False until the saved draft has been read, like the basket's own flag. */
  hydrated: boolean;
  details: DeliveryDetails;
  method: DeliveryMethodKey;
  step: number;
  /** Highest step reached, so the indicator can only jump back to seen steps. */
  furthest: number;
}

const INITIAL: DraftState = {
  hydrated: false,
  details: EMPTY_DETAILS,
  method: DEFAULT_DELIVERY_METHOD,
  step: 0,
  furthest: 0,
};

type DraftAction =
  | { type: "hydrate"; draft: unknown }
  | { type: "setField"; field: keyof DeliveryDetails; value: string }
  | { type: "setMethod"; method: DeliveryMethodKey }
  | { type: "goTo"; step: number };

function clampStep(value: unknown, max: number): number {
  return Number.isInteger(value)
    ? Math.min(Math.max(value as number, 0), max)
    : 0;
}

/**
 * All four pieces of draft state move together, so restoring a saved draft is
 * one dispatch rather than four `setState` calls fired from an effect.
 */
function draftReducer(state: DraftState, action: DraftAction): DraftState {
  switch (action.type) {
    case "hydrate": {
      const draft = action.draft;
      if (typeof draft !== "object" || draft === null) {
        return { ...state, hydrated: true };
      }

      const saved = draft as Partial<DraftState>;
      const furthest = clampStep(saved.furthest, LAST_STEP);

      return {
        hydrated: true,
        details: saved.details
          ? { ...EMPTY_DETAILS, ...saved.details }
          : state.details,
        method: isDeliveryMethodKey(saved.method) ? saved.method : state.method,
        furthest,
        // Never restore past the furthest step actually reached, whatever the
        // stored value claims.
        step: clampStep(saved.step, furthest),
      };
    }

    case "setField":
      return {
        ...state,
        details: { ...state.details, [action.field]: action.value },
      };

    case "setMethod":
      return { ...state, method: action.method };

    case "goTo": {
      const step = clampStep(action.step, LAST_STEP);
      return { ...state, step, furthest: Math.max(state.furthest, step) };
    }
  }
}

/* --------------------------------------------------------------------------
   Context
   -------------------------------------------------------------------------- */

interface CheckoutContextValue {
  step: number;
  stepKey: StepKey;
  goTo: (step: number) => void;
  next: () => void;
  back: () => void;
  furthest: number;

  details: DeliveryDetails;
  setField: (field: keyof DeliveryDetails, value: string) => void;
  errors: DetailErrors;
  setErrors: (errors: DetailErrors) => void;

  method: DeliveryMethodKey;
  setMethod: (method: DeliveryMethodKey) => void;

  hydrated: boolean;
}

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

/**
 * Checkout state: which step, the address, the delivery method.
 *
 * Kept in `sessionStorage` rather than `localStorage`. A half-typed address
 * should survive a refresh or a stray back-navigation, but it should not still
 * be sitting there tomorrow on a shared machine — it is somebody's name, phone
 * number and home address, and it has no reason to outlive the tab.
 *
 * Validation errors are deliberately **not** persisted. A restored draft should
 * open clean and be re-checked on submit, not greet somebody with the mistakes
 * they made yesterday.
 */
export function CheckoutProvider({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const [state, dispatch] = useReducer(draftReducer, INITIAL);
  const [errors, setErrors] = useState<DetailErrors>({});

  useEffect(() => {
    let draft: unknown = null;
    try {
      const raw = window.sessionStorage.getItem(DRAFT_KEY);
      if (raw) draft = JSON.parse(raw);
    } catch {
      draft = null;
    }
    dispatch({ type: "hydrate", draft });
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    try {
      const { details, method, step, furthest } = state;
      window.sessionStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ details, method, step, furthest }),
      );
    } catch {
      // Storage blocked. Checkout still works for this tab.
    }
  }, [state]);

  const setField = useCallback(
    (field: keyof DeliveryDetails, value: string) => {
      dispatch({ type: "setField", field, value });
      // The error clears as soon as the customer starts fixing it, rather than
      // sitting there accusing them until they submit again.
      setErrors((current) => {
        if (!(field in current)) return current;
        const next = { ...current };
        delete next[field];
        return next;
      });
    },
    [],
  );

  const goTo = useCallback((step: number) => {
    dispatch({ type: "goTo", step });
  }, []);

  const setMethod = useCallback((method: DeliveryMethodKey) => {
    dispatch({ type: "setMethod", method });
  }, []);

  const next = useCallback(() => goTo(state.step + 1), [goTo, state.step]);
  const back = useCallback(() => goTo(state.step - 1), [goTo, state.step]);

  const value = useMemo<CheckoutContextValue>(
    () => ({
      step: state.step,
      stepKey: STEPS[state.step].key,
      goTo,
      next,
      back,
      furthest: state.furthest,
      details: state.details,
      setField,
      errors,
      setErrors,
      method: state.method,
      setMethod,
      hydrated: state.hydrated,
    }),
    [state, goTo, next, back, setField, errors, setMethod],
  );

  return (
    <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>
  );
}

export function useCheckout(): CheckoutContextValue {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout must be used inside a CheckoutProvider.");
  }
  return context;
}

/** Clears the draft once an order is placed, so the next one starts clean. */
export function clearCheckoutDraft(): void {
  try {
    window.sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    // Nothing to do.
  }
}
