#!/usr/bin/env node
/**
 * check_source.mjs — structural validation with plain node and no node_modules.
 *
 * The sandbox this project was built in blocks the npm registry, so there is no
 * babel, no ESLint and no React here: `vite build` cannot run, and neither can
 * anything that parses JSX off the shelf. This script therefore carries its own
 * small JSX stripper. It rewrites every element into a `__jsx(...)` call that
 * keeps all embedded expressions in place, then hands the result to
 * `node --check`, so a syntax error inside an attribute, a `.map()` callback or
 * a nested template literal is still caught.
 *
 * On top of the syntax check it verifies, per file:
 *   - every JSX element is closed by a tag with the same name
 *   - every (), [] and {} pair balances
 *   - every capitalised JSX tag is imported or declared
 *   - every lowercase JSX tag is a real HTML or SVG element
 *   - every use*() hook that is called is in scope
 *   - every relative import resolves, and its named imports really are exported
 *   - every PATHS.* reference exists in routes.js
 *   - every route the section links to is mounted in the host's src/App.jsx
 *   - every REGISTRY_ROUTES.* the host uses is a real segment
 *   - the section's own stylesheet stays scoped to .registry-scope
 *   - every colour / font / animation class resolves in tailwind.config.js
 *
 * Usage:  node tools/check_source.mjs      (from the repo root)
 */

import { execFileSync } from 'node:child_process'
import {
  existsSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// The wizard is a subtree of the site's app (src/registry) rather than its own
// repo, so ROOT is the app and SECTION is the part this script owns. The root
// config files are the app's — which is the point: the section's classes have to
// resolve in the merged tailwind.config.js, not in the one it arrived with.
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'bhuniti-react')
const SECTION = join(ROOT, 'src', 'registry')
const rel = (file) => relative(ROOT, file)

const problems = []
const notes = []
const fail = (file, message) => problems.push(`${rel(file)}: ${message}`)

/** Every .js/.jsx file under src/registry, plus the three root config files. */
const sources = []
;(function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) walk(full)
    else if (/\.(jsx|js|mjs)$/.test(entry.name)) sources.push(full)
  }
})(SECTION)
for (const name of ['vite.config.js', 'tailwind.config.js', 'postcss.config.js']) {
  const full = join(ROOT, name)
  if (existsSync(full)) sources.push(full)
}

const HTML_TAGS = new Set(
  `a abbr address area article aside audio b base bdi bdo blockquote body br button canvas
   caption cite code col colgroup data datalist dd del details dfn dialog div dl dt em embed
   fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe
   img input ins kbd label legend li link main map mark menu meta meter nav noscript object ol
   optgroup option output p param picture pre progress q rp rt ruby s samp script section select
   slot small source span strong style sub summary sup table tbody td template textarea tfoot th
   thead time tr track u ul video wbr`.split(/\s+/),
)

const SVG_TAGS = new Set(
  `svg g path circle ellipse line polyline polygon rect text tspan textPath defs use symbol
   marker mask clipPath pattern linearGradient radialGradient stop filter feGaussianBlur
   feOffset feMerge feMergeNode animate animateTransform foreignObject image title desc`.split(
    /\s+/,
  ),
)

/** Identifiers after which a `<` opens JSX and a `/` opens a regex. */
const EXPRESSION_KEYWORDS = new Set([
  'return', 'typeof', 'case', 'in', 'of', 'do', 'else', 'yield', 'await', 'new', 'delete',
  'void', 'instanceof', 'default', 'extends',
])

const dropComments = (text) =>
  text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/[^\n]*/gm, '')

/**
 * Rewrite one file's JSX into plain JS.
 *
 * Returns the rewritten source plus everything worth asserting about it: the
 * tags that were opened, and the identifiers that were called (used for the
 * hook-scope check, and gathered here rather than by regex so that a mention
 * inside a comment or a string cannot be mistaken for a call).
 */
