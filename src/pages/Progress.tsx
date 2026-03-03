import { useMemo } from 'react'
import { useHistoryStore } from '../stores/useHistoryStore'
import { exercises as exerciseDb } from '../data/exercises'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Trophy } from 'lucide-react'
import { t } from '../i18n'
import { formatDate } from '../lib/formatDate'
import FatigueMonitor from '../components/FatigueMonitor'

interface PersonalRecord {
  exerciseName: string
  maxWeight: number
}

export default function Progress() {
  const { sessions } = useHistoryStore()

  const personalRecords = useMemo<PersonalRecord[]>(() => {
    const prMap = new Map<string, number>()

    for (const session of sessions) {
      for (const entry of session.entries) {
        for (const set of entry.sets) {
          if (!set.completed) continue
          const current = prMap.get(entry.exerciseId) ?? 0
          if (set.weight > current) {
            prMap.set(entry.exerciseId, set.weight)
          }
        }
      }
    }

    return Array.from(prMap.entries())
      .map(([id, maxWeight]) => ({
        exerciseName: exerciseDb.find((e) => e.id === id)?.name ?? id,
        maxWeight,
      }))
      .sort((a, b) => b.maxWeight - a.maxWeight)
  }, [sessions])

  const volumeData = useMemo(() => {
    return sessions
      .slice(0, 10)
      .reverse()
      .map((session) => {
        const totalVolume = session.entries.reduce((sum, entry) => {
          return sum + entry.sets.reduce((s, set) => {
            return s + (set.completed ? set.weight * set.reps : 0)
          }, 0)
        }, 0)
        return { date: formatDate(session.date), volume: totalVolume }
      })
  }, [sessions])

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="font-display text-4xl">{t('progress.title')}</h1>
        <p className="py-12 text-center text-text-secondary">
          {t('progress.empty')}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-4xl">{t('progress.title')}</h1>

      <FatigueMonitor />

      {volumeData.length > 1 && (
        <div className="rounded-lg border border-border bg-bg-card p-4">
          <h2 className="mb-3 font-display text-2xl">{t('progress.volume')}</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={volumeData}>
              <XAxis
                dataKey="date"
                tick={{ fill: '#8888A0', fontSize: 10 }}
                tickFormatter={(v: string) => v.slice(0, 5)}
              />
              <YAxis tick={{ fill: '#8888A0', fontSize: 10 }} width={40} />
              <Tooltip
                contentStyle={{ background: '#14141F', border: '1px solid #2A2A3A', borderRadius: 8 }}
                labelStyle={{ color: '#F0F0F5' }}
                itemStyle={{ color: '#00E676' }}
              />
              <Bar dataKey="volume" fill="#00E676" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="rounded-lg border border-border bg-bg-card p-4">
        <h2 className="mb-3 flex items-center gap-2 font-display text-2xl">
          <Trophy size={20} className="text-accent" />
          {t('progress.records')}
        </h2>
        <div className="flex flex-col gap-2">
          {personalRecords.map((pr) => (
            <div
              key={pr.exerciseName}
              className="flex items-center justify-between rounded-lg bg-bg-input px-3 py-2"
            >
              <span className="text-sm text-text-primary">{pr.exerciseName}</span>
              <span className="text-sm font-medium text-accent">{pr.maxWeight} {t('progress.kg')}</span>
            </div>
          ))}
          {personalRecords.length === 0 && (
            <p className="text-sm text-text-secondary">{t('progress.noRecords')}</p>
          )}
        </div>
      </div>
    </div>
  )
}
