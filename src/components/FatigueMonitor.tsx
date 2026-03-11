import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Model, { type IExerciseData, type IMuscleStats, type Muscle } from 'react-body-highlighter'
import { useFatigue } from '../hooks/useFatigue'
import { t } from '../i18n'
import { fadeUp } from '../lib/motion'
import { type FatigueStatus, type MuscleGroup } from '../types'

// Map our muscle groups → library muscle names
const MUSCLE_MAP: Partial<Record<MuscleGroup, Muscle[]>> = {
  chest:      ['chest'],
  back:       ['upper-back', 'lower-back'],
  shoulders:  ['front-deltoids', 'back-deltoids'],
  biceps:     ['biceps'],
  triceps:    ['triceps'],
  quads:      ['quadriceps'],
  hamstrings: ['hamstring'],
  glutes:     ['gluteal'],
  calves:     ['calves'],
  core:       ['abs', 'obliques'],
  // cardio has no anatomical region
}

// Map library muscle name back to our MuscleGroup (for click handler)
const MUSCLE_TO_GROUP: Partial<Record<Muscle, MuscleGroup>> = {
  'chest':           'chest',
  'upper-back':      'back',
  'lower-back':      'back',
  'front-deltoids':  'shoulders',
  'back-deltoids':   'shoulders',
  'biceps':          'biceps',
  'triceps':         'triceps',
  'quadriceps':      'quads',
  'hamstring':       'hamstrings',
  'gluteal':         'glutes',
  'calves':          'calves',
  'abs':             'core',
  'obliques':        'core',
}

const STATUS_FREQUENCY: Record<FatigueStatus, number> = {
  ready:    1,
  resting:  2,
  fatigued: 3,
}

// green → amber → red
const HIGHLIGHTED_COLORS = ['#4ade80', '#f59e0b', '#ef4444']
const BODY_COLOR = '#2A2A3A'

const STATUS_STYLES: Record<FatigueStatus, { badge: string; bar: string; text: string }> = {
  ready:    { badge: 'bg-green-500/15 text-green-400', bar: 'bg-green-400',  text: 'text-green-400' },
  resting:  { badge: 'bg-amber-500/15 text-amber-400', bar: 'bg-amber-400',  text: 'text-amber-400' },
  fatigued: { badge: 'bg-red-500/15 text-red-400',     bar: 'bg-red-400',    text: 'text-red-400'   },
}

function subText(daysAgo: number | null): string {
  if (daysAgo === null) return t('fatigue.never')
  if (daysAgo === 0)    return t('fatigue.today')
  if (daysAgo === 1)    return t('fatigue.yesterday')
  return `${daysAgo} ${t('fatigue.daysAgo')}`
}

export default function FatigueMonitor() {
  const muscles = useFatigue()
  const [view, setView] = useState<'anterior' | 'posterior'>('anterior')
  const [selectedGroup, setSelectedGroup] = useState<MuscleGroup | null>(null)

  const modelData: IExerciseData[] = muscles
    .filter(f => f.lastTrainedDate !== null)
    .flatMap(f => {
      const libraryMuscles = MUSCLE_MAP[f.muscleGroup]
      if (!libraryMuscles) return []
      return [{ name: f.muscleGroup, muscles: libraryMuscles, frequency: STATUS_FREQUENCY[f.status] }]
    })

  const handleClick = useCallback(({ muscle }: IMuscleStats) => {
    const group = MUSCLE_TO_GROUP[muscle]
    if (!group) return
    setSelectedGroup(prev => (prev === group ? null : group))
  }, [])

  const selected = selectedGroup ? muscles.find(m => m.muscleGroup === selectedGroup) : null
  const cardio = muscles.find(m => m.muscleGroup === 'cardio')

  return (
    <section>
      <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: 'var(--font-display)' }}>
        {t('fatigue.title')}
      </h2>

      {/* View toggle — pill with sliding indicator */}
      <div className="relative flex bg-bg-input rounded-xl p-1 mb-4 gap-1">
        {(['anterior', 'posterior'] as const).map(v => (
          <motion.button
            key={v}
            onClick={() => setView(v)}
            className="relative flex-1 py-1.5 rounded-lg text-sm font-medium z-10"
            style={{ color: view === v ? 'var(--color-bg-primary)' : 'var(--color-text-secondary)' }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.15 }}
          >
            {view === v && (
              <motion.div
                layoutId="fatigue-tab"
                className="absolute inset-0 bg-accent rounded-lg"
                style={{ zIndex: -1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
            )}
            {v === 'anterior' ? 'Frente' : 'Costas'}
          </motion.button>
        ))}
      </div>

      {/* Body model */}
      <div className="flex justify-center">
        <Model
          type={view}
          data={modelData}
          bodyColor={BODY_COLOR}
          highlightedColors={HIGHLIGHTED_COLORS}
          onClick={handleClick}
          style={{ width: '220px' }}
          svgStyle={{ borderRadius: '12px' }}
        />
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-3 mb-4">
        {(['ready', 'resting', 'fatigued'] as FatigueStatus[]).map(s => (
          <div key={s} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: HIGHLIGHTED_COLORS[STATUS_FREQUENCY[s] - 1] }}
            />
            <span className="text-xs text-secondary">{t(`fatigue.${s}`)}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: BODY_COLOR }} />
          <span className="text-xs text-secondary">N/A</span>
        </div>
      </div>

      {/* Detail card on tap */}
      <AnimatePresence mode="wait">
        {selected && (
          <motion.div
            key={selected.muscleGroup}
            className="rounded-xl p-4 bg-bg-card border border-border mt-1"
            variants={fadeUp}
            initial="initial"
            animate="animate"
            exit="exit"
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-primary">
                {t(`muscle.${selected.muscleGroup}` as `muscle.${MuscleGroup}`)}
              </span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[selected.status].badge}`}>
                {t(`fatigue.${selected.status}`)}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-black/20">
                <motion.div
                  className={`h-full rounded-full ${STATUS_STYLES[selected.status].bar}`}
                  initial={{ width: 0 }}
                  animate={{ width: selected.recoveryPct === 0 ? '4px' : `${selected.recoveryPct}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
              <span className={`text-xs font-medium w-9 text-right ${STATUS_STYLES[selected.status].text}`}>
                {selected.recoveryPct}%
              </span>
            </div>

            <span className="text-xs text-secondary">{subText(selected.daysAgo)}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cardio chip (no body region) */}
      {cardio && (
        <div className={`mt-3 flex items-center justify-between rounded-xl px-4 py-2.5 ${
          cardio.status === 'fatigued' ? 'bg-red-500/10' :
          cardio.status === 'resting'  ? 'bg-amber-500/10' : 'bg-green-500/10'
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-sm">🫀</span>
            <span className="text-sm font-medium text-primary">{t('muscle.cardio')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[cardio.status].badge}`}>
              {t(`fatigue.${cardio.status}`)}
            </span>
            <span className="text-xs text-secondary">{subText(cardio.daysAgo)}</span>
          </div>
        </div>
      )}
    </section>
  )
}