function transpile(src, file) {
  let pos = 0
  let out = []
  let lastTok = ''
  const tags = []
  const calls = new Set()
  const members = new Set()
  const delimiters = []

  const lineAt = (at) => src.slice(0, at).split('\n').length
  const emit = (text) => out.push(text)
  const capture = (fn) => {
    const saved = out
    out = []
    fn()
    const text = out.join('')
    out = saved
    return text
  }
  const newlinesIn = (from, to) => '\n'.repeat((src.slice(from, to).match(/\n/g) || []).length)

  const atExpressionStart = () => {
    if (lastTok === '') return true
    if (EXPRESSION_KEYWORDS.has(lastTok)) return true
    if (/^[A-Za-z_$][\w$]*$/.test(lastTok)) return false
    if (lastTok === '#string' || lastTok === '#template' || lastTok === '#regex') return false
    if (lastTok === '#jsx' || lastTok === '#number') return false
    return !')]}'.includes(lastTok)
  }

  const skipTrivia = () => {
    for (;;) {
      const ch = src[pos]
      if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
        pos++
        continue
      }
      if (ch === '/' && src[pos + 1] === '/') {
        const end = src.indexOf('\n', pos)
        pos = end === -1 ? src.length : end
        continue
      }
      if (ch === '/' && src[pos + 1] === '*') {
        const end = src.indexOf('*/', pos + 2)
        pos = end === -1 ? src.length : end + 2
        continue
      }
      return
    }
  }

  const readWord = () => {
    const re = /[A-Za-z_$][\w$]*/y
    re.lastIndex = pos
    return re.exec(src)?.[0]
  }

  function readString() {
    const quote = src[pos]
    let i = pos + 1
    while (i < src.length) {
      if (src[i] === '\\') {
        i += 2
        continue
      }
      if (src[i] === quote) {
        i++
        break
      }
      if (src[i] === '\n') {
        fail(file, `unterminated string at line ${lineAt(pos)}`)
        break
      }
      i++
    }
    const raw = src.slice(pos, i)
    pos = i
    return raw
  }

  function readRegex() {
    let i = pos + 1
    let inClass = false
    while (i < src.length) {
      const ch = src[i]
      if (ch === '\\') {
        i += 2
        continue
      }
      if (ch === '[') inClass = true
      else if (ch === ']') inClass = false
      else if (ch === '/' && !inClass) {
        i++
        break
      } else if (ch === '\n') {
        fail(file, `unterminated regex at line ${lineAt(pos)}`)
        break
      }
      i++
    }
    while (i < src.length && /[a-z]/.test(src[i])) i++
    const raw = src.slice(pos, i)
    pos = i
    return raw
  }

  /** Template literals are emitted as they go, because `${}` re-enters JS. */
  function readTemplate() {
    const start = pos
    emit('`')
    pos++
    while (pos < src.length) {
      const ch = src[pos]
      if (ch === '\\') {
        emit(src.slice(pos, pos + 2))
        pos += 2
        continue
      }
      if (ch === '`') {
        emit('`')
        pos++
        return
      }
      if (ch === '$' && src[pos + 1] === '{') {
        emit('${')
        pos += 2
        delimiters.push({ ch: '{', at: pos })
        lastTok = '{'
        scanJs(true)
        delimiters.pop()
        if (src[pos] === '}') {
          emit('}')
          pos++
        } else fail(file, `unterminated \${…} at line ${lineAt(start)}`)
        continue
      }
      emit(ch)
      pos++
    }
    fail(file, `unterminated template literal at line ${lineAt(start)}`)
  }

  /** `{ expr }` in an attribute or a child position. Returns '' to drop it. */
  function readBraced(where) {
    const open = pos
    pos++
    delimiters.push({ ch: '{', at: pos })
    // A container is a fresh expression context: `element={<Navigate />}` must
    // read its `<` as JSX, not as a comparison against whatever came before.
    lastTok = '{'
    const inner = capture(() => scanJs(true))
    delimiters.pop()
    if (src[pos] === '}') pos++
    else fail(file, `unterminated {…} in ${where} at line ${lineAt(open)}`)
    const code = dropComments(inner).trim()
    if (!code) return newlinesIn(open, pos) // a `{/* comment */}` and nothing else
    // A spread has to stay a bare argument: `__jsx(...rest)`, not `(...rest)`.
    return code.startsWith('...') ? `${inner},` : `(${inner}),`
  }

  const JSX_NAME = /[A-Za-z_$][\w$.:-]*/y

  function parseElement() {
    const start = pos
    pos++ // '<'
    let name = ''
    let children = false

    if (src[pos] === '>') {
      pos++ // <> fragment
      children = true
    } else {
      JSX_NAME.lastIndex = pos
      name = JSX_NAME.exec(src)?.[0] ?? ''
      if (!name) {
        fail(file, `malformed JSX tag at line ${lineAt(start)}`)
        return
      }
      pos += name.length
      tags.push({ name, line: lineAt(start) })
    }

    const body = []

    while (!children && pos < src.length) {
      const before = pos
      skipTrivia()
      body.push(newlinesIn(before, pos))

      if (src[pos] === '/' && src[pos + 1] === '>') {
        pos += 2
        break
      }
      if (src[pos] === '>') {
        pos++
        children = true
        break
      }
      if (src[pos] === '{') {
        body.push(readBraced(`<${name}>`))
        continue
      }
      JSX_NAME.lastIndex = pos
      const attr = JSX_NAME.exec(src)?.[0]
      if (!attr) {
        fail(file, `unexpected '${src[pos]}' inside <${name}> at line ${lineAt(pos)}`)
        pos++
        continue
      }
      pos += attr.length
      skipTrivia()
      if (src[pos] !== '=') continue // valueless boolean attribute
      pos++
      skipTrivia()
      if (src[pos] === '"' || src[pos] === "'") {
        const quote = src[pos]
        const from = pos
        pos = src.indexOf(quote, pos + 1) + 1
        if (pos === 0) {
          fail(file, `unterminated value for ${attr} in <${name}> at line ${lineAt(from)}`)
          pos = src.length
          break
        }
        body.push(newlinesIn(from, pos))
      } else if (src[pos] === '{') {
        body.push(readBraced(`${attr}= in <${name}>`))
      } else if (src[pos] === '<') {
        body.push(`${capture(() => parseElement())},`)
      } else {
        fail(file, `unreadable value for ${attr} in <${name}> at line ${lineAt(pos)}`)
        pos++
      }
    }

    while (children && pos < src.length) {
      if (src[pos] === '<' && src[pos + 1] === '/') {
        const closeAt = pos
        pos += 2
        JSX_NAME.lastIndex = pos
        const closing = JSX_NAME.exec(src)?.[0] ?? ''
        pos += closing.length
        skipTrivia()
        if (src[pos] === '>') pos++
        else fail(file, `malformed </${closing}> at line ${lineAt(closeAt)}`)
        if (closing !== name) {
          fail(
            file,
            `<${name || '>'} at line ${lineAt(start)} is closed by </${closing}> at line ${lineAt(closeAt)}`,
          )
        }
        children = false
        break
      }
      if (src[pos] === '<') {
        body.push(`${capture(() => parseElement())},`)
        continue
      }
      if (src[pos] === '{') {
        body.push(readBraced(`<${name}> children`))
        continue
      }
      const from = pos
      while (pos < src.length && src[pos] !== '<' && src[pos] !== '{') pos++
      const text = src.slice(from, pos)
      // Whitespace-only text is legal between call arguments, so keep it and
      // the line numbers stay in step with the original file.
      body.push(text.trim() === '' ? text : newlinesIn(from, pos))
    }

    if (children) fail(file, `<${name || '>'} at line ${lineAt(start)} is never closed`)
    emit(`__jsx(${body.join('')})`)
  }

  function scanJs(stopAtBrace) {
    const floor = delimiters.length
    while (pos < src.length) {
      const ch = src[pos]

      if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
        emit(ch)
        pos++
        continue
      }
      if (ch === '/' && src[pos + 1] === '/') {
        const end = src.indexOf('\n', pos)
        const stop = end === -1 ? src.length : end
        emit(src.slice(pos, stop))
        pos = stop
        continue
      }
      if (ch === '/' && src[pos + 1] === '*') {
        const end = src.indexOf('*/', pos + 2)
        if (end === -1) {
          fail(file, `unterminated block comment at line ${lineAt(pos)}`)
          pos = src.length
          break
        }
        emit(src.slice(pos, end + 2))
        pos = end + 2
        continue
      }

      if (ch === '"' || ch === "'") {
        emit(readString())
        lastTok = '#string'
        continue
      }
      if (ch === '`') {
        readTemplate()
        lastTok = '#template'
        continue
      }
      if (ch === '/' && atExpressionStart()) {
        emit(readRegex())
        lastTok = '#regex'
        continue
      }
      if (ch === '<' && atExpressionStart()) {
        parseElement()
        lastTok = '#jsx'
        continue
      }
      if (ch === '(' || ch === '[' || ch === '{') {
        delimiters.push({ ch, at: pos })
        emit(ch)
        pos++
        lastTok = ch
        continue
      }
      if (ch === ')' || ch === ']' || ch === '}') {
        if (ch === '}' && stopAtBrace && delimiters.length === floor) return
        const expected = { ')': '(', ']': '[', '}': '{' }[ch]
        const top = delimiters.pop()
        if (!top) fail(file, `stray '${ch}' at line ${lineAt(pos)}`)
        else if (top.ch !== expected) {
          fail(
            file,
            `'${top.ch}' opened at line ${lineAt(top.at)} is closed by '${ch}' at line ${lineAt(pos)}`,
          )
        }
        emit(ch)
        pos++
        lastTok = ch
        continue
      }

      const word = readWord()
      if (word) {
        emit(word)
        pos += word.length
        if (lastTok === '.') members.add(word)
        // Look past whitespace and comments to see whether this is a call, then
        // emit what was skipped so nothing is lost from the rewritten output.
        const after = pos
        skipTrivia()
        if (src[pos] === '(') calls.add(word)
        emit(src.slice(after, pos))
        lastTok = word
        continue
      }

      const digits = /[0-9][\w.]*/y
      digits.lastIndex = pos
      const number = digits.exec(src)?.[0]
      if (number) {
        emit(number)
        pos += number.length
        lastTok = '#number'
        continue
      }

      emit(ch)
      pos++
      lastTok = ch
    }
  }

  scanJs(false)
  const dangling = delimiters.pop()
  if (dangling) fail(file, `'${dangling.ch}' at line ${lineAt(dangling.at)} is never closed`)

  return { code: out.join(''), tags, calls, members }
}

