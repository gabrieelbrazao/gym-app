import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import ExerciseLibrary from './ExerciseLibrary'

function renderPage() {
  return render(
    <MemoryRouter>
      <ExerciseLibrary />
    </MemoryRouter>
  )
}

describe('ExerciseLibrary', () => {
  it('renders the page title', () => {
    renderPage()
    expect(screen.getByText('Exercícios')).toBeInTheDocument()
  })

  it('renders exercise cards', () => {
    renderPage()
    expect(screen.getByText('Supino Reto')).toBeInTheDocument()
    expect(screen.getByText('Agachamento')).toBeInTheDocument()
  })

  it('filters exercises by muscle group', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: 'Peito' }))
    expect(screen.getByText('Supino Reto')).toBeInTheDocument()
    expect(screen.queryByText('Agachamento')).not.toBeInTheDocument()
  })

  it('shows all exercises when "All" is clicked', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: 'Peito' }))
    await user.click(screen.getByRole('button', { name: 'Todos' }))
    expect(screen.getByText('Supino Reto')).toBeInTheDocument()
    expect(screen.getByText('Agachamento')).toBeInTheDocument()
  })

  it('filters exercises by search text', async () => {
    const user = userEvent.setup()
    renderPage()

    const search = screen.getByPlaceholderText('Buscar exercícios...')
    await user.type(search, 'supino')
    expect(screen.getByText('Supino Reto')).toBeInTheDocument()
    expect(screen.getByText('Supino Inclinado')).toBeInTheDocument()
    expect(screen.queryByText('Agachamento')).not.toBeInTheDocument()
  })
})
