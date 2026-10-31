import { createFileRoute } from '@tanstack/react-router'
import { Hero } from '../components/Hero'
import { Footer } from '../components/Footer'
import { HowItWorks } from '../components/HowItWorks'
import { Join } from '../components/Join'
import { Nav } from '../components/Nav'
import { Problem } from '../components/Problem'
import { TrustModel } from '../components/TrustModel'
import { Why } from '../components/Why'
import { WaitlistForm } from '../components/WaitlistForm'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero form={<WaitlistForm id="hero" />} />
        <Problem />
        <HowItWorks />
        <TrustModel />
        <Why />
        <Join />
      </main>
      <Footer />
    </>
  )
}
