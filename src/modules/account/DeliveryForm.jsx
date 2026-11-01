import { useState } from 'react';
import { FormField } from '../core/design-system/FormField';
import { Button } from '../core/design-system/Button';
import s from './DeliveryForm.module.css';

const CARRIERS = ['Нова пошта', 'Укрпошта', 'Meest'];

function validate(f) {
  const e = {};
  if (f.name.trim().length < 2) e.name = 'Вкажіть імʼя отримувача';
  const digits = f.phone.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 13) e.phone = 'Введіть коректний номер телефону';
  if (!f.city.trim()) e.city = 'Вкажіть місто';
  if (!f.address.trim()) e.address = 'Вкажіть відділення або адресу';
  return e;
}

export function DeliveryForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  function onSubmit(e) {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (!Object.keys(found).length)
      onSave({
        ...form,
        name: form.name.trim(),
        city: form.city.trim(),
        address: form.address.trim(),
        phone: form.phone.trim(),
      });
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <FormField
        id="name"
        label="Отримувач"
        value={form.name}
        onChange={onChange}
        error={errors.name}
        autoComplete="name"
      />
      <FormField
        id="phone"
        type="tel"
        label="Телефон"
        placeholder="+38 0XX XXX XX XX"
        value={form.phone}
        onChange={onChange}
        error={errors.phone}
        autoComplete="tel"
      />
      <div className={s.field}>
        <label htmlFor="carrier" className={s.label}>
          Служба доставки
        </label>
        <select
          id="carrier"
          name="carrier"
          className={s.select}
          value={form.carrier}
          onChange={onChange}
        >
          {CARRIERS.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <FormField
        id="city"
        label="Місто"
        value={form.city}
        onChange={onChange}
        error={errors.city}
        autoComplete="address-level2"
      />
      <FormField
        id="address"
        label="Відділення або адреса"
        placeholder="Відділення № 25, вул. Хрещатик, 22"
        value={form.address}
        onChange={onChange}
        error={errors.address}
        autoComplete="street-address"
      />
      <div className={s.actions}>
        <Button type="submit">Зберегти</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Скасувати
        </Button>
      </div>
    </form>
  );
}
