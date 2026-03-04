import { describe, it, expect, beforeEach } from 'vitest'
import { useScheduleStore } from './useScheduleStore'

const resetStore = () => {
  localStorage.clear()
  useScheduleStore.setState({
    schedule: { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null },
  })
}

describe('useScheduleStore', () => {
  beforeEach(resetStore)

  it('starts with all days unassigned', () => {
    const { schedule } = useScheduleStore.getState()
    for (let i = 0; i <= 6; i++) {
      expect(schedule[i]).toBeNull()
    }
  })

  it('assigns a routine to a day', () => {
    useScheduleStore.getState().setDay(1, 'routine-abc')
    expect(useScheduleStore.getState().schedule[1]).toBe('routine-abc')
  })

  it('reassigns a different routine to the same day', () => {
    useScheduleStore.getState().setDay(3, 'routine-a')
    useScheduleStore.getState().setDay(3, 'routine-b')
    expect(useScheduleStore.getState().schedule[3]).toBe('routine-b')
  })

  it('clears a day assignment by setting null', () => {
    useScheduleStore.getState().setDay(5, 'routine-xyz')
    useScheduleStore.getState().setDay(5, null)
    expect(useScheduleStore.getState().schedule[5]).toBeNull()
  })

  it('does not affect other days when one is set', () => {
    useScheduleStore.getState().setDay(2, 'routine-leg')
    const { schedule } = useScheduleStore.getState()
    expect(schedule[0]).toBeNull()
    expect(schedule[1]).toBeNull()
    expect(schedule[2]).toBe('routine-leg')
    expect(schedule[3]).toBeNull()
  })
})
