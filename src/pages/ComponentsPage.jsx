import { ShopLayout } from '../modules/core/shop/ShopLayout';
import { PartCard } from '../modules/core/shop/PartCard';
import { componentItems } from '../data/parts';

const fields = [
  { key: 'category', title: 'Категорія' },
  { key: 'brand', title: 'Виробник' },
];

export function ComponentsPage() {
  return (
    <ShopLayout
      title="Комплектуючі"
      items={componentItems}
      fields={fields}
      renderItem={(item) => <PartCard item={item} />}
    />
  );
}
