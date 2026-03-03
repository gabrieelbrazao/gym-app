import { describe, it, expect, beforeEach } from 'vitest'
import { storage } from './storage'

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('get', () => {
    it('returns null for missing keys', () => {
      expect(storage.get('nonexistent')).toBeNull()
    })

    it('returns parsed JSON for existing keys', () => {
      localStorage.setItem('test', JSON.stringify({ name: 'hello' }))
      expect(storage.get('test')).toEqual({ name: 'hello' })
    })

    it('returns primitive values', () => {
      localStorage.setItem('num', JSON.stringify(42))
      expect(storage.get('num')).toBe(42)
    })
  })

  describe('set', () => {
    it('stores a value as JSON', () => {
      storage.set('key', { a: 1 })
      expect(JSON.parse(localStorage.getItem('key')!)).toEqual({ a: 1 })
    })

    it('stores arrays', () => {
      storage.set('arr', [1, 2, 3])
      expect(storage.get('arr')).toEqual([1, 2, 3])
    })

    it('overwrites existing values', () => {
      storage.set('key', 'first')
      storage.set('key', 'second')
      expect(storage.get('key')).toBe('second')
    })
  })

  describe('remove', () => {
    it('removes an existing key', () => {
      storage.set('key', 'value')
      storage.remove('key')
      expect(storage.get('key')).toBeNull()
    })

    it('does not throw for missing keys', () => {
      expect(() => storage.remove('nonexistent')).not.toThrow()
    })
  })
})
