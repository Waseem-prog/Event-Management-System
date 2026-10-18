import { useEffect } from 'react'

// Sets the browser tab title for the current page, e.g. "My Events | EventHub".
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | EventHub` : 'EventHub'
  }, [title])
}
