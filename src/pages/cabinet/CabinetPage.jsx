import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Panel } from '../../modules/core/design-system/Panel';
import { EmptyState } from '../../modules/core/design-system/EmptyState';
import { OrderCard } from '../../modules/account/OrderCard';
import { DeliveryForm } from '../../modules/account/DeliveryForm';
import { useAccount, isDeliveryComplete } from '../../modules/account/AccountContext';
import { useAuth } from '../../modules/auth/AuthContext';
import s from './CabinetPage.module.css';

export function CabinetPage() {
  const { user } = useAuth();
  const { orders, delivery, saveDelivery } = useAccount();
  const [editing, setEditing] = useState(false);
  const complete = isDeliveryComplete(delivery);

  return (
    <>
      <Panel
        title="Актуальне замовлення"
        action={orders.length > 1 && <Link to="/cabinet/orders">Усі замовлення ({orders.length})</Link>}
      >
        {orders.length ? (
          <OrderCard order={orders[0]} withSteps />
        ) : (
          <EmptyState title="Замовлень ще немає" text="Тут зʼявиться ваше замовлення після оформлення." to="/catalog" label="До каталогу" />
        )}
      </Panel>

      <Panel
        title="Дані та доставка"
        action={!editing && <button type="button" onClick={() => setEditing(true)}>{complete ? 'Змінити' : 'Вказати'}</button>}
      >
        {editing ? (
          <DeliveryForm
            initial={{ ...delivery, name: delivery.name || user.name }}
            onSave={(d) => { saveDelivery(d); setEditing(false); }}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <div className={s.info}>
            <p><b>{delivery.name || user.name}</b></p>
            <p className={s.muted}>{user.email}</p>
            {delivery.phone && <p className={s.muted}>{delivery.phone}</p>}
            <hr className={s.hr} />
            {complete ? (
              <>
                <small className={s.label}>Адреса доставки</small>
                <p><b>{delivery.city}, {delivery.address}</b></p>
                <p className={s.muted}>{delivery.carrier}</p>
              </>
            ) : (
              <p className={s.muted}>Адресу доставки ще не вказано. Вона знадобиться для оформлення замовлення.</p>
            )}
          </div>
        )}
      </Panel>
    </>
  );
}
