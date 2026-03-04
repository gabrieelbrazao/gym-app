import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRoutineStore } from '../stores/useRoutineStore'
import type { RoutineExercise, Exercise } from '../types'
import { exercises as exerciseDb } from '../data/exercises'
import ExercisePicker from '../components/ExercisePicker'
import NumericInput from '../components/NumericInput'
import { Plus, Trash2, ArrowLeft, ChevronDown, ChevronRight } from 'lucide-react'
import { t } from '../i18n'

export default function RoutineEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addRoutine, updateRoutine, getRoutineById } = useRoutineStore()

  const existing = id ? getRoutineById(id) : undefined

  const [name, setName] = useState(existing?.name ?? '')
  const [routineExercises, setRoutineExercises] = useState<RoutineExercise[]>(
    existing?.exercises ?? []
  )
  const [showPicker, setShowPicker] = useState(false)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const handleAddExercise = (exercise: Exercise) => {
    setRoutineExercises((prev) => [
      ...prev,
      { exerciseId: exercise.id, sets: 3, reps: 10, weight: 0 },
    ])
    setShowPicker(false)
  }

  const handleRemoveExercise = (index: number) => {
    setRoutineExercises((prev) => prev.filter((_, i) => i !== index))
    if (expandedIndex === index) setExpandedIndex(null)
  }

  const handleUpdateExercise = (index: number, data: Partial<RoutineExercise>) => {
    setRoutineExercises((prev) =>
      prev.map((e, i) => {
        if (i !== index) return e
        let updated = { ...e, ...data }
        // when the default weight changes, reset all per-set weights to the new value
        if ('weight' in data && updated.weights) {
          updated = { ...updated, weights: updated.weights.map(() => data.weight as number) }
        }
        // when the default reps changes, reset all per-set reps to the new value
        if ('reps' in data && updated.repsPerSet) {
          updated = { ...updated, repsPerSet: updated.repsPerSet.map(() => data.reps as number) }
        }
        // when sets count changes, resize the per-set arrays if they exist
        if ('sets' in data) {
          const n = updated.sets
          if (updated.weights) {
            updated = {
              ...updated,
              weights: Array.from({ length: n }, (_, j) => updated.weights![j] ?? e.weight),
            }
          }
          if (updated.repsPerSet) {
            updated = {
              ...updated,
              repsPerSet: Array.from({ length: n }, (_, j) => updated.repsPerSet![j] ?? e.reps),
            }
          }
        }
        return updated
      })
    )
  }

  const handleTogglePerSet = (index: number) => {
    const re = routineExercises[index]
    if (expandedIndex === index) {
      setExpandedIndex(null)
    } else {
      // initialise per-set arrays if not yet set
      const init: Partial<RoutineExercise> = {}
      if (!re.weights) init.weights = Array.from({ length: re.sets }, () => re.weight)
      if (!re.repsPerSet) init.repsPerSet = Array.from({ length: re.sets }, () => re.reps)
      if (Object.keys(init).length > 0) handleUpdateExercise(index, init)
      setExpandedIndex(index)
    }
  }

  const handleSave = () => {
    if (!name.trim()) return
    if (existing) {
      updateRoutine(existing.id, { name, exercises: routineExercises })
    } else {
      addRoutine({ name, exercises: routineExercises })
    }
    navigate('/routines')
  }

  const getExerciseName = (exerciseId: string) =>
    exerciseDb.find((e) => e.id === exerciseId)?.name ?? exerciseId

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={() => navigate('/routines')}
        className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary"
      >
        <ArrowLeft size={16} />
        {t('editor.back')}
      </button>

      <h1 className="font-display text-4xl">{existing ? t('editor.edit') : t('editor.new')}</h1>

      <input
        type="text"
        placeholder={t('editor.namePlaceholder')}
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="rounded-lg border border-border bg-bg-input px-4 py-3 text-lg text-text-primary placeholder:text-text-secondary focus:border-accent focus:outline-none"
      />

      <div className="flex flex-col gap-3">
        {routineExercises.map((re, index) => (
          <div
            key={`${re.exerciseId}-${index}`}
            className="flex flex-col gap-2 rounded-lg border border-border bg-bg-card p-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-text-primary">{getExerciseName(re.exerciseId)}</h3>
              <button
                onClick={() => handleRemoveExercise(index)}
                className="text-text-secondary hover:text-accent-warm"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="flex gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-xs text-text-secondary">{t('editor.sets')}</span>
                <NumericInput
                  value={re.sets}
                  min={1}
                  onChange={(v) => handleUpdateExercise(index, { sets: v })}
                  className="w-16 rounded border border-border bg-bg-input px-2 py-1 text-center text-sm text-text-primary focus:border-accent focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs text-text-secondary">{t('editor.reps')}</span>
                <NumericInput
                  value={re.reps}
                  min={1}
                  onChange={(v) => handleUpdateExercise(index, { reps: v })}
                  className="w-16 rounded border border-border bg-bg-input px-2 py-1 text-center text-sm text-text-primary focus:border-accent focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs text-text-secondary">{t('editor.weight')}</span>
                <NumericInput
                  value={re.weight}
                  min={0}
                  onChange={(v) => handleUpdateExercise(index, { weight: v })}
                  className="w-16 rounded border border-border bg-bg-input px-2 py-1 text-center text-sm text-text-primary focus:border-accent focus:outline-none"
                />
              </label>
            </div>

            <button
              onClick={() => handleTogglePerSet(index)}
              className="flex items-center gap-1 self-start text-xs text-text-secondary transition-colors hover:text-accent"
            >
              {expandedIndex === index ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              {t('editor.perSet')}
            </button>

            {expandedIndex === index && (
              <div className="flex flex-col gap-1 rounded-lg bg-bg-input px-3 py-2">
                <div className="flex gap-3 text-xs text-text-secondary">
                  <span className="w-6" />
                  <span className="w-16 text-center">{t('editor.reps')}</span>
                  <span className="w-16 text-center">{t('editor.weight')}</span>
                </div>
                {Array.from({ length: re.sets }, (_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-6 text-center text-xs text-text-secondary">{i + 1}</span>
                    <NumericInput
                      value={re.repsPerSet?.[i] ?? re.reps}
                      min={1}
                      onChange={(v) => {
                        const arr = Array.from(
                          { length: re.sets },
                          (_, j) => re.repsPerSet?.[j] ?? re.reps
                        )
                        arr[i] = v
                        handleUpdateExercise(index, { repsPerSet: arr })
                      }}
                      className="w-16 rounded border border-border bg-bg-card px-2 py-1 text-center text-sm text-text-primary focus:border-accent focus:outline-none"
                    />
                    <NumericInput
                      value={re.weights?.[i] ?? re.weight}
                      min={0}
                      onChange={(v) => {
                        const arr = Array.from(
                          { length: re.sets },
                          (_, j) => re.weights?.[j] ?? re.weight
                        )
                        arr[i] = v
                        handleUpdateExercise(index, { weights: arr })
                      }}
                      className="w-16 rounded border border-border bg-bg-card px-2 py-1 text-center text-sm text-text-primary focus:border-accent focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => setShowPicker(true)}
        className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border py-3 text-sm text-text-secondary transition-colors hover:border-accent hover:text-accent"
      >
        <Plus size={16} />
        {t('editor.addExercise')}
      </button>

      <button
        onClick={handleSave}
        disabled={!name.trim()}
        className="rounded-lg bg-accent py-3 text-center font-medium text-bg-primary transition-opacity disabled:opacity-40"
      >
        {t('editor.save')}
      </button>

      {showPicker && (
        <ExercisePicker
          onSelect={handleAddExercise}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  )
}
