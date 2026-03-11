import { useEffect } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import type { SetLog } from '../types'
import { t } from '../i18n'
import NumericInput from './NumericInput'

interface SetInputProps {
  index: number
  reps: number
  weight: number
  completed: boolean
  onChange: (data: Partial<SetLog>) => void
  previousWeight?: number
  previousReps?: number
  isPR?: boolean
}

export default function SetInput({
  index,
  reps,
  weight,
  completed,
  onChange,
  previousWeight,
  previousReps,
  isPR,
}: SetInputProps) {
  useEffect(() => {
    if (isPR && completed) {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 }, zIndex: 9999 })
    }
  }, [isPR, completed])

  const hasGhost = previousWeight !== undefined || previousReps !== undefined

  return (
    <motion.div
      key={String(completed)}
      className={`flex flex-col rounded-lg px-3 py-2 ${
        completed ? 'bg-accent/10' : 'bg-bg-input'
      }`}
      animate={completed ? { scale: [1, 1.04, 1] } : {}}
      transition={{ duration: 0.25 }}
    >
      <div className="flex items-center gap-3">
        <span className="w-6 text-center text-xs font-medium text-text-secondary">
          {index + 1}
        </span>
        <NumericInput
          value={weight}
          onChange={(n) => onChange({ weight: n })}
          className="w-16 rounded border border-border bg-bg-card px-2 py-1 text-center text-sm text-text-primary focus:border-accent focus:outline-none"
          aria-label="Weight"
        />
        <span className="text-xs text-text-secondary">{t('workout.kg')}</span>
        <NumericInput
          value={reps}
          onChange={(n) => onChange({ reps: n })}
          className="w-16 rounded border border-border bg-bg-card px-2 py-1 text-center text-sm text-text-primary focus:border-accent focus:outline-none"
          aria-label="Reps"
        />
        <span className="text-xs text-text-secondary">{t('workout.reps')}</span>
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => onChange({ completed: e.target.checked })}
          className="ml-auto h-5 w-5 accent-accent"
        />
      </div>

      {isPR && completed ? (
        <p className="mt-0.5 pl-9 text-[10px] font-semibold text-yellow-400">
          {t('workout.newPR')}
        </p>
      ) : hasGhost ? (
        <p className="mt-0.5 pl-9 text-[10px] text-text-secondary/60">
          {previousWeight ?? '—'} kg · {previousReps ?? '—'} reps
        </p>
      ) : null}
    </motion.div>
  )
}
