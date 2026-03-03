import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import Dashboard from './Dashboard'
import { useHistoryStore } from '../stores/useHistoryStore'

function renderPage() {
  return render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  )
}

describe('Dashboard', () => {
  beforeEach(() => {
    localStorage.clear()
    useHistoryStore.setState({ sessions: [] })
  })

  it('renders the welcome heading', () => {
    renderPage()
    expect(screen.getByText('Painel')).toBeInTheDocument()
  })

  it('has a start workout button', () => {
    renderPage()
    const link = screen.getByText('Iniciar Treino')
    expect(link.closest('a')).toHaveAttribute('href', '/workout')
  })

  it('shows total workouts stat', () => {
    useHistoryStore.getState().saveSession({
      id: 's1',
      date: '2026-03-01',
      status: 'completed',
      entries: [],
    })
    renderPage()

    expect(screen.getByText('Total de Treinos')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('shows recent workouts', () => {
    useHistoryStore.getState().saveSession({
      id: 's1',
      date: '2026-03-01',
      status: 'completed',
      entries: [{ exerciseId: 'bench-press', sets: [{ reps: 10, weight: 60, completed: true }] }],
    })
    renderPage()

    expect(screen.getByText('Treinos Recentes')).toBeInTheDocument()
  })
})
