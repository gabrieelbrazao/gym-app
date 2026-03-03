import { describe, it, expect } from 'vitest'
import { exercises } from './exercises'
import { MUSCLE_GROUPS, EQUIPMENT_TYPES } from '../types'

describe('exercise seed data', () => {
  it('has at least 30 exercises', () => {
    expect(exercises.length).toBeGreaterThanOrEqual(30)
  })

  it('has no duplicate IDs', () => {
    const ids = exercises.map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every exercise has all required fields', () => {
    for (const exercise of exercises) {
      expect(exercise.id).toBeTruthy()
      expect(exercise.name).toBeTruthy()
      expect(exercise.muscleGroup).toBeTruthy()
      expect(exercise.equipment).toBeTruthy()
      expect(exercise.description).toBeTruthy()
    }
  })

  it('every exercise has a valid muscle group', () => {
    for (const exercise of exercises) {
      expect(MUSCLE_GROUPS).toContain(exercise.muscleGroup)
    }
  })

  it('every exercise has a valid equipment type', () => {
    for (const exercise of exercises) {
      expect(EQUIPMENT_TYPES).toContain(exercise.equipment)
    }
  })

  it('covers all muscle groups', () => {
    const groups = new Set(exercises.map((e) => e.muscleGroup))
    for (const group of MUSCLE_GROUPS) {
      expect(groups.has(group)).toBe(true)
    }
  })
})
