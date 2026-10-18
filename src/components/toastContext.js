import { createContext, useContext } from 'react'

// Context holding showToast(message, type). Provider lives in ToastProvider.jsx.
export const ToastContext = createContext({ showToast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}
