import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useRestTimer } from './useRestTimer'

describe('useRestTimer', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  it('starts with remaining=0 and isRunning=false', () => {
    const { result } = renderHook(() => useRestTimer())
    expect(result.current.remaining).toBe(0)
    expect(result.current.isRunning).toBe(false)
  })

  it('starts the countdown on start()', () => {
    const { result } = renderHook(() => useRestTimer())
    act(() => { result.current.start(10) })
    expect(result.current.remaining).toBe(10)
    expect(result.current.isRunning).toBe(true)
  })

  it('counts down each second', () => {
    const { result } = renderHook(() => useRestTimer())
    act(() => { result.current.start(10) })
    act(() => { vi.advanceTimersByTime(3000) })
    expect(result.current.remaining).toBe(7)
  })

  it('stops at 0 and sets isRunning=false', () => {
    const { result } = renderHook(() => useRestTimer())
    act(() => { result.current.start(3) })
    act(() => { vi.advanceTimersByTime(3000) })
    expect(result.current.remaining).toBe(0)
    expect(result.current.isRunning).toBe(false)
  })

  it('skip() resets remaining to 0 and stops timer', () => {
    const { result } = renderHook(() => useRestTimer())
    act(() => { result.current.start(30) })
    act(() => { vi.advanceTimersByTime(5000) })
    act(() => { result.current.skip() })
    expect(result.current.remaining).toBe(0)
    expect(result.current.isRunning).toBe(false)
  })

  it('setDuration() updates the default duration', () => {
    const { result } = renderHook(() => useRestTimer())
    act(() => { result.current.setDuration(90) })
    expect(result.current.duration).toBe(90)
  })

  it('start() with explicit duration uses that duration', () => {
    const { result } = renderHook(() => useRestTimer())
    act(() => { result.current.start(120) })
    expect(result.current.remaining).toBe(120)
  })

  it('restarting replaces the current countdown', () => {
    const { result } = renderHook(() => useRestTimer())
    act(() => { result.current.start(60) })
    act(() => { vi.advanceTimersByTime(10000) })
    act(() => { result.current.start(30) })
    expect(result.current.remaining).toBe(30)
    act(() => { vi.advanceTimersByTime(2000) })
    expect(result.current.remaining).toBe(28)
  })
})
