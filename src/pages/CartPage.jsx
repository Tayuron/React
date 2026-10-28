import { Link } from 'react-router-dom';
import { ProductImage } from '../modules/core/design-system/ProductImage';
import { Button } from '../modules/core/design-system/Button';
import { useCart } from '../modules/cart/CartContext';
import { useAuth } from '../modules/auth/AuthContext';
import { formatPrice } from '../data/products';
import s from './CartPage.module.css';

export function CartPage() {
  const { items, count, total, setQty, remove, clear } = useCart();
  const { user } = useAuth();

  if (!items.length) {
    return (
      <div className={s.empty}>
        <h1>Кошик порожній</h1>
        <p>Додайте збірку або комплектуючі з каталогу.</p>
        <Button to="/catalog">До каталогу</Button>
      </div>
    );
  }

  return (
    <div className={s.wrap}>
      <div className={s.head}>
        <h1>Кошик</h1>
        <button type="button" className={s.link} onClick={clear}>Очистити кошик</button>
      </div>

      <div className={s.layout}>
        <ul className={s.list}>
          {items.map((i) => (
            <li key={i.id} className={s.row}>
              <ProductImage className={s.thumb} src={i.image} label={i.name} kind={i.kind} />
              <div className={s.name}>{i.name}</div>
              <div className={s.qty}>
                <button type="button" aria-label="Менше" onClick={() => setQty(i.id, i.qty - 1)}>−</button>
                <span>{i.qty}</span>
                <button type="button" aria-label="Більше" onClick={() => setQty(i.id, i.qty + 1)}>+</button>
              </div>
              <strong className={s.sum}>{formatPrice(i.price * i.qty)}</strong>
              <button type="button" className={s.remove} aria-label={`Видалити ${i.name}`} onClick={() => remove(i.id)}>×</button>
            </li>
          ))}
        </ul>

        <aside className={s.summary}>
          <h2>Разом</h2>
          <p className={s.line}><span>Товарів</span><span>{count}</span></p>
          <p className={s.total}><span>До сплати</span><strong>{formatPrice(total)}</strong></p>
          <Button to={user ? '/requisites' : '/login'} state={{ from: '/requisites' }} full>
            Оформити замовлення
          </Button>
          {!user && <p className={s.hint}>Щоб оформити замовлення, <Link to="/login" state={{ from: '/requisites' }}>увійдіть</Link> в акаунт.</p>}
        </aside>
      </div>
    </div>
  );
}
