import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useInView } from './useInView'

let cb: IntersectionObserverCallback
const disconnect = vi.fn()
const original = window.IntersectionObserver

beforeEach(() => {
  disconnect.mockClear()
  window.IntersectionObserver = class {
    constructor(c: IntersectionObserverCallback) {
      cb = c
    }
    observe() {}
    disconnect = disconnect
  } as unknown as typeof IntersectionObserver
})
afterEach(() => {
  window.IntersectionObserver = original
})

// the hook only observes once a ref has an element
function setup() {
  return renderHook(() => {
    const r = useInView<HTMLDivElement>()
    r[0].current = document.createElement('div')
    return r
  })
}
const fire = (isIntersecting: boolean) =>
  act(() => cb([{ isIntersecting } as IntersectionObserverEntry], {} as IntersectionObserver))

describe('useInView', () => {
  it('starts false, becomes true on intersect', () => {
    const { result } = setup()
    expect(result.current[1]).toBe(false)
    fire(true)
    expect(result.current[1]).toBe(true)
  })

  it('stays true after leaving view', () => {
    const { result } = setup()
    fire(true)
    fire(false)
    expect(result.current[1]).toBe(true)
    expect(disconnect).toHaveBeenCalled()
  })

  it('true after mount without IntersectionObserver', () => {
    // @ts-expect-error simulate old browser
    delete window.IntersectionObserver
    const { result } = renderHook(() => useInView<HTMLDivElement>())
    expect(result.current[1]).toBe(true)
  })
})
