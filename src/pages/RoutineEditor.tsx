import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRoutineStore } from '../stores/useRoutineStore'
import type { RoutineExercise, Exercise } from '../types'
import { exercises as exerciseDb } from '../data/exercises'
import ExercisePicker from '../components/ExercisePicker'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'
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

  const handleAddExercise = (exercise: Exercise) => {
    setRoutineExercises((prev) => [
      ...prev,
      { exerciseId: exercise.id, sets: 3, reps: 10, restSeconds: 90 },
    ])
    setShowPicker(false)
  }

  const handleRemoveExercise = (index: number) => {
    setRoutineExercises((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpdateExercise = (index: number, data: Partial<RoutineExercise>) => {
    setRoutineExercises((prev) =>
      prev.map((e, i) => (i === index ? { ...e, ...data } : e))
    )
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
                <input
                  type="number"
                  min={1}
                  value={re.sets}
                  onChange={(e) => handleUpdateExercise(index, { sets: Number(e.target.value) })}
                  className="w-16 rounded border border-border bg-bg-input px-2 py-1 text-center text-sm text-text-primary focus:border-accent focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs text-text-secondary">{t('editor.reps')}</span>
                <input
                  type="number"
                  min={1}
                  value={re.reps}
                  onChange={(e) => handleUpdateExercise(index, { reps: Number(e.target.value) })}
                  className="w-16 rounded border border-border bg-bg-input px-2 py-1 text-center text-sm text-text-primary focus:border-accent focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs text-text-secondary">{t('editor.rest')}</span>
                <input
                  type="number"
                  min={0}
                  step={15}
                  value={re.restSeconds}
                  onChange={(e) => handleUpdateExercise(index, { restSeconds: Number(e.target.value) })}
                  className="w-20 rounded border border-border bg-bg-input px-2 py-1 text-center text-sm text-text-primary focus:border-accent focus:outline-none"
                />
              </label>
            </div>
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
