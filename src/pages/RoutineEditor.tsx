import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useRoutineStore } from '../stores/useRoutineStore'
import type { RoutineExercise, Exercise } from '../types'
import { exercises as exerciseDb } from '../data/exercises'
import ExercisePicker from '../components/ExercisePicker'
import NumericInput from '../components/NumericInput'
import { Plus, Trash2, ArrowLeft, ChevronDown, ChevronRight, GripVertical } from 'lucide-react'
import { t } from '../i18n'
import { uuid } from '../lib/dateUtils'

interface RoutineExerciseCardProps {
  re: RoutineExercise
  index: number
  isExpanded: boolean
  getExerciseName: (id: string) => string
  onRemove: (i: number) => void
  onUpdate: (i: number, data: Partial<RoutineExercise>) => void
  onTogglePerSet: (i: number) => void
}

function RoutineExerciseCard({
  re,
  index,
  isExpanded,
  getExerciseName,
  onRemove,
  onUpdate,
  onTogglePerSet,
}: RoutineExerciseCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: re.uid!,
  })
  const dndStyle = {
    transform: transform ? CSS.Translate.toString(transform) : undefined,
    transition,
    zIndex: isDragging ? 10 : undefined,
  }

  return (
    <div ref={setNodeRef} style={dndStyle}>
      <div className="flex flex-col gap-2 rounded-lg border border-border bg-bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              {...attributes}
              {...listeners}
              aria-label="Reordenar exercício"
              style={{ touchAction: 'none' }}
              className="cursor-grab select-none text-text-secondary active:cursor-grabbing"
            >
              <GripVertical size={16} />
            </button>
            <h3 className="font-medium text-text-primary">{getExerciseName(re.exerciseId)}</h3>
          </div>
          <button
            onClick={() => onRemove(index)}
            aria-label="Remover exercício"
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
              onChange={(v) => onUpdate(index, { sets: v })}
              className="w-16 rounded border border-border bg-bg-input px-2 py-1 text-center text-sm text-text-primary focus:border-accent focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-text-secondary">{t('editor.reps')}</span>
            <NumericInput
              value={re.reps}
              min={1}
              onChange={(v) => onUpdate(index, { reps: v })}
              className="w-16 rounded border border-border bg-bg-input px-2 py-1 text-center text-sm text-text-primary focus:border-accent focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-text-secondary">{t('editor.weight')}</span>
            <NumericInput
              value={re.weight}
              min={0}
              onChange={(v) => onUpdate(index, { weight: v })}
              className="w-16 rounded border border-border bg-bg-input px-2 py-1 text-center text-sm text-text-primary focus:border-accent focus:outline-none"
            />
          </label>
        </div>

        <button
          onClick={() => onTogglePerSet(index)}
          className="flex items-center gap-1 self-start text-xs text-text-secondary transition-colors hover:text-accent"
        >
          {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          {t('editor.perSet')}
        </button>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              key="per-set"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: 'hidden' }}
            >
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
                        onUpdate(index, { repsPerSet: arr })
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
                        onUpdate(index, { weights: arr })
                      }}
                      className="w-16 rounded border border-border bg-bg-card px-2 py-1 text-center text-sm text-text-primary focus:border-accent focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function RoutineEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addRoutine, updateRoutine, getRoutineById } = useRoutineStore()

  const existing = id ? getRoutineById(id) : undefined

  const [name, setName] = useState(existing?.name ?? '')
  const [routineExercises, setRoutineExercises] = useState<RoutineExercise[]>(
    () => (existing?.exercises ?? []).map((e) => e.uid ? e : { ...e, uid: uuid() })
  )
  const [showPicker, setShowPicker] = useState(false)
  const [expandedUids, setExpandedUids] = useState<Set<string>>(new Set())

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleAddExercise = (exercise: Exercise) => {
    setRoutineExercises((prev) => [
      ...prev,
      { uid: uuid(), exerciseId: exercise.id, sets: 3, reps: 10, weight: 0 },
    ])
    setShowPicker(false)
  }

  const handleRemoveExercise = (index: number) => {
    const uid = routineExercises[index].uid
    setRoutineExercises((prev) => prev.filter((_, i) => i !== index))
    if (uid) setExpandedUids((prev) => { const next = new Set(prev); next.delete(uid); return next })
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
    const uid = re.uid ?? ''
    if (expandedUids.has(uid)) {
      setExpandedUids((prev) => { const next = new Set(prev); next.delete(uid); return next })
    } else {
      // initialise per-set arrays if not yet set
      const init: Partial<RoutineExercise> = {}
      if (!re.weights) init.weights = Array.from({ length: re.sets }, () => re.weight)
      if (!re.repsPerSet) init.repsPerSet = Array.from({ length: re.sets }, () => re.reps)
      if (Object.keys(init).length > 0) handleUpdateExercise(index, init)
      setExpandedUids((prev) => new Set(prev).add(uid))
    }
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return
    const oldIndex = routineExercises.findIndex((e) => e.uid === active.id)
    const newIndex = routineExercises.findIndex((e) => e.uid === over.id)
    if (oldIndex !== -1 && newIndex !== -1)
      setRoutineExercises(arrayMove(routineExercises, oldIndex, newIndex))
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

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={routineExercises.map((re) => re.uid!)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-3">
            {routineExercises.map((re, index) => (
              <RoutineExerciseCard
                key={re.uid!}
                re={re}
                index={index}
                isExpanded={expandedUids.has(re.uid ?? '')}
                getExerciseName={getExerciseName}
                onRemove={handleRemoveExercise}
                onUpdate={handleUpdateExercise}
                onTogglePerSet={handleTogglePerSet}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

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
