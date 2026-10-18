import { ShopLayout } from '../modules/core/shop/ShopLayout';
import { ProductCard } from '../modules/core/shop/ProductCard';
import { products } from '../data/products';

const fields = [
  { key: 'cpu', title: 'Процесор' },
  { key: 'gpu', title: 'Відеокарта' },
];

export function CatalogPage() {
  return (
    <ShopLayout
      title="Готові збірки"
      items={products}
      fields={fields}
      renderItem={(p) => <ProductCard product={p} />}
    />
  );
}
