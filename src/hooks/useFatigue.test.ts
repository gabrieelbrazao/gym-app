import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useFatigue } from './useFatigue'
import { useHistoryStore } from '../stores/useHistoryStore'
import type { WorkoutSession } from '../types'

// Fix "today" so tests are date-independent
const TODAY = '2026-03-03'
vi.setSystemTime(new Date(TODAY + 'T12:00:00'))

function makeSession(date: string, exerciseIds: string[]): WorkoutSession {
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

describe('useFatigue', () => {
  it('returns ready with null daysAgo for muscles never trained', () => {
    const { result } = renderHook(() => useFatigue())
    const quads = result.current.find((m) => m.muscleGroup === 'quads')!
    expect(quads.status).toBe('ready')
    expect(quads.lastTrainedDate).toBeNull()
    expect(quads.daysAgo).toBeNull()
  })

  it('quads trained today (0 days ago) → fatigued (R=4, ceil=2, 0 < 2)', () => {
    useHistoryStore.setState({
      sessions: [makeSession(TODAY, ['squat'])], // squat → quads
    })
    const { result } = renderHook(() => useFatigue())
    const quads = result.current.find((m) => m.muscleGroup === 'quads')!
    expect(quads.daysAgo).toBe(0)
    expect(quads.status).toBe('fatigued')
  })

  it('quads trained 2 days ago → resting (2 >= ceil(4/2)=2 but < 4)', () => {
    useHistoryStore.setState({
      sessions: [makeSession('2026-03-01', ['squat'])],
    })
    const { result } = renderHook(() => useFatigue())
    const quads = result.current.find((m) => m.muscleGroup === 'quads')!
    expect(quads.daysAgo).toBe(2)
    expect(quads.status).toBe('resting')
  })

  it('quads trained 5 days ago → ready (5 >= 4)', () => {
    useHistoryStore.setState({
      sessions: [makeSession('2026-02-26', ['squat'])],
    })
    const { result } = renderHook(() => useFatigue())
    const quads = result.current.find((m) => m.muscleGroup === 'quads')!
    expect(quads.daysAgo).toBe(5)
    expect(quads.status).toBe('ready')
  })

  it('biceps trained yesterday (1 day ago) → resting (R=2, ceil=1, 1 >= 1 but < 2)', () => {
    useHistoryStore.setState({
      sessions: [makeSession('2026-03-02', ['barbell-curl'])], // barbell-curl → biceps
    })
    const { result } = renderHook(() => useFatigue())
    const biceps = result.current.find((m) => m.muscleGroup === 'biceps')!
    expect(biceps.daysAgo).toBe(1)
    expect(biceps.status).toBe('resting')
  })

  it('biceps trained 2 days ago → ready (2 >= R=2)', () => {
    useHistoryStore.setState({
      sessions: [makeSession('2026-03-01', ['barbell-curl'])],
    })
    const { result } = renderHook(() => useFatigue())
    const biceps = result.current.find((m) => m.muscleGroup === 'biceps')!
    expect(biceps.daysAgo).toBe(2)
    expect(biceps.status).toBe('ready')
  })

  it('results are sorted: fatigued first, then resting, then ready', () => {
    useHistoryStore.setState({
      sessions: [
        makeSession(TODAY, ['squat']),           // quads → fatigued
        makeSession('2026-03-01', ['bench-press']), // chest (R=3, 2d ago) → resting
      ],
    })
    const { result } = renderHook(() => useFatigue())
    const statuses = result.current.map((m) => m.status)
    const firstFatigued = statuses.indexOf('fatigued')
    const firstResting = statuses.indexOf('resting')
    const firstReady = statuses.indexOf('ready')
    expect(firstFatigued).toBeLessThan(firstResting)
    expect(firstResting).toBeLessThan(firstReady)
  })

  it('uses the most recent session date for each muscle', () => {
    useHistoryStore.setState({
      sessions: [
        makeSession('2026-02-20', ['squat']), // old
        makeSession('2026-03-02', ['squat']), // recent → 1 day ago
      ],
    })
    const { result } = renderHook(() => useFatigue())
    const quads = result.current.find((m) => m.muscleGroup === 'quads')!
    expect(quads.lastTrainedDate).toBe('2026-03-02')
    expect(quads.daysAgo).toBe(1)
    expect(quads.status).toBe('fatigued') // R=4, ceil(4/2)=2, 1 < 2 → fatigued
  })
})
