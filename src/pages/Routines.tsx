import { Link } from 'react-router-dom'
import { useRoutineStore } from '../stores/useRoutineStore'
import { exercises as exerciseDb } from '../data/exercises'
import { Plus, Trash2, Edit, Dumbbell } from 'lucide-react'
import { t } from '../i18n'
import WeekSchedule from '../components/WeekSchedule'

export default function Routines() {
  const { routines, deleteRoutine } = useRoutineStore()

  const getExerciseName = (exerciseId: string) =>
    exerciseDb.find((e) => e.id === exerciseId)?.name ?? exerciseId

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl">{t('routines.title')}</h1>
        <Link
          to="/routines/new"
          className="flex items-center gap-1 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-bg-primary"
        >
          <Plus size={16} />
          {t('routines.new')}
        </Link>
      </div>

      <WeekSchedule />

      {routines.length === 0 ? (
        <p className="py-12 text-center text-text-secondary">{t('routines.empty')}</p>
      ) : (
        <div className="flex flex-col gap-3">
          {routines.map((routine) => (
            <div
              key={routine.id}
              className="rounded-lg border border-border bg-bg-card p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-xl text-text-primary">{routine.name}</h3>
                  <p className="mt-1 flex items-center gap-1 text-xs text-text-secondary">
                    <Dumbbell size={12} />
                    {routine.exercises.length} {routine.exercises.length !== 1 ? t('common.exercises') : t('common.exercise')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/routines/${routine.id}/edit`}
                    className="text-text-secondary hover:text-accent-blue"
                  >
                    <Edit size={16} />
                  </Link>
                  <button
                    onClick={() => deleteRoutine(routine.id)}
                    aria-label={t('common.deleteRoutine')}
                    className="text-text-secondary hover:text-accent-warm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              {routine.exercises.length > 0 && (
                <ul className="mt-2 flex flex-wrap gap-1">
                  {routine.exercises.map((re, i) => (
                    <li
                      key={`${re.exerciseId}-${i}`}
                      className="rounded bg-bg-input px-2 py-0.5 text-xs text-text-secondary"
                    >
                      {getExerciseName(re.exerciseId)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
