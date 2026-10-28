import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useAccount } from './AccountContext';
import s from './FavoriteButton.module.css';

export function FavoriteButton({ product }) {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useAccount();
  const navigate = useNavigate();
  const location = useLocation();
  const active = isFavorite(product.id);

  function onClick() {
    if (!user) return navigate('/login', { state: { from: location.pathname } });
    toggleFavorite(product);
  }

  return (
    <button
      type="button"
      className={`${s.btn} ${active ? s.on : ''}`}
      aria-pressed={active}
      aria-label={active ? 'Прибрати з обраного' : 'Додати в обране'}
      onClick={onClick}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
        <path d="M12 21s-7-4.6-9.3-9A5.3 5.3 0 0 1 12 6.6 5.3 5.3 0 0 1 21.3 12C19 16.4 12 21 12 21Z" />
      </svg>
    </button>
  );
}
