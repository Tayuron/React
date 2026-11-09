import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../modules/core/design-system/Button';
import { ProductImage } from '../modules/core/design-system/ProductImage';
import { useCart } from '../modules/cart/CartContext';
import { getIssues, estimatePower, recommendedPsu } from '../modules/configurator/compat';
import { configCategories } from '../data/configurator';
import { formatPrice } from '../data/products';
import s from './ConfiguratorPage.module.css';

const lookup = new Map(
  configCategories.flatMap((c) => c.options.map((o) => [o.id, { cat: c.id, option: o }])),
);

function parseBuild(raw) {
  const sel = {};
  (raw ?? '').split(',').forEach((id) => {
    const found = lookup.get(id);
    if (found) sel[found.cat] = found.option.id;
  });
  return sel;
}

export function ConfiguratorPage() {
  const { add } = useCart();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [selected, setSelected] = useState(() => parseBuild(params.get('build')));
  const [activeId, setActiveId] = useState(configCategories[0].id);
  const [filters, setFilters] = useState({});
  const [copied, setCopied] = useState(false);

  const sel = useMemo(
    () => Object.fromEntries(Object.entries(selected).map(([c, id]) => [c, lookup.get(id).option])),
    [selected],
  );
  const issues = useMemo(() => getIssues(sel), [sel]);
  const errors = issues.filter((i) => i.severity === 'error');
  const warnings = issues.filter((i) => i.severity === 'warning');
  const total = Object.values(sel).reduce((n, o) => n + o.price, 0);
  const required = configCategories.filter((c) => c.required);
  const doneRequired = required.filter((c) => sel[c.id]).length;
  const canBuy = doneRequired === required.length && !errors.length;
  const power = estimatePower(sel);

  const active = configCategories.find((c) => c.id === activeId);
  const f = filters[activeId] ?? { brand: '', q: '' };
  const setFilter = (patch) => setFilters((all) => ({ ...all, [activeId]: { ...f, ...patch } }));
  const brands = [...new Set(active.options.map((o) => o.brand))];
  const q = f.q.trim().toLowerCase();
  const visible = active.options.filter(
    (o) => (!f.brand || o.brand === f.brand) && (!q || o.name.toLowerCase().includes(q)),
  );
  const conflict = (o) =>
    getIssues({ ...sel, [active.id]: o }).find(
      (i) => i.severity === 'error' && i.categories.includes(active.id),
    )?.message;

  function toggle(o) {
    setSelected((cur) => {
      if (cur[active.id] === o.id) {
        const next = { ...cur };
        delete next[active.id];
        return next;
      }
      return { ...cur, [active.id]: o.id };
    });
  }

  async function share() {
    const ids = Object.values(selected).join(',');
    const url = `${window.location.origin}${window.location.pathname}${ids ? `?build=${ids}` : ''}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* буфер обміну недоступний */
    }
  }

  function buy() {
    Object.values(sel).forEach(add);
    navigate('/cart');
  }

  const current = sel[active.id];

  return (
    <div className={s.wrap}>
      <h1>Збери свого звіра сам!</h1>

      <div className={s.layout}>
        <nav className={s.nav} aria-label="Категорії компонентів">
          <ul>
            {configCategories.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  className={`${s.navBtn} ${c.id === activeId ? s.navOn : ''}`}
                  aria-current={c.id === activeId}
                  onClick={() => setActiveId(c.id)}
                >
                  <span className={s.navTitle}>{c.title}</span>
                  <small className={sel[c.id] ? s.navDone : ''}>
                    {sel[c.id] ? sel[c.id].name : c.required ? 'Не обрано' : 'Необовʼязково'}
                  </small>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <section className={s.picker} aria-label={active.title}>
          {brands.length > 1 && (
            <div className={s.chips} role="group" aria-label="Бренд">
              <button
                type="button"
                className={!f.brand ? s.chipOn : s.chip}
                onClick={() => setFilter({ brand: '' })}
              >
                Всі
              </button>
              {brands.map((b) => (
                <button
                  key={b}
                  type="button"
                  className={f.brand === b ? s.chipOn : s.chip}
                  onClick={() => setFilter({ brand: f.brand === b ? '' : b })}
                >
                  {b}
                </button>
              ))}
            </div>
          )}
          <input
            type="search"
            className={s.search}
            placeholder={`Пошук: ${active.title.toLowerCase()}`}
            aria-label="Пошук"
            value={f.q}
            onChange={(e) => setFilter({ q: e.target.value })}
          />

          <div className={`${s.current} ${!current && active.required ? s.currentWarn : ''}`}>
            <div>
              <b>{active.title}</b>
              <small>{current ? current.name : active.emptyLabel}</small>
            </div>
            {current && (
              <button
                type="button"
                className={s.remove}
                onClick={() => toggle(current)}
                aria-label={`Прибрати: ${current.name}`}
              >
                ×
              </button>
            )}
          </div>

          {visible.length ? (
            <ul className={s.list}>
              {visible.map((o) => {
                const isSel = current?.id === o.id;
                const bad = conflict(o);
                return (
                  <li key={o.id} className={`${s.opt} ${isSel ? s.optOn : ''}`}>
                    <ProductImage
                      className={s.thumb}
                      src={o.image}
                      alt={o.name}
                      label={o.brand}
                      kind={o.kind}
                    />
                    <div className={s.optInfo}>
                      <b>{o.name}</b>
                      <small>{o.desc}</small>
                      {bad && <em>Несумісно: {bad}</em>}
                    </div>
                    <strong>{formatPrice(o.price)}</strong>
                    <button
                      type="button"
                      className={s.pick}
                      aria-pressed={isSel}
                      aria-label={`${isSel ? 'Прибрати' : 'Обрати'} ${o.name}`}
                      onClick={() => toggle(o)}
                    >
                      {isSel ? '✓' : '+'}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className={s.none}>Нічого не знайдено.</p>
          )}
        </section>

        <aside className={s.summary} aria-label="Ваша збірка">
          <h2>Збірка</h2>
          <p className={s.progress}>
            Обрано <b>{Object.keys(sel).length}</b>/{configCategories.length} · обовʼязкових{' '}
            {doneRequired}/{required.length}
          </p>

          {errors.length === 0 && warnings.length === 0 ? (
            <p className={s.ok}>✓ Комплектуючі сумісні</p>
          ) : (
            <ul className={s.issues}>
              {errors.map((i) => (
                <li key={i.message} className={s.err}>
                  ✕ {i.message}
                </li>
              ))}
              {warnings.map((i) => (
                <li key={i.message} className={s.warn}>
                  ! {i.message}
                </li>
              ))}
            </ul>
          )}
          {power > 0 && (
            <p className={s.power}>
              Орієнтовне споживання: ~{power} Вт · БЖ від {recommendedPsu(power)} Вт
            </p>
          )}

          <ul className={s.rows}>
            {configCategories.map((c) => (
              <li key={c.id}>
                <span>{c.title}</span>
                <b className={sel[c.id] ? '' : s.dim}>
                  {sel[c.id] ? sel[c.id].name : c.emptyLabel}
                </b>
              </li>
            ))}
          </ul>

          <div className={s.total}>
            <span>Загальна сума</span>
            <strong>{formatPrice(total)}</strong>
          </div>
          <Button full disabled={!canBuy} onClick={buy}>
            Купити
          </Button>
          {!canBuy && (
            <p className={s.hint}>
              {errors.length
                ? 'Усуньте несумісність компонентів.'
                : `Оберіть обовʼязкові компоненти: ${doneRequired} з ${required.length}.`}
            </p>
          )}
          <div className={s.tools}>
            <button type="button" onClick={share}>
              {copied ? 'Посилання скопійовано' : 'Поділитися'}
            </button>
            <button
              type="button"
              onClick={() => setSelected({})}
              disabled={!Object.keys(selected).length}
            >
              Очистити
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
