import { useState, useEffect, useRef, useCallback } from 'react'

const DEFAULT_DURATION = 60

interface RestTimerState {
  remaining: number
  isRunning: boolean
  duration: number
  start: (d?: number) => void
  skip: () => void
  setDuration: (d: number) => void
}

export function useRestTimer(): RestTimerState {
  const [duration, setDurationState] = useState(DEFAULT_DURATION)
  const [remaining, setRemaining] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const endTimeRef = useRef<number>(0)

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const tick = useCallback(() => {
    const left = Math.ceil((endTimeRef.current - Date.now()) / 1000)
    if (left <= 0) {
      clearTimer()
      setIsRunning(false)
      setRemaining(0)

    } else {
      setRemaining(left)
    }
  }, [])

  // Sync immediately when app returns to foreground
  useEffect(() => {
    if (!isRunning) return
    const onVisibilityChange = () => {
      if (!document.hidden) tick()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [isRunning, tick])

  useEffect(() => {
    return clearTimer
  }, [])

  const start = useCallback((d?: number) => {
    clearTimer()
    const dur = d ?? duration
    endTimeRef.current = Date.now() + dur * 1000
    setRemaining(dur)
    setIsRunning(true)
    intervalRef.current = setInterval(tick, 1000)
  }, [duration, tick])

  const skip = useCallback(() => {
    clearTimer()
    setIsRunning(false)
    setRemaining(0)
  }, [])

  const setDuration = useCallback((d: number) => {
    setDurationState(d)
  }, [])

  return { remaining, isRunning, duration, start, skip, setDuration }
}
