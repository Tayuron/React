import s from './FormField.module.css';

export function FormField({ id, label, icon, trailing, error, ...input }) {
  return (
    <div className={s.field}>
      <label htmlFor={id} className={s.label}>
        {label}
      </label>
      <div className={`${s.control} ${error ? s.invalid : ''}`}>
        {icon && (
          <span className={s.icon} aria-hidden="true">
            {icon}
          </span>
        )}
        <input
          id={id}
          name={id}
          className={s.input}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          {...input}
        />
        {trailing}
      </div>
      {error && (
        <p id={`${id}-error`} className={s.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
