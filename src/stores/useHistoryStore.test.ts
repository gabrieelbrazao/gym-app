import { describe, it, expect, beforeEach } from 'vitest'
import { useHistoryStore } from './useHistoryStore'
import type { WorkoutSession } from '../types'

const mockSession: WorkoutSession = {
  id: 'session-1',
  date: '2026-03-01',
  status: 'completed',
  entries: [
    { exerciseId: 'bench-press', sets: [{ reps: 10, weight: 60, completed: true }] },
  ],
}

describe('useHistoryStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useHistoryStore.setState({ sessions: [] })
  })

  it('starts with an empty sessions list', () => {
    expect(useHistoryStore.getState().sessions).toEqual([])
  })

  it('saves a completed session', () => {
    useHistoryStore.getState().saveSession(mockSession)
    const sessions = useHistoryStore.getState().sessions
    expect(sessions).toHaveLength(1)
    expect(sessions[0].id).toBe('session-1')
  })

  it('lists sessions sorted by date descending', () => {
    useHistoryStore.getState().saveSession(mockSession)
    useHistoryStore.getState().saveSession({ ...mockSession, id: 'session-2', date: '2026-03-03' })

    const sessions = useHistoryStore.getState().sessions
    expect(sessions[0].date).toBe('2026-03-03')
    expect(sessions[1].date).toBe('2026-03-01')
  })

  it('gets a session by id', () => {
    useHistoryStore.getState().saveSession(mockSession)
    const session = useHistoryStore.getState().getSessionById('session-1')
    expect(session?.id).toBe('session-1')
  })

  it('returns undefined for unknown id', () => {
    expect(useHistoryStore.getState().getSessionById('nope')).toBeUndefined()
  })
})
