import { ShopLayout } from '../modules/core/shop/ShopLayout';
import { ProductCard } from '../modules/core/shop/ProductCard';
import { Loading, ErrorState } from '../modules/core/design-system/AsyncState';
import { useProducts } from '../hooks/useCatalog';

const fields = [
  { key: 'cpu', title: 'Процесор' },
  { key: 'gpu', title: 'Відеокарта' },
];

export function CatalogPage() {
  const { data, loading, error, refetch } = useProducts();
  if (loading) return <Loading />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  return (
    <ShopLayout
      title="Готові збірки"
      items={data}
      fields={fields}
      renderItem={(p) => <ProductCard product={p} />}
    />
  );
}
