import { useSyncExternalStore } from 'react'
import { BREAKPOINTS } from '../utils/performance'

const MOBILE_BREAKPOINT = BREAKPOINTS.mobile

function subscribe(breakpoint: number, callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {}

  const mediaQuery = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
  const handler = () => callback()

  mediaQuery.addEventListener('change', handler)
  return () => mediaQuery.removeEventListener('change', handler)
}

export default function useIsMobile(breakpoint: number = MOBILE_BREAKPOINT): boolean {
  return useSyncExternalStore(
    (callback) => subscribe(breakpoint, callback),
    () => {
      if (typeof window === 'undefined') return false
      return window.matchMedia(`(max-width: ${breakpoint - 1}px)`).matches
    },
    () => false,
  )
}
