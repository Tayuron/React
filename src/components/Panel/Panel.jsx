import s from './Panel.module.css';

export default function Panel({ title, action, children, className = '' }) {
  return (
    <section className={`${s.panel} ${className}`}>
      {(title || action) && (
        <header className={s.head}>
          {title && <h2>{title}</h2>}
          {action && (
            <a href="#" className={s.action}>
              {action}
            </a>
          )}
        </header>
      )}
      {children}
    </section>
  );
}
