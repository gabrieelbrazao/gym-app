import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Routine, RoutineExercise } from '../types'
import { uuid } from '../lib/dateUtils'

interface RoutineStore {
  routines: Routine[]
  addRoutine: (data: { name: string; exercises: RoutineExercise[] }) => void
  updateRoutine: (id: string, data: Partial<Pick<Routine, 'name' | 'exercises'>>) => void
  deleteRoutine: (id: string) => void
  getRoutineById: (id: string) => Routine | undefined
}

export const useRoutineStore = create<RoutineStore>()(
  persist(
    (set, get) => ({
      routines: [],

      addRoutine: (data) => {
        const routine: Routine = {
          id: uuid(),
          name: data.name,
          exercises: data.exercises,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ routines: [...state.routines, routine] }))
      },

      updateRoutine: (id, data) => {
        set((state) => ({
          routines: state.routines.map((r) =>
            r.id === id ? { ...r, ...data } : r
          ),
        }))
      },

      deleteRoutine: (id) => {
        set((state) => ({
          routines: state.routines.filter((r) => r.id !== id),
        }))
      },

      getRoutineById: (id) => {
        return get().routines.find((r) => r.id === id)
      },
    }),
    { name: 'gym-routines' }
  )
)
