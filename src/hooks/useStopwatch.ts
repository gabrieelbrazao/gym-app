import { useState, useEffect, useRef } from 'react'

export function useStopwatch(active: boolean): number {
  const [seconds, setSeconds] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startRef = useRef<number>(0)

  useEffect(() => {
    if (active) {
      startRef.current = Date.now()
      setSeconds(0)

      const tick = () => {
        setSeconds(Math.floor((Date.now() - startRef.current) / 1000))
      }

      intervalRef.current = setInterval(tick, 1000)

      const onVisibilityChange = () => {
        if (!document.hidden) tick()
      }
      document.addEventListener('visibilitychange', onVisibilityChange)

      return () => {
        clearInterval(intervalRef.current!)
        intervalRef.current = null
        document.removeEventListener('visibilitychange', onVisibilityChange)
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [active])

  return seconds
}
