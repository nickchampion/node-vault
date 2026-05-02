import { breakpointsTailwind, useBreakpoints as useTailwindBreakpoints } from '@vueuse/core'

export function useBreakpoints() {
  const breakpoint = useTailwindBreakpoints({
    xs: 0,
    ...breakpointsTailwind,
  }, {
    ssrWidth: 768, // Will enable SSR mode and render like if the screen was 768px wide
  })

  const activeBreakpoint = breakpoint.active()

  return {
    breakpoint,
    activeBreakpoint,
    ...breakpoint,
  }
}
