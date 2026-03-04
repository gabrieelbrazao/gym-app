import { useEffect, useRef } from 'react'
import { motion, animate } from 'framer-motion'
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
      <motion.div
        className="bg-surface rounded-xl px-3 py-3 flex flex-col gap-0.5 items-center text-center"
        variants={staggerItem}
      >
        <span className="text-xl font-bold text-primary">
          <AnimatedNumber value={totalWorkouts} />
        </span>
        <span className="text-[10px] text-secondary leading-tight">{t('stats.totalWorkouts')}</span>
      </motion.div>

      <motion.div
        className="bg-surface rounded-xl px-3 py-3 flex flex-col gap-0.5 items-center text-center"
        variants={staggerItem}
      >
        <span className="text-xl font-bold text-primary">
          <AnimatedNumber value={avgPerWeek} decimals={1} />
        </span>
        <span className="text-[10px] text-secondary leading-tight">{t('stats.avgPerWeek')}</span>
      </motion.div>

      <motion.div
        className="bg-surface rounded-xl px-3 py-3 flex flex-col gap-0.5 items-center text-center"
        variants={staggerItem}
      >
        <span className="text-xl font-bold text-accent truncate w-full text-center">{muscleLabel}</span>
        <span className="text-[10px] text-secondary leading-tight">{t('stats.mostTrained')}</span>
      </motion.div>
    </motion.div>
  )
}
