import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'

export default function Layout() {
  return (
    <div className="min-h-screen bg-bg-primary pb-20">
      <main className="mx-auto max-w-lg px-4 py-6">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
