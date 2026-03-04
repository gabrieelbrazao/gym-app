import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import Routines from './Routines'
import { useRoutineStore } from '../stores/useRoutineStore'

function renderPage() {
  return render(
    <MemoryRouter>
      <Routines />
    </MemoryRouter>
  )
}

describe('Routines', () => {
  beforeEach(() => {
    localStorage.clear()
    useRoutineStore.setState({ routines: [] })
  })

  it('renders the page title', () => {
    renderPage()
    expect(screen.getByText('Rotinas')).toBeInTheDocument()
  })

  it('shows empty state when no routines exist', () => {
    renderPage()
    expect(screen.getByText('Nenhuma rotina ainda.')).toBeInTheDocument()
  })

  it('renders routines from the store', () => {
    useRoutineStore.getState().addRoutine({ name: 'Push Day', exercises: [] })
    useRoutineStore.getState().addRoutine({ name: 'Pull Day', exercises: [] })
    renderPage()

    expect(screen.getByText('Push Day')).toBeInTheDocument()
    expect(screen.getByText('Pull Day')).toBeInTheDocument()
  })

  it('shows plural exercise count', () => {
    useRoutineStore.getState().addRoutine({
      name: 'Push Day',
      exercises: [
        { exerciseId: 'bench-press', sets: 3, reps: 10, weight: 0 },
        { exerciseId: 'squat', sets: 4, reps: 8, weight: 0 },
      ],
    })
    renderPage()

    expect(screen.getByText(/exercícios/)).toBeInTheDocument()
  })

  it('shows singular exercise count', () => {
    useRoutineStore.getState().addRoutine({
      name: 'Push Day',
      exercises: [{ exerciseId: 'bench-press', sets: 3, reps: 10, weight: 0 }],
    })
    renderPage()

    expect(screen.getByText(/exercício/)).toBeInTheDocument()
    expect(screen.queryByText(/exercícios/)).not.toBeInTheDocument()
  })

  it('shows exercise chips for routines with exercises', () => {
    useRoutineStore.getState().addRoutine({
      name: 'Push Day',
      exercises: [
        { exerciseId: 'bench-press', sets: 3, reps: 10, weight: 0 },
        { exerciseId: 'squat', sets: 4, reps: 8, weight: 0 },
      ],
    })
    renderPage()

    expect(screen.getByText('Supino Reto')).toBeInTheDocument()
    expect(screen.getByText('Agachamento')).toBeInTheDocument()
  })

  it('does not show exercise list for routines with no exercises', () => {
    useRoutineStore.getState().addRoutine({ name: 'Empty Routine', exercises: [] })
    renderPage()

    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('deletes a routine when delete is clicked', async () => {
    const user = userEvent.setup()
    useRoutineStore.getState().addRoutine({ name: 'Push Day', exercises: [] })
    renderPage()

    await user.click(screen.getByLabelText('Excluir rotina'))
    expect(screen.queryByText('Push Day')).not.toBeInTheDocument()
    expect(useRoutineStore.getState().routines).toHaveLength(0)
  })

  it('has a link to create a new routine', () => {
    renderPage()
    const link = screen.getByText('Nova Rotina')
    expect(link.closest('a')).toHaveAttribute('href', '/routines/new')
  })

  it('has an edit link for each routine', () => {
    useRoutineStore.getState().addRoutine({ name: 'Push Day', exercises: [] })
    renderPage()

    const id = useRoutineStore.getState().routines[0].id
    const editLink = screen.getByRole('link', { name: '' })
    expect(editLink).toHaveAttribute('href', `/routines/${id}/edit`)
  })
})
