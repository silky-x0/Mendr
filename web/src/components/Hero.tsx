import type { CSSProperties, ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { SpecSheet } from './SpecSheet'

const i = (n: number) => ({ '--i': n }) as CSSProperties

export function Hero({ form }: { form: ReactNode }) {
  const [on, setOn] = useState(false)
  useEffect(() => setOn(true), [])

  return (
    <section
      data-in={on ? 'true' : undefined}
      className="mx-auto grid max-w-6xl gap-12 px-4 pb-20 pt-12 sm:px-6 lg:grid-cols-12 lg:items-center lg:pt-20"
    >
      <div className="min-w-0 lg:col-span-5">
        <h1 className="m-rise font-serif text-4xl font-medium leading-tight text-ink sm:text-5xl" style={i(0)}>
          Your API's contracts, kept
        </h1>
        <p className="m-rise mt-5 max-w-md text-base text-ink-2" style={i(1)}>
          Mendr watches the HTTP calls your service makes and serves, catches the moment an API contract drifts, and shows what changed, which lines depend on it and how to fix it
        </p>
        <div className="m-rise mt-8" style={i(2)}>{form}</div>
      </div>
      <div className="min-w-0 lg:col-span-7">
        <SpecSheet />
      </div>
    </section>
  )
}
