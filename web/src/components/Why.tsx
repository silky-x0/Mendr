import type { CSSProperties } from 'react'
import { Redline } from './Redline'
import { Section, idx } from './Section'

const pairs = [
  ['hear from a customer that a provider changed its API', 'see the changed field and your call sites as soon as calls start failing'],
  ['read every provider\'s changelog by hand', 'get spec diffs only for the endpoints you actually call'],
  ['trust a model\'s "looks fine" on a fix', 'count a fix only when tests pass and the endpoint is back to baseline'],
  ['one broad key with standing write access to everything', 'scoped credentials per action, never merge rights'],
]

export function Why() {
  return (
    <Section id="why" num={4} label="Why Mendr" title="Built for teams who won't hand over the keys blindly">
      <ul className="mt-10 grid max-w-3xl gap-6" style={{ '--step': '120ms' } as CSSProperties}>
        {pairs.map(([from, to], k) => (
          <li key={from} className="text-base leading-relaxed text-ink-2" style={idx(k + 2)}>
            <Redline multiline from={from} to={to} fromLabel="Before: " toLabel="With Mendr: " />
          </li>
        ))}
      </ul>
    </Section>
  )
}
