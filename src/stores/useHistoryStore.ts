import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WorkoutSession } from '../types'

interface HistoryStore {
  sessions: WorkoutSession[]
  saveSession: (session: WorkoutSession) => void
  getSessionById: (id: string) => WorkoutSession | undefined
  getLastEntryForExercise: (exerciseId: string) => { sets: { reps: number; weight: number }[] } | undefined
  getBestWeightForExercise: (exerciseId: string) => number
}

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set, get) => ({
      sessions: [],

      saveSession: (session) => {
        set((state) => ({
          sessions: [session, ...state.sessions].sort(
            (a, b) => b.date.localeCompare(a.date)
          ),
        }))
      },

      getSessionById: (id) => {
        return get().sessions.find((s) => s.id === id)
      },

      getLastEntryForExercise: (exerciseId) => {
        for (const session of get().sessions) {
          const entry = session.entries.find((e) => e.exerciseId === exerciseId)
          if (entry) return { sets: entry.sets.map((s) => ({ reps: s.reps, weight: s.weight })) }
        }
        return undefined
      },

      getBestWeightForExercise: (exerciseId) => {
        let best = 0
        for (const session of get().sessions) {
          for (const entry of session.entries) {
            if (entry.exerciseId !== exerciseId) continue
            for (const set of entry.sets) {
              if (set.completed && set.weight > best) best = set.weight
            }
          }
        }
        return best
      },
    }),
    { name: 'gym-history' }
  )
)
