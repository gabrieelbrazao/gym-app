import { NavLink } from 'react-router-dom'
import { Home, Dumbbell, ClipboardList, TrendingUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { t } from '../i18n'

const navItems = [
  { to: '/', icon: Home, label: t('nav.home') },
  { to: '/exercises', icon: Dumbbell, label: t('nav.exercises') },
  { to: '/routines', icon: ClipboardList, label: t('nav.routines') },
  { to: '/progress', icon: TrendingUp, label: t('nav.progress') },
]

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 border-t border-border bg-bg-card"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      data-testid="bottom-nav"
    >
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-1 px-3 py-1 text-xs transition-colors ${
                isActive ? 'text-accent' : 'text-text-secondary hover:text-text-primary'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-lg bg-accent/10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </AnimatePresence>
                <motion.span
                  className="relative flex flex-col items-center gap-1"
                  whileTap={{ scale: 0.85 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </motion.span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
