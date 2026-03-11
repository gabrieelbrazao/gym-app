import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import RestTimer from './RestTimer'

function makeTimer(overrides: Partial<Parameters<typeof RestTimer>[0]['timer']> = {}) {
  return {
    remaining: 0,
    isRunning: false,
    duration: 60,
    start: vi.fn(),
    skip: vi.fn(),
    setDuration: vi.fn(),
    ...overrides,
  }
}

describe('RestTimer', () => {
  it('renders nothing when not running and remaining is 0', () => {
    const { container } = render(<RestTimer timer={makeTimer()} />)
    expect(container.firstChild).toBeNull()
  })

  it('shows the timer UI when isRunning is true', () => {
    render(<RestTimer timer={makeTimer({ isRunning: true, remaining: 45 })} />)
    expect(screen.getByText('Descanso')).toBeInTheDocument()
    expect(screen.getByText('Pular')).toBeInTheDocument()
  })

  it('shows the timer UI when remaining > 0 even if not running', () => {
    render(<RestTimer timer={makeTimer({ isRunning: false, remaining: 10 })} />)
    expect(screen.getByText('Descanso')).toBeInTheDocument()
  })

  it('renders all four preset buttons', () => {
    render(<RestTimer timer={makeTimer({ isRunning: true, remaining: 60 })} />)
    expect(screen.getByText('30s')).toBeInTheDocument()
    expect(screen.getByText('60s')).toBeInTheDocument()
    expect(screen.getByText('90s')).toBeInTheDocument()
    expect(screen.getByText('120s')).toBeInTheDocument()
  })

  it('formats remaining time correctly', () => {
    render(<RestTimer timer={makeTimer({ isRunning: true, remaining: 90 })} />)
    expect(screen.getByText('1:30')).toBeInTheDocument()
  })

  it('calls skip when skip button is clicked', async () => {
    const user = userEvent.setup()
    const skip = vi.fn()
    render(<RestTimer timer={makeTimer({ isRunning: true, remaining: 30, skip })} />)
    await user.click(screen.getByText('Pular'))
    expect(skip).toHaveBeenCalledOnce()
  })

  it('calls start and setDuration when a preset is clicked', async () => {
    const user = userEvent.setup()
    const start = vi.fn()
    const setDuration = vi.fn()
    render(<RestTimer timer={makeTimer({ isRunning: true, remaining: 60, start, setDuration })} />)
    await user.click(screen.getByText('30s'))
    expect(setDuration).toHaveBeenCalledWith(30)
    expect(start).toHaveBeenCalledWith(30)
  })
})
