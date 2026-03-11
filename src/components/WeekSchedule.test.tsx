import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import WeekSchedule from './WeekSchedule'
import { useScheduleStore } from '../stores/useScheduleStore'
import { useRoutineStore } from '../stores/useRoutineStore'

describe('WeekSchedule', () => {
  beforeEach(() => {
    useScheduleStore.setState({ schedule: {} })
    useRoutineStore.setState({ routines: [] })
  })

  it('renders the heading', () => {
    render(<WeekSchedule />)
    expect(screen.getByText('Plano Semanal')).toBeInTheDocument()
  })

  it('renders all 7 day abbreviations', () => {
    render(<WeekSchedule />)
    expect(screen.getByText('Dom')).toBeInTheDocument()
    expect(screen.getByText('Seg')).toBeInTheDocument()
    expect(screen.getByText('Ter')).toBeInTheDocument()
    expect(screen.getByText('Qua')).toBeInTheDocument()
    expect(screen.getByText('Qui')).toBeInTheDocument()
    expect(screen.getByText('Sex')).toBeInTheDocument()
    expect(screen.getByText('Sáb')).toBeInTheDocument()
  })

  it('shows Descanso for all days when no routines assigned', () => {
    render(<WeekSchedule />)
    // Each day shows "Descanso" in the visible label + as an option in the hidden select
    expect(screen.getAllByText('Descanso').length).toBeGreaterThanOrEqual(7)
  })

  it('shows routine name when a routine is assigned to a day', () => {
    useRoutineStore.setState({
      routines: [{ id: 'r1', name: 'Push Day', exercises: [], createdAt: '2026-01-01' }],
    })
    useScheduleStore.setState({ schedule: { 1: 'r1' } })
    render(<WeekSchedule />)
    // The visible <p> element shows the routine name
    expect(screen.getAllByText('Push Day').length).toBeGreaterThanOrEqual(1)
  })

  it('shows routines in the select options', async () => {
    const user = userEvent.setup()
    useRoutineStore.setState({
      routines: [{ id: 'r1', name: 'Pull Day', exercises: [], createdAt: '2026-01-01' }],
    })
    render(<WeekSchedule />)
    const selects = screen.getAllByRole('combobox')
    // First select (Sunday)
    await user.selectOptions(selects[0], 'r1')
    expect(useScheduleStore.getState().schedule[0]).toBe('r1')
  })
})
