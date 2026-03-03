import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WorkoutSession } from '../types'

interface HistoryStore {
  sessions: WorkoutSession[]
  saveSession: (session: WorkoutSession) => void
  getSessionById: (id: string) => WorkoutSession | undefined
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
    }),
    { name: 'gym-history' }
  )
)
