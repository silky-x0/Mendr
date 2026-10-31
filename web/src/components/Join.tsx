import { Section } from './Section'
import { WaitlistForm } from './WaitlistForm'

export function Join() {
  return (
    <Section id="join" label="Early access" title="Be first to run Mendr on your service" center>
      <p className="mx-auto mt-5 max-w-xl text-center text-base text-ink-2">
        The first release is read-only drift reports, opening to a small group of teams first
      </p>
      <div className="mx-auto mt-8 max-w-md">
        <WaitlistForm id="join" />
      </div>
    </Section>
  )
}
