import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import FatigueMonitor from './FatigueMonitor'
import { useHistoryStore } from '../stores/useHistoryStore'

describe('FatigueMonitor', () => {
  beforeEach(() => {
    useHistoryStore.setState({ sessions: [] })
  })

  it('renders the section heading', () => {
    render(<FatigueMonitor />)
    expect(screen.getByText('Monitor de Fadiga')).toBeInTheDocument()
  })

  it('renders all muscle groups', () => {
    render(<FatigueMonitor />)
    expect(screen.getByText('Peito')).toBeInTheDocument()
    expect(screen.getByText('Costas')).toBeInTheDocument()
    expect(screen.getByText('Ombros')).toBeInTheDocument()
    expect(screen.getByText('Bíceps')).toBeInTheDocument()
    expect(screen.getByText('Tríceps')).toBeInTheDocument()
  })

  it('shows "Pronto" status for all muscles with no history', () => {
    render(<FatigueMonitor />)
    expect(screen.getAllByText('Pronto').length).toBeGreaterThan(0)
  })

  it('shows "Fatigado" for a muscle trained today', () => {
    useHistoryStore.getState().saveSession({
      id: 's1',
      date: '2026-03-10',
      status: 'completed',
      entries: [{ exerciseId: 'bench-press', sets: [{ reps: 10, weight: 60, completed: true }] }],
    })
    render(<FatigueMonitor />)
    expect(screen.getByText('Fatigado')).toBeInTheDocument()
  })
})
