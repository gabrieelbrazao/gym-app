import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import TimeStats from './TimeStats'
import { useHistoryStore } from '../stores/useHistoryStore'

describe('TimeStats', () => {
  beforeEach(() => {
    useHistoryStore.setState({ sessions: [] })
  })

  it('renders all three time stat labels', () => {
    render(<TimeStats />)
    expect(screen.getByText('Tempo Total')).toBeInTheDocument()
    expect(screen.getByText('Duração Média')).toBeInTheDocument()
    expect(screen.getByText('Maior Treino')).toBeInTheDocument()
  })

  it('shows em dash for all times when no history', () => {
    render(<TimeStats />)
    expect(screen.getAllByText('—')).toHaveLength(3)
  })

  it('formats durations under 60 minutes as "Xmin"', () => {
    useHistoryStore.getState().saveSession({
      id: 's1',
      date: '2026-03-10',
      status: 'completed',
      durationMinutes: 45,
      entries: [],
    })
    render(<TimeStats />)
    expect(screen.getAllByText('45min').length).toBeGreaterThan(0)
  })

  it('formats durations of exactly 60 minutes as "1h"', () => {
    useHistoryStore.getState().saveSession({
      id: 's1',
      date: '2026-03-10',
      status: 'completed',
      durationMinutes: 60,
      entries: [],
    })
    render(<TimeStats />)
    expect(screen.getAllByText('1h').length).toBeGreaterThan(0)
  })

  it('formats durations over 60 minutes with hours and minutes', () => {
    useHistoryStore.getState().saveSession({
      id: 's1',
      date: '2026-03-10',
      status: 'completed',
      durationMinutes: 90,
      entries: [],
    })
    render(<TimeStats />)
    expect(screen.getAllByText('1h 30min').length).toBeGreaterThan(0)
  })
})
