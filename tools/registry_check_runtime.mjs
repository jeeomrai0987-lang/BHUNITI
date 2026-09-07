/**
 * Everything in the Digital Registry section that can be executed without
 * React, executed.
 *
 * `registry_check_catalogs.mjs` compares the two catalogs against each other
 * and `registry_check_source.mjs` parses the JSX. Neither one runs any of the
 * code. This does: it imports the translator and the fee module for real,
 * resolves every key the pages ask for against both catalogs, renders every
 * catalog entry in both locales, and checks the arithmetic that two pages used
 * to disagree on.
 *
 * It works with no `node_modules` because `i18n/translator.js`,
 * `i18n/catalogs.js` and `lib/fees.js` are plain ESM importing nothing but each
 * other — which is the reason the React context was kept in a separate
 * `index.jsx`.
 *
 *   node tools/registry_check_runtime.mjs      # from the repo root
 */

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve as resolvePath } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

// The section is a subtree of the site's app rather than its own repo, so paths
// are anchored to this file instead of to the shell's cwd.
const ROOT = resolvePath(dirname(fileURLToPath(import.meta.url)), '..', 'bhuniti-react', 'src', 'registry')
const SRC = ROOT

const problems = []
const notes = []
const fail = (where, message) => problems.push(`${where}: ${message}`)

/** Every .js/.jsx file under src/, so a new page cannot escape the scan. */
function sourceFiles(dir = SRC, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) sourceFiles(full, out)
    else if (/\.jsx?$/.test(entry)) out.push(full)
  }
  return out
}

const FILES = sourceFiles().sort()
const read = (file) => readFileSync(file, 'utf8')
const rel = (file) => relative(ROOT, file).split('\\').join('/')

/** Strip comments before scanning for calls, so prose cannot fake a call site. */
function dropComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1')
}

// ---------------------------------------------------------------------------
// 1. Which keys does the source actually ask for?
// ---------------------------------------------------------------------------

/**
 * Each page defines a one-letter namespace helper:
 *   const k = (key, vars) => t(`pages.tracking.${key}`, vars)
 * Find them so `k('badge')` can be expanded to `pages.tracking.badge`.
 */
