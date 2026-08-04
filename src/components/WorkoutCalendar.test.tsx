import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import WorkoutCalendar from './WorkoutCalendar'
import { useHistoryStore } from '../stores/useHistoryStore'

// Fix "today" so tests are date-independent
const TODAY = '2026-03-10'
vi.setSystemTime(new Date(TODAY + 'T12:00:00'))

describe('WorkoutCalendar', () => {
  beforeEach(() => {
    useHistoryStore.setState({ sessions: [] })
  })

  it('renders the section heading', () => {
    render(<WorkoutCalendar />)
    expect(screen.getByText('Calendário de Treinos')).toBeInTheDocument()
  })

  it('renders day-of-week header labels', () => {
    render(<WorkoutCalendar />)
    expect(screen.getByText('Dom')).toBeInTheDocument()
    expect(screen.getByText('Seg')).toBeInTheDocument()
    expect(screen.getByText('Sáb')).toBeInTheDocument()
  })

  it('renders navigation buttons', () => {
    render(<WorkoutCalendar />)
    expect(screen.getByLabelText('Mês anterior')).toBeInTheDocument()
    expect(screen.getByLabelText('Próximo mês')).toBeInTheDocument()
  })

  it('next month button is disabled when viewing current month', () => {
    render(<WorkoutCalendar />)
    expect(screen.getByLabelText('Próximo mês')).toBeDisabled()
  })

  it('navigates to previous month on click', async () => {
    const user = userEvent.setup()
    render(<WorkoutCalendar />)
    // Current month: March 2026
    expect(screen.getByText('Março 2026')).toBeInTheDocument()
    await user.click(screen.getByLabelText('Mês anterior'))
    expect(screen.getByText('Fevereiro 2026')).toBeInTheDocument()
  })

  it('renders the day number for today', () => {
    render(<WorkoutCalendar />)
    // Today is 2026-03-10, so "10" should appear in the grid
    expect(screen.getByText('10')).toBeInTheDocument()
  })
})
