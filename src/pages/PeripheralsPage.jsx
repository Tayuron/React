import { ShopLayout } from '../modules/core/shop/ShopLayout';
import { PartCard } from '../modules/core/shop/PartCard';
import { Loading, ErrorState } from '../modules/core/design-system/AsyncState';
import { usePeripherals } from '../hooks/useCatalog';

const fields = [
  { key: 'category', title: 'Категорія' },
  { key: 'brand', title: 'Бренд' },
];

export function PeripheralsPage() {
  const { data, loading, error, refetch } = usePeripherals();
  if (loading) return <Loading />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  return (
    <ShopLayout
      title="Геймерська периферія"
      items={data}
      fields={fields}
      renderItem={(item) => <PartCard item={item} />}
    />
  );
}
