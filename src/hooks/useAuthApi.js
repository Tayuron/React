import { useCallback } from 'react';
import { api, tokenStore } from '../api/http';
import { useMutation } from './useMutation';

export function useLoginRequest() {
  return useMutation(
    useCallback(async ({ email, password, remember = true }) => {
      const res = await api.post('/auth/login', { email, password, remember });
      tokenStore.set(res.token, remember);
      return res.user;
    }, []),
  );
}

export function useRegisterRequest() {
  return useMutation(
    useCallback(async ({ name, email, password }) => {
      const res = await api.post('/auth/register', { name, email, password });
      tokenStore.set(res.token, true);
      return res.user;
    }, []),
  );
}

export async function logoutRequest() {
  try {
    await api.post('/auth/logout');
  } catch {}
  tokenStore.clear();
}

export async function fetchCurrentUser() {
  if (!tokenStore.get()) return null;
  try {
    return (await api.get('/auth/me')).user;
  } catch (e) {
    if (e.status === 401) tokenStore.clear();
    return null;
  }
}
