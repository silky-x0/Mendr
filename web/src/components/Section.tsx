import type { CSSProperties, ReactNode } from 'react'
import { useInView } from '../lib/useInView'

const i = (n: number) => ({ '--i': n }) as CSSProperties

export function Section({
  id,
  label,
  title,
  children,
  center,
}: {
  id: string
  label: string
  title: string
  children: ReactNode
  center?: boolean
}) {
  const [ref, inView] = useInView<HTMLElement>()
  return (
    <section
      ref={ref}
      id={id}
      data-in={inView ? 'true' : undefined}
      className="scroll-mt-16 mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24"
    >
      <div className="m-rule h-px bg-hairline" />
      <p className="mt-4 font-mono text-[13px] text-muted">
        {label}
      </p>
      <h2
        className={`m-rise mt-3 max-w-3xl font-serif text-3xl font-medium leading-tight text-ink sm:text-4xl ${center ? 'mx-auto text-center' : ''}`}
        style={i(1)}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}

export { i as idx }
