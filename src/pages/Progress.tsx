import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useHistoryStore } from '../stores/useHistoryStore'
import { exercises as exerciseDb } from '../data/exercises'
import { Trophy, BarChart2 } from 'lucide-react'
import { t } from '../i18n'
import FatigueMonitor from '../components/FatigueMonitor'
import StreakCards from '../components/StreakCards'
import WorkoutCalendar from '../components/WorkoutCalendar'
import SummaryStats from '../components/SummaryStats'
import TimeStats from '../components/TimeStats'
import { staggerContainer, staggerItem, fadeUp } from '../lib/motion'

const MEDALS = ['🥇', '🥈', '🥉']

interface PersonalRecord {
  exerciseName: string
  maxWeight: number
}

export default function Progress() {
  const { sessions } = useHistoryStore()

  const personalRecords = useMemo<PersonalRecord[]>(() => {
    const prMap = new Map<string, number>()

    for (const session of sessions) {
      for (const entry of session.entries) {
        for (const set of entry.sets) {
          if (!set.completed) continue
          const current = prMap.get(entry.exerciseId) ?? 0
          if (set.weight > current) {
            prMap.set(entry.exerciseId, set.weight)
          }
        }
      }
    }

    return Array.from(prMap.entries())
      .map(([id, maxWeight]) => ({
        exerciseName: exerciseDb.find((e) => e.id === id)?.name ?? id,
        maxWeight,
      }))
      .sort((a, b) => b.maxWeight - a.maxWeight)
  }, [sessions])

  return (
    <motion.div
      className="flex flex-col gap-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.h1 className="font-display text-4xl" variants={fadeUp}>
        {t('progress.title')}
      </motion.h1>

      <motion.div variants={staggerItem}>
        <FatigueMonitor />
      </motion.div>

      <motion.div variants={staggerItem}>
        <StreakCards />
      </motion.div>

      <motion.div variants={staggerItem}>
        <WorkoutCalendar />
      </motion.div>

      {/* Stats section */}
      <motion.div className="flex flex-col gap-3" variants={staggerItem}>
        <h2 className="flex items-center gap-2 font-display text-2xl">
          <BarChart2 size={18} className="text-accent" />
          Estatísticas
        </h2>
        <SummaryStats />
        <TimeStats />
      </motion.div>

      {/* Personal Records */}
      <motion.div
        className="rounded-xl border border-border bg-bg-card p-4"
        variants={staggerItem}
      >
        <h2 className="mb-3 flex items-center gap-2 font-display text-2xl">
          <Trophy size={18} className="text-accent" />
          {t('progress.records')}
        </h2>
        <motion.div
          className="flex flex-col gap-2"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <AnimatePresence>
            {personalRecords.map((pr, index) => (
              <motion.div
                key={pr.exerciseName}
                className="flex items-center justify-between rounded-lg bg-bg-input px-3 py-2.5"
                variants={staggerItem}
                exit={{ opacity: 0, x: 20 }}
                whileHover={{ x: 2 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none w-5 text-center">
                    {index < 3 ? MEDALS[index] : '·'}
                  </span>
                  <span className="text-sm text-text-primary">{pr.exerciseName}</span>
                </div>
                <span className="text-sm font-semibold text-accent tabular-nums">
                  {pr.maxWeight} {t('progress.kg')}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
          {personalRecords.length === 0 && (
            <p className="text-sm text-text-secondary">{t('progress.noRecords')}</p>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
