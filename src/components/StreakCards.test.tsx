import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import StreakCards from './StreakCards'
import { useHistoryStore } from '../stores/useHistoryStore'

// Fix "today" so tests are date-independent
const TODAY = '2026-03-10'
vi.setSystemTime(new Date(TODAY + 'T12:00:00'))

describe('StreakCards', () => {
  beforeEach(() => {
    useHistoryStore.setState({ sessions: [] })
  })

  it('renders current and best streak labels', () => {
    render(<StreakCards />)
    expect(screen.getByText('Sequência Atual')).toBeInTheDocument()
    expect(screen.getByText('Melhor Sequência')).toBeInTheDocument()
  })

  it('renders days label', () => {
    render(<StreakCards />)
    expect(screen.getAllByText('dias')).toHaveLength(2)
  })

  it('shows 0 for both streaks with no history', () => {
    render(<StreakCards />)
    expect(screen.getAllByText('0')).toHaveLength(2)
  })

  it('shows correct current streak when trained today', () => {
    useHistoryStore.getState().saveSession({
      id: 's1',
      date: TODAY,
      status: 'completed',
      entries: [],
    })
    render(<StreakCards />)
    // currentStreak = 1, bestStreak = 1
    expect(screen.getAllByText('1')).toHaveLength(2)
  })

  it('shows best streak when there is a long consecutive run', () => {
    useHistoryStore.getState().saveSession({ id: 's1', date: '2026-03-08', status: 'completed', entries: [] })
    useHistoryStore.getState().saveSession({ id: 's2', date: '2026-03-09', status: 'completed', entries: [] })
    useHistoryStore.getState().saveSession({ id: 's3', date: TODAY, status: 'completed', entries: [] })
    render(<StreakCards />)
    // currentStreak = 3, bestStreak = 3
    expect(screen.getAllByText('3')).toHaveLength(2)
  })
})
