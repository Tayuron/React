import { Link } from 'react-router-dom'

export default function Home() {
	return (
		<main>
			<div className='wrapper'>
				<div className='fixed-nav-padding'></div>
				<div>
					<img
						className='img-ad'
						src='/images/RTS_BANNER_bf876098-87be-4b3a-b290-9f9a4286b21b.webp'
						alt='pc ad'
					/>
				</div>
			</div>

			<section className='hero-section'>
				<div className='hero-content'>
					<h1 className='montserrat-bold'>
						ЗБИРАЄМО ПК, ЯКІ <span className='red-text'>ДИХАЮТЬ ШВИДКІСТЮ</span>
					</h1>
					<p className='montserrat-regular'>
						Ми не просто продаємо залізо. Ми створюємо індивідуальні ігрові та
						робочі станції з ідеальним кабель-менеджментом, протестованою
						стабільністю та характером.
					</p>
					<div className='hero-btns'>
						<Link to='/catalog' className='btn'>
							ПЕРЕГЛЯНУТИ КАТАЛОГ
						</Link>
						<Link to='/coming-soon' className='btn btn-outline'>
							КОНФІГУРАТОР
						</Link>
					</div>
				</div>
			</section>
		</main>
	)
}
