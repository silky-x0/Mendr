// @vitest-environment jsdom
import { render } from '@testing-library/react'
import { expect, it, vi } from 'vitest'

vi.mock('@tanstack/react-router', async (orig) => ({
  ...(await orig<object>()),
  Outlet: () => null,
}))

import { RootComponent } from './__root'

it('marks the app mounted so the js-class fallback does not fire', () => {
  window.__mendrMounted = undefined
  render(<RootComponent />)
  expect(window.__mendrMounted).toBe(true)
})
