import { useMutation as useRqMutation } from '@tanstack/react-query';
import { api } from '../api/http';

export function useMutation(fn) {
  const m = useRqMutation({ mutationFn: fn });
  return {
    data: m.data ?? null,
    loading: m.isPending,
    error: m.error ?? null,
    mutate: m.mutateAsync,
    reset: m.reset,
  };
}

export const usePost = (path) => useMutation((body) => api.post(path, body));
export const usePut = (path) => useMutation((body) => api.put(path, body));
