import { createFileRoute } from '@tanstack/react-router'
import { Hero } from '../components/Hero'
import { Nav } from '../components/Nav'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero form={null} />
      </main>
    </>
  )
}
