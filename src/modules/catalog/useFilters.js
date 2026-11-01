import { useMemo, useState } from 'react';

// fields: [{ key: 'cpu', title: 'Процесор' }] — варіанти беруться з самих товарів
export function useFilters(items, fields) {
  const [query, setQuery] = useState('');
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [selected, setSelected] = useState({});

  const groups = useMemo(
    () =>
      fields.map((f) => {
        const counts = new Map();
        items.forEach((i) => counts.set(i[f.key], (counts.get(i[f.key]) ?? 0) + 1));
        return { ...f, options: [...counts].map(([value, count]) => ({ value, count })) };
      }),
    [items, fields],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const lo = min === '' ? -Infinity : Number(min);
    const hi = max === '' ? Infinity : Number(max);
    return items.filter((i) => {
      const text = `${i.name} ${i.info ?? ''} ${(i.card ?? []).join(' ')}`.toLowerCase();
      if (q && !text.includes(q)) return false;
      if (i.price < lo || i.price > hi) return false;
      return fields.every((f) => !selected[f.key]?.length || selected[f.key].includes(i[f.key]));
    });
  }, [items, fields, query, min, max, selected]);

  const toggle = (key, value) =>
    setSelected((s) => {
      const cur = s[key] ?? [];
      return {
        ...s,
        [key]: cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value],
      };
    });
  const reset = () => {
    setQuery('');
    setMin('');
    setMax('');
    setSelected({});
  };
  const isActive = Boolean(query || min || max || Object.values(selected).some((v) => v.length));

  return {
    filtered,
    groups,
    state: { query, min, max, selected },
    setQuery,
    setMin,
    setMax,
    toggle,
    reset,
    isActive,
  };
}
