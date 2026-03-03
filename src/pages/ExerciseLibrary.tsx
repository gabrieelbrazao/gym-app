import { useState } from 'react'
import { exercises } from '../data/exercises'
import type { MuscleGroup } from '../types'
import ExerciseCard from '../components/ExerciseCard'
import MuscleGroupFilter from '../components/MuscleGroupFilter'
import { Search } from 'lucide-react'
import { t } from '../i18n'

export default function ExerciseLibrary() {
  const [selectedGroup, setSelectedGroup] = useState<MuscleGroup | null>(null)
  const [search, setSearch] = useState('')

  const filtered = exercises.filter((e) => {
    const matchesGroup = selectedGroup === null || e.muscleGroup === selectedGroup
    const matchesSearch =
      search === '' || e.name.toLowerCase().includes(search.toLowerCase())
    return matchesGroup && matchesSearch
  })

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-4xl">{t('exercises.title')}</h1>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
        <input
          type="text"
          placeholder={t('exercises.search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-border bg-bg-input py-2 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-secondary focus:border-accent focus:outline-none"
        />
      </div>

      <MuscleGroupFilter selected={selectedGroup} onSelect={setSelectedGroup} />

      <div className="flex flex-col gap-3">
        {filtered.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-text-secondary">{t('exercises.empty')}</p>
        )}
      </div>
    </div>
  )
}
