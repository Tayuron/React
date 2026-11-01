import { Link } from 'react-router-dom';
import s from './PageNotFound.module.css';

export function PageNotFound() {
  return (
    <div className={s.container}>
      <h1 className={s.code}>404</h1>
      <h2>Сторінку не знайдено</h2>
      <p>Такої сторінки не існує.</p>
      <Link to="/">Повернутися на головну</Link>
    </div>
  );
}
