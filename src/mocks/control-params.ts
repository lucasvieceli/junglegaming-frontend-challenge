export const CONTROL_PARAMS = ['scenario', 'reset', 'user']

// Runs before the router reads the URL, so a refresh doesn't reapply them.
export function takeControlParams(): URL {
  const original = new URL(window.location.href)
  if (CONTROL_PARAMS.some((param) => original.searchParams.has(param))) {
    const clean = new URL(original)
    CONTROL_PARAMS.forEach((param) => clean.searchParams.delete(param))
    window.history.replaceState(window.history.state, '', clean.toString())
  }
  return original
}
