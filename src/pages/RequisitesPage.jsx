import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../modules/core/design-system/Button';
import { EmptyState } from '../modules/core/design-system/EmptyState';
import { useCart } from '../modules/cart/CartContext';
import { useAccount, isDeliveryComplete } from '../modules/account/AccountContext';
import { Loading, ErrorState } from '../modules/core/design-system/AsyncState';
import { usePaymentMethods } from '../hooks/useCatalog';
import { formatPrice } from '../data/products';
import s from './RequisitesPage.module.css';

export function RequisitesPage() {
  const { items, total, clear } = useCart();
  const { delivery, placeOrder } = useAccount();
  const navigate = useNavigate();
  const payment = usePaymentMethods();
  const [copied, setCopied] = useState(null);
  const [busy, setBusy] = useState(false);
  const [orderError, setOrderError] = useState('');
  const ready = isDeliveryComplete(delivery);

  async function copy(id, addr) {
    try {
      await navigator.clipboard.writeText(addr);
      setCopied(id);
      setTimeout(() => setCopied((c) => (c === id ? null : c)), 2000);
    } catch {
      /* буфер обміну недоступний */
    }
  }

  async function confirm() {
    setBusy(true);
    setOrderError('');
    try {
      await placeOrder({ items }); // сервер сам перераховує ціни та суму
      clear();
      navigate('/cabinet');
    } catch (e) {
      setOrderError(e.message);
      setBusy(false);
    }
  }

  if (!items.length) {
    return (
      <div className={s.wrap}>
        <EmptyState
          title="Нічого оплачувати"
          text="Кошик порожній. Додайте товари з каталогу."
          to="/catalog"
          label="До каталогу"
        />
      </div>
    );
  }

  return (
    <div className={s.wrap}>
      <h1 className={s.title}>Оплата</h1>
      <p className={s.lead}>Приймаємо USDT. Оберіть мережу та надішліть точну суму на адресу.</p>

      <p className={s.sum}>
        До сплати <strong>{formatPrice(total)}</strong>
        <Link to="/cart">Змінити замовлення</Link>
      </p>

      {payment.loading && <Loading />}
      {payment.error && <ErrorState error={payment.error} onRetry={payment.refetch} />}
      <ul className={s.list}>
        {(payment.data ?? []).map((c) => (
          <li key={c.id} className={s.row}>
            <div className={s.net}>
              <b>USDT · {c.net}</b>
              <small>{c.full}</small>
            </div>
            <code className={s.addr}>{c.addr}</code>
            <button type="button" className={s.copy} onClick={() => copy(c.id, c.addr)}>
              {copied === c.id ? 'Скопійовано' : 'Копіювати'}
            </button>
          </li>
        ))}
      </ul>

      <p className={s.note}>
        Перевірте мережу перед відправкою: переказ на іншу мережу не повертається. Після оплати
        натисніть кнопку нижче, і замовлення зʼявиться в кабінеті.
      </p>

      <section className={s.delivery}>
        <h2>Доставка</h2>
        {ready ? (
          <p>
            {delivery.name}, {delivery.phone}
            <br />
            {delivery.carrier} · {delivery.city}, {delivery.address}
          </p>
        ) : (
          <p className={s.warn}>
            Спершу вкажіть дані доставки у <Link to="/cabinet">кабінеті</Link>.
          </p>
        )}
        {ready && (
          <Link to="/cabinet" className={s.edit}>
            Змінити
          </Link>
        )}
      </section>

      {orderError && (
        <p className={s.warn} role="alert">
          {orderError}
        </p>
      )}
      <div className={s.actions}>
        <Button onClick={confirm} disabled={!ready || busy}>
          {busy ? 'Оформлюємо…' : 'Я оплатив(ла), оформити замовлення'}
        </Button>
        <Button to="https://t.me/tayuron" variant="outline">
          Повідомити в Telegram
        </Button>
      </div>
    </div>
  );
}
