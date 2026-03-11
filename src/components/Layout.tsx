import { useState, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import BottomNav from './BottomNav'
import { useWorkoutStore } from '../stores/useWorkoutStore'
import { ChevronRight } from 'lucide-react'
import { t } from '../i18n'

function formatElapsed(startTime: string): string {
  const s = Math.floor((Date.now() - new Date(startTime).getTime()) / 1000)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  return `${m}:${String(sec).padStart(2, '0')}`
}

function WorkoutBanner({ startTime }: { startTime: string }) {
  const navigate = useNavigate()
  const [elapsed, setElapsed] = useState(() => formatElapsed(startTime))

  useEffect(() => {
    const id = setInterval(() => setElapsed(formatElapsed(startTime)), 1000)
    return () => clearInterval(id)
  }, [startTime])

  return (
    <motion.button
      initial={{ y: 32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 32, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate('/workout')}
      className="fixed bottom-[4.5rem] left-1/2 z-40 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 overflow-hidden rounded-2xl border border-accent/20 bg-bg-card shadow-2xl"
      style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* accent top stripe */}
      <div className="h-0.5 w-full bg-gradient-to-r from-accent via-accent/60 to-transparent" />

      <div className="flex items-center gap-3 px-4 py-3">
        {/* pulsing live dot */}
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
        </span>

        <div className="flex min-w-0 flex-1 flex-col gap-0">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            {t('workout.returnBanner')}
          </span>
          <span className="font-mono text-lg font-medium leading-tight text-text-primary">
            {elapsed}
          </span>
        </div>

        <ChevronRight size={18} className="shrink-0 text-text-secondary" />
      </div>
    </motion.button>
  )
}

export default function Layout() {
  const location = useLocation()
  const { session } = useWorkoutStore()
  const isOnWorkout = location.pathname === '/workout'

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

      <AnimatePresence>
        {session?.startTime && !isOnWorkout && (
          <WorkoutBanner key="banner" startTime={session.startTime} />
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  )
}
