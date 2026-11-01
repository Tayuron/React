import { ProductImage } from '../core/design-system/ProductImage';
import { formatPrice } from '../../data/products';
import s from './OrderCard.module.css';

export function OrderCard({ order, withSteps = false }) {
  const date = new Date(order.createdAt).toLocaleDateString('uk-UA');
  const d = order.delivery;
  const steps = [['Оформлено', date, true], ['Оплата підтверджена', 'Очікується', false], ['Відправлено', 'Очікується', false], ['Отримано', 'Очікується', false]];
  return (
    <article className={s.order}>
      <header className={s.meta}>
        <span>№ {order.id} · {date}</span>
        <span className={s.badge}>{order.status}</span>
      </header>
      <ul className={s.items}>
        {order.items.map((i) => (
          <li key={i.id}>
            <ProductImage className={s.thumb} src={i.image} label={i.name} kind={i.kind} />
            <span className={s.name}>{i.name}</span>
            <span className={s.qty}>× {i.qty}</span>
            <strong>{formatPrice(i.price * i.qty)}</strong>
          </li>
        ))}
      </ul>
      {withSteps && (
        <ol className={s.steps}>
          {steps.map(([t, sub, done]) => (
            <li key={t} className={done ? s.done : ''}><b>{t}</b><small>{sub}</small></li>
          ))}
        </ol>
      )}
      <footer className={s.foot}>
        <div>
          <b>Доставка</b>
          <p>{d.carrier} · {d.city}, {d.address}</p>
          <p>{d.name}, {d.phone}</p>
        </div>
        <div className={s.total}>
          <span>Разом</span>
          <strong>{formatPrice(order.total)}</strong>
        </div>
      </footer>
    </article>
  );
}
