import { useCallback, useRef, useState } from 'react'
import { ToastContext } from './toast-context'
import Toast from './Toast'

const AUTO_DISMISS_MS = 4000

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  const timerRef = useRef(null)

  const dismiss = useCallback(() => {
    setToast(null)
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  const showToast = useCallback((message, tone = 'info') => {
    setToast({ message, tone })
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setToast(null), AUTO_DISMISS_MS)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast message={toast?.message} tone={toast?.tone} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}
