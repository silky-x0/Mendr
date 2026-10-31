import { Section } from './Section'
import { WaitlistForm } from './WaitlistForm'

export function Join() {
  return (
    <Section id="join" label="Early access" title="Be first to run Mendr on your service">
      <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-start">
        <p className="max-w-md text-base text-ink-2 lg:col-span-5">
          The first release is read-only drift reports, opening to a small group of teams first
        </p>
        <div className="lg:col-span-6 lg:col-start-7">
          <WaitlistForm id="join" />
        </div>
      </div>
    </Section>
  )
}