/** Names a file brings into scope: imports, declarations, destructurings. */
function scopeOf(src) {
  const names = new Set()
  const add = (name) => {
    if (/^[A-Za-z_$][\w$]*$/.test(name)) names.add(name)
  }
  for (const m of src.matchAll(/import\s+([\w$]+)\s*(?:,|from\b)/g)) add(m[1])
  for (const m of src.matchAll(/import\s+\*\s+as\s+([\w$]+)/g)) add(m[1])
  for (const m of src.matchAll(/import\s*(?:[\w$]+\s*,\s*)?\{([^}]*)\}/g)) {
    for (const part of m[1].split(',')) add(part.trim().split(/\s+as\s+/).pop().trim())
  }
  for (const m of src.matchAll(/\b(?:function|class)\s+([\w$]+)/g)) add(m[1])
  for (const m of src.matchAll(/\b(?:const|let|var)\s+([\w$]+)/g)) add(m[1])
  for (const m of src.matchAll(/\b(?:const|let|var)\s*\{([^}]*)\}\s*=/g)) {
    for (const part of m[1].split(',')) {
      add(part.trim().split(':').pop().replace(/=.*$/s, '').trim())
    }
  }
  return names
}

/** What a module exports, so a named import can be checked against it. */
function exportsOf(src) {
  const names = new Set()
  let wildcard = false
  if (/export\s+default\b/.test(src)) names.add('default')
  for (const m of src.matchAll(/export\s+(?:async\s+)?(?:function|class|const|let|var)\s+([\w$]+)/g)) {
    names.add(m[1])
  }
  for (const m of src.matchAll(/export\s*\{([^}]*)\}/g)) {
    for (const part of m[1].split(',')) {
      const name = part.trim().split(/\s+as\s+/).pop().trim()
      if (name) names.add(name)
    }
  }
  if (/export\s+\*/.test(src)) wildcard = true
  return { names, wildcard }
}

