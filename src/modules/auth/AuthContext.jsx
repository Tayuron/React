import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { tokenStore } from '../../api/http';
import {
  fetchCurrentUser,
  logoutRequest,
  useLoginRequest,
  useRegisterRequest,
} from '../../hooks/useAuthApi';

const USER_CACHE_KEY = 'mg_user';
const AuthContext = createContext(null);

function readCachedUser() {
  try {
    if (!tokenStore.get()) return null;
    return JSON.parse(localStorage.getItem(USER_CACHE_KEY));
  } catch {
    return null;
  }
}
function cacheUser(user) {
  try {
    if (user) localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_CACHE_KEY);
  } catch {}
}

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [user, setUserState] = useState(readCachedUser);
  const loginRequest = useLoginRequest();
  const registerRequest = useRegisterRequest();

  const setUser = useCallback((u) => {
    cacheUser(u);
    setUserState(u);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchCurrentUser().then((u) => {
      if (!cancelled) setUser(u);
    });
    return () => {
      cancelled = true;
    };
  }, [setUser]);

  const { mutate: doLogin } = loginRequest;
  const { mutate: doRegister } = registerRequest;

  const login = useCallback(
    async ({ email, password, remember }) => {
      try {
        setUser(await doLogin({ email, password, remember }));
        return { ok: true };
      } catch (e) {
        return { ok: false, error: e.message };
      }
    },
    [doLogin, setUser],
  );

  const register = useCallback(
    async ({ name, email, password }) => {
      try {
        setUser(await doRegister({ name, email, password }));
        return { ok: true };
      } catch (e) {
        return { ok: false, error: e.message };
      }
    },
    [doRegister, setUser],
  );

  const logout = useCallback(async () => {
    setUser(null);
    queryClient.clear();
    await logoutRequest();
  }, [setUser, queryClient]);

  const value = useMemo(() => ({ user, register, login, logout }), [user, register, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth має використовуватись всередині AuthProvider');
  return ctx;
}
