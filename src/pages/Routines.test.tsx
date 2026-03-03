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
})
