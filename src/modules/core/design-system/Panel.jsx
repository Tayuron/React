import s from './Panel.module.css';

export function Panel({ title, action, children, className = '' }) {
  return (
    <section className={`${s.panel} ${className}`}>
      {(title || action) && (
        <header className={s.head}>
          {title && <h2>{title}</h2>}
          {action && <div className={s.action}>{action}</div>}
        </header>
      )}
      {children}
    </section>
  );
}
