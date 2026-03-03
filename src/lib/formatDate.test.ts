import { describe, it, expect } from 'vitest'
import { formatDate } from './formatDate'

describe('formatDate', () => {
  it('converts YYYY-MM-DD to DD/MM/YYYY', () => {
    expect(formatDate('2026-03-01')).toBe('01/03/2026')
  })

  it('pads single-digit day and month', () => {
    expect(formatDate('2026-01-05')).toBe('05/01/2026')
  })

  it('handles end of year', () => {
    expect(formatDate('2025-12-31')).toBe('31/12/2025')
  })
})
