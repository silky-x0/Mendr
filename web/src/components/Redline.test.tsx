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

it('gives screen readers was/now cues, overridable', () => {
  const { container, rerender } = render(<Redline from="a" to="b" />)
  expect(container.querySelector('del .sr-only')?.textContent).toBe('was ')
  expect(container.querySelector('ins .sr-only')?.textContent).toBe('now ')
  rerender(<Redline from="a" to="b" fromLabel="Before: " toLabel="With Mendr: " />)
  expect(container.querySelector('del .sr-only')?.textContent).toBe('Before: ')
  expect(container.querySelector('ins .sr-only')?.textContent).toBe('With Mendr: ')
})

it('multiline uses static line-through, not the drawn strike', () => {
  const { container } = render(<Redline multiline from="a" to="b" />)
  expect(container.querySelector('del')?.className).toContain('m-del-static')
  expect(container.querySelector('del')?.className).not.toContain('m-strike')
})
