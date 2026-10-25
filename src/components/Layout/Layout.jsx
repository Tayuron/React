import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import s from './Layout.module.css';

export default function Layout() {
  return (
    <div className={s.page}>
      <Navbar />
      <main className={s.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
