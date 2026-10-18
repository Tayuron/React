import { Button } from '../core/design-system/Button';
import { useCart } from './CartContext';

export function AddToCartButton({ product, full = false }) {
  const { items, add } = useCart();
  const inCart = items.find((i) => i.id === product.id);
  return (
    <Button full={full} variant={inCart ? 'outline' : 'primary'} onClick={() => add(product)}>
      {inCart ? `У кошику · ${inCart.qty}` : 'У кошик'}
    </Button>
  );
}
