import { products, ramOptions, hddOptions } from '../data/products';
import { componentItems, peripheralItems, crypto as paymentMethods } from '../data/parts';
import { configCategories } from '../data/configurator';

const DB_KEY = 'mg_api_db';
const LATENCY = 150; // мс, імітація мережі
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DAY = 24 * 60 * 60 * 1000;
const CARRIERS = ['Нова пошта', 'Укрпошта', 'Meest'];
const EMPTY_DELIVERY = { name: '', phone: '', carrier: CARRIERS[0], city: '', address: '' };

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function readDb() {
  try {
    return JSON.parse(localStorage.getItem(DB_KEY)) ?? { users: [], sessions: {}, accounts: {} };
  } catch {
    return { users: [], sessions: {}, accounts: {} };
  }
}
function writeDb(db) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch {
    throw new HttpError(507, 'Сховище браузера недоступне');
  }
}
const accountOf = (db, uid) =>
  (db.accounts[uid] ??= { orders: [], favorites: [], delivery: { ...EMPTY_DELIVERY } });

async function hashPassword(password, salt = crypto.randomUUID()) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + password));
  return {
    salt,
    hash: [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join(''),
  };
}
const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email, createdAt: u.createdAt });

function startSession(db, user, remember) {
  const token = crypto.randomUUID() + crypto.randomUUID();
  db.sessions[token] = { uid: user.id, expiresAt: Date.now() + (remember ? 30 : 1) * DAY };
  return token;
}
function authenticate(db, headers) {
  const token = (headers.Authorization ?? '').replace(/^Bearer\s+/i, '');
  const session = db.sessions[token];
  const user =
    session && session.expiresAt > Date.now() && db.users.find((u) => u.id === session.uid);
  if (!user) throw new HttpError(401, 'Потрібна авторизація');
  return { user, token };
}

function validateDelivery(d = {}) {
  const f = {
    name: String(d.name ?? '').trim(),
    phone: String(d.phone ?? '').trim(),
    carrier: CARRIERS.includes(d.carrier) ? d.carrier : CARRIERS[0],
    city: String(d.city ?? '').trim(),
    address: String(d.address ?? '').trim(),
  };
  const digits = f.phone.replace(/\D/g, '');
  if (f.name.length < 2) throw new HttpError(422, 'Вкажіть імʼя отримувача');
  if (digits.length < 10 || digits.length > 13) {
    throw new HttpError(422, 'Введіть коректний номер телефону');
  }
  if (!f.city) throw new HttpError(422, 'Вкажіть місто');
  if (!f.address) throw new HttpError(422, 'Вкажіть відділення або адресу');
  return f;
}

const priceIndex = new Map(
  [...componentItems, ...peripheralItems, ...configCategories.flatMap((c) => c.options)].map(
    (i) => [i.id, i.price],
  ),
);
function priceOf(id) {
  if (priceIndex.has(id)) return priceIndex.get(id);
  const m = /^(.+)-r(\d+)-h(\d+)$/.exec(id);
  if (m) {
    const product = products.find((p) => p.id === m[1]);
    const ram = ramOptions[Number(m[2])];
    const hdd = hddOptions[Number(m[3])];
    if (product && ram && hdd) return product.price + ram.price + hdd.price;
  }
  return null;
}

function buildOrder(account, rawItems) {
  if (!Array.isArray(rawItems) || !rawItems.length) throw new HttpError(422, 'Кошик порожній');
  const d = account.delivery;
  if (!(d.name && d.phone && d.city && d.address)) {
    throw new HttpError(422, 'Спершу вкажіть дані доставки');
  }
  const items = rawItems.map((i) => {
    const price = priceOf(String(i.id));
    if (price === null) throw new HttpError(422, `Невідомий товар: ${i.id}`);
    const qty = Number(i.qty);
    if (!Number.isInteger(qty) || qty < 1 || qty > 99) {
      throw new HttpError(422, `Некоректна кількість для ${i.name ?? i.id}`);
    }
    return { id: i.id, name: i.name, image: i.image, kind: i.kind, price, qty };
  });
  return {
    id: 'MG-' + String(Date.now()).slice(-6),
    createdAt: new Date().toISOString(),
    status: 'Очікує підтвердження оплати',
    items,
    total: items.reduce((n, i) => n + i.price * i.qty, 0),
    delivery: d,
  };
}

