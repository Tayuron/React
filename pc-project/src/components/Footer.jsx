import { Link } from 'react-router-dom'

export default function Footer() {
	return (
		<footer className='montserrat-regular'>
			<div className='footer-content'>
				<div className='footer-section about'>
					<h3>Про нас</h3>
					<p>
						Наш найкращий магазин ігрових ПК та комплектуючих. Ми пропонуємо
						тільки якісні збірки та надійні компоненти.
					</p>
				</div>
				<div className='footer-section links'>
					<h3>Посилання</h3>
					<ul>
						<li>
							<Link to='/catalog'>Готові збірки</Link>
						</li>
						<li>
							<Link to='/coming-soon'>Конфігуратор</Link>
						</li>
						<li>
							<Link to='/coming-soon'>Комплектуючі</Link>
						</li>
						<li>
							<Link to='/coming-soon'>Периферія</Link>
						</li>
					</ul>
				</div>
				<div className='footer-section contact'>
					<h3>Контакти</h3>
					<p>Email: Configurator@email.com</p>
					<p>Телефон: +38 (0XX) XXX-XX-XX</p>
					<p>Адреса: м. Варош вул Зеньковецької 89</p>
				</div>
			</div>
			<div className='footer-bottom'>
				&copy; 2025 PC Configurator. Всі права захищені.
			</div>
		</footer>
	)
}
