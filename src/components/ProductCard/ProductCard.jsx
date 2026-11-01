import { Link } from 'react-router-dom'
import { formatPrice } from '../../data/products'
import s from './ProductCard.module.css'

export default function ProductCard({ product }) {
  return (
    <article className={s.card}>
      <Link to={`/catalog/${product.id}`} className={s.imageLink}>
        <img className={s.image} src={product.image} alt={product.name} />
      </Link>
      <Link to={`/catalog/${product.id}`}><h3 className={s.title}>{product.name}</h3></Link>
      <ul className={s.specs}>
        {product.card.map((line) => <li key={line}>{line}</li>)}
      </ul>
      <p className={s.price}>{formatPrice(product.price)}</p>
    </article>
  )
}
