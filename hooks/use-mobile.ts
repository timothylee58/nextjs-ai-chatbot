/**
 * @fileoverview Hook that detects whether the current viewport is a mobile
 * device.
 *
 * Uses `window.matchMedia` to listen for viewport width changes against a
 * 768 px breakpoint. Returns `true` when the window width is below the
 * breakpoint and `false` otherwise. During SSR the value defaults to `false`.
 */
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
