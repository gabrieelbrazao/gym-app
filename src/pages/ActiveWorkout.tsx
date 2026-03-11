import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useWorkoutStore } from '../stores/useWorkoutStore'
import { useHistoryStore } from '../stores/useHistoryStore'
import { useRoutineStore } from '../stores/useRoutineStore'
import { useStopwatch } from '../hooks/useStopwatch'
import { useRestTimer } from '../hooks/useRestTimer'
import { exercises as exerciseDb } from '../data/exercises'
import SetInput from '../components/SetInput'
import ExercisePicker from '../components/ExercisePicker'
import RestTimer from '../components/RestTimer'
import { Plus, CheckCircle, Dumbbell, X, EyeOff, Eye } from 'lucide-react'
import type { Exercise, SetLog } from '../types'
import { t } from '../i18n'

function formatTime(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export default function ActiveWorkout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { session, startSession, addExercise, removeExercise, toggleHideExercise, addSet, updateSet, cancelWorkout, finishWorkout } = useWorkoutStore()
  const { saveSession } = useHistoryStore()
  const { routines } = useRoutineStore()
  const [showPicker, setShowPicker] = useState(false)
  const elapsed = useStopwatch(!!session)
  const restTimer = useRestTimer()

  useEffect(() => {
    cancelWorkout()
    const routineId = (location.state as { routineId?: string } | null)?.routineId
    if (routineId) {
      const routine = routines.find((r) => r.id === routineId)
      if (routine) startSession(routine.exercises)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const getExerciseName = (exerciseId: string) =>
    exerciseDb.find((e) => e.id === exerciseId)?.name ?? exerciseId

  const handleSetChange = (ei: number, si: number, data: Partial<SetLog>) => {
    updateSet(ei, si, data)
    if (data.completed === true) restTimer.start()
  }

  const handleAddExercise = (exercise: Exercise) => {
    addExercise(exercise.id)
    setShowPicker(false)
  }

  const handleFinish = () => {
    const completed = finishWorkout()
    if (completed) {
      saveSession(completed)
      navigate('/history')
    }
  }

  if (!session) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="font-display text-4xl">{t('workout.startTitle')}</h1>

        <motion.button
          onClick={() => startSession()}
          className="flex items-center justify-center gap-2 rounded-lg bg-accent py-4 text-lg font-medium text-bg-primary"
          whileTap={{ scale: 0.97 }}
        >
          <Dumbbell size={20} />
          {t('workout.freestyle')}
        </motion.button>

        {routines.length > 0 && (
          <>
            <p className="text-sm text-text-secondary">{t('workout.fromRoutine')}</p>
            <div className="flex flex-col gap-2">
              {routines.map((routine) => (
                <motion.button
                  key={routine.id}
                  onClick={() => startSession(routine.exercises)}
                  className="rounded-lg border border-border bg-bg-card px-4 py-3 text-left transition-colors hover:border-accent"
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <p className="font-medium text-text-primary">{routine.name}</p>
                  <p className="text-xs text-text-secondary">
                    {routine.exercises.length} {t('common.exercises')}
                  </p>
                </motion.button>
              ))}
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl">{t('workout.title')}</h1>
          <p className="mt-0.5 font-mono text-sm text-text-secondary">{formatTime(elapsed)}</p>
        </div>
        <motion.button
          onClick={handleFinish}
          className="flex items-center gap-1 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg-primary"
          whileTap={{ scale: 0.95 }}
        >
          <CheckCircle size={16} />
          {t('workout.finish')}
        </motion.button>
      </div>

      <AnimatePresence>
        {session.entries.map((entry, entryIndex) => (
          <motion.div
            key={entry.uid ?? `${entry.exerciseId}-${entryIndex}`}
            className="rounded-lg border border-border bg-bg-card p-4"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: entry.hidden ? 0.4 : 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.22 }}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <h3 className="font-display text-xl text-text-primary">
                  {getExerciseName(entry.exerciseId)}
                </h3>
                {entry.fromRoutine ? (
                  <span className="flex items-center gap-1 text-[10px] font-medium text-accent">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                    {t('workout.fromRoutineLabel')}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-medium text-text-secondary">
                    <Plus size={9} />
                    {t('workout.addedLabel')}
                  </span>
                )}
              </div>
              {entry.fromRoutine ? (
                <motion.button
                  onClick={() => toggleHideExercise(entryIndex)}
                  className={`rounded p-1 transition-colors ${entry.hidden ? 'text-accent hover:text-text-primary' : 'text-text-secondary hover:text-yellow-400'}`}
                  whileTap={{ scale: 0.9 }}
                  title={entry.hidden ? t('workout.showExercise') : t('workout.hideExercise')}
                >
                  {entry.hidden ? <Eye size={16} /> : <EyeOff size={16} />}
                </motion.button>
              ) : (
                <motion.button
                  onClick={() => removeExercise(entryIndex)}
                  className="rounded p-1 text-text-secondary transition-colors hover:text-red-400"
                  whileTap={{ scale: 0.9 }}
                  title={t('workout.removeExercise')}
                >
                  <X size={16} />
                </motion.button>
              )}
            </div>

            <div className={entry.hidden ? 'pointer-events-none' : undefined}>
            <div className="mb-2 flex gap-3 px-3 text-xs text-text-secondary">
              <span className="w-6">{t('workout.set')}</span>
              <span className="w-16 text-center">{t('workout.kg')}</span>
              <span className="w-4" />
              <span className="w-16 text-center">{t('workout.reps')}</span>
            </div>

            <AnimatePresence>
              <div className="flex flex-col gap-2">
                {entry.sets.map((s, setIndex) => (
                  <motion.div
                    key={setIndex}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.18 }}
                  >
                    <SetInput
                      index={setIndex}
                      reps={s.reps}
                      weight={s.weight}
                      completed={s.completed}
                      onChange={(data) => handleSetChange(entryIndex, setIndex, data)}
                    />
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>

            <button
              onClick={() => addSet(entryIndex)}
              className="mt-2 flex w-full items-center justify-center gap-1 rounded py-2 text-xs text-text-secondary transition-colors hover:text-accent"
            >
              <Plus size={14} />
              {t('workout.addSet')}
            </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.button
        onClick={() => setShowPicker(true)}
        className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border py-3 text-sm text-text-secondary transition-colors hover:border-accent hover:text-accent"
        whileTap={{ scale: 0.97 }}
      >
        <Plus size={16} />
        {t('workout.addExercise')}
      </motion.button>

      <RestTimer timer={restTimer} />

      {showPicker && (
        <ExercisePicker onSelect={handleAddExercise} onClose={() => setShowPicker(false)} />
      )}
    </div>
  )
}
