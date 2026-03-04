import { motion } from 'framer-motion'
import { useWorkoutStats } from '../hooks/useWorkoutStats'
import { t } from '../i18n'
import { staggerContainer, springScale } from '../lib/motion'

export default function StreakCards() {
  const { currentStreak, bestStreak } = useWorkoutStats()

  return (
    <motion.div
      className="grid grid-cols-2 gap-3"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.div className="bg-surface rounded-xl p-4 flex flex-col gap-1" variants={springScale}>
        <motion.span
          className="text-2xl"
          whileHover={{ rotate: [-10, 10, -5, 0] }}
          transition={{ duration: 0.4 }}
        >
          🔥
        </motion.span>
        <motion.span
          className="text-3xl font-bold text-primary leading-none"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.15 }}
        >
          {currentStreak}
        </motion.span>
        <span className="text-xs text-secondary">{t('stats.days')}</span>
        <span className="text-xs font-medium text-secondary mt-0.5">{t('stats.currentStreak')}</span>
      </motion.div>

      <motion.div className="bg-surface rounded-xl p-4 flex flex-col gap-1" variants={springScale}>
        <motion.span
          className="text-2xl"
          whileHover={{ rotate: [-10, 10, -5, 0] }}
          transition={{ duration: 0.4 }}
        >
          🏆
        </motion.span>
        <motion.span
          className="text-3xl font-bold text-primary leading-none"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
        >
          {bestStreak}
        </motion.span>
        <span className="text-xs text-secondary">{t('stats.days')}</span>
        <span className="text-xs font-medium text-secondary mt-0.5">{t('stats.bestStreak')}</span>
      </motion.div>
    </motion.div>
  )
}
