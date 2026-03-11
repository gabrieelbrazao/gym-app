import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { useWorkoutStore } from '../stores/useWorkoutStore'
import { useHistoryStore } from '../stores/useHistoryStore'
import { useRoutineStore } from '../stores/useRoutineStore'
import { useScheduleStore } from '../stores/useScheduleStore'
import ConfirmDialog from '../components/ConfirmDialog'
import { t } from '../i18n'

export default function Settings() {
  const navigate = useNavigate()
  const [confirmReset, setConfirmReset] = useState(false)

  const resetWorkout = useWorkoutStore((s) => s.reset)
  const resetHistory = useHistoryStore((s) => s.reset)
  const resetRoutines = useRoutineStore((s) => s.reset)
  const resetSchedule = useScheduleStore((s) => s.reset)

  const handleReset = () => {
    resetWorkout()
    resetHistory()
    resetRoutines()
    resetSchedule()
    setConfirmReset(false)
    navigate('/')
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-4xl">{t('settings.title')}</h1>

      <section className="flex flex-col gap-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-accent-warm">
          <AlertTriangle size={14} />
          {t('settings.dangerZone')}
        </h2>

        <div className="rounded-xl border border-accent-warm/30 bg-bg-card p-4">
          <p className="font-medium text-text-primary">{t('settings.resetTitle')}</p>
          <p className="mt-1 text-sm text-text-secondary">{t('settings.resetDesc')}</p>
          <button
            onClick={() => setConfirmReset(true)}
            className="mt-4 w-full rounded-lg border border-accent-warm py-2.5 text-sm font-medium text-accent-warm transition-colors hover:bg-accent-warm/10"
          >
            {t('settings.resetButton')}
          </button>
        </div>
      </section>

      {confirmReset && (
        <ConfirmDialog
          title={t('confirm.resetTitle')}
          description={t('confirm.resetDesc')}
          confirmLabel={t('confirm.resetConfirm')}
          onConfirm={handleReset}
          onCancel={() => setConfirmReset(false)}
        />
      )}
    </div>
  )
}
