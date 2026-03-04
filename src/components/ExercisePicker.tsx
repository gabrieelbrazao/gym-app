import { useState } from 'react'
import { exercises } from '../data/exercises'
import type { Exercise, MuscleGroup } from '../types'
import MuscleGroupFilter from './MuscleGroupFilter'
import { X, Search } from 'lucide-react'
import { t } from '../i18n'

interface ExercisePickerProps {
  onSelect: (exercise: Exercise) => void
  onClose: () => void
}

export default function ExercisePicker({ onSelect, onClose }: ExercisePickerProps) {
  const [search, setSearch] = useState('')
  const [selectedGroup, setSelectedGroup] = useState<MuscleGroup | null>(null)

  const filtered = exercises.filter((e) => {
    const matchesGroup = selectedGroup === null || e.muscleGroup === selectedGroup
    const matchesSearch = search === '' || e.name.toLowerCase().includes(search.toLowerCase())
    return matchesGroup && matchesSearch
  })

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
      <div className="flex max-h-[80vh] w-full max-w-lg flex-col rounded-t-2xl bg-bg-card">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="font-display text-2xl">{t('picker.title')}</h2>
          <button onClick={onClose} aria-label={t('picker.close')} className="text-text-secondary hover:text-text-primary">
            <X size={20} />
          </button>
        </div>

        <div className="relative p-4">
          <Search size={16} className="absolute left-7 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder={t('picker.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-bg-input py-2 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-secondary focus:border-accent focus:outline-none"
          />
        </div>

        <div className="px-4 pb-2">
          <MuscleGroupFilter selected={selectedGroup} onSelect={setSelectedGroup} />
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {filtered.map((exercise) => (
            <button
              key={exercise.id}
              onClick={() => onSelect(exercise)}
              className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-bg-input"
            >
              <div>
                <p className="text-sm font-medium text-text-primary">{exercise.name}</p>
                <p className="text-xs text-text-secondary capitalize">
                  {t(`muscle.${exercise.muscleGroup}`)} · {t(`equipment.${exercise.equipment}`)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
