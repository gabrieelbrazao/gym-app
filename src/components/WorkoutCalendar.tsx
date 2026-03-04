import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useWorkoutStats } from '../hooks/useWorkoutStats'
import { t } from '../i18n'

const calendarVariants = {
  enter: (dir: number) => ({ x: dir * 40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -40, opacity: 0 }),
}

const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

function formatMonthYear(date: Date): string {
  const month = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(date)
  return `${month.charAt(0).toUpperCase() + month.slice(1)} ${date.getFullYear()}`
}

function toISO(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export default function WorkoutCalendar() {
  const { trainedDates } = useWorkoutStats()
  const today = new Date()
  const [current, setCurrent] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [direction, setDirection] = useState(0)

  const year = current.getFullYear()
  const month = current.getMonth()

  const firstWeekday = new Date(year, month, 1).getDay() // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth()

  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  // pad to always have 6 rows (42 cells) so height stays constant during slide transition
  while (cells.length < 42) cells.push(null)

  const prevMonth = () => {
    setDirection(-1)
    setCurrent(new Date(year, month - 1, 1))
  }
  const nextMonth = () => {
    setDirection(1)
    setCurrent(new Date(year, month + 1, 1))
  }

  return (
    <section>
      <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: 'var(--font-display)' }}>
        {t('stats.calendar')}
      </h2>

      {/* Month navigation */}
      <div className="bg-surface rounded-xl p-4 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="p-1 rounded-lg text-secondary hover:text-primary hover:bg-white/5 transition-colors"
            aria-label="Mês anterior"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-semibold text-primary">{formatMonthYear(current)}</span>
          <button
            onClick={nextMonth}
            disabled={isCurrentMonth}
            className="p-1 rounded-lg text-secondary hover:text-primary hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Próximo mês"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Day-of-week header */}
        <div className="grid grid-cols-7 mb-1">
          {DAY_NAMES.map((d) => (
            <div key={d} className="text-center text-[10px] font-medium text-secondary py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells — slide on month change */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`${year}-${month}`}
            className="grid grid-cols-7 gap-y-1"
            custom={direction}
            variants={calendarVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {cells.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} />

              const iso = toISO(year, month, day)
              const isTrained = trainedDates.has(iso)
              const isToday = day === today.getDate() && isCurrentMonth

              return (
                <div key={iso} className="flex items-center justify-center aspect-square">
                  <span
                    className={[
                      'flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium transition-colors',
                      isTrained
                        ? 'bg-accent text-bg-primary font-bold'
                        : isToday
                        ? 'ring-1 ring-white/40 text-primary'
                        : 'text-secondary',
                    ].join(' ')}
                  >
                    {day}
                  </span>
                </div>
              )
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
