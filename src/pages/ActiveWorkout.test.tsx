import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import ActiveWorkout from './ActiveWorkout'
import { useWorkoutStore } from '../stores/useWorkoutStore'
import { useHistoryStore } from '../stores/useHistoryStore'
import { useRoutineStore } from '../stores/useRoutineStore'

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
    useRoutineStore.setState({ routines: [] })
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
    renderPage()
    // start session after mount (useEffect clears any pre-existing session)
    act(() => {
      useWorkoutStore.getState().startSession([
        { exerciseId: 'bench-press', sets: 3, reps: 10, weight: 0 },
      ])
    })

    expect(screen.getByText('Supino Reto')).toBeInTheDocument()
  })

  it('finishes a workout and saves to history', async () => {
    const user = userEvent.setup()
    renderPage()
    act(() => {
      useWorkoutStore.getState().startSession([
        { exerciseId: 'bench-press', sets: 1, reps: 10, weight: 0 },
      ])
    })

    await user.click(screen.getByText('Finalizar Treino'))
    expect(useHistoryStore.getState().sessions).toHaveLength(1)
    expect(useWorkoutStore.getState().session).toBeNull()
  })

  it('shows available routines on the start screen', () => {
    useRoutineStore.getState().addRoutine({
      name: 'Push Day',
      exercises: [{ exerciseId: 'bench-press', sets: 3, reps: 10, weight: 0 }],
    })
    renderPage()

    expect(screen.getByText('Push Day')).toBeInTheDocument()
    expect(screen.getByText('Ou comece a partir de uma rotina:')).toBeInTheDocument()
  })

  it('starts a session from a routine button', async () => {
    const user = userEvent.setup()
    useRoutineStore.getState().addRoutine({
      name: 'Push Day',
      exercises: [{ exerciseId: 'bench-press', sets: 3, reps: 10, weight: 0 }],
    })
    renderPage()

    await user.click(screen.getByText('Push Day'))
    expect(screen.getByText('Supino Reto')).toBeInTheDocument()
    expect(screen.getByText('Finalizar Treino')).toBeInTheDocument()
  })

  it('adds an exercise during an active workout via the picker', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByText('Treino Livre'))
    await user.click(screen.getByText('Adicionar Exercício'))
    await user.click(screen.getByText('Supino Reto'))

    expect(screen.getByText('Supino Reto')).toBeInTheDocument()
    expect(useWorkoutStore.getState().session!.entries).toHaveLength(1)
  })

  it('adds a set to an exercise during workout', async () => {
    const user = userEvent.setup()
    renderPage()
    act(() => {
      useWorkoutStore.getState().startSession([
        { exerciseId: 'bench-press', sets: 1, reps: 10, weight: 0 },
      ])
    })

    await user.click(screen.getByText('Adicionar Série'))
    expect(useWorkoutStore.getState().session!.entries[0].sets).toHaveLength(2)
  })
})
