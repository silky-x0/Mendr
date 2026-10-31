import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <main>
      <h1 className="font-serif font-medium">Your API's contracts, kept</h1>
    </main>
  )
}
