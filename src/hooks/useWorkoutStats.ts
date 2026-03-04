import { useMemo } from 'react'
import { useHistoryStore } from '../stores/useHistoryStore'
import { exercises as exerciseDb } from '../data/exercises'
import { localDateISO, subtractDay, diffDays } from '../lib/dateUtils'

export interface WorkoutStats {
  currentStreak: number
  bestStreak: number
  totalWorkouts: number
  avgPerWeek: number
  mostTrainedMuscle: string
  trainedDates: Set<string>
}

export function useWorkoutStats(): WorkoutStats {
  const sessions = useHistoryStore((s) => s.sessions)

  return useMemo(() => {
    const completed = sessions.filter((s) => s.status === 'completed')

    if (completed.length === 0) {
      return {
        currentStreak: 0,
        bestStreak: 0,
        totalWorkouts: 0,
        avgPerWeek: 0,
        mostTrainedMuscle: '',
        trainedDates: new Set<string>(),
      }
    }

    const trainedDates = new Set(completed.map((s) => s.date))
    const today = localDateISO()

    // Current streak: walk back from today (or yesterday) while dates exist
    let currentStreak = 0
    const startDate = trainedDates.has(today) ? today : subtractDay(today)
    if (trainedDates.has(startDate)) {
      let d = startDate
      while (trainedDates.has(d)) {
        currentStreak++
        d = subtractDay(d)
      }
    }

    // Best streak: sort ascending, count longest consecutive run
    const sorted = [...trainedDates].sort()
    let bestStreak = 0
    let run = 1
    for (let i = 1; i < sorted.length; i++) {
      if (diffDays(sorted[i - 1], sorted[i]) === 1) {
        run++
      } else {
        run = 1
      }
      if (run > bestStreak) bestStreak = run
    }
    if (sorted.length > 0 && bestStreak === 0) bestStreak = 1

    const totalWorkouts = completed.length

    // Avg per week since first session
    const firstDate = sorted[0]
    const weeksElapsed = Math.max(1, diffDays(firstDate, today) / 7)
    const avgPerWeek = totalWorkouts / weeksElapsed

    // Most trained muscle: tally muscle groups per session (count each muscle once per session)
    const muscleTally = new Map<string, number>()
    for (const session of completed) {
      const muscles = new Set<string>()
      for (const entry of session.entries) {
        const ex = exerciseDb.find((e) => e.id === entry.exerciseId)
        if (ex) muscles.add(ex.muscleGroup)
      }
      for (const m of muscles) {
        muscleTally.set(m, (muscleTally.get(m) ?? 0) + 1)
      }
    }
    let mostTrainedMuscle = ''
    let maxCount = 0
    for (const [muscle, count] of muscleTally) {
      if (count > maxCount) {
        maxCount = count
        mostTrainedMuscle = muscle
      }
    }

    return { currentStreak, bestStreak, totalWorkouts, avgPerWeek, mostTrainedMuscle, trainedDates }
  }, [sessions])
}