const routes = [
  ['GET', '/products', false, () => products],
  [
    'GET',
    '/products/:id',
    false,
    ({ params }) => {
      const p = products.find((x) => x.id === params.id);
      if (!p) throw new HttpError(404, 'Збірку не знайдено');
      return { ...p, options: { ram: ramOptions, hdd: hddOptions } };
    },
  ],
  ['GET', '/components', false, () => componentItems],
  ['GET', '/peripherals', false, () => peripheralItems],
  ['GET', '/payment-methods', false, () => paymentMethods],

  [
    'POST',
    '/auth/register',
    false,
    async ({ db, body }) => {
      const name = String(body.name ?? '').trim();
      const email = String(body.email ?? '')
        .trim()
        .toLowerCase();
      const password = String(body.password ?? '');
      if (name.length < 2) throw new HttpError(422, 'Введіть імʼя (мінімум 2 символи)');
      if (!EMAIL_RE.test(email)) throw new HttpError(422, 'Введіть коректний email');
      if (password.length < 8) throw new HttpError(422, 'Пароль має містити щонайменше 8 символів');
      if (db.users.some((u) => u.email === email)) {
        throw new HttpError(409, 'Акаунт з таким email уже існує');
      }
      const user = {
        id: crypto.randomUUID(),
        name,
        email,
        ...(await hashPassword(password)),
        createdAt: new Date().toISOString(),
      };
      db.users.push(user);
      accountOf(db, user.id);
      return { status: 201, body: { user: publicUser(user), token: startSession(db, user, true) } };
    },
  ],
  [
    'POST',
    '/auth/login',
    false,
    async ({ db, body }) => {
      const email = String(body.email ?? '')
        .trim()
        .toLowerCase();
      const user = db.users.find((u) => u.email === email);
      const ok =
        user && (await hashPassword(String(body.password ?? ''), user.salt)).hash === user.hash;
      if (!ok) throw new HttpError(401, 'Невірний email або пароль');
      return { user: publicUser(user), token: startSession(db, user, body.remember !== false) };
    },
  ],
  ['GET', '/auth/me', true, ({ user }) => ({ user: publicUser(user) })],
  [
    'POST',
    '/auth/logout',
    true,
    ({ db, token }) => {
      delete db.sessions[token];
      return { ok: true };
    },
  ],

  ['GET', '/account', true, ({ db, user }) => accountOf(db, user.id)],
  [
    'PUT',
    '/account/delivery',
    true,
    ({ db, user, body }) => {
      const account = accountOf(db, user.id);
      account.delivery = validateDelivery(body);
      return account.delivery;
    },
  ],
  [
    'POST',
    '/account/favorites',
    true,
    ({ db, user, body }) => {
      if (!body?.id || !body?.name) throw new HttpError(422, 'Некоректний товар');
      const account = accountOf(db, user.id);
      const price = priceOf(String(body.id)) ?? products.find((p) => p.id === body.id)?.price;
      if (price == null) throw new HttpError(422, `Невідомий товар: ${body.id}`);
      const { id, name, info, image, kind, href } = body;
      if (!account.favorites.some((f) => f.id === id)) {
        account.favorites.unshift({ id, name, info, image, kind, href, price });
      }
      return account.favorites;
    },
  ],
  [
    'DELETE',
    '/account/favorites/:id',
    true,
    ({ db, user, params }) => {
      const account = accountOf(db, user.id);
      account.favorites = account.favorites.filter((f) => f.id !== params.id);
      return account.favorites;
    },
  ],

  ['GET', '/orders', true, ({ db, user }) => accountOf(db, user.id).orders],
  [
    'POST',
    '/orders',
    true,
    ({ db, user, body }) => {
      const account = accountOf(db, user.id);
      const order = buildOrder(account, body.items);
      account.orders.unshift(order);
      return { status: 201, body: order };
    },
  ],
];

const compiled = routes.map(([method, path, auth, handler]) => ({
  method,
  auth,
  handler,
  keys: [...path.matchAll(/:(\w+)/g)].map((m) => m[1]),
  re: new RegExp('^' + path.replace(/:\w+/g, '([^/]+)') + '/?$'),
}));

const json = (status, payload) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export async function localFetch(url, { method = 'GET', headers = {}, body, signal } = {}) {
  await new Promise((r) => setTimeout(r, LATENCY));
  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');

  const path =
    String(url)
      .split('?')[0]
      .replace(/^\/api/, '') || '/';
  try {
    const candidates = compiled.filter((r) => r.re.test(path));
    if (!candidates.length) throw new HttpError(404, 'Не знайдено');
    const route = candidates.find((r) => r.method === method);
    if (!route) throw new HttpError(405, 'Метод не підтримується');

    const m = route.re.exec(path);
    const params = Object.fromEntries(route.keys.map((k, i) => [k, decodeURIComponent(m[i + 1])]));
    const db = readDb();
    const ctx = { db, params, body: body ? JSON.parse(body) : {} };
    if (route.auth) Object.assign(ctx, authenticate(db, headers));

    const result = await route.handler(ctx);
    writeDb(db);
    if (result && typeof result === 'object' && 'status' in result && 'body' in result) {
      return json(result.status, result.body);
    }
    return json(200, result);
  } catch (e) {
    if (e instanceof HttpError) return json(e.status, { message: e.message });
    console.error('[localApi]', e);
    return json(500, { message: 'Внутрішня помилка' });
  }
}
