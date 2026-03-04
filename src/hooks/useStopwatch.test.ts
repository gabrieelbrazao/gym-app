import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useStopwatch } from './useStopwatch'

describe('useStopwatch', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  it('starts at 0', () => {
    const { result } = renderHook(() => useStopwatch(false))
    expect(result.current).toBe(0)
  })

  it('counts up each second when active', () => {
    const { result } = renderHook(() => useStopwatch(true))
    act(() => { vi.advanceTimersByTime(3000) })
    expect(result.current).toBe(3)
  })

  it('does not tick when inactive', () => {
    const { result } = renderHook(() => useStopwatch(false))
    act(() => { vi.advanceTimersByTime(5000) })
    expect(result.current).toBe(0)
  })

  it('resets to 0 when active toggles from false to true', () => {
    let active = true
    const { result, rerender } = renderHook(() => useStopwatch(active))
    act(() => { vi.advanceTimersByTime(4000) })
    expect(result.current).toBe(4)

    active = false
    rerender()
    active = true
    rerender()
    expect(result.current).toBe(0)
  })

  it('stops ticking when deactivated', () => {
    let active = true
    const { result, rerender } = renderHook(() => useStopwatch(active))
    act(() => { vi.advanceTimersByTime(2000) })
    expect(result.current).toBe(2)

    active = false
    rerender()
    act(() => { vi.advanceTimersByTime(3000) })
    expect(result.current).toBe(2)
  })
})
