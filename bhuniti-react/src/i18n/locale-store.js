/*
 * Locale plumbing with no React in it.
 *
 * `services/api.js` needs to know the active locale so it can send `?lang=` to
 * the backend, but it is a plain module -- it cannot call a hook. So the active
 * locale lives here, in module scope, and `i18n/index.js` keeps it in step with
 * React state. Importing this file never pulls React in.
 */

/** Locales the UI ships translations for. The backend also serves mr/bn/ta. */
export const SUPPORTED_LOCALES = ["en", "hi"];

export const DEFAULT_LOCALE = "en";

/** BCP 47 tags for Intl. India-specific so dates read dd/mm/yyyy and numbers
 *  group in lakhs/crores. */
export const LOCALE_TAGS = {
  en: "en-IN",
  hi: "hi-IN",
};

/** How each language names itself, for the switcher. */
export const LOCALE_NAMES = {
  en: { endonym: "English", exonym: "English", short: "EN" },
  hi: { endonym: "हिन्दी", exonym: "Hindi", short: "हि" },
};

const STORAGE_KEY = "bhuniti_locale";

/**
 * Coerce anything into a supported locale code, or null.
 * Accepts "hi", "HI", "hi-IN", "hi_IN".
 * @param {unknown} value
 * @returns {string|null}
 */
export function normalizeLocale(value) {
  if (typeof value !== "string") return null;
  const base = value.trim().toLowerCase().replace("_", "-").split("-")[0];
  return SUPPORTED_LOCALES.includes(base) ? base : null;
}

/**
 * The locale to start in: a previous choice, else the browser's preference,
 * else English. Every storage access is guarded -- Safari private mode throws
 * on localStorage rather than returning null.
 * @returns {string}
 */
export function readStoredLocale() {
  try {
    const saved = normalizeLocale(window.localStorage.getItem(STORAGE_KEY));
    if (saved) return saved;
  } catch {
    /* storage unavailable; fall through to the browser preference */
  }
  try {
    const preferred = Array.isArray(navigator.languages) && navigator.languages.length
      ? navigator.languages
      : [navigator.language];
    for (const tag of preferred) {
      const match = normalizeLocale(tag);
      if (match) return match;
    }
  } catch {
    /* no navigator (tests, SSR) */
  }
  return DEFAULT_LOCALE;
}

/** Remember the choice for the next visit. Failure here is not worth an error. */
export function writeStoredLocale(locale) {
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    /* ignored */
  }
}

let activeLocale = DEFAULT_LOCALE;

/** The locale non-React modules should use. @returns {string} */
export function getLocale() {
  return activeLocale;
}

/** Called by the provider whenever the React-side locale changes. */
export function setActiveLocale(locale) {
  activeLocale = normalizeLocale(locale) || DEFAULT_LOCALE;
  return activeLocale;
}

/** The Intl tag for a locale code. @returns {string} */
export function localeTag(locale) {
  return LOCALE_TAGS[normalizeLocale(locale) || DEFAULT_LOCALE];
}
