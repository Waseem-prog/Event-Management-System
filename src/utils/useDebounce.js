import { useEffect, useState } from 'react'

// Returns `value` only after it has stopped changing for `delay` ms.
// Used so typing in the search box does not call the API on every keystroke
// (Ticketmaster allows only 2 requests per second).
export function useDebounce(value, delay = 450) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer) // restart the wait on every new keystroke
  }, [value, delay])
  return debounced
}
