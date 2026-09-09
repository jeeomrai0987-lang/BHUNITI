/**
 * Locale core — deliberately free of any React import.
 *
 * Keeping the lookup, interpolation and Intl wrappers in a plain module means
 * they can be exercised by a bare `node` harness (see tools/), which is how
 * this project is validated: there is no bundler step available here, so the
 * translator has to be testable without JSX.
 *
 * `index.jsx` layers the React context on top of everything exported here.
 */

export const LOCALES = ['en', 'hi']
export const DEFAULT_LOCALE = 'en'
export const STORAGE_KEY = 'bhuniti.locale'

/** Display names, each written in its own language. */
export const LOCALE_NAMES = { en: 'English', hi: 'हिंदी' }

/** BCP-47 tags handed to Intl. India-specific so ₹ and lakh/crore grouping work. */
const INTL_TAG = { en: 'en-IN', hi: 'hi-IN' }

export function normalizeLocale(value) {
  if (typeof value !== 'string') return DEFAULT_LOCALE
  const short = value.toLowerCase().split('-')[0]
  return LOCALES.includes(short) ? short : DEFAULT_LOCALE
}

/** Walk a dotted key such as `pages.parcel.title` through a nested object. */
function walk(catalog, key) {
  let node = catalog
  for (const part of key.split('.')) {
    if (node === null || typeof node !== 'object' || !(part in node)) return undefined
    node = node[part]
  }
  return typeof node === 'string' ? node : undefined
}

/**
 * Resolve one catalog, preferring a `_one` / `_other` variant when the caller
 * passed a numeric `count`. A non-numeric `count` must not select a plural
 * form, otherwise `count: undefined` would silently pick `_other`.
 */
function resolve(catalog, key, vars) {
  if (vars && typeof vars.count === 'number') {
    const suffix = Math.abs(vars.count) === 1 ? '_one' : '_other'
    const plural = walk(catalog, key + suffix)
    if (plural !== undefined) return plural
  }
  return walk(catalog, key)
}

/** `{{name}}` → vars.name. Unknown placeholders are left visible on purpose. */
function interpolate(template, vars) {
  if (!vars) return template
  return template.replace(/\{\{(\w+)\}\}/g, (match, name) =>
    name in vars && vars[name] !== undefined && vars[name] !== null
      ? String(vars[name])
      : match,
  )
}

/**
 * @param {Record<string, object>} catalogs keyed by locale
 * @param {string} locale
 * @returns {(key: string, vars?: object) => string}
 */
export function createTranslator(catalogs, locale) {
  const active = catalogs[locale] ?? catalogs[DEFAULT_LOCALE] ?? {}
  const fallback = catalogs[DEFAULT_LOCALE] ?? {}

  return function t(key, vars) {
    if (typeof key !== 'string' || key === '') return ''
    let raw = resolve(active, key, vars)
    if (raw === undefined && active !== fallback) raw = resolve(fallback, key, vars)
    // Returning the key (rather than an empty string) makes a gap in the
    // catalogs visible in the UI instead of silently blanking a label.
    if (raw === undefined) return key
    return interpolate(raw, vars)
  }
}

/**
 * `t()` returns the key itself when a catalog has no entry, which makes gaps
 * visible but is useless for values that legitimately may not be in the
 * catalog at all — a village name typed by the user, say. This wraps `t` so
 * such a lookup falls back to the raw value instead of showing a dotted key.
 */
export function createFallbackTranslator(t) {
  return function tOr(key, fallback, vars) {
    const value = t(key, vars)
    return value === key ? String(fallback ?? '') : value
  }
}

const toDate = (value) => (value instanceof Date ? value : new Date(value))
/** Intl wrappers bound to one locale. All of them tolerate null/invalid input. */
export function createFormatters(locale) {
  const tag = INTL_TAG[normalizeLocale(locale)]

  const whole = new Intl.NumberFormat(tag, { maximumFractionDigits: 0 })
  const twoDp = new Intl.NumberFormat(tag, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  const rupees = new Intl.NumberFormat(tag, {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  })
  const longDate = new Intl.DateTimeFormat(tag, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const shortDate = new Intl.DateTimeFormat(tag, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
  const clock = new Intl.DateTimeFormat(tag, { hour: '2-digit', minute: '2-digit' })

  const guardDate = (value, formatter) => {
    if (value === null || value === undefined || value === '') return ''
    const date = toDate(value)
    return Number.isNaN(date.getTime()) ? '' : formatter.format(date)
  }

  return {
    tag,
    formatNumber: (n) => whole.format(Number(n) || 0),
    formatDecimal: (n) => twoDp.format(Number(n) || 0),
    formatCurrency: (n) => rupees.format(Number(n) || 0),
    formatDate: (value) => guardDate(value, longDate),
    formatDateShort: (value) => guardDate(value, shortDate),
    formatTime: (value) => guardDate(value, clock),
    formatDateTime: (value) => {
      const day = guardDate(value, longDate)
      const time = guardDate(value, clock)
      return day && time ? `${day}, ${time}` : day || time
    },
  }
}

/** localStorage is wrapped because it throws outright in private-mode Safari. */
export function readStoredLocale() {
  try {
    const stored = globalThis.localStorage?.getItem(STORAGE_KEY)
    return stored ? normalizeLocale(stored) : null
  } catch {
    return null
  }
}

export function storeLocale(locale) {
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, normalizeLocale(locale))
  } catch {
    /* Persistence is a nicety; losing it must not break the switcher. */
  }
}
