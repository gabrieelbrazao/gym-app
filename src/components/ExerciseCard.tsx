import type { Exercise } from '../types'
import { t } from '../i18n'

interface ExerciseCardProps {
  exercise: Exercise
}

export default function ExerciseCard({ exercise }: ExerciseCardProps) {
  return (
    <div className="rounded-lg border border-border bg-bg-card p-4">
      <h3 className="font-display text-xl text-text-primary">{exercise.name}</h3>
      <div className="mt-1 flex gap-2">
        <span className="rounded-md bg-accent/15 px-2 py-0.5 text-xs text-accent">
          {t(`muscle.${exercise.muscleGroup}`)}
        </span>
        <span className="rounded-md bg-accent-blue/15 px-2 py-0.5 text-xs text-accent-blue">
          {t(`equipment.${exercise.equipment}`)}
        </span>
      </div>
      <p className="mt-2 text-sm text-text-secondary">{exercise.description}</p>
    </div>
  )
}
