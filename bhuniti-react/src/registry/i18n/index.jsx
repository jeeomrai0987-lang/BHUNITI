import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import CATALOGS from './catalogs.js'
import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_NAMES,
  createFallbackTranslator,
  createFormatters,
  createTranslator,
  normalizeLocale,
  readStoredLocale,
  storeLocale,
} from './translator.js'

export { LOCALES, LOCALE_NAMES, DEFAULT_LOCALE }

const I18nContext = createContext(null)

/** Prefer a stored choice, then the browser's language, then English. */
function initialLocale() {
  const stored = readStoredLocale()
  if (stored) return stored
  const nav = globalThis.navigator
  const candidates = nav?.languages?.length ? nav.languages : [nav?.language]
  for (const candidate of candidates) {
    if (typeof candidate !== 'string') continue
    const short = candidate.toLowerCase().split('-')[0]
    if (LOCALES.includes(short)) return short
  }
  return DEFAULT_LOCALE
}

/**
 * Uncontrolled (standalone) the provider owns the locale and persists it.
 * Controlled — pass `locale` and `onLocaleChange`, which is what the embedded
 * `RegistrySection` does — the host owns it: the value comes from above, the
 * wizard's own switcher reports upwards instead of forking a second choice, and
 * this provider keeps its hands off `localStorage`, `<html lang>` and the tab
 * title, all three of which the host is already managing.
 */
export function I18nProvider({ children, locale: controlledLocale, onLocaleChange }) {
  const embedded = controlledLocale !== undefined
  const [ownLocale, setOwnLocale] = useState(initialLocale)
  const locale = embedded ? normalizeLocale(controlledLocale) : ownLocale

  const setLocale = useCallback(
    (next) => {
      const normalized = normalizeLocale(next)
      if (onLocaleChange) {
        onLocaleChange(normalized)
        return
      }
      setOwnLocale(normalized)
      storeLocale(normalized)
    },
    [onLocaleChange],
  )

  // The original index.html hard-coded `lang="en"`, so a screen reader kept
  // applying English pronunciation to Devanagari text. Drive it from state
  // instead, and keep the document title in the active language too.
  useEffect(() => {
    if (embedded) return
    const root = globalThis.document?.documentElement
    if (root) root.lang = locale
  }, [embedded, locale])

  const value = useMemo(() => {
    const t = createTranslator(CATALOGS, locale)
    return { locale, setLocale, t, tOr: createFallbackTranslator(t), ...createFormatters(locale) }
  }, [locale, setLocale])

  useEffect(() => {
    if (embedded) return
    if (globalThis.document) globalThis.document.title = value.t('app.title')
  }, [embedded, value])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>')
  return ctx
}