const CANDIDATE_SUFFIXES = ['', '.js', '.jsx', '.mjs', '/index.js', '/index.jsx']

const isFile = (path) => {
  try {
    return statSync(path).isFile()
  } catch {
    return false
  }
}

function resolveImport(fromFile, specifier) {
  const base = resolve(dirname(fromFile), specifier)
  for (const suffix of CANDIDATE_SUFFIXES) {
    if (isFile(base + suffix)) return base + suffix
  }
  return null
}

/* ---------------------------------------------------------------- Tailwind -- */

const tailwindSrc = readFileSync(join(ROOT, 'tailwind.config.js'), 'utf8')

/** Keys of one `theme.extend` block, read straight out of the config text. */
function themeKeys(section) {
  const at = tailwindSrc.indexOf(`${section}: {`)
  if (at === -1) return new Set()
  let depth = 0
  let end = at
  for (let i = tailwindSrc.indexOf('{', at); i < tailwindSrc.length; i++) {
    if (tailwindSrc[i] === '{') depth++
    else if (tailwindSrc[i] === '}' && --depth === 0) {
      end = i
      break
    }
  }
  const block = tailwindSrc.slice(at, end)
  const keys = new Set()
  // The section's own config quoted keys with ', the site's with " — accept both.
  for (const m of block.matchAll(/^\s{6,8}["']?([\w-]+)["']?:/gm)) keys.add(m[1])
  return keys
}

const COLORS = themeKeys('colors')
const SPACING = themeKeys('spacing')
const MAX_WIDTH = themeKeys('maxWidth')
const FONT_FAMILY = themeKeys('fontFamily')
const FONT_SIZE = themeKeys('fontSize')
const ANIMATION = themeKeys('animation')
const KEYFRAMES = themeKeys('keyframes')

/** Tailwind's own palette, which the config extends rather than replaces. */
const BUILTIN_COLOR_FAMILIES = new Set(
  `slate gray zinc neutral stone red orange amber yellow lime green emerald teal cyan sky blue
   indigo violet purple fuchsia pink rose`.split(/\s+/),
)
const BUILTIN_COLOR_WORDS = new Set(['white', 'black', 'transparent', 'current', 'inherit'])

/** Non-colour members of the utility families that also take a colour. */
const NON_COLOUR = {
  bg: /^(cover|contain|center|top|bottom|left|right|fixed|local|scroll|auto|none|no-repeat|repeat(-x|-y|-round|-space)?|clip-\w+|origin-\w+|blend-\w+|gradient-to-\w+)$/,
  text: /^(left|center|right|justify|start|end|ellipsis|clip|wrap|nowrap|balance|pretty|xs|sm|base|lg|[2-9]?xl)$/,
  border: /^(\d+|none|solid|dashed|dotted|double|hidden|collapse|separate|[xytrbles](-\d+)?)$/,
  ring: /^(\d+|inset|offset-\d+)$/,
  divide: /^([xy](-\d+|-reverse)?|\d+|solid|dashed|dotted|double|none)$/,
  outline: /^(\d+|none|dashed|dotted|double|offset-\d+)$/,
  shadow: /^(sm|md|lg|xl|2xl|inner|none)$/,
  fill: /^(none|current)$/,
  stroke: /^(none|current|\d+)$/,
  from: /^$/,
  to: /^$/,
  via: /^$/,
}

const isColour = (value) => {
  const bare = value.replace(/\/\d+$/, '') // drop an /opacity suffix
  if (bare.startsWith('[')) return true // arbitrary value
  if (COLORS.has(bare) || BUILTIN_COLOR_WORDS.has(bare)) return true
  const family = bare.replace(/-\d{2,3}$/, '')
  return family !== bare && BUILTIN_COLOR_FAMILIES.has(family)
}

const VARIANT = /^(sm|md|lg|xl|2xl|hover|focus|focus-within|focus-visible|active|disabled|group-hover|group-focus|peer-focus|first|last|odd|even|print|motion-safe|motion-reduce|dark|rtl|ltr|not-first|aria-\w+|data-\[[^\]]+\])$/

/** Every class token that appears in a string or template literal in a file. */
function classTokens(source) {
  // Comments go first: an apostrophe in prose ("didn't") would otherwise pair
  // with the next real quote and drag half a line of code into a "string".
  const src = dropComments(source)
  const tokens = new Set()
  const literals = [
    ...src.matchAll(/'([^'\n]*)'/g),
    ...src.matchAll(/"([^"\n]*)"/g),
    ...src.matchAll(/`([^`]*)`/g),
  ]
  for (const [, text] of literals) {
    for (const raw of text.split(/[\s${}]+/)) {
      if (!raw || /['"<>()]/.test(raw)) continue
      if (/^[a-z[!-]/.test(raw) && /[a-z]/.test(raw)) tokens.add(raw)
    }
  }
  return tokens
}

function checkClass(file, token) {
  let name = token
  while (name.includes(':')) {
    const [variant, ...rest] = name.split(':')
    if (!VARIANT.test(variant)) return // not a Tailwind class at all
    name = rest.join(':')
  }
  name = name.replace(/^!/, '').replace(/^-/, '')

  const animate = /^animate-(.+)$/.exec(name)
  if (animate) {
    if (!ANIMATION.has(animate[1]) && !/^(spin|ping|pulse|bounce|none)$/.test(animate[1])) {
      fail(file, `animate-${animate[1]} has no entry in tailwind.config.js`)
    } else if (ANIMATION.has(animate[1]) && !KEYFRAMES.has(animate[1])) {
      fail(file, `animation.${animate[1]} has no matching keyframes`)
    }
    return
  }

  const font = /^font-(.+)$/.exec(name)
  if (font && !/^(sans|serif|mono|thin|extralight|light|normal|medium|semibold|bold|extrabold|black|\[.+\])$/.test(font[1])) {
    if (!FONT_FAMILY.has(font[1])) fail(file, `font-${font[1]} is not a configured fontFamily`)
    return
  }

  const maxWidth = /^max-w-(.+)$/.exec(name)
  if (maxWidth && !/^(none|full|min|max|fit|prose|screen-\w+|\d+(xl)?|xs|sm|md|lg|xl|\[.+\])$/.test(maxWidth[1])) {
    if (!MAX_WIDTH.has(maxWidth[1])) fail(file, `max-w-${maxWidth[1]} is not a configured maxWidth`)
    return
  }

  // `px-4`, `gap-x-4` and `inset-x-0` all sit in this family, so the axis
  // letter is optional and may or may not have a dash in front of it.
  const spacing = /^(p|m|gap|space|w|h|size|inset|top|right|bottom|left)(?:-?[xytrbles])?-(.+)$/.exec(name)
  if (spacing && /^[a-z][\w-]*$/.test(spacing[2]) && !SPACING.has(spacing[2])) {
    const builtin = /^(auto|full|screen|min|max|fit|px|reverse|dvh|dvw|svh|lvh)$/.test(spacing[2])
    if (!builtin) fail(file, `${name} — '${spacing[2]}' is not a configured spacing value`)
    return
  }

  const utility = /^(bg|text|border|ring|divide|outline|shadow|fill|stroke|from|to|via|placeholder|caret|accent|decoration)-(.+)$/.exec(name)
  if (!utility) return
  const [, family, value] = utility
  if (family === 'text' && FONT_SIZE.has(value)) return
  if (NON_COLOUR[family]?.test(value)) return
  if (!isColour(value)) fail(file, `${name} — '${value}' is not a colour in tailwind.config.js`)
}

/* ------------------------------------------------------------------- run it -- */

const scratch = mkdtempSync(join(tmpdir(), 'bhuniti-check-'))
const routesSrc = readFileSync(join(SECTION, 'routes.js'), 'utf8')
// PATHS is now derived — `Object.fromEntries(Object.entries(SEGMENTS)…)` prefixes
// every segment with /registry — so the names come from SEGMENTS, which is the
// literal that is left.
const segmentsBlock = routesSrc.slice(routesSrc.indexOf('export const SEGMENTS'))
const pathKeys = new Set(
  [...segmentsBlock.slice(0, segmentsBlock.indexOf('}')).matchAll(/^\s{2}(\w+):\s*'/gm)].map(
    (m) => m[1],
  ),
)

let checked = 0
let elements = 0

for (const file of sources) {
  const src = readFileSync(file, 'utf8')
  const isJsx = file.endsWith('.jsx')
  const { code, tags, calls } = transpile(src, file)
  const scope = scopeOf(src)
  checked++
  elements += tags.length

  // 1. Syntax. The rewritten source is written as .mjs so `node --check`
  //    parses it as a module, which is how vite will treat it.
  const scratchFile = join(scratch, rel(file).replace(/[/\\]/g, '_') + '.mjs')
  writeFileSync(scratchFile, code)
  try {
    execFileSync(process.execPath, ['--check', scratchFile], { stdio: 'pipe' })
  } catch (error) {
    const detail = String(error.stderr || error.message)
      .split('\n')
      .filter((line) => line.trim() && !line.includes(scratch) && !line.startsWith('    at '))
      .slice(0, 4)
      .join(' / ')
    fail(file, `does not parse: ${detail}`)
  }

  // 2. JSX tags.
  for (const { name, line } of tags) {
    const root = name.split('.')[0]
    if (/^[a-z]/.test(name)) {
      if (!HTML_TAGS.has(name) && !SVG_TAGS.has(name)) {
        fail(file, `<${name}> at line ${line} is not an HTML or SVG element`)
      }
    } else if (!scope.has(root)) {
      fail(file, `<${name}> at line ${line} is neither imported nor declared`)
    }
  }

  // 3. Hooks must be in scope — a stale import shows up as a runtime crash
  //    only when the page is opened, which is exactly what cannot be done here.
  for (const call of calls) {
    if (/^use[A-Z]/.test(call) && !scope.has(call)) {
      fail(file, `${call}() is called but not in scope`)
    }
  }

  // 4. Relative imports resolve, and their named bindings are really exported.
  for (const m of src.matchAll(/import\s+([\s\S]*?)\s+from\s+['"]([^'"]+)['"]/g)) {
    const [, clause, specifier] = m
    if (!specifier.startsWith('.')) continue
    const target = resolveImport(file, specifier)
    if (!target) {
      fail(file, `imports '${specifier}', which does not resolve to a file`)
      continue
    }
    const { names, wildcard } = exportsOf(readFileSync(target, 'utf8'))
    if (wildcard) continue
    if (/^[\w$]/.test(clause.trim()) && !names.has('default')) {
      fail(file, `imports a default from '${specifier}', which has no default export`)
    }
    const braced = /\{([^}]*)\}/.exec(clause)
    if (!braced) continue
    for (const part of braced[1].split(',')) {
      const wanted = part.trim().split(/\s+as\s+/)[0].trim()
      if (wanted && !names.has(wanted)) {
        fail(file, `imports { ${wanted} } from '${specifier}', which does not export it`)
      }
    }
  }

  // 5. PATHS.* references.
  for (const m of src.matchAll(/\bPATHS\.(\w+)/g)) {
    if (!pathKeys.has(m[1])) fail(file, `PATHS.${m[1]} is not defined in routes.js`)
  }

  // 6. Tailwind tokens, for .jsx and index.css consumers only.
  if (isJsx) for (const token of classTokens(src)) checkClass(file, token)
}

/* ------------------------------------------------------- the mount point -- */

/*
 * The one invariant that spans the boundary: the section links to
 * /registry/<segment>, and the host router has to actually have a route there.
 * Nothing inside src/registry can see src/App.jsx, so if a step were added to
 * SEGMENTS and not mounted, every link to it would silently fall through to the
 * catch-all and land back on step 1 -- which looks like a bug in the wizard.
 */
const appFile = join(ROOT, 'src', 'App.jsx')
const appSrc = readFileSync(appFile, 'utf8')
const mountFail = (message) => problems.push(`${rel(appFile)}: ${message}`)

const segmentAlias = /\bSEGMENTS(?:\s+as\s+(\w+))?/.exec(
  /import\s*\{([^}]*)\}\s*from\s*['"]\.\/registry\/routes['"]/.exec(appSrc)?.[1] ?? '',
)
if (!appSrc.includes('registry/App')) {
  mountFail('does not import the registry section, so /registry is not mounted')
} else if (!segmentAlias) {
  mountFail("does not import SEGMENTS from './registry/routes' — route paths are hard-coded")
} else {
  const alias = segmentAlias[1] ?? 'SEGMENTS'
  if (!/path=\{REGISTRY_SEGMENT\}/.test(appSrc)) {
    mountFail('the parent <Route path> is not REGISTRY_SEGMENT, so it can drift from REGISTRY_BASE')
  }
  for (const key of pathKeys) {
    if (!appSrc.includes(`path={${alias}.${key}}`)) {
      mountFail(`SEGMENTS.${key} is linked to but has no <Route path={${alias}.${key}}>`)
    }
  }
  notes.push(`${pathKeys.size} registry routes mounted in src/App.jsx`)
}

/*
 * The card that opens the section. Everything outside src/registry reaches the
 * wizard through REGISTRY_ROUTES, re-exported from src/routes.js; a typo there
 * is not a crash, it is `navigate(undefined)` -- the tap does nothing at all.
 */
let hostRefs = 0
;(function walkHost(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (full === SECTION) continue
    if (entry.isDirectory()) walkHost(full)
    else if (/\.jsx?$/.test(entry.name)) {
      const text = readFileSync(full, 'utf8')
      for (const m of text.matchAll(/\bREGISTRY_ROUTES\.(\w+)/g)) {
        hostRefs += 1
        if (!pathKeys.has(m[1])) {
          problems.push(`${rel(full)}: REGISTRY_ROUTES.${m[1]} is not a segment in registry/routes.js`)
        }
      }
    }
  }
})(join(ROOT, 'src'))
notes.push(`${hostRefs} REGISTRY_ROUTES.* reference(s) from outside the section`)

/*
 * Two class names carry the whole embed. `theme-main` is what resolves the 52
 * --color-* variables every Tailwind colour utility in here reads, and
 * `registry-scope` is what index.css hangs its rules on -- including the one
 * that gives the stepper back a scrollbar the site's global reset removes. Lose
 * either and the section renders, but wrong.
 */
const sectionRoot = readFileSync(join(SECTION, 'App.jsx'), 'utf8')
const rootClass = /className="([^"]*)"/.exec(sectionRoot)?.[1] ?? ''
for (const needed of ['theme-main', 'registry-scope']) {
  if (!rootClass.split(/\s+/).includes(needed)) {
    problems.push(`src/registry/App.jsx: the section's root element is missing '${needed}'`)
  }
}

