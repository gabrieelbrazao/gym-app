import { motion, AnimatePresence } from 'framer-motion'
import type { useRestTimer } from '../hooks/useRestTimer'
import { t } from '../i18n'

const PRESETS = [30, 60, 90, 120]
const RADIUS = 45
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function formatTime(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

interface RestTimerProps {
  timer: ReturnType<typeof useRestTimer>
}

export default function RestTimer({ timer }: RestTimerProps) {
  const { remaining, isRunning, duration, start, skip, setDuration } = timer
  const visible = isRunning || remaining > 0
  const progress = duration > 0 ? remaining / duration : 0
  const dashOffset = CIRCUMFERENCE * (1 - progress)

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-20 left-0 right-0 z-50 flex justify-center px-4"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        >
          <div className="w-full max-w-sm rounded-2xl border border-border bg-bg-card p-5 shadow-xl">
            <p className="mb-3 text-center text-xs font-medium uppercase tracking-widest text-text-secondary">
              {t('timer.rest')}
            </p>

            <div className="flex items-center justify-center">
              <svg width="110" height="110" className="-rotate-90">
                <circle
                  cx="55"
                  cy="55"
                  r={RADIUS}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-border"
                />
                <motion.circle
                  cx="55"
                  cy="55"
                  r={RADIUS}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  className="text-accent"
                  animate={{ strokeDashoffset: dashOffset }}
                  transition={{ duration: 0.5, ease: 'linear' }}
                />
              </svg>
              <span className="absolute font-display text-4xl text-text-primary">
                {formatTime(remaining)}
              </span>
            </div>

            <div className="mt-4 flex justify-center gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => { setDuration(p); start(p) }}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    duration === p && isRunning
                      ? 'bg-accent text-bg-primary'
                      : 'bg-bg-input text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {p}s
                </button>
              ))}
            </div>

            <button
              onClick={skip}
              className="mt-3 w-full rounded-lg py-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              {t('timer.skip')}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
