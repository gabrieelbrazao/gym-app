import { useWorkoutStats } from '../hooks/useWorkoutStats'
import { t } from '../i18n'

export default function StreakCards() {
  const { currentStreak, bestStreak } = useWorkoutStats()

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-surface rounded-xl p-4 flex flex-col gap-1">
        <span className="text-2xl">🔥</span>
        <span className="text-3xl font-bold text-primary leading-none">{currentStreak}</span>
        <span className="text-xs text-secondary">{t('stats.days')}</span>
        <span className="text-xs font-medium text-secondary mt-0.5">{t('stats.currentStreak')}</span>
      </div>
      <div className="bg-surface rounded-xl p-4 flex flex-col gap-1">
        <span className="text-2xl">🏆</span>
        <span className="text-3xl font-bold text-primary leading-none">{bestStreak}</span>
        <span className="text-xs text-secondary">{t('stats.days')}</span>
        <span className="text-xs font-medium text-secondary mt-0.5">{t('stats.bestStreak')}</span>
      </div>
    </div>
  )
}
