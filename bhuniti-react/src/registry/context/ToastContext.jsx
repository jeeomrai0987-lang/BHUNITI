import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { useI18n } from '../i18n/index.jsx'

/**
 * One polite live region for the whole app.
 *
 * Several controls in the prototype looked interactive but went nowhere —
 * six `<a href="#">` links in the footer, a "Cancel upload" button, a "More
 * actions" button, an `<a href="#guidelines">` pointing at an id that does
 * not exist. Rather than leave them silently inert, each now says so.
 *
 * The region is mounted for the lifetime of the app and starts empty. A live
 * region that appears at the same moment as its first message is unreliable:
 * screen readers need it present beforehand to notice the change.
 */

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [message, setMessage] = useState('')
  const timer = useRef(null)

  const notify = useCallback((text) => {
    if (timer.current) clearTimeout(timer.current)
    // Re-announce an identical message by clearing first, otherwise the DOM
    // text never changes and nothing is read out.
    setMessage('')
    timer.current = setTimeout(() => {
      setMessage(text)
      timer.current = setTimeout(() => setMessage(''), 6000)
    }, 40)
  }, [])

  const value = useMemo(() => ({ notify, message }), [notify, message])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastRegion message={message} />
    </ToastContext.Provider>
  )
}

function ToastRegion({ message }) {
  const { t } = useI18n()
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={t('toastRegionLabel')}
      className="fixed inset-x-0 bottom-0 z-[1000] flex justify-center px-4 pb-6 pointer-events-none"
    >
      {message ? (
        <p className="max-w-xl rounded-xl bg-on-surface/90 px-4 py-3 text-white font-body-sm shadow-lg">
          {message}
        </p>
      ) : null}
    </div>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}

/**
 * Shared handler for the prototype's decorative links. Keeps the wording in
 * one place so all of them announce the same way.
 */
export function useDemoNotice() {
  const { notify } = useToast()
  const { t } = useI18n()
  return useCallback((label) => notify(t('demoOnly', { label })), [notify, t])
}
