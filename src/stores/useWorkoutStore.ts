import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { format } from 'date-fns'
import type { WorkoutSession, SetLog, RoutineExercise, WorkoutEntry } from '../types'
import { uuid } from '../lib/dateUtils'

interface WorkoutStore {
  session: WorkoutSession | null
  startSession: (routineExercises?: RoutineExercise[]) => void
  addExercise: (exerciseId: string) => void
  removeExercise: (entryIndex: number) => void
  toggleHideExercise: (entryIndex: number) => void
  addSet: (entryIndex: number) => void
  updateSet: (entryIndex: number, setIndex: number, data: Partial<SetLog>) => void
  reorderExercises: (entries: WorkoutEntry[]) => void
  cancelWorkout: () => void
  finishWorkout: () => WorkoutSession | null
  reset: () => void
}

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set, get) => ({
  session: null,

  startSession: (routineExercises) => {
    const entries = routineExercises
      ? routineExercises.map((re) => ({
          uid: uuid(),
          fromRoutine: true,
          exerciseId: re.exerciseId,
          sets: Array.from({ length: re.sets }, (_, i) => ({
            reps: re.repsPerSet?.[i] ?? re.reps,
            weight: re.weights?.[i] ?? re.weight,
            completed: false,
          })),
        }))
      : []

    set({
      session: {
        id: uuid(),
        date: format(new Date(), 'yyyy-MM-dd'),
        startTime: new Date().toISOString(),
        status: 'in-progress',
        entries,
      },
    })
  },

  addExercise: (exerciseId) => {
    set((state) => {
      if (!state.session) return state
      return {
        session: {
          ...state.session,
          entries: [
            ...state.session.entries,
            { uid: uuid(), exerciseId, sets: [{ reps: 0, weight: 0, completed: false }] },
          ],
        },
      }
    })
  },

  toggleHideExercise: (entryIndex) => {
    set((state) => {
      if (!state.session) return state
      const entries = state.session.entries.map((entry, i) =>
        i === entryIndex ? { ...entry, hidden: !entry.hidden } : entry
      )
      return { session: { ...state.session, entries } }
    })
  },

  removeExercise: (entryIndex) => {
    set((state) => {
      if (!state.session) return state
      return {
        session: {
          ...state.session,
          entries: state.session.entries.filter((_, i) => i !== entryIndex),
        },
      }
    })
  },

  addSet: (entryIndex) => {
    set((state) => {
      if (!state.session) return state
      const entries = state.session.entries.map((entry, i) => {
        if (i !== entryIndex) return entry
        const last = entry.sets[entry.sets.length - 1]
        return {
          ...entry,
          sets: [...entry.sets, { reps: last?.reps ?? 0, weight: last?.weight ?? 0, completed: false }],
        }
      })
      return { session: { ...state.session, entries } }
    })
  },

  updateSet: (entryIndex, setIndex, data) => {
    set((state) => {
      if (!state.session) return state
      const entries = state.session.entries.map((entry, i) => {
        if (i !== entryIndex) return entry
        const sets = entry.sets.map((s, j) =>
          j === setIndex ? { ...s, ...data } : s
        )
        return { ...entry, sets }
      })
      return { session: { ...state.session, entries } }
    })
  },

  reorderExercises: (entries) => {
    set((state) => {
      if (!state.session) return state
      return { session: { ...state.session, entries } }
    })
  },

  cancelWorkout: () => set({ session: null }),
  reset: () => set({ session: null }),

  finishWorkout: () => {
    const session = get().session
    if (!session) return null
    const durationMinutes = session.startTime
      ? Math.round((Date.now() - new Date(session.startTime).getTime()) / 60000)
      : undefined
    const completed: WorkoutSession = {
      ...session,
      status: 'completed',
      durationMinutes,
      entries: session.entries.filter((e) => !e.hidden),
    }
    set({ session: null })
    return completed
  },
}),
    { name: 'gym-workout' }
  )
)
