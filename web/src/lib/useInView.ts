import { useEffect, useRef, useState } from 'react'

export function useInView<T extends Element>(
  options?: { rootMargin?: string },
): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false) // always false on first render: SSR/hydration match
  const rootMargin = options?.rootMargin

  useEffect(() => {
    const el = ref.current
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true)
          io.disconnect()
        }
      },
      { rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin])

  return [ref, inView]
}
