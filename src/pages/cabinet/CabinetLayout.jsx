import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../modules/auth/AuthContext';
import { useAccount } from '../../modules/account/AccountContext';
import s from './CabinetLayout.module.css';

export function CabinetLayout() {
  const { user, logout } = useAuth();
  const { orders, favorites } = useAccount();
  const navigate = useNavigate();

  const firstName = user.name.split(' ')[0];
  const initials = user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  const since = new Date(user.createdAt).toLocaleDateString('uk-UA', { month: 'long', year: 'numeric' });
  const publicId = 'MG-' + user.id.slice(0, 6).toUpperCase();

  const menu = [
    { to: '/cabinet', label: 'Огляд акаунта', end: true },
    { to: '/cabinet/orders', label: 'Історія замовлень', count: orders.length },
    { to: '/cabinet/favorites', label: 'Обрані товари', count: favorites.length },
  ];

  return (
    <div className={s.wrap}>
      <nav className={s.crumbs}><Link to="/">Головна</Link> › Особистий кабінет</nav>
      <div className={s.top}>
        <div>
          <h1>ОСОБИСТИЙ КАБІНЕТ</h1>
          <p className={s.muted}>Вітаємо, {firstName}.</p>
        </div>
        <div className={s.uid}><small>ID користувача</small><span>{publicId}</span></div>
      </div>

      <div className={s.layout}>
        <aside>
          <div className={s.profile}>
            <div className={s.avatar}>{initials}</div>
            <strong>{user.name}</strong>
            <small>У грі з {since}</small>
          </div>
          <ul className={s.menu}>
            {menu.map((m) => (
              <li key={m.to}>
                <NavLink to={m.to} end={m.end} className={({ isActive }) => (isActive ? s.on : '')}>
                  <span>{m.label}</span>
                  {m.count > 0 && <small>{m.count}</small>}
                </NavLink>
              </li>
            ))}
            <li className={s.logout}>
              <button type="button" onClick={() => { logout(); navigate('/'); }}>Вийти з акаунта</button>
            </li>
          </ul>
        </aside>
        <div className={s.content}><Outlet /></div>
      </div>
    </div>
  );
}
