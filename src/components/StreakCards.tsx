import { motion } from 'framer-motion'
import { useWorkoutStats } from '../hooks/useWorkoutStats'
import { t } from '../i18n'
import { staggerContainer, staggerItem } from '../lib/motion'

function nextMilestone(streak: number): number {
  const milestones = [7, 14, 30, 60, 90, 180, 365]
  return milestones.find(m => m > streak) ?? streak + 30
}

export default function StreakCards() {
  const { currentStreak, bestStreak } = useWorkoutStats()

  const milestone = nextMilestone(currentStreak)
  const milestoneProgress = Math.min(1, currentStreak / milestone)
  const daysLeft = milestone - currentStreak

  return (
    <motion.div
      className="grid grid-cols-2 gap-3"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* Current streak — accent-tinted */}
      <motion.div
        className="bg-accent/10 border border-accent/20 rounded-2xl p-4 flex flex-col gap-2"
        variants={staggerItem}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <motion.span
          className="text-3xl leading-none"
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.1 }}
        >
          🔥
        </motion.span>

        <div className="flex items-end gap-1 leading-none">
          <motion.span
            className="text-5xl text-accent leading-none"
            style={{ fontFamily: 'var(--font-display)' }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.15 }}
          >
            {currentStreak}
          </motion.span>
          <span className="text-sm text-text-secondary mb-1">{t('stats.days')}</span>
        </div>

        <span className="text-xs font-medium text-accent/80">{t('stats.currentStreak')}</span>

        {/* Milestone progress */}
        <div className="mt-1">
          <div className="h-1 rounded-full bg-accent/15 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-accent"
              initial={{ width: 0 }}
              animate={{ width: `${milestoneProgress * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
            />
          </div>
          <span className="text-[10px] text-text-secondary mt-1 block">
            {daysLeft} {daysLeft === 1 ? 'dia' : 'dias'} p/ {milestone}d
          </span>
        </div>
      </motion.div>

      {/* Best streak */}
      <motion.div
        className="bg-bg-card border border-border rounded-2xl p-4 flex flex-col gap-2"
        variants={staggerItem}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <motion.span
          className="text-3xl leading-none"
          whileHover={{ rotate: [-10, 10, -5, 0] }}
          transition={{ duration: 0.4 }}
        >
          🏆
        </motion.span>

        <div className="flex items-end gap-1 leading-none">
          <motion.span
            className="text-5xl text-text-primary leading-none"
            style={{ fontFamily: 'var(--font-display)' }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
          >
            {bestStreak}
          </motion.span>
          <span className="text-sm text-text-secondary mb-1">{t('stats.days')}</span>
        </div>

        <span className="text-xs font-medium text-text-secondary">{t('stats.bestStreak')}</span>

        {/* Best = current indicator */}
        {currentStreak > 0 && currentStreak >= bestStreak && (
          <span className="text-[10px] text-accent mt-1">Recorde atual! ✨</span>
        )}
      </motion.div>
    </motion.div>
  )
}
