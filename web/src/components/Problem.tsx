import { Section, idx } from './Section'

export function Problem() {
  return (
    <Section id="problem" num={1} label="The problem" title="APIs break quietly">
      <div className="mt-8 grid max-w-4xl gap-6 text-base text-ink-2 md:grid-cols-2">
        <p className="m-rise" style={idx(2)}>
          A provider ships a breaking change in a changelog nobody reads. A field you depend on starts coming back as a string. A teammate's deploy renames a response field another service still reads. Monitoring shows <em>that</em> error rates went up. It rarely shows <em>which contract changed</em> or <em>which lines of your code depend on it</em>.
        </p>
        <p className="m-rise" style={idx(3)}>
          Mendr watches that one layer, the contracts between your service and the APIs around it. Autonomy is <em>tiered and earned, not assumed</em>. It starts read-only, you decide action by action what it may do next, and it never has merge rights on your repo.
        </p>
      </div>
    </Section>
  )
}
