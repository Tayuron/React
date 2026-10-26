import { ShopLayout } from '../modules/core/shop/ShopLayout';
import { PartCard } from '../modules/core/shop/PartCard';
import { peripheralItems } from '../data/parts';

const fields = [
  { key: 'category', title: 'Категорія' },
  { key: 'brand', title: 'Бренд' },
];

export function PeripheralsPage() {
  return (
    <ShopLayout
      title="Геймерська периферія"
      items={peripheralItems}
      fields={fields}
      renderItem={(item) => <PartCard item={item} />}
    />
  );
}
