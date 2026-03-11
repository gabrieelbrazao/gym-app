import { motion } from 'framer-motion'
import { Clock, Timer, Zap } from 'lucide-react'
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

  const stats = [
    { icon: Clock, label: t('stats.totalTime'),       value: formatDuration(totalTimeMinutes)         },
    { icon: Timer, label: t('stats.avgDuration'),     value: formatDuration(avgDurationMinutes)       },
    { icon: Zap,   label: t('stats.longestSession'),  value: formatDuration(longestSessionMinutes)    },
  ]

  return (
    <motion.div
      className="grid grid-cols-3 gap-2"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {stats.map(({ icon: Icon, label, value }) => (
        <motion.div
          key={label}
          className="bg-bg-card border border-border rounded-xl px-3 py-3 flex flex-col gap-1.5 items-center text-center"
          variants={staggerItem}
          whileHover={{ y: -2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <Icon size={14} className="text-accent opacity-80" />
          <span
            className="text-2xl font-bold text-text-primary leading-none truncate w-full text-center"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {value}
          </span>
          <span className="text-[10px] text-text-secondary leading-tight">{label}</span>
        </motion.div>
      ))}
    </motion.div>
  )
}
