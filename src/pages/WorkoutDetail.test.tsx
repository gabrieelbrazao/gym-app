import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import WorkoutDetail from './WorkoutDetail'
import { useHistoryStore } from '../stores/useHistoryStore'

function renderPage(id: string) {
  return render(
    <MemoryRouter initialEntries={[`/history/${id}`]}>
      <Routes>
        <Route path="/history/:id" element={<WorkoutDetail />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('WorkoutDetail', () => {
  beforeEach(() => {
    localStorage.clear()
    useHistoryStore.setState({ sessions: [] })
  })

  it('shows not found for unknown session', () => {
    renderPage('unknown')
    expect(screen.getByText('Treino não encontrado.')).toBeInTheDocument()
  })

  it('renders workout date', () => {
    useHistoryStore.getState().saveSession({
      id: 's1',
      date: '2026-03-01',
      status: 'completed',
      entries: [{ exerciseId: 'bench-press', sets: [{ reps: 10, weight: 60, completed: true }] }],
    })
    renderPage('s1')

    expect(screen.getByText('01/03/2026')).toBeInTheDocument()
  })

  it('renders exercise names and set details', () => {
    useHistoryStore.getState().saveSession({
      id: 's1',
      date: '2026-03-01',
      status: 'completed',
      entries: [{ exerciseId: 'bench-press', sets: [{ reps: 10, weight: 60, completed: true }] }],
    })
    renderPage('s1')

    expect(screen.getByText('Supino Reto')).toBeInTheDocument()
    expect(screen.getByText('60 kg × 10')).toBeInTheDocument()
  })
})