const sectionCss = readFileSync(join(SECTION, 'index.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
let cssRules = 0
for (const m of sectionCss.matchAll(/([^{}]+)\{/g)) {
  const selector = m[1].trim()
  if (!selector || selector.startsWith('@')) continue
  cssRules += 1
  for (const one of selector.split(',')) {
    if (!one.trim().startsWith('.registry-scope')) {
      problems.push(`src/registry/index.css: '${one.trim()}' is not scoped to .registry-scope`)
    }
  }
}
notes.push(`${cssRules} rule(s) in src/registry/index.css, all scoped`)

/* --------------------------------------------------------------- the report -- */

notes.push(`${checked} files parsed`)
notes.push(`${elements} JSX elements opened and closed`)
notes.push(`${pathKeys.size} routes in PATHS`)
notes.push(
  `${COLORS.size} custom colours, ${FONT_SIZE.size} font sizes, ${ANIMATION.size} animations in tailwind.config.js`,
)

for (const note of notes) process.stdout.write(`  ${note}\n`)

if (problems.length) {
  process.stdout.write(`\n${problems.length} problem(s):\n`)
  for (const problem of problems) process.stdout.write(`  ✗ ${problem}\n`)
  process.exitCode = 1
} else {
  process.stdout.write('\nOK — structure, tags, scope, imports, routes and classes all check out.\n')
}
