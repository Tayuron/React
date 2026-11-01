import axios from 'axios';
import { localFetch } from './localApi';

const REMOTE = import.meta.env.VITE_API_URL;
const TOKEN_KEY = 'mg_token';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function safe(fn) {
  try {
    return fn();
  } catch {
    return null;
  }
}

export const tokenStore = {
  get: () => safe(() => localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY)),
  set(token, remember = true) {
    safe(() => {
      localStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
      (remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, token);
    });
  },
  clear() {
    safe(() => {
      localStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
    });
  },
};

async function localAdapter(config) {
  let res;
  try {
    res = await localFetch((config.baseURL ?? '') + config.url, {
      method: String(config.method).toUpperCase(),
      headers: { Authorization: config.headers?.get?.('Authorization') ?? undefined },
      body: config.data,
      signal: config.signal,
    });
  } catch (e) {
    if (e.name === 'AbortError') throw new axios.CanceledError(null, config);
    throw e;
  }
  const data = await res.json().catch(() => null);
  const response = {
    data,
    status: res.status,
    statusText: res.statusText,
    headers: {},
    config,
    request: {},
  };
  if (res.ok) return response;
  throw new axios.AxiosError(
    `Request failed with status code ${res.status}`,
    res.status >= 500 ? axios.AxiosError.ERR_BAD_RESPONSE : axios.AxiosError.ERR_BAD_REQUEST,
    config,
    {},
    response,
  );
}

export const http = axios.create({
  baseURL: REMOTE ?? '/api',
  ...(REMOTE ? {} : { adapter: localAdapter }),
});

http.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) return Promise.reject(error);
    if (error.response) {
      const { status, data } = error.response;
      return Promise.reject(new ApiError(data?.message ?? `Помилка ${status}`, status));
    }
    return Promise.reject(new ApiError('Немає звʼязку із сервером', 0));
  },
);

const unwrap = (promise) => promise.then((r) => r.data);
export const api = {
  get: (path, opts) => unwrap(http.get(path, opts)),
  post: (path, body, opts) => unwrap(http.post(path, body, opts)),
  put: (path, body, opts) => unwrap(http.put(path, body, opts)),
  delete: (path, opts) => unwrap(http.delete(path, opts)),
};
