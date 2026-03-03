import { MUSCLE_GROUPS, type MuscleGroup } from '../types'
import { t } from '../i18n'

interface MuscleGroupFilterProps {
  selected: MuscleGroup | null
  onSelect: (group: MuscleGroup | null) => void
}

export default function MuscleGroupFilter({ selected, onSelect }: MuscleGroupFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
          selected === null
            ? 'bg-accent text-bg-primary'
            : 'bg-bg-input text-text-secondary hover:text-text-primary'
        }`}
        onClick={() => onSelect(null)}
      >
        {t('exercises.all')}
      </button>
      {MUSCLE_GROUPS.map((group) => (
        <button
          key={group}
          className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
            selected === group
              ? 'bg-accent text-bg-primary'
              : 'bg-bg-input text-text-secondary hover:text-text-primary'
          }`}
          onClick={() => onSelect(group)}
        >
          {t(`muscle.${group}`)}
        </button>
      ))}
    </div>
  )
}
