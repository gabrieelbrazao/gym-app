import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import SetInput from './SetInput'

describe('SetInput', () => {
  const defaultProps = {
    index: 0,
    reps: 10,
    weight: 60,
    completed: false,
    onChange: vi.fn(),
  }

  it('renders set number, reps and weight inputs', () => {
    render(<SetInput {...defaultProps} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByDisplayValue('10')).toBeInTheDocument()
    expect(screen.getByDisplayValue('60')).toBeInTheDocument()
  })

  it('calls onChange when reps input changes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<SetInput {...defaultProps} onChange={onChange} />)

    const repsInput = screen.getByDisplayValue('10')
    await user.clear(repsInput)
    await user.type(repsInput, '12')
    expect(onChange).toHaveBeenCalled()
  })

  it('calls onChange when complete toggle is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<SetInput {...defaultProps} onChange={onChange} />)

    await user.click(screen.getByRole('checkbox'))
    expect(onChange).toHaveBeenCalledWith({ completed: true })
  })

  it('shows completed state visually', () => {
    render(<SetInput {...defaultProps} completed={true} />)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })
})
