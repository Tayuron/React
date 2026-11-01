import { Link } from 'react-router-dom';
import { Panel } from '../../modules/core/design-system/Panel';
import { EmptyState } from '../../modules/core/design-system/EmptyState';
import { ProductImage } from '../../modules/core/design-system/ProductImage';
import { AddToCartButton } from '../../modules/cart/AddToCartButton';
import { useAccount } from '../../modules/account/AccountContext';
import { formatPrice } from '../../data/products';
import s from './FavoritesPage.module.css';

export function FavoritesPage() {
  const { favorites, toggleFavorite } = useAccount();
  return (
    <Panel title="Обрані товари">
      {favorites.length ? (
        <ul className={s.list}>
          {favorites.map((f) => (
            <li key={f.id} className={s.row}>
              <ProductImage className={s.thumb} src={f.image} label={f.name} kind={f.kind} />
              <div className={s.name}>
                {f.href ? <Link to={f.href}><b>{f.name}</b></Link> : <b>{f.name}</b>}
                {f.info && <small>{f.info}</small>}
              </div>
              <strong>{formatPrice(f.price)}</strong>
              <AddToCartButton product={{ id: f.id, name: f.name, price: f.price, image: f.image, kind: f.kind }} />
              <button type="button" className={s.remove} onClick={() => toggleFavorite(f)} aria-label={`Прибрати ${f.name} з обраного`}>×</button>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="Обраного ще немає" text="Натискайте серце на товарі, щоб зберегти його тут." to="/catalog" label="До каталогу" />
      )}
    </Panel>
  );
}
