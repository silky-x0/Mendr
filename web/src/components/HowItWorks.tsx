import { Section, idx } from './Section'

const clauses = [
  ['2.1', 'Baseline', 'Learn what normal looks like', 'Per endpoint: status mix, latency and, if you opt in, response shape. Bodies are reduced to field names and types before they leave your service.'],
  ['2.2', 'Detect', 'Spot drift', 'A new error class or a changed schema on an endpoint that was stable is drift.'],
  ['2.3', 'Explain', 'Find what changed and where it hurts', 'The upstream spec diff or changelog, next to the call sites in your repo that read the changed fields.'],
  ['2.4', 'Propose', 'Report, or act within your scope', 'A report in Slack or a GitHub issue. Higher tiers act only where you allowed it.'],
]

const watches = [
  ['Upstream APIs', 'Providers you call change a field, an error or a rate limit', 'Building'],
  ['Your own contract', 'A deploy breaks the OpenAPI contract your consumers rely on', 'Planned'],
  ['Dependencies', 'An SDK version you pin is deprecated, or soon will be', 'Planned'],
]

export function HowItWorks() {
  return (
    <Section id="how" num={2} label="How it works" title="From a stray 400 to the line that needs fixing">
      <p className="m-rise mt-5 max-w-2xl text-base text-ink-2" style={idx(2)}>
        Mendr reads the OpenTelemetry HTTP spans your stack already emits. Detection is plain statistics. A model only helps explain what changed.
      </p>
      <ol className="mt-10 grid max-w-3xl gap-6">
        {clauses.map(([n, name, head, body], k) => (
          <li key={n} className="m-rise grid gap-1 sm:grid-cols-[8rem_1fr] sm:gap-6" style={idx(k)}>
            <span className="font-mono text-[13px] text-muted">
              {n} {name}
            </span>
            <div>
              <h3 className="font-sans text-base font-medium text-ink">{head}</h3>
              <p className="mt-1 text-base text-ink-2">{body}</p>
            </div>
          </li>
        ))}
      </ol>
      <h3 className="mt-14 font-mono text-[13px] text-muted">What Mendr watches</h3>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[32rem] border-collapse text-left text-base">
          <thead>
            <tr className="border-b border-hairline font-mono text-[13px] font-normal text-muted">
              <th scope="col" className="py-2 pr-4 font-normal">Surface</th>
              <th scope="col" className="py-2 pr-4 font-normal">What changes</th>
              <th scope="col" className="py-2 font-normal">Status</th>
            </tr>
          </thead>
          <tbody>
            {watches.map(([surface, what, status], k) => (
              <tr key={surface} className="m-rise border-b border-hairline align-top" style={idx(k)}>
                <td className="py-3 pr-4 font-medium text-ink">{surface}</td>
                <td className="py-3 pr-4 text-ink-2">{what}</td>
                <td className={`py-3 font-mono text-[13px] ${status === 'Building' ? 'text-ink' : 'text-muted'}`}>{status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  )
}
