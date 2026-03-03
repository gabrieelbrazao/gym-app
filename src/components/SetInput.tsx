import type { SetLog } from '../types'
import { t } from '../i18n'

interface SetInputProps {
  index: number
  reps: number
  weight: number
  completed: boolean
  onChange: (data: Partial<SetLog>) => void
}

export default function SetInput({ index, reps, weight, completed, onChange }: SetInputProps) {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
        completed ? 'bg-accent/10' : 'bg-bg-input'
      }`}
    >
      <span className="w-6 text-center text-xs font-medium text-text-secondary">
        {index + 1}
      </span>
      <input
        type="number"
        min={0}
        value={weight}
        onChange={(e) => onChange({ weight: Number(e.target.value) })}
        className="w-16 rounded border border-border bg-bg-card px-2 py-1 text-center text-sm text-text-primary focus:border-accent focus:outline-none"
        aria-label="Weight"
      />
      <span className="text-xs text-text-secondary">{t('workout.kg')}</span>
      <input
        type="number"
        min={0}
        value={reps}
        onChange={(e) => onChange({ reps: Number(e.target.value) })}
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
  )
}
