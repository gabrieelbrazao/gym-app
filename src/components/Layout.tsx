import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import BottomNav from './BottomNav'

export default function Layout() {
  const location = useLocation()

  return (
    <div
      className="min-h-screen bg-bg-primary"
      style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom))' }}
    >
      <main
        className="mx-auto max-w-lg px-4 pb-6"
        style={{ paddingTop: 'calc(1.5rem + env(safe-area-inset-top))' }}
      >
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.div>
      </main>
      <BottomNav />
    </div>
  )
}
