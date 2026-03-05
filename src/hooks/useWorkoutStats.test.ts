import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useWorkoutStats } from './useWorkoutStats'
import { useHistoryStore } from '../stores/useHistoryStore'
import type { WorkoutSession } from '../types'

const TODAY = '2026-03-03'
vi.setSystemTime(new Date(TODAY + 'T12:00:00'))

function makeSession(date: string, exerciseIds: string[] = ['bench-press']): WorkoutSession {
  return {
    id: date,
    date,
    status: 'completed',
    entries: exerciseIds.map((exerciseId) => ({
      exerciseId,
      sets: [{ reps: 10, weight: 100, completed: true }],
    })),
  }
}

beforeEach(() => {
  useHistoryStore.setState({ sessions: [] })
})

describe('useWorkoutStats', () => {
  it('returns zeros and empty set when no sessions', () => {
    const { result } = renderHook(() => useWorkoutStats())
    expect(result.current.currentStreak).toBe(0)
    expect(result.current.bestStreak).toBe(0)
    expect(result.current.totalWorkouts).toBe(0)
    expect(result.current.avgPerWeek).toBe(0)
    expect(result.current.mostTrainedMuscle).toBe('')
    expect(result.current.trainedDates.size).toBe(0)
    expect(result.current.totalTimeMinutes).toBe(0)
    expect(result.current.avgDurationMinutes).toBe(0)
    expect(result.current.longestSessionMinutes).toBe(0)
  })

  it('currentStreak counts consecutive days ending today', () => {
    useHistoryStore.setState({
      sessions: [
        makeSession('2026-03-03'), // today
        makeSession('2026-03-02'), // yesterday
        makeSession('2026-03-01'), // 2 days ago
        // gap — 2026-02-28 missing
        makeSession('2026-02-27'),
      ],
    })
    const { result } = renderHook(() => useWorkoutStats())
    expect(result.current.currentStreak).toBe(3) // 03, 02, 01
  })

  it('currentStreak still counts if not trained today but trained yesterday', () => {
    useHistoryStore.setState({
      sessions: [
        makeSession('2026-03-02'), // yesterday
        makeSession('2026-03-01'),
      ],
    })
    const { result } = renderHook(() => useWorkoutStats())
    expect(result.current.currentStreak).toBe(2)
  })

  it('currentStreak is 0 if last training was 2+ days ago', () => {
    useHistoryStore.setState({
      sessions: [makeSession('2026-03-01')], // 2 days ago
    })
    const { result } = renderHook(() => useWorkoutStats())
    expect(result.current.currentStreak).toBe(0)
  })

  it('bestStreak finds the longest run across all history', () => {
    useHistoryStore.setState({
      sessions: [
        makeSession('2026-03-03'),
        makeSession('2026-03-02'),
        makeSession('2026-03-01'), // run of 3
        // gap
        makeSession('2026-02-20'),
        makeSession('2026-02-19'),
        makeSession('2026-02-18'),
        makeSession('2026-02-17'),
        makeSession('2026-02-16'), // run of 5
      ],
    })
    const { result } = renderHook(() => useWorkoutStats())
    expect(result.current.bestStreak).toBe(5)
  })

  it('totalWorkouts equals number of completed sessions', () => {
    useHistoryStore.setState({
      sessions: [makeSession('2026-03-03'), makeSession('2026-03-01')],
    })
    const { result } = renderHook(() => useWorkoutStats())
    expect(result.current.totalWorkouts).toBe(2)
  })

  it('trainedDates contains all session dates', () => {
    useHistoryStore.setState({
      sessions: [makeSession('2026-03-03'), makeSession('2026-03-01')],
    })
    const { result } = renderHook(() => useWorkoutStats())
    expect(result.current.trainedDates.has('2026-03-03')).toBe(true)
    expect(result.current.trainedDates.has('2026-03-01')).toBe(true)
    expect(result.current.trainedDates.has('2026-03-02')).toBe(false)
  })

  it('totalTimeMinutes sums durationMinutes of timed sessions', () => {
    useHistoryStore.setState({
      sessions: [
        { ...makeSession('2026-03-03'), durationMinutes: 45 },
        { ...makeSession('2026-03-02'), durationMinutes: 30 },
        makeSession('2026-03-01'), // no durationMinutes
      ],
    })
    const { result } = renderHook(() => useWorkoutStats())
    expect(result.current.totalTimeMinutes).toBe(75)
  })

  it('avgDurationMinutes is the mean of timed sessions only', () => {
    useHistoryStore.setState({
      sessions: [
        { ...makeSession('2026-03-03'), durationMinutes: 60 },
        { ...makeSession('2026-03-02'), durationMinutes: 40 },
        makeSession('2026-03-01'), // excluded from average
      ],
    })
    const { result } = renderHook(() => useWorkoutStats())
    expect(result.current.avgDurationMinutes).toBe(50)
  })

  it('longestSessionMinutes is the max duration', () => {
    useHistoryStore.setState({
      sessions: [
        { ...makeSession('2026-03-03'), durationMinutes: 90 },
        { ...makeSession('2026-03-02'), durationMinutes: 45 },
      ],
    })
    const { result } = renderHook(() => useWorkoutStats())
    expect(result.current.longestSessionMinutes).toBe(90)
  })

  it('time stats are 0 when no sessions have durationMinutes', () => {
    useHistoryStore.setState({
      sessions: [makeSession('2026-03-03'), makeSession('2026-03-02')],
    })
    const { result } = renderHook(() => useWorkoutStats())
    expect(result.current.totalTimeMinutes).toBe(0)
    expect(result.current.avgDurationMinutes).toBe(0)
    expect(result.current.longestSessionMinutes).toBe(0)
  })

  it('mostTrainedMuscle returns the muscle group with most sessions', () => {
    useHistoryStore.setState({
      sessions: [
        makeSession('2026-03-03', ['bench-press']),   // chest
        makeSession('2026-03-02', ['bench-press']),   // chest
        makeSession('2026-03-01', ['squat']),          // quads
      ],
    })
    const { result } = renderHook(() => useWorkoutStats())
    expect(result.current.mostTrainedMuscle).toBe('chest')
  })
})
