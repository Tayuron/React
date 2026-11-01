import { useFetch } from './useFetch';

export const useProducts = () => useFetch('/products');
export const useProduct = (id) => useFetch(`/products/${encodeURIComponent(id)}`);
export const useComponents = () => useFetch('/components');
export const usePeripherals = () => useFetch('/peripherals');
export const usePaymentMethods = () => useFetch('/payment-methods');
