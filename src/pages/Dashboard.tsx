import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useHistoryStore } from '../stores/useHistoryStore'
import { useRoutineStore } from '../stores/useRoutineStore'
import { useScheduleStore } from '../stores/useScheduleStore'
import { exercises as exerciseDb } from '../data/exercises'
import { Dumbbell, Calendar } from 'lucide-react'
import { t } from '../i18n'
import { formatDate } from '../lib/formatDate'
import { staggerContainer, staggerItem, springScale } from '../lib/motion'

export default function Dashboard() {
  const navigate = useNavigate()
  const { sessions } = useHistoryStore()
  const { routines } = useRoutineStore()
  const { schedule } = useScheduleStore()

  const todayIndex = new Date().getDay()
  const todayRoutineId = schedule[todayIndex]
  const todayRoutine = todayRoutineId ? routines.find((r) => r.id === todayRoutineId) : null

  function handleStartTodayWorkout() {
    if (todayRoutine) {
      navigate('/workout', { state: { routineId: todayRoutine.id } })
    }
  }

  const totalWorkouts = sessions.length
  const totalSets = sessions.reduce(
    (sum, s) => sum + s.entries.reduce((es, e) => es + e.sets.filter((s) => s.completed).length, 0),
    0
  )

  const recentSessions = sessions.slice(0, 3)

  const getExerciseNames = (session: (typeof sessions)[0]) =>
    session.entries
      .map((e) => exerciseDb.find((ex) => ex.id === e.exerciseId)?.name ?? e.exerciseId)
      .slice(0, 3)
      .join(', ')

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-4xl">{t('dashboard.title')}</h1>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
        <Link
          to="/workout"
          className="flex items-center justify-center gap-2 rounded-lg bg-accent py-4 text-lg font-medium text-bg-primary"
        >
          <Dumbbell size={22} />
          {t('dashboard.startWorkout')}
        </Link>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 gap-3"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div className="rounded-lg border border-border bg-bg-card p-4" variants={staggerItem}>
          <p className="text-xs text-text-secondary">{t('dashboard.totalWorkouts')}</p>
          <p className="mt-1 font-display text-3xl text-text-primary">{totalWorkouts}</p>
        </motion.div>
        <motion.div className="rounded-lg border border-border bg-bg-card p-4" variants={staggerItem}>
          <p className="text-xs text-text-secondary">{t('dashboard.totalSets')}</p>
          <p className="mt-1 font-display text-3xl text-text-primary">{totalSets}</p>
        </motion.div>
      </motion.div>

      <motion.div
        className="rounded-lg border border-border bg-bg-card p-4"
        variants={springScale}
        initial="initial"
        animate="animate"
      >
        <p className="text-xs text-text-secondary">{t('schedule.today')} — {t(`day.${todayIndex}`)}</p>
        {todayRoutine ? (
          <div className="mt-2 flex items-center justify-between">
            <p className="font-display text-xl text-text-primary">{todayRoutine.name}</p>
            <motion.button
              onClick={handleStartTodayWorkout}
              className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-bg-primary"
              whileTap={{ scale: 0.95 }}
            >
              <Dumbbell size={14} />
              {t('schedule.startWorkout')}
            </motion.button>
          </div>
        ) : (
          <p className="mt-1 text-sm text-text-secondary">{t('schedule.rest')}</p>
        )}
      </motion.div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-2xl">{t('dashboard.recentWorkouts')}</h2>
          {sessions.length > 0 && (
            <Link to="/history" className="text-sm text-accent-blue hover:text-accent">
              {t('dashboard.viewAll')}
            </Link>
          )}
        </div>

        {recentSessions.length === 0 ? (
          <p className="py-8 text-center text-text-secondary">
            {t('dashboard.empty')}
          </p>
        ) : (
          <motion.div
            className="flex flex-col gap-2"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <AnimatePresence>
              {recentSessions.map((session) => (
                <motion.div key={session.id} variants={staggerItem}>
                  <Link
                    to={`/history/${session.id}`}
                    className="block rounded-lg border border-border bg-bg-card p-3 transition-colors hover:border-accent/50"
                  >
                    <p className="flex items-center gap-2 text-sm text-text-primary">
                      <Calendar size={14} className="text-text-secondary" />
                      {formatDate(session.date)}
                    </p>
                    <p className="mt-0.5 text-xs text-text-secondary">{getExerciseNames(session)}</p>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}
