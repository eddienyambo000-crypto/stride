"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

export interface CartLine {
  key: string; // productId|size|color
  productId: string;
  slug: string;
  name: string;
  image: string;
  size: string | null;
  color: string | null;
  unitPrice: number;
  qty: number;
}

interface CartState {
  lines: CartLine[];
  hydrated: boolean;
}

type Action =
  | { type: "hydrate"; lines: CartLine[] }
  | { type: "add"; line: Omit<CartLine, "key" | "qty">; qty: number }
  | { type: "setQty"; key: string; qty: number }
  | { type: "remove"; key: string }
  | { type: "clear" };

const STORAGE_KEY = "stride-cart-v1";
const lineKey = (productId: string, size: string | null, color: string | null) =>
  `${productId}|${size ?? ""}|${color ?? ""}`;

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "hydrate":
      return { lines: action.lines, hydrated: true };
    case "add": {
      const key = lineKey(action.line.productId, action.line.size, action.line.color);
      const existing = state.lines.find((l) => l.key === key);
      const lines = existing
        ? state.lines.map((l) =>
            l.key === key ? { ...l, qty: l.qty + action.qty } : l,
          )
        : [...state.lines, { ...action.line, key, qty: action.qty }];
      return { ...state, lines };
    }
    case "setQty": {
      const lines = state.lines
        .map((l) => (l.key === action.key ? { ...l, qty: Math.max(0, action.qty) } : l))
        .filter((l) => l.qty > 0);
      return { ...state, lines };
    }
    case "remove":
      return { ...state, lines: state.lines.filter((l) => l.key !== action.key) };
    case "clear":
      return { ...state, lines: [] };
    default:
      return state;
  }
}

interface CartContextValue {
  lines: CartLine[];
  hydrated: boolean;
  count: number;
  subtotal: number;
  add: (line: Omit<CartLine, "key" | "qty">, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [], hydrated: false });

  // Hydrate from localStorage once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const lines = raw ? (JSON.parse(raw) as CartLine[]) : [];
      dispatch({ type: "hydrate", lines });
    } catch {
      dispatch({ type: "hydrate", lines: [] });
    }
  }, []);

  // Persist on change (after hydration).
  useEffect(() => {
    if (!state.hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
    } catch {
      /* ignore quota errors */
    }
  }, [state.lines, state.hydrated]);

  const add = useCallback(
    (line: Omit<CartLine, "key" | "qty">, qty = 1) =>
      dispatch({ type: "add", line, qty }),
    [],
  );
  const setQty = useCallback(
    (key: string, qty: number) => dispatch({ type: "setQty", key, qty }),
    [],
  );
  const remove = useCallback((key: string) => dispatch({ type: "remove", key }), []);
  const clear = useCallback(() => dispatch({ type: "clear" }), []);

  const value = useMemo<CartContextValue>(() => {
    const count = state.lines.reduce((s, l) => s + l.qty, 0);
    const subtotal = state.lines.reduce((s, l) => s + l.qty * l.unitPrice, 0);
    return {
      lines: state.lines,
      hydrated: state.hydrated,
      count,
      subtotal,
      add,
      setQty,
      remove,
      clear,
    };
  }, [state.lines, state.hydrated, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
