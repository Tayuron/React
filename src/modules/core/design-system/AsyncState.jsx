import { Button } from './Button';
import s from './AsyncState.module.css';

export function Loading({ text = 'Завантаження…' }) {
  return (
    <div className={s.box} role="status">
      <div className={s.spinner} aria-hidden="true" />
      <p>{text}</p>
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  return (
    <div className={s.box} role="alert">
      <h3>Не вдалося завантажити дані</h3>
      <p>{error?.message ?? 'Спробуйте ще раз пізніше.'}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Спробувати ще раз
        </Button>
      )}
    </div>
  );
}
