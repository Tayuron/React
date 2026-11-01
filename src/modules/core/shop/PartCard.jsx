import { formatPrice } from '../../../data/products';
import { AddToCartButton } from '../../cart/AddToCartButton';
import { ProductImage } from '../design-system/ProductImage';
import { FavoriteButton } from '../../account/FavoriteButton';
import s from './PartCard.module.css';

export function PartCard({ item }) {
  return (
    <article className={s.card}>
      <div className={s.thumb}>
        <ProductImage className={s.img} src={item.image} alt={item.name} label={item.brand} kind={item.kind} />
        <FavoriteButton product={{ id: item.id, name: item.name, price: item.price, info: item.info, image: item.image, kind: item.kind }} />
      </div>
      <h3>{item.name}</h3>
      <p className={s.info}>{item.info}</p>
      <div className={s.foot}>
        <strong>{formatPrice(item.price)}</strong>
        <AddToCartButton product={{ id: item.id, name: item.name, price: item.price, image: item.image, kind: item.kind }} />
      </div>
    </article>
  );
}
