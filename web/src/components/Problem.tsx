import { Section, idx } from './Section'

export function Problem() {
  return (
    <Section id="problem" label="The problem" title="APIs break quietly">
      <div className="mt-8 grid gap-8 text-ink-2 lg:grid-cols-12">
        <p className="m-rise text-lg leading-relaxed sm:text-xl lg:col-span-8" style={idx(2)}>
          A provider ships a breaking change in a changelog nobody reads. A field you depend on starts coming back as a string. A teammate's deploy renames a response field another service still reads. Monitoring shows <strong className="font-medium text-ink">that</strong> error rates went up. It rarely shows <strong className="font-medium text-ink">which contract changed</strong> or <strong className="font-medium text-ink">which lines of your code depend on it</strong>.
        </p>
        <p className="m-rise border-t border-hairline pt-6 text-lg leading-relaxed text-ink lg:col-span-6 lg:col-start-7" style={idx(3)}>
          Mendr watches that one layer, the contracts between your service and the APIs around it. Autonomy is <strong className="font-medium text-ink">tiered and earned, not assumed</strong>. It starts read-only, you decide action by action what it may do next, and it never has merge rights on your repo.
        </p>
      </div>
    </Section>
  )
}
