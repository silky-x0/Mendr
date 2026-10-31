import { Section, idx } from './Section'

const tiers = [
  ['0 Read-only', 'Mendr explains the drift and proposes a fix in Slack or a GitHub issue. No write access.', 'No permissions'],
  ['1 Scoped, reversible actions', 'Pin an upstream API version, switch on a fallback you configured, or roll back the deploy that broke your contract. Per action, per service.', 'You allowlist'],
  ['2 Code fixes, human-merged', 'Mendr opens a PR with the client fix and a regression test that reproduces the failure. Your tests and reviewers decide.', 'Your reviewers'],
  ['3 Escalate', 'Anything touching auth, payments or data, or anything low-confidence, pages a human. Always.', 'Always on'],
]

export function TrustModel() {
  return (
    <Section id="trust" label="Trust model" title="Autonomy you grant, one tier at a time">
      <p className="m-rise mt-5 max-w-2xl text-base text-ink-2" style={idx(2)}>
        Nobody hands a new tool merge access on day one. Mendr doesn't ask you to.
      </p>
      <div className="mt-10 sm:overflow-x-auto">
        <table role="table" className="block w-full border-collapse text-left text-base sm:table sm:min-w-[40rem]">
          <thead role="rowgroup" className="max-sm:sr-only">
            <tr role="row" className="border-b border-hairline font-mono text-[13px] text-muted">
              <th scope="col" role="columnheader" className="py-2 pr-4 font-normal">Tier</th>
              <th scope="col" role="columnheader" className="py-2 pr-4 font-normal">What Mendr may do</th>
              <th scope="col" role="columnheader" className="py-2 font-normal">Who decides</th>
            </tr>
          </thead>
          <tbody role="rowgroup" className="block sm:table-row-group">
            {tiers.map(([tier, may, who], k) => (
              <tr key={tier} role="row" className="m-rise block border-b border-hairline py-4 align-top sm:table-row sm:py-0" style={idx(k + 3)}>
                <th scope="row" role="rowheader" className="block font-sans sm:table-cell sm:py-4 sm:pr-4 font-medium text-ink">{tier}</th>
                <td role="cell" className="mt-1 block text-ink-2 sm:mt-0 sm:table-cell sm:py-4 sm:pr-4">{may}</td>
                <td role="cell" className="mt-3 block sm:mt-0 sm:table-cell sm:py-4">
                  <span
                    className="m-stamp inline-block whitespace-nowrap rounded border border-ink px-2 py-0.5 font-mono text-[13px] text-ink"
                    style={{ ...idx(k + 3), transitionDelay: `calc(var(--i) * 60ms + 300ms)` }}
                  >
                    {who}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  )
}
