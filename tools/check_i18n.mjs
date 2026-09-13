#!/usr/bin/env node
/*
 * Frontend i18n checker. Run offline, no dependencies:
 *
 *     node tools/check_i18n.mjs
 *
 * Four things go wrong with a hand-maintained catalog, and this catches all of
 * them:
 *
 *   1. a key exists in English but not Hindi (or the reverse), so one language
 *      silently falls back;
 *   2. a Hindi value is still the English string, i.e. a copy-paste that never
 *      got translated;
 *   3. a component calls t("some.key") that no catalog defines, which renders
 *      the raw key on screen;
 *   4. literal English text is still sitting in the JSX, unwrapped.
 *
 * (1)-(3) are errors and set the exit code. (4) is advisory: it is a heuristic,
 * and some literals -- ULPIN values, "BHUNITI", icon names -- are meant to stay.
 */

import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "bhuniti-react", "src");
const I18N = path.join(SRC, "i18n");

/** Values that are identical in both languages on purpose. */
const SAME_IN_BOTH_OK = new Set([
  "common.units.percent",
  "common.fields.ulpin",
  "common.fields.email",
  "common.fields.otp",
  "common.fields.password",
  // Government forms print the acronym in Latin in both languages.
  "pages.dataReconciliation.ulpinChip",
  // HTTP verbs are written in Latin capitals everywhere.
  "pages.platform.interop.method",
  // ULPIN is the statutory acronym and is printed in Latin capitals on the
  // record itself, in both languages.
  "pages.citizenPortal.recent.ulpinLabel",
  "viewers.virtual360.identity",
]);

/** Flatten a nested catalog into {"a.b.c": "value"}. */
function flatten(node, prefix = "", out = {}) {
  for (const [key, value] of Object.entries(node)) {
    const dotted = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object") flatten(value, dotted, out);
    else out[dotted] = value;
  }
  return out;
}

/** Every file under a directory whose name matches one of the extensions. */
async function walk(dir, extensions, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, extensions, out);
    else if (extensions.some((ext) => entry.name.endsWith(ext))) out.push(full);
  }
  return out;
}

const errors = [];
const notes = [];

// ── 1 + 2: catalog parity ───────────────────────────────────────────────────
const en = flatten((await import(pathToFileURL(path.join(I18N, "en", "index.js")).href)).default);
const hi = flatten((await import(pathToFileURL(path.join(I18N, "hi", "index.js")).href)).default);

const enKeys = new Set(Object.keys(en));
const hiKeys = new Set(Object.keys(hi));

for (const key of enKeys) {
  if (!hiKeys.has(key)) errors.push(`missing in hi: ${key}`);
}
for (const key of hiKeys) {
  if (!enKeys.has(key)) errors.push(`missing in en: ${key}`);
}

let untranslated = 0;
for (const key of enKeys) {
  if (!hiKeys.has(key) || SAME_IN_BOTH_OK.has(key)) continue;
  // A value with no letters of its own is the same in both by nature: numbers,
  // symbols, "%", or a template that is nothing but {{placeholders}} and
  // punctuation. Placeholder names are not translatable text, so they come out
  // before the test.
  if (!/[A-Za-z]{2}/.test(en[key].replace(/\{\{\s*\w+\s*\}\}/g, ""))) continue;
  if (en[key] === hi[key]) {
    untranslated += 1;
    errors.push(`not translated (hi === en): ${key} = ${JSON.stringify(en[key])}`);
  }
}

// ── 3: every t("key") a component asks for must exist ───────────────────────
/*
 * src/registry is excluded on purpose. The Digital Registry section ships its
 * own 332-key catalogs under src/registry/i18n and its own `useI18n`, so its
 * t() calls resolve against a different vocabulary; measured against the site's
 * catalogs every one of them would read as undefined. That subtree is checked
 * by tools/registry_check_catalogs.mjs and tools/registry_check_runtime.mjs,
 * which between them do the same two jobs for it — parity, then every key
 * resolved in both locales.
 */
const REGISTRY = path.join(SRC, "registry");
const sourceFiles = (await walk(SRC, [".js", ".jsx"])).filter(
  (file) => !file.startsWith(I18N + path.sep) && !file.startsWith(REGISTRY + path.sep)
);

