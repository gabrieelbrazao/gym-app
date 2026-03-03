import { useFatigue } from '../hooks/useFatigue'
import { t } from '../i18n'
import { type FatigueStatus, type MuscleGroup } from '../types'

const STATUS_STYLES: Record<FatigueStatus, { badge: string; dot: string }> = {
  fatigued: { badge: 'bg-red-500/15 text-red-400', dot: 'bg-red-400' },
  resting:  { badge: 'bg-amber-500/15 text-amber-400', dot: 'bg-amber-400' },
  ready:    { badge: 'bg-accent/15 text-accent', dot: 'bg-accent' },
}

function subText(daysAgo: number | null): string {
  if (daysAgo === null) return t('fatigue.never')
  if (daysAgo === 0) return t('fatigue.today')
  if (daysAgo === 1) return t('fatigue.yesterday')
  return `${daysAgo} ${t('fatigue.daysAgo')}`
}

export default function FatigueMonitor() {
  const muscles = useFatigue()

  return (
    <section>
      <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: 'var(--font-display)' }}>
        {t('fatigue.title')}
      </h2>
      <div className="grid grid-cols-3 gap-2">
        {muscles.map(({ muscleGroup, daysAgo, status }) => {
          const styles = STATUS_STYLES[status]
          return (
            <div
              key={muscleGroup}
              className="bg-surface rounded-xl p-3 flex flex-col gap-1.5"
            >
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${styles.dot}`} />
                <span className="text-xs font-medium text-primary leading-tight">
                  {t(`muscle.${muscleGroup}` as `muscle.${MuscleGroup}`)}
                </span>
              </div>
              <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full w-fit ${styles.badge}`}>
                {t(`fatigue.${status}`)}
              </span>
              <span className="text-[10px] text-secondary">{subText(daysAgo)}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
