// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { Route } from './index'

it('renders the hero heading', () => {
  const Home = Route.options.component!
  render(<Home />)
  expect(
    screen.getByRole('heading', { name: /Your API's contracts, kept/ }),
  ).toBeTruthy()
})
