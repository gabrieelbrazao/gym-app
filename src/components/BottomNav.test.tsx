import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import BottomNav from './BottomNav'

function renderNav(initialRoute = '/') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <BottomNav />
    </MemoryRouter>
  )
}

describe('BottomNav', () => {
  it('renders four navigation items', () => {
    renderNav()
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(4)
  })

  it('renders correct labels', () => {
    renderNav()
    expect(screen.getByText('Início')).toBeInTheDocument()
    expect(screen.getByText('Exercícios')).toBeInTheDocument()
    expect(screen.getByText('Rotinas')).toBeInTheDocument()
    expect(screen.getByText('Progresso')).toBeInTheDocument()
  })

  it('links to correct routes', () => {
    renderNav()
    expect(screen.getByText('Início').closest('a')).toHaveAttribute('href', '/')
    expect(screen.getByText('Exercícios').closest('a')).toHaveAttribute('href', '/exercises')
    expect(screen.getByText('Rotinas').closest('a')).toHaveAttribute('href', '/routines')
    expect(screen.getByText('Progresso').closest('a')).toHaveAttribute('href', '/progress')
  })

  it('highlights active route', () => {
    renderNav('/exercises')
    const exercisesLink = screen.getByText('Exercícios').closest('a')
    expect(exercisesLink?.className).toContain('text-accent')
  })
})
