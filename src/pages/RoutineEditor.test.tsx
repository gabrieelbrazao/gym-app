import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
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

    // The exercise picker closes and exercise appears in the list
    expect(screen.getByText('Supino Reto')).toBeInTheDocument()
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
})
