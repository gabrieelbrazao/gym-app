import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import Progress from './Progress'
import { useHistoryStore } from '../stores/useHistoryStore'

vi.setSystemTime(new Date('2026-03-03T12:00:00'))

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

  it('shows streak section with 0 days when no history', () => {
    renderPage()
    expect(screen.getByText('Sequência Atual')).toBeInTheDocument()
    expect(screen.getByText('Melhor Sequência')).toBeInTheDocument()
  })

  it('shows the workout calendar', () => {
    renderPage()
    expect(screen.getByText('Calendário de Treinos')).toBeInTheDocument()
  })

  it('shows summary stats labels', () => {
    renderPage()
    expect(screen.getByText('Total de Treinos')).toBeInTheDocument()
    expect(screen.getByText('Média / Semana')).toBeInTheDocument()
    expect(screen.getByText('Mais Treinado')).toBeInTheDocument()
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
