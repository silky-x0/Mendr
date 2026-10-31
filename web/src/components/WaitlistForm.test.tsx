// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { WAITLIST_ENDPOINT, WaitlistForm } from './WaitlistForm'

const fetchMock = vi.fn()

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
  fetchMock.mockResolvedValue({})
  render(<WaitlistForm id="hero" />)
  await act(async () => submit())
  expect(fetchMock).toHaveBeenCalledTimes(1)
  const [url, init] = fetchMock.mock.calls[0]
  expect(url).toBe(WAITLIST_ENDPOINT)
  expect(init.method).toBe('POST')
  expect(init.mode).toBe('no-cors')
  expect(init.body).toBeInstanceOf(URLSearchParams)
  expect(init.body.get('Email')).toBe('a@b.co')
  expect(new Date(init.body.get('Timestamp')).toISOString()).toBe(init.body.get('Timestamp'))
})

it('shows success', async () => {
  fetchMock.mockResolvedValue({})
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
  expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(false)
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
