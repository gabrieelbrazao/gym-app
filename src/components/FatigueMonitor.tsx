import { motion } from 'framer-motion'
import { useFatigue } from '../hooks/useFatigue'
import { t } from '../i18n'
import { type FatigueStatus, type MuscleGroup } from '../types'
import { staggerContainer, staggerItem } from '../lib/motion'

const STATUS_STYLES: Record<FatigueStatus, { badge: string; dot: string; bar: string; bg: string }> = {
  fatigued: { badge: 'bg-red-500/15 text-red-400', dot: 'bg-red-400', bar: 'bg-red-400', bg: 'bg-red-500/5' },
  resting:  { badge: 'bg-amber-500/15 text-amber-400', dot: 'bg-amber-400', bar: 'bg-amber-400', bg: 'bg-amber-500/5' },
  ready:    { badge: 'bg-accent/15 text-accent', dot: 'bg-accent', bar: 'bg-accent', bg: 'bg-accent/5' },
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
      <motion.div
        className="grid grid-cols-3 gap-2"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {muscles.map(({ muscleGroup, daysAgo, status, recoveryPct }, index) => {
          const styles = STATUS_STYLES[status]
          return (
            <motion.div
              key={muscleGroup}
              className={`rounded-xl p-3 flex flex-col gap-1.5 ${styles.bg}`}
              variants={staggerItem}
              transition={{ delay: index * 0.04 }}
            >
              <div className="flex items-center gap-1.5">
                <motion.span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${styles.dot}`}
                  animate={status === 'fatigued' ? { scale: [1, 1.5, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                />
                <span className="text-xs font-medium text-primary leading-tight">
                  {t(`muscle.${muscleGroup}` as `muscle.${MuscleGroup}`)}
                </span>
              </div>

              <div className="w-full h-1 rounded-full overflow-hidden bg-black/10">
                <motion.div
                  className={`h-full rounded-full ${styles.bar}`}
                  initial={{ width: 0 }}
                  animate={{ width: recoveryPct === 0 ? '4px' : `${recoveryPct}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.04 }}
                />
              </div>

              <div className="flex items-center justify-between gap-1 flex-wrap">
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${styles.badge}`}>
                  {t(`fatigue.${status}`)}
                </span>
                <span className="text-[10px] text-secondary">{subText(daysAgo)}</span>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
