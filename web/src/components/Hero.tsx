import type { CSSProperties, ReactNode } from 'react'
import { ShaderBackground } from './ShaderBackground'
import { SpecSheet } from './SpecSheet'

const i = (n: number) => ({ '--i': n }) as CSSProperties

export function Hero({ form }: { form: ReactNode }) {
  return (
    <section className="relative isolate">
      <ShaderBackground className="absolute inset-x-0 -top-16 -z-10 h-[calc(100%+10rem)] w-full [mask-image:linear-gradient(to_bottom,black_70%,transparent)]" />
      <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-12 pt-12 sm:pb-20 sm:px-6 lg:grid-cols-12 lg:items-center lg:pt-20">
        <div className="min-w-0 lg:col-span-5">
          <h1 className="m-load text-balance font-serif text-4xl font-medium leading-tight text-ink sm:text-5xl" style={i(0)}>
            Know the moment an API changes
          </h1>
          <p className="m-load mt-5 max-w-md text-base text-ink-2" style={i(1)}>
            Mendr watches the HTTP calls your service makes and serves, catches the moment an API contract drifts, and shows what changed, which lines depend on it and how to fix it
          </p>
          <div className="m-load mt-8" style={i(2)}>{form}</div>
        </div>
        <div className="min-w-0 lg:col-span-7">
          <SpecSheet />
        </div>
      </div>
    </section>
  )
}
