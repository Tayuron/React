import { Link } from 'react-router-dom'
import s from './Button.module.css'

export default function Button({ to, variant = 'primary', full = false, children, ...rest }) {
  const cls = `${s.btn} ${s[variant]} ${full ? s.full : ''}`
  if (to) return <Link to={to} className={cls} {...rest}>{children}</Link>
  return <button className={cls} {...rest}>{children}</button>
}
