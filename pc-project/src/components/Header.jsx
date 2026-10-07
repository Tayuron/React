import { Link } from 'react-router-dom'

export default function Header() {
	return (
		<header className='header'>
			<nav>
				<Link to='/'>
					<img
						className='logo'
						src='/images/-04-11-2025.png'
						alt='МАГАЗИК - logo'
					/>
				</Link>

				<ul className='nav-links montserrat-regular'>
					<div className='info'>
						<li>
							<Link to='/catalog'>
								<img
									className='mini-logo'
									src='/images/computer-case.png'
									alt=''
								/>
								Готові збірки
							</Link>
						</li>
					</div>
					<div className='info'>
						<li>
							<Link to='/coming-soon'>
								<img
									className='mini-logo'
									src='/images/preferences.png'
									alt=''
								/>
								Конфігуратор
							</Link>
						</li>
					</div>

					<div className='info'>
						<li>
							<Link to='/coming-soon'>
								<img className='mini-logo' src='/images/hardware.png' alt='' />
								Комплектуючі
							</Link>
						</li>
					</div>
					<div className='info'>
						<li>
							<Link to='/coming-soon'>
								<img className='mini-logo' src='/images/monitor.png' alt='' />
								Периферія
							</Link>
						</li>
					</div>
				</ul>
			</nav>
		</header>
	)
}
