import { Link } from 'react-router-dom'
import { useHistoryStore } from '../stores/useHistoryStore'
import { exercises as exerciseDb } from '../data/exercises'
import { Calendar, ChevronRight } from 'lucide-react'
import { t } from '../i18n'
import { formatDate } from '../lib/formatDate'

export default function WorkoutHistory() {
  const { sessions } = useHistoryStore()

  const getExerciseNames = (session: (typeof sessions)[0]) =>
    session.entries
      .map((e) => exerciseDb.find((ex) => ex.id === e.exerciseId)?.name ?? e.exerciseId)
      .join(', ')

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-4xl">{t('history.title')}</h1>

      {sessions.length === 0 ? (
        <p className="py-12 text-center text-text-secondary">{t('history.empty')}</p>
      ) : (
        <div className="flex flex-col gap-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="rounded-lg border border-border bg-bg-card p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="flex items-center gap-2 text-sm font-medium text-text-primary">
                    <Calendar size={14} className="text-text-secondary" />
                    {formatDate(session.date)}
                  </p>
                  <p className="mt-1 text-xs text-text-secondary">
                    {session.entries.length} {session.entries.length !== 1 ? t('common.exercises') : t('common.exercise')} · {getExerciseNames(session)}
                  </p>
                </div>
                <Link
                  to={`/history/${session.id}`}
                  className="flex items-center gap-1 text-sm text-accent-blue hover:text-accent"
                >
                  {t('history.view')}
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
