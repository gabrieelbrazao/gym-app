import { create } from 'zustand'
import { format } from 'date-fns'
import type { WorkoutSession, SetLog, RoutineExercise } from '../types'
import { uuid } from '../lib/dateUtils'

interface WorkoutStore {
  session: WorkoutSession | null
  startSession: (routineExercises?: RoutineExercise[]) => void
  addExercise: (exerciseId: string) => void
  addSet: (entryIndex: number) => void
  updateSet: (entryIndex: number, setIndex: number, data: Partial<SetLog>) => void
  cancelWorkout: () => void
  finishWorkout: () => WorkoutSession | null
}

export const useWorkoutStore = create<WorkoutStore>()((set, get) => ({
  session: null,

  startSession: (routineExercises) => {
    const entries = routineExercises
      ? routineExercises.map((re) => ({
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
            { exerciseId, sets: [{ reps: 0, weight: 0, completed: false }] },
          ],
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

  cancelWorkout: () => set({ session: null }),

  finishWorkout: () => {
    const session = get().session
    if (!session) return null
    const completed: WorkoutSession = { ...session, status: 'completed' }
    set({ session: null })
    return completed
  },
}))
