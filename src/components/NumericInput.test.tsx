import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import NumericInput from './NumericInput'

describe('NumericInput', () => {
  it('renders with the initial value', () => {
    render(<NumericInput value={42} onChange={vi.fn()} />)
    expect(screen.getByRole('spinbutton')).toHaveValue(42)
  })

  it('commits value on blur', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<NumericInput value={0} onChange={onChange} />)

    const input = screen.getByRole('spinbutton')
    await user.clear(input)
    await user.type(input, '15')
    await user.tab()

    expect(onChange).toHaveBeenCalledWith(15)
  })

  it('does not call onChange while typing (only on blur)', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<NumericInput value={0} onChange={onChange} />)

    const input = screen.getByRole('spinbutton')
    await user.clear(input)
    await user.type(input, '5')

    expect(onChange).not.toHaveBeenCalled()
  })

  it('defaults to 0 when cleared and blurred (NaN)', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<NumericInput value={5} onChange={onChange} />)

    const input = screen.getByRole('spinbutton')
    await user.clear(input)
    await user.tab()

    expect(onChange).toHaveBeenCalledWith(0)
  })

  it('clamps to min when value is below min on blur', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<NumericInput value={5} min={1} onChange={onChange} />)

    const input = screen.getByRole('spinbutton')
    await user.clear(input)
    await user.type(input, '-3')
    await user.tab()

    expect(onChange).toHaveBeenCalledWith(1)
  })

  it('accepts 0 when min is 0', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<NumericInput value={10} min={0} onChange={onChange} />)

    const input = screen.getByRole('spinbutton')
    await user.clear(input)
    await user.type(input, '0')
    await user.tab()

    expect(onChange).toHaveBeenCalledWith(0)
  })

  it('syncs to external value when not focused', async () => {
    const onChange = vi.fn()
    const { rerender } = render(<NumericInput value={10} onChange={onChange} />)

    rerender(<NumericInput value={99} onChange={onChange} />)

    expect(screen.getByRole('spinbutton')).toHaveValue(99)
  })

  it('does not sync external value while focused', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { rerender } = render(<NumericInput value={10} onChange={onChange} />)

    await user.click(screen.getByRole('spinbutton'))
    rerender(<NumericInput value={99} onChange={onChange} />)

    // Still shows 10 because the field is focused
    expect(screen.getByRole('spinbutton')).toHaveValue(10)
  })

  it('passes aria-label to the input', () => {
    render(<NumericInput value={0} onChange={vi.fn()} aria-label="Weight" />)
    expect(screen.getByRole('spinbutton', { name: 'Weight' })).toBeInTheDocument()
  })
})
