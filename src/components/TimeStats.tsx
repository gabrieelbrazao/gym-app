import { motion } from 'framer-motion'
import { useWorkoutStats } from '../hooks/useWorkoutStats'
import { t } from '../i18n'
import { staggerContainer, staggerItem } from '../lib/motion'

function formatDuration(min: number): string {
  if (min === 0) return t('stats.none')
  if (min < 60) return `${min}min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m === 0 ? `${h}h` : `${h}h ${m}min`
}

export default function TimeStats() {
  const { totalTimeMinutes, avgDurationMinutes, longestSessionMinutes } = useWorkoutStats()

  return (
    <motion.div
      className="grid grid-cols-3 gap-2"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.div
        className="bg-surface rounded-xl px-3 py-3 flex flex-col gap-0.5 items-center text-center"
        variants={staggerItem}
      >
        <span className="text-xl font-bold text-primary truncate w-full text-center">
          {formatDuration(totalTimeMinutes)}
        </span>
        <span className="text-[10px] text-secondary leading-tight">{t('stats.totalTime')}</span>
      </motion.div>

      <motion.div
        className="bg-surface rounded-xl px-3 py-3 flex flex-col gap-0.5 items-center text-center"
        variants={staggerItem}
      >
        <span className="text-xl font-bold text-primary truncate w-full text-center">
          {formatDuration(avgDurationMinutes)}
        </span>
        <span className="text-[10px] text-secondary leading-tight">{t('stats.avgDuration')}</span>
      </motion.div>

      <motion.div
        className="bg-surface rounded-xl px-3 py-3 flex flex-col gap-0.5 items-center text-center"
        variants={staggerItem}
      >
        <span className="text-xl font-bold text-primary truncate w-full text-center">
          {formatDuration(longestSessionMinutes)}
        </span>
        <span className="text-[10px] text-secondary leading-tight">{t('stats.longestSession')}</span>
      </motion.div>
    </motion.div>
  )
}
