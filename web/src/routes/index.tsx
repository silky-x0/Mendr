import { createFileRoute } from '@tanstack/react-router'
import { Hero } from '../components/Hero'
import { Nav } from '../components/Nav'
import { WaitlistForm } from '../components/WaitlistForm'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero form={<WaitlistForm id="hero" />} />
      </main>
    </>
  )
}
