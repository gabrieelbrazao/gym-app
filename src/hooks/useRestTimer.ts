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

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  useEffect(() => {
    return clearTimer
  }, [])

  const start = useCallback((d?: number) => {
    clearTimer()
    const dur = d ?? duration
    setRemaining(dur)
    setIsRunning(true)
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearTimer()
          setIsRunning(false)
          try { navigator.vibrate(200) } catch {}
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [duration])

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
