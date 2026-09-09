/*
 * The whole i18n layer, hand-rolled.
 *
 * react-i18next is not used on purpose: this project has to install from a
 * lockfile on machines with no registry access, and adding a dependency for
 * what amounts to a nested-object lookup plus Intl is not a good trade. What is
 * here covers the app's needs -- dotted keys, {{placeholder}} interpolation,
 * count-aware plurals, English fallback for gaps, locale-aware dates and
 * numbers, and a remembered choice.
 *
 * Usage:
 *   const { t, label, formatDate, locale, setLocale } = useI18n();
 *   t("citizen.search.title")
 *   t("citizen.search.count", { count: results.length })
 *   label("verification_status", parcel.verification_status, parcel.verification_status_label)
 *   formatDate(parcel.registered_on)
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import en from "./en/index.js";
import hi from "./hi/index.js";
import {
  DEFAULT_LOCALE,
  LOCALE_NAMES,
  SUPPORTED_LOCALES,
  localeTag,
  normalizeLocale,
  readStoredLocale,
  setActiveLocale,
  writeStoredLocale,
} from "./locale-store.js";

const CATALOGS = { en, hi };

const isDev = Boolean(
  typeof import.meta !== "undefined" && import.meta.env && import.meta.env.DEV
);

/** Keys already reported, so one missing string does not flood the console. */
const reported = new Set();

function warnOnce(key) {
  if (!isDev || reported.has(key)) return;
  reported.add(key);
  // eslint-disable-next-line no-console
  console.warn(`[i18n] missing translation: ${key}`);
}

/**
 * Walk a dotted path through a catalog.
 * @returns {string|undefined} the string at that path, or undefined
 */
function lookup(catalog, path) {
  let node = catalog;
  for (const part of path.split(".")) {
    if (node === null || typeof node !== "object") return undefined;
    node = node[part];
  }
  return typeof node === "string" ? node : undefined;
}

/** Replace every {{name}} with vars.name. Unknown names are left alone. */
function interpolate(template, vars) {
  if (!vars) return template;
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (whole, name) =>
    Object.prototype.hasOwnProperty.call(vars, name) && vars[name] !== undefined
      ? String(vars[name])
      : whole
  );
}

/**
 * Resolve one key. Tries the plural variant first when a count is supplied,
 * then the plain key, then the same two in English. Hindi pluralises like
 * English (one / other), so a two-way split is enough for both locales.
 */
function resolve(locale, path, vars) {
  const candidates = [];
  if (vars && typeof vars.count === "number") {
    candidates.push(`${path}_${vars.count === 1 ? "one" : "other"}`);
  }
  candidates.push(path);

  for (const catalogLocale of [locale, DEFAULT_LOCALE]) {
    const catalog = CATALOGS[catalogLocale];
    if (!catalog) continue;
    for (const candidate of candidates) {
      const hit = lookup(catalog, candidate);
      if (hit !== undefined) return hit;
    }
  }
  return undefined;
}

/**
 * Build the {t, label, formatX} bundle for a locale. Kept outside the provider
 * so `translator()` can also be used from a plain module or a test.
 * @param {string} locale
 */
