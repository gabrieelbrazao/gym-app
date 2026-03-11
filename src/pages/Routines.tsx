import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useRoutineStore } from '../stores/useRoutineStore'
import { exercises as exerciseDb } from '../data/exercises'
import { Plus, Trash2, Dumbbell } from 'lucide-react'
import { t } from '../i18n'
import WeekSchedule from '../components/WeekSchedule'
import ConfirmDialog from '../components/ConfirmDialog'

export default function Routines() {
  const { routines, deleteRoutine } = useRoutineStore()
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

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
            <div key={routine.id} className="relative rounded-lg border border-border bg-bg-card p-4">
              <Link to={`/routines/${routine.id}/edit`} className="block">
                <div className="flex items-start justify-between pr-8">
                  <div>
                    <h3 className="font-display text-xl text-text-primary">{routine.name}</h3>
                    <p className="mt-1 flex items-center gap-1 text-xs text-text-secondary">
                      <Dumbbell size={12} />
                      {routine.exercises.length} {routine.exercises.length !== 1 ? t('common.exercises') : t('common.exercise')}
                    </p>
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
              </Link>
              <button
                onClick={() => setPendingDeleteId(routine.id)}
                aria-label={t('common.deleteRoutine')}
                className="absolute right-4 top-4 text-text-secondary hover:text-accent-warm"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {pendingDeleteId && (
        <ConfirmDialog
          title={t('confirm.deleteRoutineTitle')}
          description={t('confirm.deleteRoutineDesc')}
          onConfirm={() => { deleteRoutine(pendingDeleteId); setPendingDeleteId(null) }}
          onCancel={() => setPendingDeleteId(null)}
        />
      )}
    </div>
  )
}
