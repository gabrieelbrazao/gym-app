import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import Progress from './Progress'
import { useHistoryStore } from '../stores/useHistoryStore'

function renderPage() {
  return render(
    <MemoryRouter>
      <Progress />
    </MemoryRouter>
  )
}

describe('Progress', () => {
  beforeEach(() => {
    localStorage.clear()
    useHistoryStore.setState({ sessions: [] })
  })

  it('renders the page title', () => {
    renderPage()
    expect(screen.getByText('Progresso')).toBeInTheDocument()
  })

  it('shows empty state when no history', () => {
    renderPage()
    expect(screen.getByText('Complete alguns treinos para ver seu progresso.')).toBeInTheDocument()
  })

  it('renders personal records when history exists', () => {
    useHistoryStore.getState().saveSession({
      id: 's1',
      date: '2026-03-01',
      status: 'completed',
      entries: [
        { exerciseId: 'bench-press', sets: [{ reps: 10, weight: 80, completed: true }] },
      ],
    })
    renderPage()

    expect(screen.getByText('Recordes Pessoais')).toBeInTheDocument()
    expect(screen.getByText('Supino Reto')).toBeInTheDocument()
    expect(screen.getByText('80 kg')).toBeInTheDocument()
  })
})
