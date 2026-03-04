import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WeekSchedule } from '../types'

interface ScheduleStore {
  schedule: WeekSchedule
  setDay: (day: number, routineId: string | null) => void
}

const initialSchedule: WeekSchedule = { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null }

export const useScheduleStore = create<ScheduleStore>()(
  persist(
    (set) => ({
      schedule: initialSchedule,

      setDay: (day, routineId) => {
        set((state) => ({ schedule: { ...state.schedule, [day]: routineId } }))
      },
    }),
    { name: 'gym-schedule' }
  )
)
