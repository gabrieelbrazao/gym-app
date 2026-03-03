import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import ActiveWorkout from './ActiveWorkout'
import { useWorkoutStore } from '../stores/useWorkoutStore'
import { useHistoryStore } from '../stores/useHistoryStore'

function renderPage() {
  return render(
    <MemoryRouter>
      <ActiveWorkout />
    </MemoryRouter>
  )
}

describe('ActiveWorkout', () => {
  beforeEach(() => {
    useWorkoutStore.setState({ session: null })
    useHistoryStore.setState({ sessions: [] })
    localStorage.clear()
  })

  it('shows start options when no session is active', () => {
    renderPage()
    expect(screen.getByText('Treino Livre')).toBeInTheDocument()
  })

  it('starts a freestyle workout', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByText('Treino Livre'))
    expect(screen.getByText('Adicionar Exercício')).toBeInTheDocument()
  })

  it('shows exercises in an active session', () => {
    useWorkoutStore.getState().startSession([
      { exerciseId: 'bench-press', sets: 3, reps: 10, restSeconds: 90 },
    ])
    renderPage()

    expect(screen.getByText('Supino Reto')).toBeInTheDocument()
  })

  it('finishes a workout and saves to history', async () => {
    const user = userEvent.setup()
    useWorkoutStore.getState().startSession([
      { exerciseId: 'bench-press', sets: 1, reps: 10, restSeconds: 90 },
    ])
    renderPage()

    await user.click(screen.getByText('Finalizar Treino'))
    expect(useHistoryStore.getState().sessions).toHaveLength(1)
    expect(useWorkoutStore.getState().session).toBeNull()
  })
})
