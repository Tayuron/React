import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { FormField } from '../../modules/core/design-system/FormField';
import { Button } from '../../modules/core/design-system/Button';
import { useAuth } from '../../modules/auth/AuthContext';
import { MailIcon, LockIcon, UserFieldIcon, EyeIcon } from './icons';
import s from './Auth.module.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(f) {
  const e = {};
  if (f.name.trim().length < 2) e.name = 'Введіть імʼя (мінімум 2 символи)';
  if (!EMAIL_RE.test(f.email.trim())) e.email = 'Введіть коректний email';
  if (f.password.length < 8) e.password = 'Пароль має містити щонайменше 8 символів';
  if (f.confirm !== f.password) e.confirm = 'Паролі не збігаються';
  if (!f.terms) e.terms = 'Потрібна згода з умовами';
  return e;
}

export function RegisterPage() {
  const { user, register } = useAuth();
  const location = useLocation();
  const from = location.state?.from;
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', terms: false });
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={from ?? '/cabinet'} replace />;

  const onChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;
    setBusy(true);
    const res = await register(form);
    setBusy(false);
    if (!res.ok) setErrors({ email: res.error });
  }

  const eye = (
    <button type="button" className={s.eye} aria-label={show ? 'Сховати пароль' : 'Показати пароль'} onClick={() => setShow((v) => !v)}>
      <EyeIcon />
    </button>
  );
  const pwType = show ? 'text' : 'password';

  return (
    <div className={s.wrap}>
      <form className={s.card} onSubmit={onSubmit} noValidate>
        <h1 className={s.title}>Створення акаунта</h1>
        <p className={s.sub}>Заповніть форму, щоб оформлювати замовлення та відстежувати їх.</p>

        <FormField id="name" label="Імʼя" placeholder="Ваше імʼя" icon={<UserFieldIcon />} value={form.name} onChange={onChange} error={errors.name} autoComplete="name" />
        <FormField id="email" type="email" label="Email" placeholder="name@email.com" icon={<MailIcon />} value={form.email} onChange={onChange} error={errors.email} autoComplete="email" />
        <FormField id="password" type={pwType} label="Пароль" placeholder="Мінімум 8 символів" icon={<LockIcon />} trailing={eye} value={form.password} onChange={onChange} error={errors.password} autoComplete="new-password" />
        <FormField id="confirm" type={pwType} label="Підтвердіть пароль" placeholder="Повторіть пароль" icon={<LockIcon />} value={form.confirm} onChange={onChange} error={errors.confirm} autoComplete="new-password" />

        <div className={s.row}>
          <label className={s.check}>
            <input type="checkbox" name="terms" checked={form.terms} onChange={onChange} /> Погоджуюся з умовами використання
          </label>
        </div>
        {errors.terms && <p className={s.formError} role="alert">{errors.terms}</p>}

        <Button type="submit" full disabled={busy}>{busy ? 'Створюємо…' : 'Зареєструватися'}</Button>
        <p className={s.alt}>Вже є акаунт? <Link to="/login" state={location.state}>Увійти</Link></p>
      </form>
    </div>
  );
}
