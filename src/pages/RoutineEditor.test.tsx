import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import RoutineEditor from './RoutineEditor'
import { useRoutineStore } from '../stores/useRoutineStore'

function renderEditor() {
  return render(
    <MemoryRouter>
      <RoutineEditor />
    </MemoryRouter>
  )
}

function renderEditorWithId(routineId: string) {
  return render(
    <MemoryRouter initialEntries={[`/routines/${routineId}/edit`]}>
      <Routes>
        <Route path="/routines/:id/edit" element={<RoutineEditor />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('RoutineEditor', () => {
  beforeEach(() => {
    localStorage.clear()
    useRoutineStore.setState({ routines: [] })
  })

  it('renders the routine name input', () => {
    renderEditor()
    expect(screen.getByPlaceholderText('Nome da rotina')).toBeInTheDocument()
  })

  it('renders the add exercise button', () => {
    renderEditor()
    expect(screen.getByText('Adicionar Exercício')).toBeInTheDocument()
  })

  it('save button is disabled when name is empty', () => {
    renderEditor()
    expect(screen.getByText('Salvar Rotina')).toBeDisabled()
  })

  it('opens exercise picker when add button is clicked', async () => {
    const user = userEvent.setup()
    renderEditor()

    await user.click(screen.getByText('Adicionar Exercício'))
    expect(screen.getByText('Supino Reto')).toBeInTheDocument()
  })

  it('adds an exercise to the routine', async () => {
    const user = userEvent.setup()
    renderEditor()

    await user.click(screen.getByText('Adicionar Exercício'))
    await user.click(screen.getByText('Supino Reto'))

    expect(screen.getByText('Supino Reto')).toBeInTheDocument()
  })

  it('removes an exercise from the routine', async () => {
    const user = userEvent.setup()
    renderEditor()

    await user.click(screen.getByText('Adicionar Exercício'))
    await user.click(screen.getByText('Supino Reto'))

    const deleteBtn = screen.getByLabelText('Remover exercício')
    await user.click(deleteBtn)

    expect(screen.queryByText('Supino Reto')).not.toBeInTheDocument()
  })

  it('saves a routine with a name and exercises', async () => {
    const user = userEvent.setup()
    renderEditor()

    await user.type(screen.getByPlaceholderText('Nome da rotina'), 'Push Day')
    await user.click(screen.getByText('Adicionar Exercício'))
    await user.click(screen.getByText('Supino Reto'))
    await user.click(screen.getByText('Salvar Rotina'))

    const routines = useRoutineStore.getState().routines
    expect(routines).toHaveLength(1)
    expect(routines[0].name).toBe('Push Day')
    expect(routines[0].exercises).toHaveLength(1)
  })

  it('pre-fills name and exercises when editing an existing routine', () => {
    useRoutineStore.getState().addRoutine({
      name: 'Push Day',
      exercises: [{ exerciseId: 'bench-press', sets: 3, reps: 10, weight: 0 }],
    })
    const id = useRoutineStore.getState().routines[0].id

    renderEditorWithId(id)

    expect(screen.getByDisplayValue('Push Day')).toBeInTheDocument()
    expect(screen.getByText('Supino Reto')).toBeInTheDocument()
    expect(screen.getByText('Editar Rotina')).toBeInTheDocument()
  })

  it('updates an existing routine', async () => {
    const user = userEvent.setup()
    useRoutineStore.getState().addRoutine({ name: 'Push Day', exercises: [] })
    const id = useRoutineStore.getState().routines[0].id

    renderEditorWithId(id)

    const nameInput = screen.getByDisplayValue('Push Day')
    await user.clear(nameInput)
    await user.type(nameInput, 'Push Day V2')
    await user.click(screen.getByText('Salvar Rotina'))

    expect(useRoutineStore.getState().routines[0].name).toBe('Push Day V2')
  })

  it('expands per-set section and saves repsPerSet and weights arrays', async () => {
    const user = userEvent.setup()
    renderEditor()

    await user.type(screen.getByPlaceholderText('Nome da rotina'), 'Test')
    await user.click(screen.getByText('Adicionar Exercício'))
    await user.click(screen.getByText('Supino Reto'))
    await user.click(screen.getByText('Por série'))
    await user.click(screen.getByText('Salvar Rotina'))

    const exercise = useRoutineStore.getState().routines[0].exercises[0]
    expect(exercise.repsPerSet).toHaveLength(3)
    expect(exercise.weights).toHaveLength(3)
    expect(exercise.repsPerSet![0]).toBe(10) // default reps
    expect(exercise.weights![0]).toBe(0)     // default weight
  })

  it('collapses per-set section when toggled again', async () => {
    const user = userEvent.setup()
    renderEditor()

    await user.click(screen.getByText('Adicionar Exercício'))
    await user.click(screen.getByText('Supino Reto'))

    // open
    await user.click(screen.getByText('Por série'))
    expect(screen.getAllByText('Reps').length).toBeGreaterThan(1)

    // close
    await user.click(screen.getByText('Por série'))
    expect(screen.getAllByText('Reps')).toHaveLength(1)
  })

  it('renders a drag handle for each added exercise', async () => {
    const user = userEvent.setup()
    renderEditor()

    await user.click(screen.getByText('Adicionar Exercício'))
    await user.click(screen.getByText('Supino Reto'))
    await user.click(screen.getByText('Adicionar Exercício'))
    await user.click(screen.getByText('Agachamento'))

    expect(screen.getAllByLabelText('Reordenar exercício')).toHaveLength(2)
  })
})
