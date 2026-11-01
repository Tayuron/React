import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../modules/core/design-system/Button';
import { ProductImage } from '../modules/core/design-system/ProductImage';
import { AddToCartButton } from '../modules/cart/AddToCartButton';
import { products, ramOptions, hddOptions, formatPrice } from '../data/products';
import s from './ProductPage.module.css';

const shortName = (label) => label.replace(/\s*\(.*\)/, '');

export function ProductPage() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const [ram, setRam] = useState(0);
  const [hdd, setHdd] = useState(0);

  if (!product) {
    return (
      <div className={s.notFound}>
        <h1>Збірку не знайдено</h1>
        <Button to="/catalog">До каталогу</Button>
      </div>
    );
  }

  const total = product.price + ramOptions[ram].price + hddOptions[hdd].price;
  const cartItem = {
    id: `${product.id}-r${ram}-h${hdd}`,
    name: `${product.name} (${shortName(ramOptions[ram].label)}, ${shortName(hddOptions[hdd].label)})`,
    price: total,
    image: product.image,
    kind: 'pc',
  };

  return (
    <div className={s.layout}>
      <div className={s.gallery}>
        <ProductImage className={s.image} src={product.image} alt={product.name} label={product.name} kind="pc" />
      </div>

      <div className={s.info}>
        <nav className={s.crumbs}>
          <Link to="/catalog">Готові збірки</Link> / {product.name}
        </nav>
        <h1 className={s.title}>{product.title}</h1>

        <ul className={s.specs}>
          {product.specs.map(([name, value]) => (
            <li key={name}>
              <span>{name}</span>
              {value}
            </li>
          ))}
        </ul>

        <div className={s.modules}>
          <label htmlFor="ram">Додати ОЗП</label>
          <select id="ram" value={ram} onChange={(e) => setRam(Number(e.target.value))}>
            {ramOptions.map((o, i) => (
              <option key={o.label} value={i}>{o.label}</option>
            ))}
          </select>
          <label htmlFor="hdd">Додати HDD</label>
          <select id="hdd" value={hdd} onChange={(e) => setHdd(Number(e.target.value))}>
            {hddOptions.map((o, i) => (
              <option key={o.label} value={i}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className={s.priceBox}>
          <div className={s.price}>Ціна: {formatPrice(total)}</div>
          <AddToCartButton product={cartItem} full />
        </div>
      </div>
    </div>
  );
}
