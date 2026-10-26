import s from './FormField.module.css';

export default function FormField({ id, label, icon, trailing, ...input }) {
  return (
    <div className={s.field}>
      <label htmlFor={id} className={s.label}>
        {label}
      </label>
      <div className={s.control}>
        {icon && (
          <span className={s.icon} aria-hidden="true">
            {icon}
          </span>
        )}
        <input id={id} name={id} className={s.input} {...input} />
        {trailing}
      </div>
    </div>
  );
}
