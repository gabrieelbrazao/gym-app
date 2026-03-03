import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import MuscleGroupFilter from './MuscleGroupFilter'

describe('MuscleGroupFilter', () => {
  it('renders a "Todos" button plus all muscle groups in Portuguese', () => {
    render(<MuscleGroupFilter selected={null} onSelect={vi.fn()} />)
    expect(screen.getByText('Todos')).toBeInTheDocument()
    expect(screen.getByText('Peito')).toBeInTheDocument()
    expect(screen.getByText('Costas')).toBeInTheDocument()
    expect(screen.getByText('Quadríceps')).toBeInTheDocument()
  })

  it('calls onSelect with the English muscle group key when clicked', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<MuscleGroupFilter selected={null} onSelect={onSelect} />)

    await user.click(screen.getByText('Peito'))
    expect(onSelect).toHaveBeenCalledWith('chest')
  })

  it('calls onSelect with null when "Todos" is clicked', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<MuscleGroupFilter selected="chest" onSelect={onSelect} />)

    await user.click(screen.getByText('Todos'))
    expect(onSelect).toHaveBeenCalledWith(null)
  })

  it('highlights the selected muscle group', () => {
    render(<MuscleGroupFilter selected="back" onSelect={vi.fn()} />)
    const backButton = screen.getByText('Costas')
    expect(backButton.className).toContain('bg-accent')
  })
})
