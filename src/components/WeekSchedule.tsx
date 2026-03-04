import { motion } from 'framer-motion'
import { useScheduleStore } from '../stores/useScheduleStore'
import { useRoutineStore } from '../stores/useRoutineStore'
import { t } from '../i18n'
import { staggerContainer, staggerItem } from '../lib/motion'

const TODAY = new Date().getDay()

export default function WeekSchedule() {
  const { schedule, setDay } = useScheduleStore()
  const { routines } = useRoutineStore()

  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-display text-2xl">{t('schedule.title')}</h2>
      <motion.div
        className="grid grid-cols-7 gap-1.5"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {Array.from({ length: 7 }, (_, i) => {
          const isToday = i === TODAY
          const assignedId = schedule[i]
          const routine = assignedId ? routines.find((r) => r.id === assignedId) : null

          return (
            <motion.div key={i} variants={staggerItem} className="flex flex-col">
              <span
                className={`mb-1 text-center text-xs font-medium ${
                  isToday ? 'text-accent' : 'text-text-secondary'
                }`}
              >
                {t(`day.${i}`)}
                {isToday && (
                  <span className="ml-0.5 inline-block h-1 w-1 rounded-full bg-accent align-middle" />
                )}
              </span>
              <div
                className={`relative rounded-lg border p-1.5 text-center ${
                  isToday
                    ? 'border-accent/60 bg-accent/5'
                    : 'border-border bg-bg-card'
                }`}
              >
                <select
                  value={assignedId ?? ''}
                  onChange={(e) => setDay(i, e.target.value || null)}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  aria-label={t(`day.${i}`)}
                >
                  <option value="">{t('schedule.rest')}</option>
                  {routines.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
                <p
                  className={`truncate text-xs leading-tight ${
                    routine ? 'text-text-primary' : 'text-text-secondary'
                  }`}
                  title={routine?.name}
                >
                  {routine ? routine.name : t('schedule.rest')}
                </p>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
