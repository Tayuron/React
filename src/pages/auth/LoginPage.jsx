import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { FormField } from '../../modules/core/design-system/FormField';
import { Button } from '../../modules/core/design-system/Button';
import { useAuth } from '../../modules/auth/AuthContext';
import { MailIcon, LockIcon, EyeIcon } from './icons';
import s from './Auth.module.css';

export function LoginPage() {
  const { user, login } = useAuth();
  const location = useLocation();
  const from = location.state?.from;
  const [form, setForm] = useState({ email: '', password: '', remember: true });
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={from ?? '/cabinet'} replace />;

  const onChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) return setError('Введіть email і пароль');
    setError('');
    setBusy(true);
    const res = await login(form);
    setBusy(false);
    if (!res.ok) setError(res.error);
  }

  return (
    <div className={s.wrap}>
      <form className={s.card} onSubmit={onSubmit} noValidate>
        <h1 className={s.title}>Вхід до акаунта</h1>
        <p className={s.sub}>
          {from ? 'Увійдіть, щоб продовжити.' : 'Введіть дані, які використовували під час реєстрації.'}
        </p>

        <FormField id="email" type="email" label="Email" placeholder="name@email.com" icon={<MailIcon />} value={form.email} onChange={onChange} autoComplete="email" />
        <FormField
          id="password"
          type={show ? 'text' : 'password'}
          label="Пароль"
          placeholder="Введіть пароль"
          icon={<LockIcon />}
          value={form.password}
          onChange={onChange}
          autoComplete="current-password"
          trailing={
            <button type="button" className={s.eye} aria-label={show ? 'Сховати пароль' : 'Показати пароль'} onClick={() => setShow((v) => !v)}>
              <EyeIcon />
            </button>
          }
        />

        <div className={s.row}>
          <label className={s.check}>
            <input type="checkbox" name="remember" checked={form.remember} onChange={onChange} /> Запамʼятати мене
          </label>
        </div>

        {error && <p className={s.formError} role="alert">{error}</p>}
        <Button type="submit" full disabled={busy}>{busy ? 'Входимо…' : 'Увійти'}</Button>
        <p className={s.alt}>Ще немає акаунта? <Link to="/register" state={location.state}>Зареєструватися</Link></p>
      </form>
    </div>
  );
}