const HELPER_DEF = /const\s+(\w+)\s*=\s*\([^)]*\)\s*=>\s*t(?:Or)?\(\s*`([^`]*?)\$\{key\}`/g

/** `t('a.b')`, `tOr('a.b', …)` and helper calls. Group 2 is the literal. */
const callSites = (src, name) =>
  new RegExp(`(?:^|[^\\w.$])${name}\\(\\s*(['"\`])([^'"\`]*?)\\1`, 'g')

/** A helper call whose argument is a template with a `${}` hole in it. */
const dynamicSites = (src, name) =>
  new RegExp(`(?:^|[^\\w.$])${name}\\(\\s*\`([^\`]*?\\$\\{[^\`]*?)\``, 'g')

const lineOf = (src, index) => src.slice(0, index).split('\n').length

/** key -> "file:line" of the first place that asked for it. */
const exact = new Map()
/** Template patterns with a hole, as { where, pattern } after prefixing. */
const patterns = []

for (const file of FILES) {
  const src = dropComments(read(file))
  const helpers = new Map([['t', ''], ['tOr', '']])

  for (const [, name, prefix] of src.matchAll(HELPER_DEF)) helpers.set(name, prefix)

  for (const [name, prefix] of helpers) {
    for (const m of src.matchAll(callSites(src, name))) {
      const key = prefix + m[2]
      if (!key || key.includes('${') || !/^[\w.]+$/.test(key)) continue
      if (!exact.has(key)) exact.set(key, `${rel(file)}:${lineOf(src, m.index)}`)
    }
    for (const m of src.matchAll(dynamicSites(src, name))) {
      patterns.push({ where: `${rel(file)}:${lineOf(src, m.index)}`, pattern: prefix + m[1] })
    }
  }
}

// ---------------------------------------------------------------------------
// 2. Expand the dynamic keys from the arrays that drive them
// ---------------------------------------------------------------------------

/** Text of `const NAME = [ … ]`, brackets balanced. */
function arrayLiteral(file, name) {
  const src = read(join(ROOT, file))
  const start = src.search(new RegExp(`const\\s+${name}\\s*=\\s*\\[`))
  if (start === -1) return null
  let depth = 0
  for (let i = src.indexOf('[', start); i < src.length; i += 1) {
    if (src[i] === '[') depth += 1
    else if (src[i] === ']' && (depth -= 1) === 0) return src.slice(start, i + 1)
  }
  return null
}

const STRINGS = /'([\w.]+)'/g
const KEY_FIELD = /\bkey:\s*'([\w.]+)'/g

/**
 * Every `t(\`…${x}…\`)` in the app is driven by one of these module-level
 * arrays, so the holes can be filled in exactly rather than approximately.
 */
const ENUMERATIONS = [
  ['routes.js', 'WIZARD_STEPS', KEY_FIELD, (v) => [`steps.${v}.short`, `steps.${v}.title`, `steps.${v}.hint`]],
  ['pages/OwnerAndParty.jsx', 'ID_TYPES', STRINGS, (v) => [`pages.owner.transferee.idTypes.${v}`]],
  ['pages/OwnerAndParty.jsx', 'PARTY_ROLES', STRINGS, (v) => [`pages.owner.parties.roles.${v}`]],
  ['pages/TransactionsDocuments.jsx', 'TRANSACTION_TYPES', STRINGS, (v) => [`pages.transaction.types.${v}`]],
  ['pages/TransactionsDocuments.jsx', 'PURPOSES', STRINGS, (v) => [`landUse.${v}`]],
  ['pages/ReviewSubmission.jsx', 'RECONCILIATION', STRINGS, (v) => [`pages.review.reconciliation.${v}`]],
  ['pages/ReviewSubmission.jsx', 'DOCUMENTS', KEY_FIELD, (v) => [`pages.review.documentsCard.${v}Name`, `pages.review.documentsCard.${v}Meta`]],
  ['pages/ReviewSubmission.jsx', 'DOCUMENTS', /\bunit:\s*'([\w.]+)'/g, (v) => [v]],
  ['pages/RegistryTracking.jsx', 'PENDING_STAGES', KEY_FIELD, (v) => [`pages.tracking.timeline.${v}Title`, `pages.tracking.timeline.${v}Body`]],
  ['pages/RegistryTracking.jsx', 'RECENT', /\bparcelKey:\s*'([\w.]+)'/g, (v) => [`pages.tracking.recent.${v}`]],
  ['pages/RegistryTracking.jsx', 'RECENT', /\bstatusKey:\s*'([\w.]+)'/g, (v) => [v]],
]

let expanded = 0
for (const [file, name, pick, keys] of ENUMERATIONS) {
  const literal = arrayLiteral(file, name)
  if (!literal) {
    fail(`${file}`, `const ${name} = [ … ] not found — the enumeration table is stale`)
    continue
  }
  const values = [...literal.matchAll(pick)].map((m) => m[1])
  if (values.length === 0) fail(`${file}`, `${name} yielded no values for ${pick}`)
  for (const value of values)
    for (const key of keys(value)) {
      expanded += 1
      if (!exact.has(key)) exact.set(key, `${file} (${name}: ${value})`)
    }
}

// ---------------------------------------------------------------------------
// 3. Import the real modules and resolve every key in both locales
// ---------------------------------------------------------------------------

const load = (p) => import(pathToFileURL(resolvePath(ROOT, p)).href)
const { default: CATALOGS } = await load('i18n/catalogs.js')
const translator = await load('i18n/translator.js')
const fees = await load('lib/fees.js')

const { LOCALES, createTranslator, createFallbackTranslator, createFormatters } = translator

/** Per-locale translator with **no** English fallback, so `hi` is judged alone. */
const strict = Object.fromEntries(
  LOCALES.map((locale) => [locale, createTranslator({ [locale]: CATALOGS[locale] }, locale)]),
)

/** Flatten a catalog to `dotted.key -> string`. */
function leaves(node, prefix = '', out = new Map()) {
  for (const [key, value] of Object.entries(node ?? {})) {
    const path = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'string') out.set(path, value)
    else if (value && typeof value === 'object') leaves(value, path, out)
  }
  return out
}

const LEAVES = Object.fromEntries(LOCALES.map((l) => [l, leaves(CATALOGS[l])]))
const PLURAL = /_(one|other)$/

for (const [key, where] of [...exact].sort()) {
  for (const locale of LOCALES) {
    const hasPlural =
      LEAVES[locale].has(`${key}_one`) && LEAVES[locale].has(`${key}_other`)
    if (hasPlural || LEAVES[locale].has(key)) continue
    fail(where, `${locale} catalog has no entry for '${key}'`)
  }
}

/** A dynamic pattern must match at least one entry, or the hole is misspelt. */
for (const { where, pattern } of patterns) {
  const rx = new RegExp(`^${pattern.replace(/[.]/g, '\\.').replace(/\$\{[^}]*\}/g, '[\\w]+')}$`)
  for (const locale of LOCALES) {
    if ([...LEAVES[locale].keys()].some((key) => rx.test(key.replace(PLURAL, '')))) continue
    fail(where, `${locale}: nothing in the catalog can match \`${pattern}\``)
  }
}

// ---------------------------------------------------------------------------
// 4. Render every entry in both locales
// ---------------------------------------------------------------------------

const render = Object.fromEntries(
  LOCALES.map((locale) => [locale, createTranslator(CATALOGS, locale)]),
)
const PLACEHOLDER = /\{\{(\w+)\}\}/g
const sampleFor = (name) => (name === 'count' ? 2 : `«${name}»`)

let rendered = 0
for (const [key, english] of LEAVES.en) {
  // Sample vars come from the *English* template only. That is the set the call
  // sites actually pass, so a Hindi string carrying an extra placeholder shows
  // up here as an unfilled `{{…}}` rather than being quietly satisfied.
  const names = [...english.matchAll(PLACEHOLDER)].map((m) => m[1])
  const vars = Object.fromEntries(names.map((n) => [n, sampleFor(n)]))

  for (const locale of LOCALES) {
    const out = render[locale](key, names.length ? vars : undefined)
    rendered += 1
    if (out === key) fail(`${locale}:${key}`, 'renders as its own key — lookup missed')
    if (out.includes('{{')) fail(`${locale}:${key}`, `placeholder left unfilled: ${out}`)
    if (out.trim() === '') fail(`${locale}:${key}`, 'renders empty')
  }
}

/** A `_one` without its `_other` (or vice versa) silently disables pluralisation. */
for (const locale of LOCALES)
  for (const key of LEAVES[locale].keys()) {
    if (!PLURAL.test(key)) continue
    const twin = key.endsWith('_one') ? key.replace(/_one$/, '_other') : key.replace(/_other$/, '_one')
    if (!LEAVES[locale].has(twin)) fail(`${locale}:${key}`, `has no '${twin}'`)
  }

/** `tOr` must hand back the fallback, not the dotted key, on a miss. */
const tOr = createFallbackTranslator(render.en)
if (tOr('pages.parcel.places.nowhere', 'Nowhere') !== 'Nowhere')
  fail('translator', 'tOr() did not fall back to its second argument')
if (render.en('there.is.no.such.key') !== 'there.is.no.such.key')
  fail('translator', 't() should return the key on a miss')

// ---------------------------------------------------------------------------
// 5. The arithmetic the two pages used to disagree about
// ---------------------------------------------------------------------------

const near = (a, b) => Math.abs(a - b) < 1e-6
const money = fees.feeBreakdown(4_500_000)

if (!near(money.stampDuty, money.consideration * money.rates.stampDuty))
  fail('lib/fees.js', 'stampDuty does not equal consideration × rates.stampDuty')
if (!near(money.total, money.stampDuty + money.registration + money.cess))
  fail('lib/fees.js', 'total is not the sum of the three fees')
if (!near(money.marketValue, money.consideration * fees.MARKET_VALUE_FACTOR))
  fail('lib/fees.js', 'marketValue does not follow MARKET_VALUE_FACTOR')
if (fees.effectiveConsideration('') !== fees.SAMPLE_CONSIDERATION)
  fail('lib/fees.js', 'an empty field should fall back to SAMPLE_CONSIDERATION')
if (fees.effectiveConsideration('45,00,000') !== 4_500_000)
  fail('lib/fees.js', 'a grouped Indian number should parse')
if (fees.effectiveConsideration('1') !== 1)
  fail('lib/fees.js', 'a typed value must win over the sample')
if (!near(fees.parcelAreaHectares(), fees.PARCEL_AREA_ACRES * fees.ACRE_IN_HECTARES))
  fail('lib/fees.js', 'parcelAreaHectares() is not a conversion of PARCEL_AREA_ACRES')

/** The old bug was a percentage typed beside a figure it disagreed with. */
for (const file of FILES) {
  const hits = [...dropComments(read(file)).matchAll(/['"][^'"]*\(\d+(?:\.\d+)?%\)/g)]
  for (const hit of hits) fail(rel(file), `hard-coded percentage in a label: ${hit[0]}`)
}

// ---------------------------------------------------------------------------
// 6. Report
// ---------------------------------------------------------------------------

const fmt = Object.fromEntries(LOCALES.map((l) => [l, createFormatters(l)]))
const WHEN = new Date(2026, 7, 31, 14, 32)
notes.push('locale  number       currency        decimal  date                     time')
for (const locale of LOCALES) {
  const f = fmt[locale]
  notes.push(
    `${locale}-IN   ${f.formatNumber(4500000).padEnd(12)} ${f.formatCurrency(270000).padEnd(15)} ` +
      `${f.formatDecimal(0.85).padEnd(8)} ${f.formatDate(WHEN).padEnd(24)} ${f.formatTime(WHEN)}`,
  )
  if (f.formatDate('') !== '') fail(`${locale} formatters`, 'an empty date should format as ""')
  if (f.formatDate(new Date('nope')) !== '')
    fail(`${locale} formatters`, 'an invalid date should format as ""')
}

/**
 * Hindi month names must come out in Devanagari. Digits deliberately do not:
 * CLDR's default numbering system for `hi` is `latn`, and a registry showing
 * legal figures should not be the one place that departs from that.
 */
const hiDate = fmt.hi.formatDate(WHEN)
if (!/[ऀ-ॿ]/.test(hiDate))
  fail('hi formatters', `expected a Devanagari month name, got ${hiDate}`)
if (!fmt.hi.formatCurrency(270000).includes('₹'))
  fail('hi formatters', 'the rupee symbol went missing')
if (fmt.en.formatNumber(4500000) !== '45,00,000')
  fail('en formatters', 'expected lakh grouping from en-IN')

/*
 * The locale bridge. The section's provider is controlled by the site's
 * LanguageProvider, so the visitor makes one choice and both catalogs answer to
 * it. That only holds while the two runtimes support the same locales: add one
 * to the site alone and the wizard would quietly serve English for it, since
 * `normalizeLocale` falls back rather than throwing. Cheap to check, so check.
 */
const { SUPPORTED_LOCALES: SITE_LOCALES } = await import(
  pathToFileURL(resolvePath(ROOT, '..', 'i18n', 'locale-store.js')).href
)
for (const locale of SITE_LOCALES) {
  if (!LOCALES.includes(locale)) {
    fail('locale bridge', `the site offers '${locale}' and the registry does not`)
  }
}
for (const locale of LOCALES) {
  if (!SITE_LOCALES.includes(locale)) {
    fail('locale bridge', `the registry offers '${locale}' and the site does not`)
  }
}
notes.push(`locale bridge: site [${SITE_LOCALES.join(', ')}] = registry [${LOCALES.join(', ')}]`)

console.log(`${FILES.length} source files scanned`)
console.log(`${exact.size} distinct keys requested (${expanded} of them expanded from enumerations)`)
console.log(`${patterns.length} dynamic key patterns, each matched in both catalogs`)
console.log(`${rendered} renders across ${LOCALES.length} locales, every placeholder filled`)
for (const note of notes) console.log(`  ${note}`)

if (problems.length) {
  console.error(`\n${problems.length} problem${problems.length === 1 ? '' : 's'}:`)
  for (const problem of problems) console.error(`  ${problem}`)
  process.exit(1)
}
console.log('\nOK — every key resolves in English and Hindi, and the fee arithmetic agrees.')