export function translator(locale) {
  const active = normalizeLocale(locale) || DEFAULT_LOCALE;
  const tag = localeTag(active);
  const dateFormatters = new Map();
  const numberFormatters = new Map();

  const intl = (cache, Factory, options) => {
    const cacheKey = JSON.stringify(options);
    let formatter = cache.get(cacheKey);
    if (!formatter) {
      formatter = new Factory(tag, options);
      cache.set(cacheKey, formatter);
    }
    return formatter;
  };

  /**
   * Translate a dotted key.
   * @param {string} key e.g. "revenue.overview.title"
   * @param {Record<string, unknown>} [vars] values for {{placeholders}}; a
   *        numeric `count` also selects the _one / _other variant
   * @returns {string} the translation, or the key itself if nothing matched
   */
  function t(key, vars) {
    if (typeof key !== "string" || !key) return "";
    const template = resolve(active, key, vars);
    if (template === undefined) {
      warnOnce(`${active}:${key}`);
      return key;
    }
    return interpolate(template, vars);
  }

  /**
   * Render a stored English domain value in the active locale.
   * @param {string} domainName e.g. "verification_status"
   * @param {string} value the English value held in the database
   * @param {string} [serverLabel] the API's *_label field, which already came
   *        back in this locale and therefore wins
   */
  function label(domainName, value, serverLabel) {
    if (serverLabel) return serverLabel;
    if (!value) return "";
    // Looked up directly rather than through a dotted path, because a stored
    // value is free text and may well contain a "." of its own.
    for (const catalogLocale of [active, DEFAULT_LOCALE]) {
      const catalog = CATALOGS[catalogLocale];
      const map = catalog && catalog.domain ? catalog.domain[domainName] : undefined;
      if (map && typeof map === "object" && typeof map[value] === "string") {
        return map[value];
      }
    }
    warnOnce(`${active}:domain.${domainName}.${value}`);
    return value;
  }

  /** Parse whatever the API or a fixture gave us. @returns {Date|null} */
  function toDate(value) {
    if (!value) return null;
    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  /**
   * A date in the active locale. The API sends real ISO dates precisely so the
   * client can do this instead of receiving a pre-formatted English string.
   * @param {string|Date|null|undefined} value
   * @param {Intl.DateTimeFormatOptions} [options]
   */
  function formatDate(value, options) {
    const date = toDate(value);
    if (!date) return "—";
    return intl(dateFormatters, Intl.DateTimeFormat, options || { dateStyle: "medium" })
      .format(date);
  }

  /** Date plus time, for audit entries and timestamps. */
  function formatDateTime(value, options) {
    return formatDate(value, options || { dateStyle: "medium", timeStyle: "short" });
  }

  /** A number grouped the Indian way (1,23,456) under both locales. */
  function formatNumber(value, options) {
    if (value === null || value === undefined || value === "") return "—";
    const numeric = typeof value === "number" ? value : Number(value);
    if (Number.isNaN(numeric)) return String(value);
    return intl(numberFormatters, Intl.NumberFormat, options || {}).format(numeric);
  }

  /** Rupees, no paise -- every amount in this app is a whole-rupee fee. */
  function formatCurrency(value, options) {
    return formatNumber(value, {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
      ...options,
    });
  }

  /** An area in hectares, e.g. "1.245 ha" / "1.245 हे". */
  function formatArea(value, unitKey = "common.units.hectare") {
    if (value === null || value === undefined || value === "") return "—";
    const digits = { minimumFractionDigits: 0, maximumFractionDigits: 4 };
    return `${formatNumber(value, digits)} ${t(unitKey)}`;
  }

  return {
    locale: active,
    tag,
    dir: "ltr",
    t,
    label,
    formatDate,
    formatDateTime,
    formatNumber,
    formatCurrency,
    formatArea,
  };
}

/** Every locale the switcher should offer, with the name each uses for itself. */
export const LOCALE_OPTIONS = SUPPORTED_LOCALES.map((code) => ({
  code,
  ...LOCALE_NAMES[code],
}));

const I18nContext = createContext(null);

/**
 * Wraps the app once, in main.jsx. Holds the chosen locale, mirrors it into
 * `document.documentElement.lang` (so screen readers switch voice and the
 * Devanagari font applies) and into the plain-module store that
 * `services/api.js` reads to send `?lang=`.
 */
export function LanguageProvider({ children, initialLocale }) {
  const [locale, setLocaleState] = useState(
    () => normalizeLocale(initialLocale) || readStoredLocale()
  );

  // Set before the first paint, so the very first API call and the first
  // rendered heading agree on the language.
  const value = useMemo(() => translator(locale), [locale]);
  setActiveLocale(locale);

  useEffect(() => {
    setActiveLocale(locale);
    writeStoredLocale(locale);
    const root = document.documentElement;
    root.setAttribute("lang", value.tag);
    root.setAttribute("dir", value.dir);
    // Lets index.css pick the Devanagari face without every component knowing.
    root.dataset.locale = locale;
    // index.html can only carry one static title; keep the tab in step too.
    document.title = value.t("common.app.browserTitle");
  }, [locale, value]);

  const setLocale = useCallback((next) => {
    const normalized = normalizeLocale(next);
    if (normalized) setLocaleState(normalized);
  }, []);

  const contextValue = useMemo(
    () => ({ ...value, setLocale, locales: LOCALE_OPTIONS }),
    [value, setLocale]
  );

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
}

// Used only if a component somehow renders outside the provider. Returning a
// working English translator keeps a stray component on screen instead of
// crashing a live demo; the dev-only warning still makes the mistake visible.
let orphanFallback = null;

/**
 * The hook every component uses.
 * @returns {{locale: string, tag: string, dir: string, setLocale: (l: string) => void,
 *   locales: Array<{code: string, endonym: string, exonym: string, short: string}>,
 *   t: (key: string, vars?: Record<string, unknown>) => string,
 *   label: (domain: string, value: string, serverLabel?: string) => string,
 *   formatDate: (v: unknown, o?: Intl.DateTimeFormatOptions) => string,
 *   formatDateTime: (v: unknown, o?: Intl.DateTimeFormatOptions) => string,
 *   formatNumber: (v: unknown, o?: Intl.NumberFormatOptions) => string,
 *   formatCurrency: (v: unknown, o?: Intl.NumberFormatOptions) => string,
 *   formatArea: (v: unknown, unitKey?: string) => string}}
 */
export function useI18n() {
  const context = useContext(I18nContext);
  if (context) return context;

  if (isDev) {
    // eslint-disable-next-line no-console
    console.warn("[i18n] useI18n() called outside <LanguageProvider>; using English.");
  }
  if (!orphanFallback) {
    orphanFallback = {
      ...translator(DEFAULT_LOCALE),
      setLocale: () => {},
      locales: LOCALE_OPTIONS,
    };
  }
  return orphanFallback;
}

export { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "./locale-store.js";
export default useI18n;
