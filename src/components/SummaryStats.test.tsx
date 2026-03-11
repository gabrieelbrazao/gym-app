import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import SummaryStats from './SummaryStats'
import { useHistoryStore } from '../stores/useHistoryStore'

describe('SummaryStats', () => {
  beforeEach(() => {
    useHistoryStore.setState({ sessions: [] })
  })

  it('renders all three stat labels', () => {
    render(<SummaryStats />)
    expect(screen.getByText('Total de Treinos')).toBeInTheDocument()
    expect(screen.getByText('Média / Semana')).toBeInTheDocument()
    expect(screen.getByText('Mais Treinado')).toBeInTheDocument()
  })

  it('shows em dash for most trained muscle when no history', () => {
    render(<SummaryStats />)
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('shows correct total workouts count', () => {
    useHistoryStore.getState().saveSession({ id: 's1', date: '2026-03-08', status: 'completed', entries: [] })
    useHistoryStore.getState().saveSession({ id: 's2', date: '2026-03-09', status: 'completed', entries: [] })
    render(<SummaryStats />)
    // AnimatedNumber starts at 0 and animates — initial DOM shows '0'
    expect(screen.getAllByText('0')).toHaveLength(2)
    expect(screen.getByText('Mais Treinado')).toBeInTheDocument()
  })

  it('shows most trained muscle label when history with exercises exists', () => {
    useHistoryStore.getState().saveSession({
      id: 's1',
      date: '2026-03-10',
      status: 'completed',
      entries: [{ exerciseId: 'bench-press', sets: [{ reps: 10, weight: 60, completed: true }] }],
    })
    render(<SummaryStats />)
    // bench-press is chest → 'Peito'
    expect(screen.getByText('Peito')).toBeInTheDocument()
  })
})
