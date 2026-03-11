import { useReducer, useEffect, useRef } from 'react'

type State = { seconds: number; startTime: number }
type Action = { type: 'start'; startTime: number } | { type: 'tick' }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'start':
      return { seconds: Math.floor((Date.now() - action.startTime) / 1000), startTime: action.startTime }
    case 'tick':
      return { ...state, seconds: Math.floor((Date.now() - state.startTime) / 1000) }
  }
}

export function useStopwatch(active: boolean, startTime?: string): number {
  const [{ seconds }, dispatch] = useReducer(reducer, { seconds: 0, startTime: 0 })
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (active) {
      dispatch({ type: 'start', startTime: startTime ? new Date(startTime).getTime() : Date.now() })

      const tick = () => dispatch({ type: 'tick' })
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
