import { useQuery } from '@tanstack/react-query';
import { api } from '../api/http';

export function useFetch(url, { enabled = true, ...options } = {}) {
  const query = useQuery({
    queryKey: ['get', url],
    queryFn: ({ signal }) => api.get(url, { signal }),
    enabled: enabled && Boolean(url),
    ...options,
  });
  return {
    data: query.data ?? null,
    loading: query.isLoading,
    error: query.error ?? null,
    refetch: query.refetch,
  };
}
