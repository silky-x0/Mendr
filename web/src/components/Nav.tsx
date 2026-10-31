import { useEffect, useState } from 'react'

const links = [
  ['problem', '§1 Problem'],
  ['how', '§2 How it works'],
  ['trust', '§3 Trust'],
] as const

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: '-40% 0px -50% 0px' },
    )
    // missing targets (null) are simply skipped
    for (const [id] of links) {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    }
    return () => io.disconnect()
  }, [])

  return (
    <header className="sticky top-0 z-10 bg-paper">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-sm sm:px-6">
        <a href="#" className="flex items-center gap-2 font-sans font-medium text-ink">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M1 8H4L5.5 3L8.5 13L10 8H15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          mendr
        </a>
        <div className="flex items-center gap-6">
          <div className="hidden gap-6 font-mono text-[13px] md:flex">
            {links.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className={`m-press ${active === id ? 'text-ink' : 'text-ink-2'} hover:text-ink`}
              >
                {label}
              </a>
            ))}
          </div>
          <a href="#join" className="m-press font-medium text-ink hover:text-ink-2">
            Join waitlist
          </a>
        </div>
      </nav>
      <div
        className="h-px bg-hairline transition-opacity duration-300 ease-[var(--ease-spec)]"
        style={{ opacity: scrolled ? 1 : 0 }}
      />
    </header>
  )
}
