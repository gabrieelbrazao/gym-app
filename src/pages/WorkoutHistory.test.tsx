import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import WorkoutHistory from './WorkoutHistory'
import { useHistoryStore } from '../stores/useHistoryStore'

function renderPage() {
  return render(
    <MemoryRouter>
      <WorkoutHistory />
    </MemoryRouter>
  )
}

describe('WorkoutHistory', () => {
  beforeEach(() => {
    localStorage.clear()
    useHistoryStore.setState({ sessions: [] })
  })

  it('renders the page title', () => {
    renderPage()
    expect(screen.getByText('Histórico')).toBeInTheDocument()
  })

  it('shows empty state', () => {
    renderPage()
    expect(screen.getByText('Nenhum treino ainda.')).toBeInTheDocument()
  })

  it('renders past workouts', () => {
    useHistoryStore.getState().saveSession({
      id: 's1',
      date: '2026-03-01',
      status: 'completed',
      entries: [{ exerciseId: 'bench-press', sets: [{ reps: 10, weight: 60, completed: true }] }],
    })
    renderPage()

    expect(screen.getByText('01/03/2026')).toBeInTheDocument()
  })

  it('links to workout detail', () => {
    useHistoryStore.getState().saveSession({
      id: 's1',
      date: '2026-03-01',
      status: 'completed',
      entries: [],
    })
    renderPage()

    expect(screen.getByText('Ver').closest('a')).toHaveAttribute('href', '/history/s1')
  })
})
