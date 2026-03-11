import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import FatigueMonitor from './FatigueMonitor'
import { useHistoryStore } from '../stores/useHistoryStore'

// react-body-highlighter renders a complex SVG; mock it to keep tests fast
vi.mock('react-body-highlighter', () => ({
  default: ({ onClick }: { onClick?: (s: { muscle: string; data: { exercises: string[]; frequency: number } }) => void }) => (
    <div data-testid="body-model">
      <button
        data-testid="muscle-chest"
        onClick={() => onClick?.({ muscle: 'chest', data: { exercises: [], frequency: 1 } })}
      >
        chest
      </button>
    </div>
  ),
}))

describe('FatigueMonitor', () => {
  beforeEach(() => {
    useHistoryStore.setState({ sessions: [] })
  })

  it('renders the section heading', () => {
    render(<FatigueMonitor />)
    expect(screen.getByText('Monitor de Fadiga')).toBeInTheDocument()
  })

  it('renders front/back toggle buttons', () => {
    render(<FatigueMonitor />)
    expect(screen.getByText('Frente')).toBeInTheDocument()
    expect(screen.getByText('Costas')).toBeInTheDocument()
  })

  it('renders the body model', () => {
    render(<FatigueMonitor />)
    expect(screen.getByTestId('body-model')).toBeInTheDocument()
  })

  it('renders legend with all three statuses', () => {
    render(<FatigueMonitor />)
    // Use getAllByText since 'Pronto' may appear in both legend and cardio chip
    expect(screen.getAllByText('Pronto').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Descansando')).toBeInTheDocument()
    expect(screen.getByText('Fatigado')).toBeInTheDocument()
  })

  it('shows detail card when a muscle is clicked', () => {
    render(<FatigueMonitor />)
    fireEvent.click(screen.getByTestId('muscle-chest'))
    expect(screen.getByText('Peito')).toBeInTheDocument()
  })

  it('shows "Fatigado" in detail card for a muscle trained today', () => {
    useHistoryStore.getState().saveSession({
      id: 's1',
      date: '2026-03-10',
      status: 'completed',
      entries: [{ exerciseId: 'bench-press', sets: [{ reps: 10, weight: 60, completed: true }] }],
    })
    render(<FatigueMonitor />)
    fireEvent.click(screen.getByTestId('muscle-chest'))
    // 'Fatigado' appears in legend + detail card badge
    expect(screen.getAllByText('Fatigado').length).toBeGreaterThanOrEqual(2)
  })

  it('renders cardio chip', () => {
    render(<FatigueMonitor />)
    expect(screen.getByText('Cardio')).toBeInTheDocument()
  })
})
