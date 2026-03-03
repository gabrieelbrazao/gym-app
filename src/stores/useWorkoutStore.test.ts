import { describe, it, expect, beforeEach } from 'vitest'
import { useWorkoutStore } from './useWorkoutStore'

describe('useWorkoutStore', () => {
  beforeEach(() => {
    useWorkoutStore.setState({ session: null })
  })

  it('starts with no active session', () => {
    expect(useWorkoutStore.getState().session).toBeNull()
  })

  it('starts a freestyle session', () => {
    useWorkoutStore.getState().startSession()
    const session = useWorkoutStore.getState().session
    expect(session).not.toBeNull()
    expect(session!.status).toBe('in-progress')
    expect(session!.entries).toEqual([])
  })

  it('starts a session from a routine', () => {
    useWorkoutStore.getState().startSession([
      { exerciseId: 'bench-press', sets: 3, reps: 10, restSeconds: 90 },
      { exerciseId: 'squat', sets: 4, reps: 8, restSeconds: 120 },
    ])

    const session = useWorkoutStore.getState().session
    expect(session!.entries).toHaveLength(2)
    expect(session!.entries[0].exerciseId).toBe('bench-press')
    // Pre-populated with empty sets based on routine
    expect(session!.entries[0].sets).toHaveLength(3)
    expect(session!.entries[0].sets[0]).toEqual({ reps: 10, weight: 0, completed: false })
  })

  it('adds an exercise to the session', () => {
    useWorkoutStore.getState().startSession()
    useWorkoutStore.getState().addExercise('bench-press')

    expect(useWorkoutStore.getState().session!.entries).toHaveLength(1)
    expect(useWorkoutStore.getState().session!.entries[0].exerciseId).toBe('bench-press')
  })

  it('adds a set to an exercise', () => {
    useWorkoutStore.getState().startSession()
    useWorkoutStore.getState().addExercise('bench-press')
    useWorkoutStore.getState().addSet(0)

    expect(useWorkoutStore.getState().session!.entries[0].sets).toHaveLength(2)
  })

  it('updates a set', () => {
    useWorkoutStore.getState().startSession()
    useWorkoutStore.getState().addExercise('bench-press')
    useWorkoutStore.getState().updateSet(0, 0, { reps: 12, weight: 80, completed: true })

    const set = useWorkoutStore.getState().session!.entries[0].sets[0]
    expect(set.reps).toBe(12)
    expect(set.weight).toBe(80)
    expect(set.completed).toBe(true)
  })

  it('finishes the workout', () => {
    useWorkoutStore.getState().startSession()
    useWorkoutStore.getState().addExercise('bench-press')

    const completed = useWorkoutStore.getState().finishWorkout()
    expect(completed!.status).toBe('completed')
    expect(useWorkoutStore.getState().session).toBeNull()
  })
})
