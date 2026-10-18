import { Fragment } from 'react';
import { Button } from '../design-system/Button';
import { useFilters } from '../../catalog/useFilters';
import { FilterSidebar } from './FilterSidebar';
import s from './ShopLayout.module.css';

export function ShopLayout({ title, items, fields, renderItem }) {
  const filters = useFilters(items, fields);
  const { filtered } = filters;
  return (
    <div className={s.layout}>
      <FilterSidebar filters={filters} />
      <section className={s.content}>
        <div className={s.head}>
          <h1>{title}</h1>
          <span className={s.count}>Знайдено товарів: {filtered.length}</span>
        </div>
        {filtered.length ? (
          <div className={s.grid}>
            {filtered.map((item) => (
              <Fragment key={item.id}>{renderItem(item)}</Fragment>
            ))}
          </div>
        ) : (
          <div className={s.empty}>
            <p>За вашими фільтрами нічого не знайдено.</p>
            <Button variant="outline" onClick={filters.reset}>Скинути фільтри</Button>
          </div>
        )}
      </section>
    </div>
  );
}
