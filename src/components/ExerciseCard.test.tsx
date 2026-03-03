import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ExerciseCard from './ExerciseCard'
import type { Exercise } from '../types'

const mockExercise: Exercise = {
  id: 'bench-press',
  name: 'Bench Press',
  muscleGroup: 'chest',
  equipment: 'barbell',
  description: 'Lie on a flat bench, lower the bar to your chest, then press up.',
}

describe('ExerciseCard', () => {
  it('renders the exercise name', () => {
    render(<ExerciseCard exercise={mockExercise} />)
    expect(screen.getByText('Bench Press')).toBeInTheDocument()
  })

  it('renders the muscle group', () => {
    render(<ExerciseCard exercise={mockExercise} />)
    expect(screen.getByText('Peito')).toBeInTheDocument()
  })

  it('renders the equipment type', () => {
    render(<ExerciseCard exercise={mockExercise} />)
    expect(screen.getByText('Barra')).toBeInTheDocument()
  })

  it('renders the description', () => {
    render(<ExerciseCard exercise={mockExercise} />)
    expect(screen.getByText(mockExercise.description)).toBeInTheDocument()
  })
})
