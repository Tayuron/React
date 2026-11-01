import { Panel } from '../../modules/core/design-system/Panel';
import { EmptyState } from '../../modules/core/design-system/EmptyState';
import { OrderCard } from '../../modules/account/OrderCard';
import { useAccount } from '../../modules/account/AccountContext';
import s from './OrdersPage.module.css';

export function OrdersPage() {
  const { orders } = useAccount();
  return (
    <Panel title="Історія замовлень">
      {orders.length ? (
        <div className={s.list}>
          {orders.map((o) => (
            <div key={o.id} className={s.item}><OrderCard order={o} /></div>
          ))}
        </div>
      ) : (
        <EmptyState title="Історія порожня" text="Ви ще нічого не купували." to="/catalog" label="До каталогу" />
      )}
    </Panel>
  );
}
