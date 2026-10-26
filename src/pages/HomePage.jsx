import { Button } from '../modules/core/design-system/Button';
import s from './HomePage.module.css';

export function HomePage() {
  return (
    <>
      <img className={s.banner} src="/images/banner.webp" alt="Готові збірки зі знижками" />
      <section className={s.hero}>
        <h1 className={s.title}>
          ЗБИРАЄМО ПК, ЯКІ <span className={s.red}>ДИХАЮТЬ ШВИДКІСТЮ</span>
        </h1>
        <p className={s.text}>
          Ми не просто продаємо залізо. Ми створюємо індивідуальні ігрові та робочі станції з
          ідеальним кабель-менеджментом, протестованою стабільністю та характером.
        </p>
        <div className={s.buttons}>
          <Button to="/catalog">ПЕРЕГЛЯНУТИ КАТАЛОГ</Button>
          <Button to="/configurator" variant="outline">
            КОНФІГУРАТОР
          </Button>
        </div>
      </section>
    </>
  );
}
