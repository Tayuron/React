import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../auth/AuthContext';

const CartContext = createContext(null);
const keyFor = (uid) => `mg_cart_${uid ?? 'guest'}`;

function load(uid) {
  try {
    return JSON.parse(localStorage.getItem(keyFor(uid))) ?? [];
  } catch {
    return [];
  }
}
function merge(base, extra) {
  const map = new Map(base.map((i) => [i.id, { ...i }]));
  extra.forEach((i) => {
    const found = map.get(i.id);
    if (found) found.qty += i.qty;
    else map.set(i.id, { ...i });
  });
  return [...map.values()];
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const uid = user?.id ?? null;
  const [state, setState] = useState(() => ({ uid, items: load(uid) }));

  // змінився акаунт: підвантажуємо його кошик, гостьовий кошик переходить у кошик після входу
  if (state.uid !== uid) {
    setState({ uid, items: merge(load(uid), state.uid === null ? state.items : []) });
  }

  useEffect(() => {
    try {
      localStorage.setItem(keyFor(state.uid), JSON.stringify(state.items));
      if (state.uid !== null) localStorage.removeItem(keyFor(null));
    } catch {
      /* сховище недоступне */
    }
  }, [state]);

  const update = useCallback((fn) => setState((s) => ({ ...s, items: fn(s.items) })), []);
  const add = useCallback(
    (p) =>
      update((items) =>
        merge(items, [
          { id: p.id, name: p.name, price: p.price, image: p.image, kind: p.kind, qty: 1 },
        ]),
      ),
    [update],
  );
  const remove = useCallback((id) => update((items) => items.filter((i) => i.id !== id)), [update]);
  const setQty = useCallback(
    (id, qty) =>
      update((items) =>
        qty <= 0
          ? items.filter((i) => i.id !== id)
          : items.map((i) => (i.id === id ? { ...i, qty } : i)),
      ),
    [update],
  );
  const clear = useCallback(() => update(() => []), [update]);

  const value = useMemo(() => {
    const items = state.items;
    return {
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      total: items.reduce((n, i) => n + i.qty * i.price, 0),
      add,
      remove,
      setQty,
      clear,
    };
  }, [state.items, add, remove, setQty, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart має використовуватись всередині CartProvider');
  return ctx;
}
