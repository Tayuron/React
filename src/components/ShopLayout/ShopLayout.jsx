import Button from '../Button/Button'
import { formatPrice } from '../../data/products'
import s from './ShopLayout.module.css'

export default function ShopLayout({ title, items, filters }) {
  return (
    <div className={s.layout}>
      <aside className={s.sidebar}>
        <h3>Фільтри</h3>
        <form onSubmit={(e) => e.preventDefault()}>
          <h4>Ціна (грн)</h4>
          <div className={s.range}>
            <input type="number" placeholder="Від" aria-label="Ціна від" />
            <input type="number" placeholder="До" aria-label="Ціна до" />
          </div>
          {filters.map((f) => (
            <fieldset key={f.title} className={s.group}>
              <legend>{f.title}</legend>
              {f.options.map((o) => <label key={o}><input type="checkbox" /> {o}</label>)}
            </fieldset>
          ))}
          <Button type="submit" full>Застосувати</Button>
        </form>
      </aside>

      <section className={s.content}>
        <div className={s.head}>
          <h1>{title}</h1>
          <span className={s.count}>Знайдено товарів: {items.length}</span>
        </div>
        <div className={s.grid}>
          {items.map((i) => (
            <article key={i.id} className={s.card}>
              <div className={s.thumb} aria-hidden="true" />
              <h3>{i.name}</h3>
              <p className={s.info}>{i.info}</p>
              <div className={s.foot}>
                <strong>{formatPrice(i.price)}</strong>
                <Button>Купити</Button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
