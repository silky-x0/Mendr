// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'
import { Route } from './index'

afterEach(cleanup)

it('renders the hero heading', () => {
  const Home = Route.options.component!
  render(<Home />)
  expect(
    screen.getByRole('heading', { name: /Your API's contracts, kept/ }),
  ).toBeTruthy()
})

it('renders section headings in order and both waitlist inputs', () => {
  const Home = Route.options.component!
  render(<Home />)
  const h2s = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
  expect(h2s).toEqual([
    'APIs break quietly',
    'From a stray 400 to the line that needs fixing',
    'Autonomy you grant, one tier at a time',
    "Built for teams who won't hand over the keys blindly",
    'Be first to run Mendr on your service',
  ])
  expect(screen.getAllByLabelText('Work email')).toHaveLength(2)
  expect(screen.getAllByRole('columnheader').map((c) => c.textContent)).toContain('Who decides')
})
