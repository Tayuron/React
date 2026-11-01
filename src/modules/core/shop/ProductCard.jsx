import { Link } from 'react-router-dom';
import { formatPrice } from '../../../data/products';
import { AddToCartButton } from '../../cart/AddToCartButton';
import { ProductImage } from '../design-system/ProductImage';
import { FavoriteButton } from '../../account/FavoriteButton';
import s from './ProductCard.module.css';

export function ProductCard({ product }) {
  const cartItem = { id: product.id, name: product.name, price: product.price, image: product.image, kind: 'pc' };
  return (
    <article className={s.card}>
      <div className={s.media}>
        <Link to={`/catalog/${product.id}`} className={s.imageLink}>
          <ProductImage className={s.image} src={product.image} alt={product.name} label={product.name} kind="pc" />
        </Link>
        <FavoriteButton product={{ ...cartItem, href: `/catalog/${product.id}`, info: product.card.slice(0, 2).join(' · ') }} />
      </div>
      <Link to={`/catalog/${product.id}`}>
        <h3 className={s.title}>{product.name}</h3>
      </Link>
      <ul className={s.specs}>
        {product.card.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <div className={s.foot}>
        <p className={s.price}>{formatPrice(product.price)}</p>
        <AddToCartButton product={cartItem} />
      </div>
    </article>
  );
}
