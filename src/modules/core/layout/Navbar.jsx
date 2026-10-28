import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { useCart } from '../../cart/CartContext'
import s from './Navbar.module.css'

const links = [
  { to: '/catalog', label: 'Готові збірки', icon: '/images/computer-case.png' },
  { to: '/configurator', label: 'Конфігуратор', icon: '/images/preferences.png' },
  { to: '/components', label: 'Комплектуючі', icon: '/images/hardware.png' },
  { to: '/peripherals', label: 'Периферія', icon: '/images/monitor.png' },
]

const SearchIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
)
const CartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M2 3h3l2.7 12.4a1 1 0 0 0 1 .8h8.7a1 1 0 0 0 1-.8L20 7H6" /></svg>
)
const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" /></svg>
)

export function Navbar() {
  const { user } = useAuth()
  const { count } = useCart()
  return (
    <header className={s.header}>
      <nav className={s.nav} aria-label="Головна навігація">
        <Link to="/" className={s.logoLink}>
          <img className={s.logo} src="/images/logo.png" alt="МАГАЗИК" />
        </Link>

        <ul className={s.links}>
          {links.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} className={({ isActive }) => `${s.link} ${isActive ? s.active : ''}`}>
                <img className={s.icon} src={l.icon} alt="" />
                <span>{l.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className={s.actions}>
          <Link to="/catalog" className={s.iconBtn} aria-label="Пошук товарів"><SearchIcon /></Link>
          <Link to="/cart" className={s.cart} aria-label="Кошик"><CartIcon /><span>{count}</span></Link>
          {user ? (
            <Link to="/cabinet" className={s.profile} aria-label={`Особистий кабінет: ${user.name}`}><UserIcon /></Link>
          ) : (
            <Link to="/login" className={s.login}>Увійти</Link>
          )}
        </div>
      </nav>
    </header>
  )
}
