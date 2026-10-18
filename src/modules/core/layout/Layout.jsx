import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import s from './Layout.module.css'

export function Layout() {
  return (
    <div className={s.page}>
      <Navbar />
      <main className={s.main}><Outlet /></main>
      <Footer />
    </div>
  )
}
