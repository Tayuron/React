import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const USERS_KEY = 'mg_users';
const SESSION_KEY = 'mg_session';
const AuthContext = createContext(null);

function read(store, key) {
  try {
    return store.getItem(key);
  } catch {
    return null;
  }
}
function write(store, key, value) {
  try {
    if (value === null) store.removeItem(key);
    else store.setItem(key, value);
  } catch {
    /* сховище недоступне */
  }
}
const getUsers = () => {
  try {
    return JSON.parse(read(localStorage, USERS_KEY)) ?? [];
  } catch {
    return [];
  }
};
const publicUser = (u) =>
  u ? { id: u.id, name: u.name, email: u.email, createdAt: u.createdAt } : null;

function readSession() {
  const id = read(localStorage, SESSION_KEY) ?? read(sessionStorage, SESSION_KEY);
  return publicUser(getUsers().find((u) => u.id === id));
}

async function hashPassword(password, salt) {
  const data = new TextEncoder().encode(salt + password);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession);

  const startSession = useCallback((account, remember) => {
    write(localStorage, SESSION_KEY, remember ? account.id : null);
    write(sessionStorage, SESSION_KEY, remember ? null : account.id);
    setUser(publicUser(account));
  }, []);

  const register = useCallback(
    async ({ name, email, password }) => {
      const users = getUsers();
      const normalized = email.trim().toLowerCase();
      if (users.some((u) => u.email === normalized)) {
        return { ok: false, error: 'Акаунт з таким email уже існує' };
      }
      const salt = crypto.randomUUID();
      const account = {
        id: crypto.randomUUID(),
        name: name.trim(),
        email: normalized,
        salt,
        hash: await hashPassword(password, salt),
        createdAt: new Date().toISOString(),
      };
      write(localStorage, USERS_KEY, JSON.stringify([...users, account]));
      startSession(account, true);
      return { ok: true };
    },
    [startSession],
  );

  const login = useCallback(
    async ({ email, password, remember }) => {
      const account = getUsers().find((u) => u.email === email.trim().toLowerCase());
      const ok = account && (await hashPassword(password, account.salt)) === account.hash;
      if (!ok) return { ok: false, error: 'Невірний email або пароль' };
      startSession(account, remember);
      return { ok: true };
    },
    [startSession],
  );

  const logout = useCallback(() => {
    write(localStorage, SESSION_KEY, null);
    write(sessionStorage, SESSION_KEY, null);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, register, login, logout }), [user, register, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth має використовуватись всередині AuthProvider');
  return ctx;
}
