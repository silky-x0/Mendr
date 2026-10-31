// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { Redline } from './Redline'

it('puts from in del and to in ins', () => {
  render(<Redline from="integer" to="string" />)
  expect(screen.getByText('integer').tagName).toBe('DEL')
  expect(screen.getByText('string').tagName).toBe('INS')
})

it('renders the note only when given', () => {
  const { rerender } = render(<Redline from="a" to="b" note="drift 03:12" />)
  expect(screen.getByText('drift 03:12')).toBeTruthy()
  rerender(<Redline from="a" to="b" />)
  expect(screen.queryByText('drift 03:12')).toBeNull()
})
