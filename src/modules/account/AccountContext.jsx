import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { api } from '../../api/http';
import { useFetch } from '../../hooks/useFetch';
import { useAuth } from '../auth/AuthContext';

const AccountContext = createContext(null);
const EMPTY = {
  orders: [],
  favorites: [],
  delivery: { name: '', phone: '', carrier: 'Нова пошта', city: '', address: '' },
};

export function isDeliveryComplete(d) {
  return Boolean(d.name?.trim() && d.phone?.trim() && d.city?.trim() && d.address?.trim());
}

const normalize = (raw) => ({
  ...EMPTY,
  ...raw,
  delivery: { ...EMPTY.delivery, ...raw?.delivery },
});

export function AccountProvider({ children }) {
  const { user } = useAuth();
  const uid = user?.id ?? null;
  const [data, setData] = useState(EMPTY);
  const [error, setError] = useState(null);
  const dataRef = useRef(data);
  dataRef.current = data;

  const remote = useFetch(`/account?user=${uid}`, { enabled: Boolean(uid) });

  useEffect(() => {
    if (!uid) setData(EMPTY);
    else if (remote.data) setData(normalize(remote.data));
  }, [uid, remote.data]);

  useEffect(() => {
    if (remote.error && remote.error.status !== 401) setError(remote.error.message);
  }, [remote.error]);

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(null), 5000);
    return () => clearTimeout(t);
  }, [error]);

  const patch = useCallback((fn) => setData((d) => fn(d)), []);

  const placeOrder = useCallback(
    async ({ items }) => {
      const order = await api.post('/orders', { items });
      patch((d) => ({ ...d, orders: [order, ...d.orders] }));
      return order;
    },
    [patch],
  );

  const toggleFavorite = useCallback(
    async (product) => {
      const was = dataRef.current.favorites.some((f) => f.id === product.id);
      const before = dataRef.current.favorites;

      patch((d) => ({
        ...d,
        favorites: was ? d.favorites.filter((f) => f.id !== product.id) : [product, ...d.favorites],
      }));
      try {
        const favorites = was
          ? await api.delete(`/account/favorites/${encodeURIComponent(product.id)}`)
          : await api.post('/account/favorites', product);
        patch((d) => ({ ...d, favorites }));
      } catch (e) {
        patch((d) => ({ ...d, favorites: before }));
        setError(e.message);
      }
    },
    [patch],
  );

  const saveDelivery = useCallback(
    async (delivery) => {
      const before = dataRef.current.delivery;
      patch((d) => ({ ...d, delivery }));
      try {
        const saved = await api.put('/account/delivery', delivery);
        patch((d) => ({ ...d, delivery: saved }));
      } catch (e) {
        patch((d) => ({ ...d, delivery: before }));
        setError(e.message);
      }
    },
    [patch],
  );

  const value = useMemo(
    () => ({
      orders: data.orders,
      favorites: data.favorites,
      delivery: data.delivery,
      loading: remote.loading,
      isFavorite: (id) => data.favorites.some((f) => f.id === id),
      placeOrder,
      toggleFavorite,
      saveDelivery,
    }),
    [data, remote.loading, placeOrder, toggleFavorite, saveDelivery],
  );

  return (
    <AccountContext.Provider value={value}>
      {children}
      {error && (
        <div
          role="alert"
          onClick={() => setError(null)}
          style={{
            position: 'fixed',
            left: '50%',
            bottom: '1.5rem',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            maxWidth: '90vw',
            padding: '0.8rem 1.2rem',
            borderRadius: 8,
            background: '#7f1d1d',
            color: '#fff',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,.4)',
          }}
        >
          {error}
        </div>
      )}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error('useAccount має використовуватись всередині AccountProvider');
  return ctx;
}
