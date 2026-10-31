// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { WAITLIST_ENDPOINT, WaitlistForm } from './WaitlistForm'

const fetchMock = vi.fn()
// what Apps Script sends back: JSON from the script, or an HTML error page when the script throws
const reply = (json: unknown, ok = true) => ({ ok, json: async () => json })
const htmlError = { ok: true, json: async () => { throw new SyntaxError('Unexpected token <') } }

beforeEach(() => {
  vi.useFakeTimers()
  fetchMock.mockReset()
  global.fetch = fetchMock as unknown as typeof fetch
})
afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

function submit(email = 'a@b.co') {
  fireEvent.change(screen.getByLabelText('Work email'), { target: { value: email } })
  fireEvent.submit(screen.getByLabelText('Work email').closest('form')!)
}

it('posts email and timestamp', async () => {
  fetchMock.mockResolvedValue(reply({ ok: true }))
  render(<WaitlistForm id="hero" />)
  await act(async () => submit())
  expect(fetchMock).toHaveBeenCalledTimes(1)
  const [url, init] = fetchMock.mock.calls[0]
  expect(url).toBe(WAITLIST_ENDPOINT)
  expect(init.method).toBe('POST')
  expect(init.mode).toBeUndefined() // response must be readable to confirm the row was written
  expect(init.body).toBeInstanceOf(URLSearchParams)
  expect(init.body.get('Email')).toBe('a@b.co')
  expect(new Date(init.body.get('Timestamp')).toISOString()).toBe(init.body.get('Timestamp'))
})

it('shows success', async () => {
  fetchMock.mockResolvedValue(reply({ ok: true }))
  render(<WaitlistForm id="hero" />)
  await act(async () => submit())
  expect(screen.getByRole('button').textContent).toContain("You're on the list")
  expect((screen.getByLabelText('Work email') as HTMLInputElement).disabled).toBe(true)
})

it('shows error then resets', async () => {
  fetchMock.mockRejectedValue(new Error('x'))
  render(<WaitlistForm id="hero" />)
  await act(async () => submit())
  expect(screen.getByText('Something went wrong, try again')).toBeTruthy()
  await act(async () => {
    vi.advanceTimersByTime(4000)
  })
  expect(screen.getByText('No spam, one email when the pilot opens')).toBeTruthy()
  await act(async () => submit())
  expect(fetchMock).toHaveBeenCalledTimes(2)
})

it('shows error when the script reports failure', async () => {
  fetchMock.mockResolvedValue(reply({ ok: false, error: 'sheet missing' }))
  render(<WaitlistForm id="hero" />)
  await act(async () => submit())
  expect(screen.getByText('Something went wrong, try again')).toBeTruthy()
})

it('shows error when the script crashes with an HTML page', async () => {
  fetchMock.mockResolvedValue(htmlError)
  render(<WaitlistForm id="hero" />)
  await act(async () => submit())
  expect(screen.getByText('Something went wrong, try again')).toBeTruthy()
})

it('announces success in the live note', async () => {
  fetchMock.mockResolvedValue(reply({ ok: true }))
  render(<WaitlistForm id="hero" />)
  await act(async () => submit())
  expect(screen.getByText(/We'll email you when the pilot opens/).getAttribute('aria-live')).toBe('polite')
})

it('shakes on error and clears the class on animationend', async () => {
  fetchMock.mockRejectedValue(new Error('x'))
  render(<WaitlistForm id="hero" />)
  const input = screen.getByLabelText('Work email')
  await act(async () => submit())
  expect(input.classList.contains('m-shake')).toBe(true)
  // jsdom lacks CSS animation support, so React may listen for the prefixed name
  fireEvent.animationEnd(input)
  fireEvent(input, new Event('webkitAnimationEnd', { bubbles: true }))
  expect(input.classList.contains('m-shake')).toBe(false)
})

it('clears the reset timer on unmount', async () => {
  fetchMock.mockRejectedValue(new Error('x'))
  const { unmount } = render(<WaitlistForm id="hero" />)
  await act(async () => submit())
  expect(vi.getTimerCount()).toBe(1)
  unmount()
  expect(vi.getTimerCount()).toBe(0)
})

it('ignores second submit while sending', async () => {
  fetchMock.mockReturnValue(new Promise(() => {}))
  render(<WaitlistForm id="hero" />)
  await act(async () => submit())
  await act(async () => submit())
  expect(fetchMock).toHaveBeenCalledTimes(1)
})

it('gives two instances distinct input ids', () => {
  render(
    <>
      <WaitlistForm id="hero" />
      <WaitlistForm id="join" />
    </>,
  )
  const ids = screen.getAllByLabelText('Work email').map((e) => e.id)
  expect(new Set(ids).size).toBe(2)
})
