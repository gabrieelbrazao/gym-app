import { useMemo } from 'react'
import { MUSCLE_GROUPS, type MuscleGroup, type FatigueStatus, type MuscleFatigue } from '../types'
import { useHistoryStore } from '../stores/useHistoryStore'
import { exercises as exerciseDb } from '../data/exercises'
import { localDateISO, diffDays } from '../lib/dateUtils'

const RECOVERY_DAYS: Record<MuscleGroup, number> = {
  cardio:     1,
  biceps:     2,
  triceps:    2,
  calves:     2,
  core:       2,
  shoulders:  2,
  chest:      3,
  back:       3,
  quads:      4,
  hamstrings: 4,
  glutes:     4,
}

const STATUS_ORDER: Record<FatigueStatus, number> = { fatigued: 0, resting: 1, ready: 2 }

export function useFatigue(): MuscleFatigue[] {
  const sessions = useHistoryStore((s) => s.sessions)

  return useMemo(() => {
    const today = localDateISO()

    const result: MuscleFatigue[] = MUSCLE_GROUPS.map((muscleGroup) => {
      // Find the most recent session date that trained this muscle
      let lastTrainedDate: string | null = null
      for (const session of sessions) {
        if (session.status !== 'completed') continue
        const trained = session.entries.some((entry) => {
          const ex = exerciseDb.find((e) => e.id === entry.exerciseId)
          return ex?.muscleGroup === muscleGroup
        })
        if (trained) {
          if (!lastTrainedDate || session.date > lastTrainedDate) {
            lastTrainedDate = session.date
          }
        }
      }

      if (!lastTrainedDate) {
        return { muscleGroup, lastTrainedDate: null, daysAgo: null, status: 'ready' }
      }

      const daysAgo = diffDays(lastTrainedDate, today)
      const R = RECOVERY_DAYS[muscleGroup]
      let status: FatigueStatus

      if (daysAgo < Math.ceil(R / 2)) {
        status = 'fatigued'
      } else if (daysAgo < R) {
        status = 'resting'
      } else {
        status = 'ready'
      }

      return { muscleGroup, lastTrainedDate, daysAgo, status }
    })

    return result.sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status])
  }, [sessions])
}
