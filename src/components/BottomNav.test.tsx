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
  it('renders five navigation items', () => {
    renderNav()
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(5)
  })

  it('renders correct labels', () => {
    renderNav()
    expect(screen.getByText('Início')).toBeInTheDocument()
    expect(screen.getByText('Exercícios')).toBeInTheDocument()
    expect(screen.getByText('Rotinas')).toBeInTheDocument()
    expect(screen.getByText('Progresso')).toBeInTheDocument()
    expect(screen.getByText('Config')).toBeInTheDocument()
  })

  it('links to correct routes', () => {
    renderNav()
    expect(screen.getByText('Início').closest('a')).toHaveAttribute('href', '/')
    expect(screen.getByText('Exercícios').closest('a')).toHaveAttribute('href', '/exercises')
    expect(screen.getByText('Rotinas').closest('a')).toHaveAttribute('href', '/routines')
    expect(screen.getByText('Progresso').closest('a')).toHaveAttribute('href', '/progress')
    expect(screen.getByText('Config').closest('a')).toHaveAttribute('href', '/settings')
  })

  it('highlights active route', () => {
    renderNav('/exercises')
    const exercisesLink = screen.getByText('Exercícios').closest('a')
    expect(exercisesLink?.className).toContain('text-accent')
  })
})
