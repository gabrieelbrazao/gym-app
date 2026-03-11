export const MUSCLE_GROUPS = [
  'chest',
  'back',
  'shoulders',
  'biceps',
  'triceps',
  'quads',
  'hamstrings',
  'glutes',
  'calves',
  'core',
  'cardio',
] as const

export type MuscleGroup = (typeof MUSCLE_GROUPS)[number]

export const EQUIPMENT_TYPES = [
  'barbell',
  'dumbbell',
  'machine',
  'cable',
  'bodyweight',
  'kettlebell',
  'band',
] as const

export type Equipment = (typeof EQUIPMENT_TYPES)[number]

export interface Exercise {
  id: string
  name: string
  muscleGroup: MuscleGroup
  equipment: Equipment
  description: string
}

export interface RoutineExercise {
  exerciseId: string
  sets: number
  reps: number
  weight: number
  weights?: number[]
  repsPerSet?: number[]
}

export interface Routine {
  id: string
  name: string
  exercises: RoutineExercise[]
  createdAt: string
}

export interface SetLog {
  reps: number
  weight: number
  completed: boolean
}

export interface WorkoutEntry {
  uid?: string
  exerciseId: string
  sets: SetLog[]
}

export interface WorkoutSession {
  id: string
  routineId?: string
  date: string
  startTime?: string
  durationMinutes?: number
  status: 'in-progress' | 'completed'
  entries: WorkoutEntry[]
}

export type WeekSchedule = Record<number, string | null>

export type MuscleStatus = 'untrained' | 'trained-this-week' | 'trained-today'

export type FatigueStatus = 'ready' | 'resting' | 'fatigued'

export interface MuscleFatigue {
  muscleGroup: MuscleGroup
  lastTrainedDate: string | null
  daysAgo: number | null
  status: FatigueStatus
}
