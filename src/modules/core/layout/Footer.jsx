import { Link } from 'react-router-dom'
import s from './Footer.module.css'

export function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.content}>
        <section>
          <h3>Про нас</h3>
          <p>Наш найкращий магазин ігрових ПК та комплектуючих. Ми пропонуємо тільки якісні збірки та надійні компоненти.</p>
        </section>
        <section>
          <h3>Посилання</h3>
          <ul>
            <li><Link to="/catalog">Готові збірки</Link></li>
            <li><Link to="/configurator">Конфігуратор</Link></li>
            <li><Link to="/components">Комплектуючі</Link></li>
            <li><Link to="/peripherals">Периферія</Link></li>
          </ul>
        </section>
        <section>
          <h3>Контакти</h3>
          <p>Email: Configurator@email.com</p>
          <p>Телефон: +38 (099) 123-45-67</p>
          <p>Адреса: м. Варош, вул. Зеньковецької 89</p>
        </section>
      </div>
      <div className={s.bottom}>© 2025 МАГАЗИК Configurator. Всі права захищені.</div>
    </footer>
  )
}
