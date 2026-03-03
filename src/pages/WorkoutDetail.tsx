import { useParams, useNavigate } from 'react-router-dom'
import { useHistoryStore } from '../stores/useHistoryStore'
import { exercises as exerciseDb } from '../data/exercises'
import { ArrowLeft } from 'lucide-react'
import { t } from '../i18n'
import { formatDate } from '../lib/formatDate'

export default function WorkoutDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getSessionById } = useHistoryStore()

  const session = id ? getSessionById(id) : undefined

  if (!session) {
    return (
      <div className="flex flex-col gap-4">
        <p className="py-12 text-center text-text-secondary">{t('detail.notFound')}</p>
      </div>
    )
  }

  const getExerciseName = (exerciseId: string) =>
    exerciseDb.find((e) => e.id === exerciseId)?.name ?? exerciseId

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={() => navigate('/history')}
        className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary"
      >
        <ArrowLeft size={16} />
        {t('detail.back')}
      </button>

      <div>
        <h1 className="font-display text-4xl">{t('detail.title')}</h1>
        <p className="text-sm text-text-secondary">{formatDate(session.date)}</p>
      </div>

      {session.entries.map((entry, i) => (
        <div key={`${entry.exerciseId}-${i}`} className="rounded-lg border border-border bg-bg-card p-4">
          <h3 className="mb-2 font-display text-xl text-text-primary">
            {getExerciseName(entry.exerciseId)}
          </h3>
          <div className="flex flex-col gap-1">
            {entry.sets.map((set, j) => (
              <div key={j} className="flex items-center gap-2 text-sm">
                <span className="w-6 text-xs text-text-secondary">{j + 1}</span>
                <span className={set.completed ? 'text-text-primary' : 'text-text-secondary'}>
                  {set.weight} kg × {set.reps}
                </span>
                {set.completed && <span className="text-xs text-accent">✓</span>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
