/**
 * Catalog parity check for the Digital Registry section
 * (bhuniti-react/src/registry).
 *
 * The section keeps its own catalogs — its 332 keys are the wizard's own
 * vocabulary, not the site's — so it gets its own parity check, alongside
 * tools/check_i18n.mjs which does the same job for bhuniti-react/src/i18n.
 *
 * Runs on bare node with no node_modules: every file under
 * src/registry/i18n/{en,hi} is a dependency-free ESM module, so it can be
 * imported directly.
 *
 * Verifies:
 *   1. both locales expose exactly the same set of leaf keys
 *   2. every leaf is a non-empty string
 *   3. every {{placeholder}} in English appears in the Hindi mirror
 *   4. no Hindi leaf is a byte-for-byte copy of the English one, except for
 *      the small allow-list of values that are meant to stay Latin
 *      (file names, ULPINs, the em-dash "not available" marker, e-mail
 *      samples, and so on)
 */
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..', 'bhuniti-react', 'src', 'registry')
const load = async (rel) =>
  (await import(pathToFileURL(path.join(ROOT, rel)).href)).default

/** Flatten a nested catalog into `{ 'a.b.c': 'value' }`. */
function flatten(node, prefix = '', out = {}) {
  for (const [key, value] of Object.entries(node)) {
    const full = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      flatten(value, full, out)
    } else {
      out[full] = value
    }
  }
  return out
}

const placeholders = (value) =>
  [...String(value).matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]).sort().join(',')

/**
 * Values that are allowed to be identical across locales: proper nouns that
 * are conventionally written in Latin script, sample e-mail addresses, file
 * names, and pure punctuation.
 */
const SAME_OK = /(\.pdf|@|^—$|^%$|^\d|^[A-Z]{2}-|Draft_|_Extract_|NOC_)/
/** A template made only of placeholders and punctuation has nothing to translate. */
const PURE_TEMPLATE = (value) =>
  String(value).replace(/\{\{\w+\}\}/g, '').trim().replace(/[\s\p{P}\p{S}]/gu, '') === ''
const SAME_OK_KEYS = new Set([
  'notAvailable',
  'units.percent',
  'pages.owner.transferee.emailPlaceholder',
  'pages.transaction.valuePlaceholder',
  'pages.owner.transferee.mobilePlaceholder',
])

const problems = []
const note = (msg) => problems.push(msg)

const en = flatten(await load('i18n/en/index.js'))
const hi = flatten(await load('i18n/hi/index.js'))

const enKeys = Object.keys(en).sort()
const hiKeys = Object.keys(hi).sort()

for (const key of enKeys) if (!(key in hi)) note(`missing in hi: ${key}`)
for (const key of hiKeys) if (!(key in en)) note(`extra in hi:   ${key}`)

let identical = 0
for (const key of enKeys) {
  const a = en[key]
  const b = hi[key]
  if (typeof a !== 'string' || a.trim() === '') note(`en not a string: ${key}`)
  if (key in hi) {
    if (typeof b !== 'string' || b.trim() === '') note(`hi not a string: ${key}`)
    if (placeholders(a) !== placeholders(b)) {
      note(`placeholder drift: ${key} — en(${placeholders(a)}) hi(${placeholders(b)})`)
    }
    if (a === b && !SAME_OK.test(a) && !SAME_OK_KEYS.has(key) && !PURE_TEMPLATE(a)) {
      identical += 1
      note(`untranslated: ${key} = ${JSON.stringify(a)}`)
    }
  }
}

console.log(`en keys: ${enKeys.length}`)
console.log(`hi keys: ${hiKeys.length}`)
console.log(`identical values needing review: ${identical}`)

if (problems.length) {
  console.log(`\n${problems.length} problem(s):`)
  for (const p of problems) console.log(`  - ${p}`)
  process.exit(1)
}
console.log('\nOK — catalogs are in full parity.')