const T_CALL = /\bt\(\s*(["'])((?:(?!\1)[^\\])+)\1/g;
const LABEL_CALL = /\blabel\(\s*(["'])((?:(?!\1)[^\\])+)\1/g;

/*
 * Pages shorten their own namespace to a one-letter helper:
 *
 *     const p = (key, vars) => t(`pages.reconciliationMonitor.${key}`, vars);
 *
 * so most call sites read p("sync.status") and never spell out the prefix. Without
 * this, check (3) only ever saw the handful of bare t("common....") calls and a
 * misspelt page key would sail through and render as raw text on screen.
 */
const HELPER_DEF = /\b(?:const|let)\s+(\w+)\s*=\s*\(\s*key\s*(?:,\s*vars\s*)?\)\s*=>\s*t\(\s*`([^`${]*)\$\{key\}`/g;

/*
 * A plural key is stored as `<key>_one` / `<key>_other` but called as `<key>`
 * with a numeric `count`, so the bare form is a legitimate call site even though
 * it is not itself a leaf in the catalog.
 */
const isDefined = (key) =>
  enKeys.has(key) || enKeys.has(`${key}_one`) || enKeys.has(`${key}_other`);

let tCalls = 0;
for (const file of sourceFiles) {
  const text = await readFile(file, "utf8");
  const relative = path.relative(ROOT, file);

  for (const match of text.matchAll(T_CALL)) {
    const key = match[2];
    // Keys are dotted paths; a bare word is something else called `t`.
    if (!key.includes(".")) continue;
    tCalls += 1;
    if (!isDefined(key)) {
      const line = text.slice(0, match.index).split("\n").length;
      errors.push(`undefined key: ${relative}:${line} t("${key}")`);
    }
  }

  // Namespaced helpers, e.g. p("sync.status") -> pages.<page>.sync.status.
  for (const [, helper, prefix] of text.matchAll(HELPER_DEF)) {
    const calls = new RegExp(`\\b${helper}\\(\\s*(["'])((?:(?!\\1)[^\\\\])+)\\1`, "g");
    for (const call of text.matchAll(calls)) {
      const key = `${prefix}${call[2]}`;
      tCalls += 1;
      if (!isDefined(key)) {
        const line = text.slice(0, call.index).split("\n").length;
        errors.push(`undefined key: ${relative}:${line} ${helper}("${call[2]}") -> ${key}`);
      }
    }
  }

  for (const match of text.matchAll(LABEL_CALL)) {
    const domainName = match[2];
    if (domainName.includes(".")) continue;
    if (!enKeys.has(`domain.${domainName}`) &&
        ![...enKeys].some((key) => key.startsWith(`domain.${domainName}.`))) {
      const line = text.slice(0, match.index).split("\n").length;
      errors.push(`unknown label domain: ${relative}:${line} label("${domainName}")`);
    }
  }
}

// ── 4: literal English still in the markup (advisory) ───────────────────────
// Material Symbols ligatures, Tailwind class soup and CSS values are all
// literal text in JSX too, so the heuristic only looks at text between tags and
// at the four attributes that reach a user.
const ICON_LIKE = /^[a-z][a-z0-9_]*$/;              // material-symbols ligature
const KEEP_AS_IS = new Set(["BHUNITI", "ULPIN", "GIS", "PDF", "CSV", "OTP", "API"]);
const TEXT_NODE = />([^<>{}\n][^<>{}]*)</g;
const ATTR_TEXT = /\b(placeholder|title|alt|aria-label)=("([^"]+)"|'([^']+)')/g;

const perFile = [];
for (const file of sourceFiles) {
  if (!file.endsWith(".jsx")) continue;
  const text = await readFile(file, "utf8");
  let hits = 0;

  for (const match of text.matchAll(TEXT_NODE)) {
    const raw = match[1].trim();
    if (raw.length < 2 || !/[A-Za-z]{2}/.test(raw)) continue;
    if (ICON_LIKE.test(raw)) continue;               // icon name, not prose
    if (KEEP_AS_IS.has(raw)) continue;
    hits += 1;
  }
  for (const match of text.matchAll(ATTR_TEXT)) {
    const raw = (match[3] || match[4] || "").trim();
    if (raw.length < 2 || !/[A-Za-z]{2}/.test(raw)) continue;
    hits += 1;
  }
  if (hits) perFile.push([path.relative(ROOT, file), hits]);
}

perFile.sort((a, b) => b[1] - a[1]);
const totalLiterals = perFile.reduce((sum, [, hits]) => sum + hits, 0);

// ── report ──────────────────────────────────────────────────────────────────
console.log(`en: ${enKeys.size} keys   hi: ${hiKeys.size} keys`);
console.log(`t() calls resolved: ${tCalls}`);
if (untranslated) console.log(`identical hi/en values: ${untranslated}`);

if (perFile.length) {
  console.log(`\nliteral text still in JSX (advisory): ${totalLiterals} in ${perFile.length} files`);
  for (const [file, hits] of perFile.slice(0, 15)) {
    console.log(`  ${String(hits).padStart(4)}  ${file}`);
  }
  if (perFile.length > 15) console.log(`  ... and ${perFile.length - 15} more files`);
} else {
  console.log("\nno literal text left in the JSX");
}

for (const note of notes) console.log(`note: ${note}`);

if (errors.length) {
  console.error(`\n${errors.length} problem(s):`);
  for (const error of errors.slice(0, 40)) console.error(`  ${error}`);
  if (errors.length > 40) console.error(`  ... and ${errors.length - 40} more`);
  process.exit(1);
}
console.log("\ni18n OK");
