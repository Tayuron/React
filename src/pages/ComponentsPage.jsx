import { ShopLayout } from '../modules/core/shop/ShopLayout';
import { PartCard } from '../modules/core/shop/PartCard';
import { Loading, ErrorState } from '../modules/core/design-system/AsyncState';
import { useComponents } from '../hooks/useCatalog';

const fields = [
  { key: 'category', title: 'Категорія' },
  { key: 'brand', title: 'Виробник' },
];

export function ComponentsPage() {
  const { data, loading, error, refetch } = useComponents();
  if (loading) return <Loading />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  return (
    <ShopLayout
      title="Комплектуючі"
      items={data}
      fields={fields}
      renderItem={(item) => <PartCard item={item} />}
    />
  );
}
