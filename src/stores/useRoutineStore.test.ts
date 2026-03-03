import { describe, it, expect, beforeEach } from 'vitest'
import { useRoutineStore } from './useRoutineStore'

describe('useRoutineStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useRoutineStore.setState({ routines: [] })
  })

  it('starts with an empty routines list', () => {
    expect(useRoutineStore.getState().routines).toEqual([])
  })

  it('adds a routine', () => {
    const { addRoutine } = useRoutineStore.getState()
    addRoutine({
      name: 'Push Day',
      exercises: [
        { exerciseId: 'bench-press', sets: 3, reps: 10, restSeconds: 90 },
      ],
    })

    const routines = useRoutineStore.getState().routines
    expect(routines).toHaveLength(1)
    expect(routines[0].name).toBe('Push Day')
    expect(routines[0].id).toBeTruthy()
    expect(routines[0].createdAt).toBeTruthy()
  })

  it('updates a routine', () => {
    const { addRoutine } = useRoutineStore.getState()
    addRoutine({
      name: 'Push Day',
      exercises: [{ exerciseId: 'bench-press', sets: 3, reps: 10, restSeconds: 90 }],
    })

    const id = useRoutineStore.getState().routines[0].id
    const { updateRoutine } = useRoutineStore.getState()
    updateRoutine(id, { name: 'Push Day V2' })

    expect(useRoutineStore.getState().routines[0].name).toBe('Push Day V2')
  })

  it('deletes a routine', () => {
    const { addRoutine } = useRoutineStore.getState()
    addRoutine({ name: 'A', exercises: [] })
    addRoutine({ name: 'B', exercises: [] })

    const id = useRoutineStore.getState().routines[0].id
    const { deleteRoutine } = useRoutineStore.getState()
    deleteRoutine(id)

    const routines = useRoutineStore.getState().routines
    expect(routines).toHaveLength(1)
    expect(routines[0].name).toBe('B')
  })

  it('gets a routine by id', () => {
    const { addRoutine } = useRoutineStore.getState()
    addRoutine({ name: 'Leg Day', exercises: [] })

    const id = useRoutineStore.getState().routines[0].id
    const { getRoutineById } = useRoutineStore.getState()
    const routine = getRoutineById(id)

    expect(routine?.name).toBe('Leg Day')
  })

  it('returns undefined for unknown id', () => {
    const { getRoutineById } = useRoutineStore.getState()
    expect(getRoutineById('nonexistent')).toBeUndefined()
  })
})
