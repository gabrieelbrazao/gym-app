import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Layout from './Layout'

function renderLayout(initialRoute = '/') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Layout />
    </MemoryRouter>
  )
}

describe('Layout', () => {
  it('renders the bottom navigation', () => {
    renderLayout()
    expect(screen.getByTestId('bottom-nav')).toBeInTheDocument()
  })

  it('renders all nav links', () => {
    renderLayout()
    expect(screen.getByText('Início')).toBeInTheDocument()
    expect(screen.getByText('Exercícios')).toBeInTheDocument()
    expect(screen.getByText('Rotinas')).toBeInTheDocument()
    expect(screen.getByText('Progresso')).toBeInTheDocument()
  })
})
