import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
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
import { useWorkoutStore } from '../stores/useWorkoutStore'
import { useHistoryStore } from '../stores/useHistoryStore'
import { useRoutineStore } from '../stores/useRoutineStore'
import { useStopwatch } from '../hooks/useStopwatch'
import { useRestTimer } from '../hooks/useRestTimer'
import { exercises as exerciseDb } from '../data/exercises'
import SetInput from '../components/SetInput'
import ExercisePicker from '../components/ExercisePicker'
import RestTimer from '../components/RestTimer'
import { Plus, CheckCircle, Dumbbell, X, EyeOff, Eye, GripVertical } from 'lucide-react'
import type { Exercise, SetLog, WorkoutEntry } from '../types'
import { t } from '../i18n'

function formatTime(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

interface SortableCardProps {
  entry: WorkoutEntry
  entryIndex: number
  getExerciseName: (id: string) => string
  onToggleHide: (i: number) => void
  onRemove: (i: number) => void
  onAddSet: (i: number) => void
  onSetChange: (ei: number, si: number, data: Partial<SetLog>) => void
}

function SortableCard({
  entry,
  entryIndex,
  getExerciseName,
  onToggleHide,
  onRemove,
  onAddSet,
  onSetChange,
}: SortableCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: entry.uid!,
  })
  const dndStyle = {
    transform: transform ? CSS.Translate.toString(transform) : undefined,
    transition,
    zIndex: isDragging ? 10 : undefined,
  }

  return (
    <div ref={setNodeRef} style={dndStyle}>
      <motion.div
        className="rounded-lg border border-border bg-bg-card p-4"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: entry.hidden ? 0.4 : 1, x: 0 }}
        exit={{ opacity: 0, x: 24 }}
        transition={{ duration: 0.22 }}
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              {...attributes}
              {...listeners}
              aria-label={t('workout.reorderExercise')}
              style={{ touchAction: 'none' }}
              className="cursor-grab select-none text-text-secondary active:cursor-grabbing"
            >
              <GripVertical size={16} />
            </button>
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
          </div>
          {entry.fromRoutine ? (
            <motion.button
              onClick={() => onToggleHide(entryIndex)}
              className={`rounded p-1 transition-colors ${entry.hidden ? 'text-accent hover:text-text-primary' : 'text-text-secondary hover:text-yellow-400'}`}
              whileTap={{ scale: 0.9 }}
              title={entry.hidden ? t('workout.showExercise') : t('workout.hideExercise')}
            >
              {entry.hidden ? <Eye size={16} /> : <EyeOff size={16} />}
            </motion.button>
          ) : (
            <motion.button
              onClick={() => onRemove(entryIndex)}
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
                    onChange={(data) => onSetChange(entryIndex, setIndex, data)}
                  />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>

          <button
            onClick={() => onAddSet(entryIndex)}
            className="mt-2 flex w-full items-center justify-center gap-1 rounded py-2 text-xs text-text-secondary transition-colors hover:text-accent"
          >
            <Plus size={14} />
            {t('workout.addSet')}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function ActiveWorkout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { session, startSession, addExercise, removeExercise, toggleHideExercise, reorderExercises, addSet, updateSet, cancelWorkout, finishWorkout } = useWorkoutStore()
  const { saveSession } = useHistoryStore()
  const { routines } = useRoutineStore()
  const [showPicker, setShowPicker] = useState(false)
  const elapsed = useStopwatch(!!session)
  const restTimer = useRestTimer()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

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

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id || !session) return
    const entries = session.entries
    const oldIndex = entries.findIndex((e) => e.uid === active.id)
    const newIndex = entries.findIndex((e) => e.uid === over.id)
    if (oldIndex !== -1 && newIndex !== -1)
      reorderExercises(arrayMove(entries, oldIndex, newIndex))
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

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={session.entries.map((e) => e.uid!)}
          strategy={verticalListSortingStrategy}
        >
          <AnimatePresence>
            <div className="flex flex-col gap-4">
              {session.entries.map((entry, entryIndex) => (
                <SortableCard
                  key={entry.uid!}
                  entry={entry}
                  entryIndex={entryIndex}
                  getExerciseName={getExerciseName}
                  onToggleHide={toggleHideExercise}
                  onRemove={removeExercise}
                  onAddSet={addSet}
                  onSetChange={handleSetChange}
                />
              ))}
            </div>
          </AnimatePresence>
        </SortableContext>
      </DndContext>

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
