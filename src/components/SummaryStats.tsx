import { useWorkoutStats } from '../hooks/useWorkoutStats'
import { t } from '../i18n'
import type { MuscleGroup } from '../types'

export default function SummaryStats() {
  const { totalWorkouts, avgPerWeek, mostTrainedMuscle } = useWorkoutStats()

  const muscleLabel = mostTrainedMuscle
    ? t(`muscle.${mostTrainedMuscle}` as `muscle.${MuscleGroup}`)
    : t('stats.none')

  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="bg-surface rounded-xl px-3 py-3 flex flex-col gap-0.5 items-center text-center">
        <span className="text-xl font-bold text-primary">{totalWorkouts}</span>
        <span className="text-[10px] text-secondary leading-tight">{t('stats.totalWorkouts')}</span>
      </div>
      <div className="bg-surface rounded-xl px-3 py-3 flex flex-col gap-0.5 items-center text-center">
        <span className="text-xl font-bold text-primary">{avgPerWeek.toFixed(1)}</span>
        <span className="text-[10px] text-secondary leading-tight">{t('stats.avgPerWeek')}</span>
      </div>
      <div className="bg-surface rounded-xl px-3 py-3 flex flex-col gap-0.5 items-center text-center">
        <span className="text-xl font-bold text-accent truncate w-full text-center">{muscleLabel}</span>
        <span className="text-[10px] text-secondary leading-tight">{t('stats.mostTrained')}</span>
      </div>
    </div>
  )
}
