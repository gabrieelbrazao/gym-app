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

  it('startSession sets fromRoutine: true on all routine entries', () => {
    useWorkoutStore.getState().startSession([
      { exerciseId: 'bench-press', sets: 3, reps: 10, weight: 90 },
      { exerciseId: 'squat', sets: 3, reps: 10, weight: 100 },
    ])
    const entries = useWorkoutStore.getState().session!.entries
    expect(entries[0].fromRoutine).toBe(true)
    expect(entries[1].fromRoutine).toBe(true)
  })

  it('addExercise does not set fromRoutine', () => {
    useWorkoutStore.getState().startSession()
    useWorkoutStore.getState().addExercise('bench-press')
    expect(useWorkoutStore.getState().session!.entries[0].fromRoutine).toBeFalsy()
  })

  it('toggleHideExercise sets hidden: true on a visible entry', () => {
    useWorkoutStore.getState().startSession([{ exerciseId: 'bench-press', sets: 3, reps: 10, weight: 90 }])
    useWorkoutStore.getState().toggleHideExercise(0)
    expect(useWorkoutStore.getState().session!.entries[0].hidden).toBe(true)
  })

  it('toggleHideExercise sets hidden: false on an already-hidden entry', () => {
    useWorkoutStore.getState().startSession([{ exerciseId: 'bench-press', sets: 3, reps: 10, weight: 90 }])
    useWorkoutStore.getState().toggleHideExercise(0)
    useWorkoutStore.getState().toggleHideExercise(0)
    expect(useWorkoutStore.getState().session!.entries[0].hidden).toBe(false)
  })

  it('toggleHideExercise does not remove the entry from the array', () => {
    useWorkoutStore.getState().startSession([
      { exerciseId: 'bench-press', sets: 3, reps: 10, weight: 90 },
      { exerciseId: 'squat', sets: 3, reps: 10, weight: 100 },
    ])
    useWorkoutStore.getState().toggleHideExercise(0)
    expect(useWorkoutStore.getState().session!.entries).toHaveLength(2)
  })

  it('toggleHideExercise does nothing without an active session', () => {
    useWorkoutStore.getState().toggleHideExercise(0)
    expect(useWorkoutStore.getState().session).toBeNull()
  })

  it('finishWorkout strips hidden entries', () => {
    useWorkoutStore.getState().startSession([
      { exerciseId: 'bench-press', sets: 3, reps: 10, weight: 90 },
      { exerciseId: 'squat', sets: 3, reps: 10, weight: 100 },
    ])
    useWorkoutStore.getState().toggleHideExercise(0)
    const completed = useWorkoutStore.getState().finishWorkout()
    expect(completed!.entries).toHaveLength(1)
    expect(completed!.entries[0].exerciseId).toBe('squat')
  })

  it('finishWorkout keeps non-hidden entries', () => {
    useWorkoutStore.getState().startSession([{ exerciseId: 'bench-press', sets: 3, reps: 10, weight: 90 }])
    const completed = useWorkoutStore.getState().finishWorkout()
    expect(completed!.entries).toHaveLength(1)
  })

  it('removeExercise removes the exercise at the given index', () => {
    useWorkoutStore.getState().startSession()
    useWorkoutStore.getState().addExercise('bench-press')
    useWorkoutStore.getState().addExercise('squat')
    useWorkoutStore.getState().removeExercise(0)

    const entries = useWorkoutStore.getState().session!.entries
    expect(entries).toHaveLength(1)
    expect(entries[0].exerciseId).toBe('squat')
  })

  it('removeExercise removes only the targeted exercise', () => {
    useWorkoutStore.getState().startSession()
    useWorkoutStore.getState().addExercise('bench-press')
    useWorkoutStore.getState().addExercise('squat')
    useWorkoutStore.getState().addExercise('deadlift')
    useWorkoutStore.getState().removeExercise(1)

    const entries = useWorkoutStore.getState().session!.entries
    expect(entries).toHaveLength(2)
    expect(entries[0].exerciseId).toBe('bench-press')
    expect(entries[1].exerciseId).toBe('deadlift')
  })

  it('removeExercise does nothing without an active session', () => {
    useWorkoutStore.getState().removeExercise(0)
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

  it('reorderExercises changes the order of entries', () => {
    useWorkoutStore.getState().startSession([
      { exerciseId: 'bench-press', sets: 3, reps: 10, weight: 90 },
      { exerciseId: 'squat', sets: 3, reps: 10, weight: 100 },
    ])
    const entries = useWorkoutStore.getState().session!.entries
    useWorkoutStore.getState().reorderExercises([entries[1], entries[0]])
    const reordered = useWorkoutStore.getState().session!.entries
    expect(reordered[0].exerciseId).toBe('squat')
    expect(reordered[1].exerciseId).toBe('bench-press')
  })

  it('reorderExercises does nothing without an active session', () => {
    useWorkoutStore.getState().reorderExercises([])
    expect(useWorkoutStore.getState().session).toBeNull()
  })
})
