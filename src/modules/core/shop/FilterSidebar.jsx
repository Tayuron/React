import s from './FilterSidebar.module.css';

export function FilterSidebar({ filters }) {
  const { state, groups, setQuery, setMin, setMax, toggle, reset, isActive } = filters;
  return (
    <aside className={s.sidebar}>
      <div className={s.top}>
        <h3>Фільтри</h3>
        {isActive && (
          <button type="button" className={s.reset} onClick={reset}>
            Скинути
          </button>
        )}
      </div>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="search"
          className={s.search}
          placeholder="Пошук за назвою"
          aria-label="Пошук за назвою"
          value={state.query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <h4>Ціна (грн)</h4>
        <div className={s.range}>
          <input
            type="number"
            min="0"
            placeholder="Від"
            aria-label="Ціна від"
            value={state.min}
            onChange={(e) => setMin(e.target.value)}
          />
          <input
            type="number"
            min="0"
            placeholder="До"
            aria-label="Ціна до"
            value={state.max}
            onChange={(e) => setMax(e.target.value)}
          />
        </div>
        {groups.map((g) => (
          <fieldset key={g.key} className={s.group}>
            <legend>{g.title}</legend>
            {g.options.map((o) => (
              <label key={o.value}>
                <input
                  type="checkbox"
                  checked={state.selected[g.key]?.includes(o.value) ?? false}
                  onChange={() => toggle(g.key, o.value)}
                />
                <span>{o.value}</span>
                <small>{o.count}</small>
              </label>
            ))}
          </fieldset>
        ))}
      </form>
    </aside>
  );
}
