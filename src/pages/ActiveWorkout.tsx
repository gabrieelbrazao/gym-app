import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkoutStore } from '../stores/useWorkoutStore'
import { useHistoryStore } from '../stores/useHistoryStore'
import { useRoutineStore } from '../stores/useRoutineStore'
import { exercises as exerciseDb } from '../data/exercises'
import SetInput from '../components/SetInput'
import ExercisePicker from '../components/ExercisePicker'
import { Plus, CheckCircle, Dumbbell } from 'lucide-react'
import type { Exercise } from '../types'
import { t } from '../i18n'

export default function ActiveWorkout() {
  const navigate = useNavigate()
  const { session, startSession, addExercise, addSet, updateSet, finishWorkout } = useWorkoutStore()
  const { saveSession } = useHistoryStore()
  const { routines } = useRoutineStore()
  const [showPicker, setShowPicker] = useState(false)

  const getExerciseName = (exerciseId: string) =>
    exerciseDb.find((e) => e.id === exerciseId)?.name ?? exerciseId

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

        <button
          onClick={() => startSession()}
          className="flex items-center justify-center gap-2 rounded-lg bg-accent py-4 text-lg font-medium text-bg-primary"
        >
          <Dumbbell size={20} />
          {t('workout.freestyle')}
        </button>

        {routines.length > 0 && (
          <>
            <p className="text-sm text-text-secondary">{t('workout.fromRoutine')}</p>
            <div className="flex flex-col gap-2">
              {routines.map((routine) => (
                <button
                  key={routine.id}
                  onClick={() => startSession(routine.exercises)}
                  className="rounded-lg border border-border bg-bg-card px-4 py-3 text-left transition-colors hover:border-accent"
                >
                  <p className="font-medium text-text-primary">{routine.name}</p>
                  <p className="text-xs text-text-secondary">
                    {routine.exercises.length} {t('common.exercises')}
                  </p>
                </button>
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
        <h1 className="font-display text-4xl">{t('workout.title')}</h1>
        <button
          onClick={handleFinish}
          className="flex items-center gap-1 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg-primary"
        >
          <CheckCircle size={16} />
          {t('workout.finish')}
        </button>
      </div>

      {session.entries.map((entry, entryIndex) => (
        <div key={`${entry.exerciseId}-${entryIndex}`} className="rounded-lg border border-border bg-bg-card p-4">
          <h3 className="mb-3 font-display text-xl text-text-primary">
            {getExerciseName(entry.exerciseId)}
          </h3>

          <div className="mb-2 flex gap-3 px-3 text-xs text-text-secondary">
            <span className="w-6">{t('workout.set')}</span>
            <span className="w-16 text-center">{t('workout.kg')}</span>
            <span className="w-4" />
            <span className="w-16 text-center">{t('workout.reps')}</span>
          </div>

          <div className="flex flex-col gap-2">
            {entry.sets.map((s, setIndex) => (
              <SetInput
                key={setIndex}
                index={setIndex}
                reps={s.reps}
                weight={s.weight}
                completed={s.completed}
                onChange={(data) => updateSet(entryIndex, setIndex, data)}
              />
            ))}
          </div>

          <button
            onClick={() => addSet(entryIndex)}
            className="mt-2 flex w-full items-center justify-center gap-1 rounded py-2 text-xs text-text-secondary transition-colors hover:text-accent"
          >
            <Plus size={14} />
            {t('workout.addSet')}
          </button>
        </div>
      ))}

      <button
        onClick={() => setShowPicker(true)}
        className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border py-3 text-sm text-text-secondary transition-colors hover:border-accent hover:text-accent"
      >
        <Plus size={16} />
        {t('workout.addExercise')}
      </button>

      {showPicker && (
        <ExercisePicker onSelect={handleAddExercise} onClose={() => setShowPicker(false)} />
      )}
    </div>
  )
}
