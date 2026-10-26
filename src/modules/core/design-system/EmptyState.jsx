import { Button } from './Button';
import s from './EmptyState.module.css';

export function EmptyState({ title, text, to, label }) {
  return (
    <div className={s.box}>
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {to && (
        <Button to={to} variant="outline">
          {label}
        </Button>
      )}
    </div>
  );
}
