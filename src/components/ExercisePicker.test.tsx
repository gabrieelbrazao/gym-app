import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import ExercisePicker from './ExercisePicker'

describe('ExercisePicker', () => {
  it('renders exercises', () => {
    render(<ExercisePicker onSelect={vi.fn()} onClose={vi.fn()} />)
    expect(screen.getByText('Supino Reto')).toBeInTheDocument()
  })

  it('filters exercises by search', async () => {
    const user = userEvent.setup()
    render(<ExercisePicker onSelect={vi.fn()} onClose={vi.fn()} />)

    await user.type(screen.getByPlaceholderText('Buscar...'), 'agachamento')
    expect(screen.getByText('Agachamento')).toBeInTheDocument()
    expect(screen.getByText('Agachamento Búlgaro')).toBeInTheDocument()
    expect(screen.queryByText('Supino Reto')).not.toBeInTheDocument()
  })

  it('calls onSelect with exercise when clicked', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<ExercisePicker onSelect={onSelect} onClose={vi.fn()} />)

    await user.click(screen.getByText('Supino Reto'))
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'bench-press', name: 'Supino Reto' })
    )
  })

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<ExercisePicker onSelect={vi.fn()} onClose={onClose} />)

    await user.click(screen.getByLabelText('Fechar'))
    expect(onClose).toHaveBeenCalled()
  })
})
