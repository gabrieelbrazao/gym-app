import { useEffect, useRef } from 'react'
import { motion, animate } from 'framer-motion'
import { Dumbbell, TrendingUp, Flame } from 'lucide-react'
import { useWorkoutStats } from '../hooks/useWorkoutStats'
import { t } from '../i18n'
import { staggerContainer, staggerItem } from '../lib/motion'
import type { MuscleGroup } from '../types'

function AnimatedNumber({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = v.toFixed(decimals)
      },
    })
    return controls.stop
  }, [value, decimals])

  return <span ref={ref}>0</span>
}

const STATS = [
  { key: 'totalWorkouts',  icon: Dumbbell,    label: 'stats.totalWorkouts' },
  { key: 'avgPerWeek',     icon: TrendingUp,   label: 'stats.avgPerWeek'   },
  { key: 'mostTrained',    icon: Flame,        label: 'stats.mostTrained'  },
] as const

export default function SummaryStats() {
  const { totalWorkouts, avgPerWeek, mostTrainedMuscle } = useWorkoutStats()

  const muscleLabel = mostTrainedMuscle
    ? t(`muscle.${mostTrainedMuscle}` as `muscle.${MuscleGroup}`)
    : t('stats.none')

  return (
    <motion.div
      className="grid grid-cols-3 gap-2"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {STATS.map(({ key, icon: Icon, label }) => (
        <motion.div
          key={key}
          className="bg-bg-card border border-border rounded-xl px-3 py-3 flex flex-col gap-1.5 items-center text-center"
          variants={staggerItem}
          whileHover={{ y: -2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <Icon size={14} className="text-accent opacity-80" />
          <span className="text-2xl font-bold text-text-primary leading-none" style={{ fontFamily: 'var(--font-display)' }}>
            {key === 'totalWorkouts' && <AnimatedNumber value={totalWorkouts} />}
            {key === 'avgPerWeek'    && <AnimatedNumber value={avgPerWeek} decimals={1} />}
            {key === 'mostTrained'   && <span className="text-accent truncate block w-full text-center">{muscleLabel}</span>}
          </span>
          <span className="text-[10px] text-text-secondary leading-tight">{t(label)}</span>
        </motion.div>
      ))}
    </motion.div>
  )
}
