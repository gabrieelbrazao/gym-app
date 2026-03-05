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
    expect(session!.startTime).toBeTruthy()
  })

  it('starts a session from a routine', () => {
    useWorkoutStore.getState().startSession([
      { exerciseId: 'bench-press', sets: 3, reps: 10, weight: 90 },
      { exerciseId: 'squat', sets: 4, reps: 8, weight: 120 },
    ])

    const session = useWorkoutStore.getState().session
    expect(session!.entries).toHaveLength(2)
    expect(session!.entries[0].exerciseId).toBe('bench-press')
    expect(session!.entries[0].sets).toHaveLength(3)
    expect(session!.entries[0].sets[0]).toEqual({ reps: 10, weight: 90, completed: false })
  })

  it('uses per-set reps and weights from routine', () => {
    useWorkoutStore.getState().startSession([{
      exerciseId: 'bench-press',
      sets: 3,
      reps: 10,
      weight: 90,
      repsPerSet: [8, 10, 12],
      weights: [100, 90, 80],
    }])

    const sets = useWorkoutStore.getState().session!.entries[0].sets
    expect(sets[0]).toEqual({ reps: 8, weight: 100, completed: false })
    expect(sets[1]).toEqual({ reps: 10, weight: 90, completed: false })
    expect(sets[2]).toEqual({ reps: 12, weight: 80, completed: false })
  })

  it('adds an exercise to the session', () => {
    useWorkoutStore.getState().startSession()
    useWorkoutStore.getState().addExercise('bench-press')

    expect(useWorkoutStore.getState().session!.entries).toHaveLength(1)
    expect(useWorkoutStore.getState().session!.entries[0].exerciseId).toBe('bench-press')
  })

  it('addExercise does nothing without an active session', () => {
    useWorkoutStore.getState().addExercise('bench-press')
    expect(useWorkoutStore.getState().session).toBeNull()
  })

  it('adds a set to an exercise', () => {
    useWorkoutStore.getState().startSession()
    useWorkoutStore.getState().addExercise('bench-press')
    useWorkoutStore.getState().addSet(0)

    expect(useWorkoutStore.getState().session!.entries[0].sets).toHaveLength(2)
  })

  it('new set inherits reps and weight from the previous set', () => {
    useWorkoutStore.getState().startSession()
    useWorkoutStore.getState().addExercise('bench-press')
    useWorkoutStore.getState().updateSet(0, 0, { reps: 12, weight: 80 })
    useWorkoutStore.getState().addSet(0)

    const sets = useWorkoutStore.getState().session!.entries[0].sets
    expect(sets[1].reps).toBe(12)
    expect(sets[1].weight).toBe(80)
  })

  it('addSet does nothing without an active session', () => {
    useWorkoutStore.getState().addSet(0)
    expect(useWorkoutStore.getState().session).toBeNull()
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

  it('updateSet does nothing without an active session', () => {
    useWorkoutStore.getState().updateSet(0, 0, { completed: true })
    expect(useWorkoutStore.getState().session).toBeNull()
  })

  it('cancelWorkout clears the session', () => {
    useWorkoutStore.getState().startSession()
    useWorkoutStore.getState().cancelWorkout()
    expect(useWorkoutStore.getState().session).toBeNull()
  })

  it('finishes the workout and returns the completed session', () => {
    useWorkoutStore.getState().startSession()
    useWorkoutStore.getState().addExercise('bench-press')

    const completed = useWorkoutStore.getState().finishWorkout()
    expect(completed!.status).toBe('completed')
    expect(completed!.durationMinutes).toBeGreaterThanOrEqual(0)
    expect(useWorkoutStore.getState().session).toBeNull()
  })

  it('finishWorkout returns null when no session is active', () => {
    const result = useWorkoutStore.getState().finishWorkout()
    expect(result).toBeNull()
  })
})
