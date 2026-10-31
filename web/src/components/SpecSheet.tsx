import type { CSSProperties } from 'react'
import { Redline } from './Redline'

const line = (i: number) =>
  ({ '--i': i }) as CSSProperties

export function SpecSheet() {
  return (
    <div
      style={{ '--step': '40ms', '--strike-delay': '600ms' } as CSSProperties}
      className="m-load rounded-lg border border-hairline bg-sheet font-mono text-sm shadow-[0_8px_30px_rgb(31_27_22/0.08)]"
    >
      <div className="m-load flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-hairline px-5 py-3 text-xs text-muted" style={line(0)}>
        <span className="text-ink">POST api.paylane.com/v1/charges</span>
        <span>rev 2026-10-29</span>
        <span className="ml-auto">Example</span>
      </div>
      <div className="overflow-x-auto px-5 py-4 leading-7 text-ink">
        <div className="min-w-max">
          <div className="m-load" style={line(1)}>charge:</div>
          <div className="m-load pl-6" style={line(2)}>id: string</div>
          <div className="m-load pl-6" style={line(3)}>
            amount:{' '}
            <Redline from="integer" to="string" note="drift 03:12 · 412 failing calls" />
          </div>
          <div className="m-load pl-6" style={line(4)}>currency: string</div>
        </div>
      </div>
      <div className="m-load border-t border-hairline px-5 py-3 text-xs text-muted" style={line(5)}>
        ↳ billing/charge.ts:42 · +2 call sites
      </div>
    </div>
  )
}
