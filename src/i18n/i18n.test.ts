import { describe, it, expect } from 'vitest'
import { t } from './index'

describe('t() translation helper', () => {
  it('returns the pt-BR translation for a known key', () => {
    expect(t('nav.home')).toBe('Início')
    expect(t('dashboard.title')).toBe('Painel')
  })

  it('returns the key itself for an unknown key', () => {
    expect(t('unknown.key')).toBe('unknown.key')
  })
})
