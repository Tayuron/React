import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../auth/AuthContext';

const AccountContext = createContext(null);
const keyFor = (uid) => `mg_account_${uid}`;
const EMPTY = {
  orders: [],
  favorites: [],
  delivery: { name: '', phone: '', carrier: 'Нова пошта', city: '', address: '' },
};

export function isDeliveryComplete(d) {
  return Boolean(d.name?.trim() && d.phone?.trim() && d.city?.trim() && d.address?.trim());
}

function load(uid) {
  if (!uid) return EMPTY;
  try {
    const saved = JSON.parse(localStorage.getItem(keyFor(uid)));
    return { ...EMPTY, ...saved, delivery: { ...EMPTY.delivery, ...saved?.delivery } };
  } catch {
    return EMPTY;
  }
}

export function AccountProvider({ children }) {
  const { user } = useAuth();
  const uid = user?.id ?? null;
  const [state, setState] = useState(() => ({ uid, data: load(uid) }));

  // змінився акаунт — підвантажуємо його дані
  if (state.uid !== uid) setState({ uid, data: load(uid) });

  useEffect(() => {
    if (!state.uid) return;
    try {
      localStorage.setItem(keyFor(state.uid), JSON.stringify(state.data));
    } catch {
      /* сховище недоступне */
    }
  }, [state]);

  const update = useCallback((fn) => setState((s) => ({ ...s, data: fn(s.data) })), []);

  const placeOrder = useCallback(
    ({ items, total }) => {
      const order = {
        id: 'MG-' + String(Date.now()).slice(-6),
        createdAt: new Date().toISOString(),
        status: 'Очікує підтвердження оплати',
        items,
        total,
        delivery: state.data.delivery,
      };
      update((d) => ({ ...d, orders: [order, ...d.orders] }));
      return order;
    },
    [update, state.data.delivery],
  );

  const toggleFavorite = useCallback(
    (product) =>
      update((d) => ({
        ...d,
        favorites: d.favorites.some((f) => f.id === product.id)
          ? d.favorites.filter((f) => f.id !== product.id)
          : [product, ...d.favorites],
      })),
    [update],
  );

  const saveDelivery = useCallback((delivery) => update((d) => ({ ...d, delivery })), [update]);

  const value = useMemo(
    () => ({
      orders: state.data.orders,
      favorites: state.data.favorites,
      delivery: state.data.delivery,
      isFavorite: (id) => state.data.favorites.some((f) => f.id === id),
      placeOrder,
      toggleFavorite,
      saveDelivery,
    }),
    [state.data, placeOrder, toggleFavorite, saveDelivery],
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error('useAccount має використовуватись всередині AccountProvider');
  return ctx;
}
