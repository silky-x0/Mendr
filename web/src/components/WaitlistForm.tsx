import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'

export const WAITLIST_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbw9Pju5wgYcP3mojYD7yTr25EkQcDndO9bonke21EuEUhFglH0ZpKYjIYOcz7izZECYQw/exec'

type Status = 'idle' | 'sending' | 'done' | 'error'

export function WaitlistForm({ id }: { id: string }) {
  const [status, setStatus] = useState<Status>('idle')
  const [shake, setShake] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status !== 'idle') return
    const email = new FormData(e.currentTarget).get('email')?.toString().trim()
    if (!email) return
    setStatus('sending')
    const body = new URLSearchParams({ Email: email, Timestamp: new Date().toISOString() })
    try {
      // Read the reply: a successful script answers {"ok":true} via a CORS-enabled redirect.
      // A crashing script returns an HTML error page, so anything else counts as failure.
      const res = await fetch(WAITLIST_ENDPOINT, { method: 'POST', body })
      const data = await res.json().catch(() => null)
      if (!res.ok || data?.ok !== true) throw new Error('waitlist not saved')
      setStatus('done')
    } catch {
      setStatus('error')
      setShake(true)
      timer.current = setTimeout(() => {
        setStatus('idle')
        setShake(false)
      }, 4000)
    }
  }

  const label =
    status === 'sending' ? 'Joining…' : status === 'done' ? "You're on the list" : 'Join waitlist'

  return (
    <form onSubmit={onSubmit} className="@container w-full max-w-md">
      <div className="flex flex-col gap-3 @sm:flex-row">
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          aria-label="Work email"
          placeholder="you@company.com"
          disabled={status === 'done'}
          onAnimationEnd={() => setShake(false)}
          className={`h-12 min-w-0 @sm:flex-1 rounded-md border border-hairline bg-sheet px-3 font-sans text-base text-ink placeholder:text-muted disabled:text-ink-2${shake ? ' m-shake' : ''}`}
        />
        <button
          type="submit"
          disabled={status === 'sending' || status === 'done'}
          className="m-press inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-ink px-4 font-sans text-base font-medium text-paper hover:text-raised @sm:w-48"
        >
          {status === 'done' && (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                className="m-check"
                d="M3 8.5l3.5 3.5L13 4.5"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
              />
            </svg>
          )}
          {label}
        </button>
      </div>
      <p
        aria-live="polite"
        className={`mt-3 font-mono text-xs ${status === 'error' ? 'text-ink' : 'text-muted'}`}
      >
        {status === 'error'
          ? 'Something went wrong, try again'
          : status === 'done'
            ? "You're on the list. We'll email you when the pilot opens"
            : 'No spam, one email when the pilot opens'}
      </p>
    </form>
  )
}
